from typing import List, Tuple
from models import VitalSigns, RedFlagChecklist, PatientBasicInfo

PRIORITY_RANK = {
    "RED": 3,
    "YELLOW": 2,
    "GREEN": 1
}

RANK_TO_PRIORITY = {
    3: "RED",
    2: "YELLOW",
    1: "GREEN"
}

def compute_priority_ceiling(rule_priority: str, ai_priority: str) -> str:
    """
    Enforces the Safety-First Rule:
    The final computed priority is strictly MAX(Rule_Engine_Priority, AI_Priority).
    The AI model can escalate a priority, but can NEVER downgrade a deterministic rule trigger.
    """
    rule_rank = PRIORITY_RANK.get(rule_priority.upper(), 1)
    ai_rank = PRIORITY_RANK.get(ai_priority.upper(), 1)
    final_rank = max(rule_rank, ai_rank)
    return RANK_TO_PRIORITY[final_rank]

def evaluate_deterministic_triage(
    vitals: VitalSigns,
    red_flags: RedFlagChecklist,
    patient_info: PatientBasicInfo
) -> Tuple[str, List[str], str, str]:
    """
    Evaluates clinical vital signs and explicit red-flag checklists deterministically.
    Returns:
        (priority: str, triggers: List[str], department: str, priority_label: str)
    """
    triggers: List[str] = []
    priority = "GREEN"
    department = "General Medicine OPD"

    # =========================================================================
    # 1. Critical Vital Sign Thresholds -> RED (P1 Emergency)
    # =========================================================================
    if vitals.spo2_percent is not None and vitals.spo2_percent < 90:
        priority = "RED"
        triggers.append(f"Critical Hypoxia Alert: SpO₂ is {vitals.spo2_percent}% (threshold < 90%)")
        department = "Emergency / Acute Respiratory Care Bay"

    if vitals.bp_systolic is not None and vitals.bp_systolic >= 180:
        priority = "RED"
        triggers.append(f"Hypertensive Crisis: Systolic BP {vitals.bp_systolic} mmHg (threshold ≥ 180 mmHg)")
        department = "Emergency Bay"
    elif vitals.bp_systolic is not None and vitals.bp_systolic < 85:
        priority = "RED"
        triggers.append(f"Critical Hypotension / Shock Alert: Systolic BP {vitals.bp_systolic} mmHg (threshold < 85 mmHg)")
        department = "Emergency Resuscitation Bay"

    if vitals.heart_rate_bpm is not None and vitals.heart_rate_bpm > 130:
        priority = "RED"
        triggers.append(f"Severe Tachycardia: Heart rate {vitals.heart_rate_bpm} bpm (threshold > 130 bpm)")
        if department == "General Medicine OPD":
            department = "Emergency / Cardiac Bay"
    elif vitals.heart_rate_bpm is not None and vitals.heart_rate_bpm < 45:
        priority = "RED"
        triggers.append(f"Severe Bradycardia: Heart rate {vitals.heart_rate_bpm} bpm (threshold < 45 bpm)")
        if department == "General Medicine OPD":
            department = "Emergency / Cardiac Bay"

    if vitals.respiratory_rate_min is not None and (vitals.respiratory_rate_min > 28 or vitals.respiratory_rate_min < 10):
        priority = "RED"
        triggers.append(f"Severe Respiratory Distress: Respiratory Rate {vitals.respiratory_rate_min}/min")
        department = "Emergency / Acute Respiratory Care Bay"

    if vitals.temperature_f is not None and vitals.temperature_f > 104.0:
        priority = "RED"
        triggers.append(f"Hyperpyrexia Alert: Core Temperature {vitals.temperature_f}°F (> 104°F)")

    if vitals.blood_glucose_mg_dl is not None and (vitals.blood_glucose_mg_dl < 60 or vitals.blood_glucose_mg_dl > 350):
        priority = "RED"
        triggers.append(f"Metabolic / Glycemic Emergency: Blood Glucose {vitals.blood_glucose_mg_dl} mg/dL")
        department = "Emergency Bay"

    # =========================================================================
    # 2. Explicit Clinical Red Flags -> RED (P1 Emergency)
    # =========================================================================
    if red_flags.severe_chest_pain:
        priority = "RED"
        triggers.append("Red Flag: Severe Acute Chest Discomfort / Pain reported")
        department = "Emergency / Cardiac Assessment Bay"

    if red_flags.severe_breathing_difficulty:
        priority = "RED"
        triggers.append("Red Flag: Severe Difficulty Breathing / Dyspnea reported")
        department = "Emergency / Acute Respiratory Care Bay"

    if red_flags.loss_of_consciousness:
        priority = "RED"
        triggers.append("Red Flag: Loss of consciousness or acute altered mental sensorium")
        department = "Emergency / Trauma & Neuro Bay"

    if red_flags.seizure:
        priority = "RED"
        triggers.append("Red Flag: Active convulsion or post-ictal seizure state")
        department = "Emergency / Trauma & Neuro Bay"

    if red_flags.sudden_weakness_paralysis:
        priority = "RED"
        triggers.append("Red Flag: Acute neurological deficit / suspected stroke signs")
        department = "Emergency / Stroke & Neuro Bay"

    if red_flags.severe_bleeding:
        priority = "RED"
        triggers.append("Red Flag: Active uncontrolled severe hemorrhage")
        department = "Emergency Bay"

    if red_flags.very_low_oxygen_spo2 and (vitals.spo2_percent is None or vitals.spo2_percent >= 90):
        priority = "RED"
        triggers.append("Red Flag: Severe oxygen desaturation verified by nurse")
        department = "Emergency / Acute Respiratory Care Bay"

    if red_flags.severe_allergic_reaction:
        priority = "RED"
        triggers.append("Red Flag: Suspected anaphylaxis / acute facial or laryngeal angioedema")
        department = "Emergency Resuscitation Bay"

    # =========================================================================
    # 3. Maternal Facility Scenario Checks
    # =========================================================================
    is_maternal = (
        patient_info.facility_type in ["MATERNAL_CLINIC", "CHC_TANGI_MATERNAL"]
        or "pregnant" in (patient_info.location_state or "").lower()
        or (vitals.bp_systolic is not None and vitals.bp_systolic >= 160 and patient_info.sex == "Female" and patient_info.age < 45 and patient_info.facility_type == "CHC_TANGI")
    )
    if is_maternal:
        if vitals.bp_systolic is not None and vitals.bp_systolic >= 160:
            priority = "RED"
            triggers.append(f"Maternal Emergency: Severe gestational hypertension ({vitals.bp_systolic}/{vitals.bp_diastolic or 0} mmHg) - high pre-eclampsia risk")
            department = "Obstetrics Emergency / Labour Room Triage"
        elif vitals.bp_systolic is not None and vitals.bp_systolic >= 140 and priority != "RED":
            priority = "YELLOW"
            triggers.append(f"Maternal Warning: Gestational BP {vitals.bp_systolic} mmHg requires priority obstetric assessment")
            department = "Obstetrics Priority Clinic"

    # =========================================================================
    # 4. Urgent Thresholds -> YELLOW (P2 Urgent) - if not already RED
    # =========================================================================
    if priority != "RED":
        if vitals.spo2_percent is not None and 90 <= vitals.spo2_percent <= 93:
            priority = "YELLOW"
            triggers.append(f"Borderline Hypoxia: SpO₂ {vitals.spo2_percent}% (target 90-93%)")
            department = "Priority Respiratory OPD"

        if vitals.temperature_f is not None and vitals.temperature_f >= 101.5:
            priority = "YELLOW"
            triggers.append(f"High Grade Pyrexia: Core temperature {vitals.temperature_f}°F (≥ 101.5°F)")
            department = "Fever Triage Desk / Priority OPD"

        if vitals.heart_rate_bpm is not None and 105 <= vitals.heart_rate_bpm <= 130:
            priority = "YELLOW"
            triggers.append(f"Tachycardia: Pulse rate {vitals.heart_rate_bpm} bpm")

        if vitals.bp_systolic is not None and 150 <= vitals.bp_systolic < 180:
            priority = "YELLOW"
            triggers.append(f"Elevated Blood Pressure: Systolic BP {vitals.bp_systolic} mmHg")

        if vitals.respiratory_rate_min is not None and 22 <= vitals.respiratory_rate_min <= 28:
            priority = "YELLOW"
            triggers.append(f"Tachypnea: Respiratory Rate {vitals.respiratory_rate_min}/min")

        if vitals.blood_glucose_mg_dl is not None and 220 <= vitals.blood_glucose_mg_dl <= 350:
            priority = "YELLOW"
            triggers.append(f"Hyperglycemia: Blood Glucose {vitals.blood_glucose_mg_dl} mg/dL")

        if patient_info.age >= 65 or patient_info.age <= 5:
            if triggers:
                triggers.append(f"Vulnerable Age Group ({patient_info.age} yrs) with abnormal vital parameters")

        # Specific Facility Scenario Rules
        if patient_info.facility_type in ["INDUSTRIAL_CLINIC", "IND_PARADEEP"] and priority == "YELLOW":
            department = "Occupational Health & Toxicology Unit"
        elif patient_info.facility_type in ["CAMPUS_FEVER", "CAMP_KORAPUT", "CHC_TANGI"] and priority == "YELLOW":
            department = "Campus / CHC Infectious Disease & Fever Station"

    # =========================================================================
    # 5. Routine Baseline -> GREEN (P3 Routine)
    # =========================================================================
    if not triggers:
        triggers.append("Vitals within physiological baseline limits; no immediate emergency red flags identified.")
        department = "General Medicine OPD / Primary Care Desk"

    if priority == "RED":
        priority_label = "Emergency (P1) — Immediate Medical Officer Assessment"
    elif priority == "YELLOW":
        priority_label = "Urgent (P2) — Priority OPD Evaluation (< 15 mins)"
    else:
        priority_label = "Routine (P3) — Standard OPD Queue"

    return priority, triggers, department, priority_label
