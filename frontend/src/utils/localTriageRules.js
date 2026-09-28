/**
 * Client-Side Deterministic Clinical Triage Rule Engine
 * Mirrors backend/triage_rules.py for instant offline execution and real-time UI highlighting.
 */

export const PRIORITY_RANK = {
  RED: 3,
  YELLOW: 2,
  GREEN: 1,
};

export const RANK_TO_PRIORITY = {
  3: "RED",
  2: "YELLOW",
  1: "GREEN",
};

export function computePriorityCeiling(rulePriority = "GREEN", aiPriority = "GREEN") {
  const rRank = PRIORITY_RANK[rulePriority.toUpperCase()] || 1;
  const aRank = PRIORITY_RANK[aiPriority.toUpperCase()] || 1;
  const maxRank = Math.max(rRank, aRank);
  return RANK_TO_PRIORITY[maxRank];
}

export function evaluateLocalDeterministicTriage(vitals = {}, redFlags = {}, patientInfo = {}) {
  const triggers = [];
  let priority = "GREEN";
  let department = "General Medicine OPD";

  const spo2 = Number(vitals.spo2_percent);
  const hr = Number(vitals.heart_rate_bpm);
  const sysBp = Number(vitals.bp_systolic);
  const diaBp = Number(vitals.bp_diastolic);
  const rr = Number(vitals.respiratory_rate_min);
  const temp = Number(vitals.temperature_f);
  const glucose = Number(vitals.blood_glucose_mg_dl);
  const age = (patientInfo.age !== undefined && patientInfo.age !== null && !isNaN(Number(patientInfo.age)))
    ? Math.max(0, Math.abs(Number(patientInfo.age)))
    : 30;
  const facility = patientInfo.facility_type || "PHC_OPD";

  // 1. Critical Vital Sign Thresholds -> RED
  if (!isNaN(spo2) && spo2 > 0 && spo2 < 90) {
    priority = "RED";
    triggers.push(`Critical Hypoxia: SpO₂ is ${spo2}% (< 90% threshold)`);
    department = "Emergency / Acute Respiratory Care Bay";
  }

  if (!isNaN(sysBp) && sysBp >= 180) {
    priority = "RED";
    triggers.push(`Hypertensive Crisis: Systolic BP ${sysBp} mmHg (≥ 180 threshold)`);
    department = "Emergency Bay";
  } else if (!isNaN(sysBp) && sysBp > 0 && sysBp < 85) {
    priority = "RED";
    triggers.push(`Critical Hypotension / Shock Alert: Systolic BP ${sysBp} mmHg (< 85 threshold)`);
    department = "Emergency Resuscitation Bay";
  }

  if (!isNaN(hr) && hr > 130) {
    priority = "RED";
    triggers.push(`Severe Tachycardia: Heart rate ${hr} bpm (> 130 bpm)`);
    if (department === "General Medicine OPD") department = "Emergency / Cardiac Bay";
  } else if (!isNaN(hr) && hr > 0 && hr < 45) {
    priority = "RED";
    triggers.push(`Severe Bradycardia: Heart rate ${hr} bpm (< 45 bpm)`);
    if (department === "General Medicine OPD") department = "Emergency / Cardiac Bay";
  }

  if (!isNaN(rr) && (rr > 28 || (rr > 0 && rr < 10))) {
    priority = "RED";
    triggers.push(`Severe Respiratory Distress: Respiratory Rate ${rr}/min`);
    department = "Emergency / Acute Respiratory Care Bay";
  }

  if (!isNaN(temp) && temp > 104.0) {
    priority = "RED";
    triggers.push(`Hyperpyrexia Alert: Core Temperature ${temp}°F (> 104°F)`);
  }

  if (!isNaN(glucose) && ((glucose > 0 && glucose < 60) || glucose > 350)) {
    priority = "RED";
    triggers.push(`Metabolic / Glycemic Emergency: Blood Glucose ${glucose} mg/dL`);
    department = "Emergency Bay";
  }

  // 2. Explicit Red Flags -> RED
  if (redFlags.severe_chest_pain) {
    priority = "RED";
    triggers.push("Red Flag: Severe Acute Chest Discomfort / Pain reported");
    department = "Emergency / Cardiac Assessment Bay";
  }

  if (redFlags.severe_breathing_difficulty) {
    priority = "RED";
    triggers.push("Red Flag: Severe Difficulty Breathing / Dyspnea reported");
    department = "Emergency / Acute Respiratory Care Bay";
  }

  if (redFlags.loss_of_consciousness) {
    priority = "RED";
    triggers.push("Red Flag: Loss of consciousness or acute altered mental state");
    department = "Emergency / Trauma & Neuro Bay";
  }

  if (redFlags.seizure) {
    priority = "RED";
    triggers.push("Red Flag: Active convulsion or post-ictal seizure state");
    department = "Emergency / Trauma & Neuro Bay";
  }

  if (redFlags.sudden_weakness_paralysis) {
    priority = "RED";
    triggers.push("Red Flag: Acute neurological deficit / suspected stroke signs");
    department = "Emergency / Stroke & Neuro Bay";
  }

  if (redFlags.severe_bleeding) {
    priority = "RED";
    triggers.push("Red Flag: Active uncontrolled severe hemorrhage");
    department = "Emergency Bay";
  }

  if (redFlags.very_low_oxygen_spo2 && (isNaN(spo2) || spo2 >= 90)) {
    priority = "RED";
    triggers.push("Red Flag: Severe oxygen desaturation verified by nurse");
    department = "Emergency / Acute Respiratory Care Bay";
  }

  if (redFlags.severe_allergic_reaction) {
    priority = "RED";
    triggers.push("Red Flag: Suspected anaphylaxis / acute facial or laryngeal angioedema");
    department = "Emergency Resuscitation Bay";
  }

  // 3. Maternal Clinic Context
  const isMaternal = (
    facility === "MATERNAL_CLINIC"
    || (patientInfo.location_state && patientInfo.location_state.toLowerCase().includes("maternal"))
    || (patientInfo.sex === "Female" && patientInfo.age < 45 && !isNaN(sysBp) && sysBp >= 160 && facility === "CHC_TANGI")
  );
  if (isMaternal) {
    if (!isNaN(sysBp) && sysBp >= 160) {
      priority = "RED";
      triggers.push(`Maternal Emergency: Gestational BP ${sysBp}/${diaBp || 0} mmHg - high pre-eclampsia risk`);
      department = "Obstetrics Emergency / Labour Room Triage";
    } else if (!isNaN(sysBp) && sysBp >= 140 && priority !== "RED") {
      priority = "YELLOW";
      triggers.push(`Maternal Warning: Gestational BP ${sysBp} mmHg requires priority obstetric assessment`);
      department = "Obstetrics Priority Clinic";
    }
  }

  // 4. Urgent Thresholds -> YELLOW (if not already RED)
  if (priority !== "RED") {
    if (!isNaN(spo2) && spo2 >= 90 && spo2 <= 93) {
      priority = "YELLOW";
      triggers.push(`Borderline Hypoxia: SpO₂ ${spo2}% (90-93%)`);
      department = "Priority Respiratory OPD";
    }

    if (!isNaN(temp) && temp >= 101.5) {
      priority = "YELLOW";
      triggers.push(`High Grade Pyrexia: Core temperature ${temp}°F (≥ 101.5°F)`);
      department = "Fever Triage Desk / Priority OPD";
    }

    if (!isNaN(hr) && hr >= 105 && hr <= 130) {
      priority = "YELLOW";
      triggers.push(`Tachycardia: Pulse rate ${hr} bpm`);
    }

    if (!isNaN(sysBp) && sysBp >= 150 && sysBp < 180) {
      priority = "YELLOW";
      triggers.push(`Elevated Blood Pressure: Systolic BP ${sysBp} mmHg`);
    }

    if (!isNaN(rr) && rr >= 22 && rr <= 28) {
      priority = "YELLOW";
      triggers.push(`Tachypnea: Respiratory Rate ${rr}/min`);
    }

    if (!isNaN(glucose) && glucose >= 220 && glucose <= 350) {
      priority = "YELLOW";
      triggers.push(`Hyperglycemia: Blood Glucose ${glucose} mg/dL`);
    }

    if (age >= 65 || age <= 5) {
      if (triggers.length > 0) {
        triggers.push(`Vulnerable Age Group (${age} yrs) with abnormal vital parameters`);
      }
    }

    if ((facility === "INDUSTRIAL_CLINIC" || facility === "IND_PARADEEP") && priority === "YELLOW") {
      department = "Occupational Health & Toxicology Unit";
    } else if ((facility === "CAMPUS_FEVER" || facility === "CAMP_KORAPUT" || facility === "CHC_TANGI") && priority === "YELLOW") {
      department = "Campus / CHC Infectious Disease & Fever Station";
    }
  }

  // 5. Routine Baseline -> GREEN
  if (triggers.length === 0) {
    triggers.push("Vitals within baseline limits; no immediate emergency red flags identified.");
    department = "General Medicine OPD / Primary Care Desk";
  }

  let priorityLabel = "Routine (P3) — Standard OPD Queue";
  if (priority === "RED") {
    priorityLabel = "Emergency (P1) — Immediate Medical Officer Assessment";
  } else if (priority === "YELLOW") {
    priorityLabel = "Urgent (P2) — Priority OPD Evaluation (< 15 mins)";
  }

  return { priority, triggers, department, priorityLabel };
}
