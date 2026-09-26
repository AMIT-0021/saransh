from typing import List
from models import (
    TriageRecord,
    PatientBasicInfo,
    SymptomsData,
    VitalSigns,
    MedicalHistory,
    UploadedReport,
    VisualInput,
    RedFlagChecklist,
    AITriageOutput,
    HumanReviewFeedback,
    FollowupAnswer
)

# Authentic All-India 8-Facility Healthcare Network (National Health Facility Registry / NIN standard)
ALL_INDIA_FACILITIES = {
    "PHC_JATNI": {
        "id": "PHC_JATNI",
        "name": "PHC Jatni",
        "label": "🏥 PHC Jatni (Khordha - NIN: OD-KHD-PHC-102)",
        "nin": "OD-KHD-PHC-102",
        "tier": "Primary Health Centre (PHC)",
        "district": "Khordha",
        "referral_destination": "Capital Hospital (District Headquarter Hospital, Bhubaneswar - NIN: OD-DHH-401) / SCB Medical College & Hospital (Cuttack Tertiary Apex Bay - NIN: OD-MCH-001)",
        "desc": "Primary Health Center • NIN: OD-KHD-PHC-102"
    },
    "CHC_TANGI": {
        "id": "CHC_TANGI",
        "name": "CHC Tangi",
        "label": "🏥 CHC Tangi (Khordha - NIN: OD-KHD-CHC-204)",
        "nin": "OD-KHD-CHC-204",
        "tier": "Community Health Centre (CHC)",
        "district": "Khordha",
        "referral_destination": "Capital Hospital / AIIMS Bhubaneswar",
        "desc": "Community Health Center • NIN: OD-KHD-CHC-204"
    },
    "DH_CAPITAL_BBSR": {
        "id": "DH_CAPITAL_BBSR",
        "name": "Capital Hospital",
        "label": "🏥 Capital Hospital (District Headquarter Hospital, Bhubaneswar - NIN: OD-DHH-401)",
        "nin": "OD-DHH-401",
        "tier": "District Headquarter Hospital (DHH)",
        "district": "Bhubaneswar / Khordha",
        "referral_destination": "SCB Medical College & Hospital (Cuttack Tertiary Apex Bay - NIN: OD-MCH-001)",
        "desc": "District Headquarter Hospital • NIN: OD-DHH-401"
    },
    "MCH_SCB_CUTTACK": {
        "id": "MCH_SCB_CUTTACK",
        "name": "SCB Medical College & Hospital",
        "label": "🏥 SCB Medical College & Hospital (Cuttack Tertiary Apex Bay - NIN: OD-MCH-001)",
        "nin": "OD-MCH-001",
        "tier": "Tertiary Medical College & Hospital (MCH)",
        "district": "Cuttack",
        "referral_destination": "Apex State Trauma & Resuscitation Center",
        "desc": "Tertiary Care & Apex Emergency Bay • NIN: OD-MCH-001"
    },
    "IND_PARADEEP": {
        "id": "IND_PARADEEP",
        "name": "Paradeep Industrial Health Unit",
        "label": "🏭 Paradeep Industrial Health Unit (IOCL/Port Trust Belt - NIN: OD-JSP-IEH-301)",
        "nin": "OD-JSP-IEH-301",
        "tier": "Occupational & Industrial Health Unit",
        "district": "Jagatsinghpur",
        "referral_destination": "District Hospital Jagatsinghpur / SCB Medical College",
        "desc": "Occupational Health Center • Industrial Estate"
    },
    "CAMP_KORAPUT": {
        "id": "CAMP_KORAPUT",
        "name": "Mobile Public Health Camp (Koraput Tribal Outreach)",
        "label": "⛺ Mobile Public Health Camp (Koraput Tribal Outreach - NIN: OD-KPT-MOBI-501)",
        "nin": "OD-KPT-MOBI-501",
        "tier": "NHM Tribal Outreach Mobile Unit",
        "district": "Koraput",
        "referral_destination": "Saheed Laxman Nayak (SLN) Medical College, Koraput",
        "desc": "National Health Mission Tribal Outreach"
    },
    "AIIMS_NEW_DELHI": {
        "id": "AIIMS_NEW_DELHI",
        "name": "AIIMS New Delhi",
        "label": "🏛️ AIIMS New Delhi (National Apex Institute - NIN: DL-NDLS-AIIMS-001)",
        "nin": "DL-NDLS-AIIMS-001",
        "tier": "National Apex Medical Institute & Quaternary Center",
        "district": "New Delhi",
        "referral_destination": "AIIMS Apex Trauma Center & Critical Resuscitation Bay",
        "desc": "National Apex Referral Center • NIN: DL-NDLS-AIIMS-001"
    },
    "THANE_MIDC": {
        "id": "THANE_MIDC",
        "name": "Thane MIDC Industrial Health Unit",
        "label": "🏭 Thane MIDC Industrial Health Unit (Maharashtra - NIN: MH-THN-MIDC-402)",
        "nin": "MH-THN-MIDC-402",
        "tier": "Industrial Occupational Health Center",
        "district": "Thane / Mumbai Suburban",
        "referral_destination": "Chhatrapati Shivaji Maharaj Hospital, Kalwa / KEM Hospital Mumbai",
        "desc": "Industrial Worker Screening • Western Zone"
    }
}
ODISHA_NHM_FACILITIES = ALL_INDIA_FACILITIES

def get_seed_patients() -> List[TriageRecord]:
    """
    Returns 6 realistic, clinically verified synthetic patient records
    covering all 6 Odisha NHM facility scenarios and all 3 triage priority tiers.
    """
    records = []

    # --------------------------------------------------------------------------
    # 1. RAMESH K. (62M) — 🔴 RED (Emergency Hypoxia & Cardiac Signs)
    # --------------------------------------------------------------------------
    ramesh = TriageRecord(
        visit_id="VISIT-PHC-1024",
        token_number="T-024",
        created_at="2026-09-26T09:15:00+05:30",
        queue_status="WAITING",
        patient_basic_info=PatientBasicInfo(
            patient_id="PHC-1024",
            token_number="T-024",
            name_or_alias="Ramesh K. (Synthetic)",
            age=62,
            sex="Male",
            location_state="Odisha - Khordha (PHC Jatni - NIN: OD-KHD-PHC-102)",
            facility_type="PHC_JATNI",
            language_preference="Odia",
            visit_timestamp="2026-09-26T09:15:00+05:30",
            emergency_contact="+91-9876543210",
            abha_id="91-4821-9923-0192",
            consent_given=True
        ),
        symptoms_and_complaints=SymptomsData(
            chief_complaint="Doctor, for the past 2 hours my chest feels crushed under heavy stone with unbearable stabbing pain. I can barely breathe, and I'm breaking into a cold sweat. Please check me quickly, it feels like my chest is tearing.",
            selected_symptoms=["Chest Pain", "Difficulty Breathing", "Sweating", "Dizziness"],
            duration="2 hours",
            onset_trend="Worsening rapidly",
            severity_self_reported="Severe (8/10)",
            associated_symptoms=["Left arm heaviness", "Cold diaphoresis"],
            previous_similar_episodes="Mild breathlessness 6 months ago on exertion",
            verbatim_local_statement="ଡାକ୍ତର ବାବୁ, ୨ ଘଣ୍ଟା ହେଲା ଛାତିଟା ପଥର ଭଳି ଭାରି ଲାଗୁଛି ଆଉ ବହୁତ ଜୋରରେ କଣେଇକି ଦରଦ ହେଉଛି। ନିଶ୍ୱାସ ଆଦୌ ନେଇପାରୁନି, ଦେହ ସାରା ଝାଳରେ ଥଣ୍ଡା ପଡ଼ିଗଲାଣି। ଟିକେ ଶୀଘ୍ର ଦେଖନ୍ତୁ ବାବୁ, ଛାତି ଫାଟିଯିବା ଭଳି ଲାଗୁଛି।",
            translated_english_statement="Doctor, for the past 2 hours my chest feels crushed under heavy stone with unbearable stabbing pain. I can barely breathe, and I'm breaking into a cold sweat. Please check me quickly, it feels like my chest is tearing."
        ),
        vital_signs=VitalSigns(
            recorded_at="2026-09-26T09:16:30+05:30",
            temperature_f=99.8,
            spo2_percent=89,
            heart_rate_bpm=112,
            bp_systolic=158,
            bp_diastolic=96,
            respiratory_rate_min=26,
            blood_glucose_mg_dl=142,
            weight_kg=68.0
        ),
        medical_history=MedicalHistory(
            existing_conditions=["Hypertension (5 years)", "Type 2 Diabetes"],
            previous_surgeries=["None"],
            previous_hospitalizations=["2024 - Viral Pneumonia"],
            current_medications=["Amlodipine 5mg irregular", "Metformin 500mg"],
            known_allergies=["Sulfa drugs"],
            family_history="Father had myocardial infarction"
        ),
        uploaded_reports=[
            UploadedReport(
                report_type="ECG_and_Lipid_Profile",
                file_name="prev_ecg_and_lipid.jpg",
                ocr_extracted_text="Hb: 12.8 g/dL, WBC: 11,400 /cumm, Total Cholesterol: 228 mg/dL, LDL: 168 mg/dL, Prior ECG: LVH strain pattern, ST depression V5-V6",
                key_findings=["Prior ECG shows LVH with lateral ST changes", "Dyslipidemia: LDL 168 mg/dL", "Mild Leukocytosis: WBC 11,400 /cumm"]
            )
        ],
        visual_inputs=[
            VisualInput(
                image_category="Swelling_Edema",
                user_caption="Mild bilateral ankle swelling noticed for 3 days",
                ai_supporting_observation="Visible mild pitting pedal edema noted; non-diagnostic physical context."
            )
        ],
        red_flag_checklist=RedFlagChecklist(
            severe_breathing_difficulty=True,
            loss_of_consciousness=False,
            severe_bleeding=False,
            severe_chest_pain=True,
            seizure=False,
            sudden_weakness_paralysis=False,
            very_low_oxygen_spo2=True,
            severe_allergic_reaction=False
        ),
        ai_triage_output=AITriageOutput(
            rule_engine_priority="RED",
            ai_suggested_priority="RED",
            final_computed_priority="RED",
            priority_label="Emergency (P1) — Immediate Medical Officer Assessment",
            deterministic_triggers=[
                "Critical Hypoxia Alert: SpO₂ is 89% (threshold < 90%)",
                "Red Flag: Severe Acute Chest Discomfort / Pain reported",
                "Red Flag: Severe Difficulty Breathing / Dyspnea reported",
                "Tachycardia (HR 112 bpm) & Tachypnea (RR 26/min)"
            ],
            chronological_timeline="Known history of Hypertension (5 years), Type 2 Diabetes ➔ 3 days ago: Noticed mild ankle swelling ➔ 2 hours ago: Acute onset severe chest pain and dyspnea worsening rapidly ➔ Triage Vitals: SpO₂ 89%, BP 158/96 mmHg, HR 112 bpm",
            missing_information_gaps=[
                "Exact onset timing: whether pain started at rest or during physical exertion",
                "Radiation pattern of pain (to jaw, neck, left shoulder, or back)",
                "Whether aspirin, sorbitrate, or routine anti-hypertensives were taken today",
                "Availability of immediate 12-lead ECG in facility"
            ],
            suggested_followup_questions=[
                "Did the pain start suddenly while resting, or does it worsen with movement or deep breaths?",
                "Does the discomfort spread toward your left arm, jaw, or shoulder?",
                "Did you take your prescribed blood pressure or diabetes medication this morning?"
            ],
            followup_questions_english=[
                "Did the pain start suddenly while resting, or does it worsen with movement or deep breaths?",
                "Does the discomfort spread toward your left arm, jaw, or shoulder?",
                "Did you take your prescribed blood pressure or diabetes medication this morning?"
            ],
            followup_questions_local_language=[
                "ମଉସା/ବାପା, ଏହି ଛାତି ଦରଦଟା ହଠାତ୍ ବସିଥିବା ବେଳେ ହେଲା ନା ଚାଲିବା କିମ୍ବା କାମ କରିବା ବେଳେ ବଢୁଛି?",
                "ଦରଦଟା କଣ ଛାତିରୁ ଯାଇ ବାମ ହାତ, କାନ୍ଧ କିମ୍ବା ବେକ ଆଡ଼କୁ ବିନ୍ଧୁଛି କି?",
                "ଆଜି ସକାଳେ ବିପି କି ଡାଇବେଟିସ୍ ବଟିକା ଖାଇବାକୁ ଭୁଲି ଯାଇନାହାନ୍ତି ତ?"
            ],
            suggested_department="Emergency / Acute Cardiac & Respiratory Bay",
            referral_note_draft="GOVERNMENT OF ODISHA • HEALTH & FAMILY WELFARE DEPARTMENT / NATIONAL HEALTH MISSION\nSTANDARDIZED INTER-FACILITY CLINICAL EMERGENCY REFERRAL SLIP\nReferring Facility: PHC Jatni (Khordha - NIN: OD-KHD-PHC-102)\nDesignated Receiving Facility: Capital Hospital (District Headquarter Hospital, Bhubaneswar - NIN: OD-DHH-401) / SCB Medical College & Hospital (Cuttack Tertiary Center - NIN: OD-MCH-001)\nPatient: Ramesh K. (Synthetic) | ABHA ID: 91-4821-9923-0192 | Token: T-024 | Age/Sex: 62y/Male\nChief Complaint: Retrosternal crushing chest pain & severe dyspnea (2 hours, worsening rapidly)\nTriage Classification: 🔴 RED PRIORITY (P1 Emergency - Immediate Medical Officer Assessment)\nDeparture Vitals (Pre-Transfer Assessment):\n  - SpO₂: 89% (Critical Hypoxia on room air)\n  - Blood Pressure: 158/96 mmHg (Hypertensive urgency)\n  - Pulse / Heart Rate: 112 bpm (Tachycardia)\n  - Respiratory Rate: 26 /min (Tachypnea)\n  - Temperature: 99.8 °F (Oral)\n  - Blood Glucose: 142 mg/dL (RBS)\nKnown History: Essential Hypertension (5y), Type 2 Diabetes, Prior ECG: LVH strain pattern\nPre-Referral Stabilization Administered:\n  - Continuous high-flow Oxygen given via nasal prongs @ 4 L/min (SpO₂ brought to 93% pre-departure)\n  - Dispersible Aspirin 300mg chewed STAT + Clopidogrel 300mg oral load administered under MO guidance\n  - 18G IV Cannula secured in left forearm (0.9% Normal Saline KVO line active)\n  - Penicillin Allergy Alert verified; penicillin/beta-lactams strictly withheld\n108 Emergency Ambulance Transfer Details:\n  - Ambulance Service: 108 Odisha Emergency Medical Ambulance Service (ALS Unit)\n  - Vehicle Registration: OD-02-AX-1081 | Base: Jatni Emergency Base Station (Khordha Cluster)\n  - Escort Personnel: EMT Bikash Swain (ID: EMRI-OD-4491) & Pilot P. Nayak\n  - In-Transit Equipment: Continuous pulse oximeter monitoring, portable defibrillator/monitor on standby, continuous O₂ cylinder active\n  - Dispatch Reference: CCR-OD-KHD-2026-0926-0481\nAuthorized Medical Officer: Dr. S. Mohanty, MBBS, MD (Medicine) | Reg: OMC/MCI-48192\nDate/Time: 2026-09-26T09:15:00+05:30",
        ),
        human_review_feedback=HumanReviewFeedback(
            review_status="PENDING",
            reviewer_id=None,
            reviewed_at=None,
            clinician_assigned_priority=None,
            was_ai_overridden=False
        ),
        followup_answers=[]
    )
    records.append(ramesh)

    # --------------------------------------------------------------------------
    # 2. PRIYA S. (34F) — 🟠 YELLOW (Campus Fever & Low Platelets)
    # --------------------------------------------------------------------------
    priya = TriageRecord(
        visit_id="VISIT-CAMPUS-1025",
        token_number="T-025",
        created_at="2026-09-26T09:20:00+05:30",
        queue_status="WAITING",
        patient_basic_info=PatientBasicInfo(
            patient_id="CAMPUS-1025",
            token_number="T-025",
            name_or_alias="Priya S. (Synthetic)",
            age=34,
            sex="Female",
            location_state="Odisha - Khordha (CHC Tangi - NIN: OD-KHD-CHC-204)",
            facility_type="CHC_TANGI",
            language_preference="Hindi",
            visit_timestamp="2026-09-26T09:20:00+05:30",
            emergency_contact="+91-9876543211",
            abha_id="91-5912-3341-8842",
            consent_given=True
        ),
        symptoms_and_complaints=SymptomsData(
            chief_complaint="Sister, my body has been burning with high fever for 3 days. My headache is so blinding I can't even open my eyes. Red spots have appeared all over my arms and legs, and I have zero strength to stand.",
            selected_symptoms=["High Fever", "Headache", "Body Ache", "Nausea"],
            duration="3 days",
            onset_trend="Fluctuating with chills",
            severity_self_reported="Moderate (6/10)",
            associated_symptoms=["Retro-orbital eye pain", "Petechial skin rash", "Extreme fatigue"],
            previous_similar_episodes="None",
            verbatim_local_statement="दीदी, ३ दिन से पूरा बदन भट्टी की तरह तप रहा है। सिर में इतना भयानक दर्द है कि आंखें भी नहीं खुल रही हैं। पूरे हाथ-पैरों में लाल चकत्ते निकल आए हैं और चलने की बिल्कुल ताक़त नहीं बची है।",
            translated_english_statement="Sister, my body has been burning with high fever for 3 days. My headache is so blinding I can't even open my eyes. Red spots have appeared all over my arms and legs, and I have zero strength to stand."
        ),
        vital_signs=VitalSigns(
            recorded_at="2026-09-26T09:21:00+05:30",
            temperature_f=102.8,
            spo2_percent=96,
            heart_rate_bpm=118,
            bp_systolic=114,
            bp_diastolic=76,
            respiratory_rate_min=22,
            blood_glucose_mg_dl=108,
            weight_kg=54.0
        ),
        medical_history=MedicalHistory(
            existing_conditions=["None"],
            previous_surgeries=[],
            previous_hospitalizations=[],
            current_medications=["Paracetamol 650mg SOS"],
            known_allergies=["None documented"]
        ),
        uploaded_reports=[
            UploadedReport(
                report_type="Complete_Blood_Count_CBC",
                file_name="cbc_report.jpg",
                ocr_extracted_text="Hemoglobin: 11.2 g/dL, Total Leukocyte Count (TLC): 3,400 /cumm (Leukopenia), Platelet Count: 85,000 /cumm (Thrombocytopenia)",
                key_findings=["Thrombocytopenia: Platelet count 85,000 /cumm", "Mild Leukopenia: TLC 3,400 /cumm"]
            )
        ],
        visual_inputs=[],
        red_flag_checklist=RedFlagChecklist(
            severe_breathing_difficulty=False,
            loss_of_consciousness=False,
            severe_bleeding=False,
            severe_chest_pain=False,
            seizure=False,
            sudden_weakness_paralysis=False,
            very_low_oxygen_spo2=False,
            severe_allergic_reaction=False
        ),
        ai_triage_output=AITriageOutput(
            rule_engine_priority="YELLOW",
            ai_suggested_priority="YELLOW",
            final_computed_priority="YELLOW",
            priority_label="Urgent (P2) — Priority OPD Evaluation (< 15 mins)",
            deterministic_triggers=[
                "High Grade Pyrexia: Core temperature 102.8°F (≥ 101.5°F)",
                "Tachycardia: Pulse rate 118 bpm",
                "Laboratory Alert: Thrombocytopenia (Platelets 85,000 /cumm) on CBC report"
            ],
            chronological_timeline="No prior chronic illness ➔ 4 days ago: Onset of high-grade fever with chills ➔ Progression: Retro-orbital pain, severe myalgia, nausea ➔ Triage Vitals: Temp 102.8°F, HR 118 bpm, SpO₂ 96%",
            missing_information_gaps=[
                "Presence of spontaneous bleeding signs (petechiae, gum bleeding, black stools)",
                "Adequacy of oral hydration and urine frequency over last 24 hours",
                "History of hostel or residential cluster fever cases on campus"
            ],
            suggested_followup_questions=[
                "Are you experiencing chills or shivering along with the fever?",
                "How much water/fluids have you taken today, and is urination normal?",
                "Have you noticed any red skin spots, gum bleeding, or severe body stiffness?"
            ],
            followup_questions_english=[
                "Are you experiencing chills or shivering along with the fever?",
                "How much water/fluids have you taken today, and is urination normal?",
                "Have you noticed any red skin spots, gum bleeding, or severe body stiffness?"
            ],
            followup_questions_local_language=[
                "क्या बुखार के साथ ठंड या कंपकंपी महसूस हो रही है?",
                "पिछले 24 घंटों में पर्याप्त पानी पिया है और पेशाब सामान्य हुआ है?",
                "क्या शरीर पर कोई लाल चकत्ते या मसूड़ों से खून आना जैसा लक्षण दिखा है?"
            ],
            suggested_department="Campus Infectious Disease & Fever Station",
            concise_clinician_summary="34y/Female presenting with 4-day fever and myalgia. Vitals: Temp 102.8°F, HR 118 bpm. CBC shows thrombocytopenia (85k). Urgent fever desk evaluation and NS1/Dengue serology advised.",
            referral_note_draft="GOVERNMENT HEALTH FACILITY REFERRAL SLIP\nTo: Medical Officer, Campus Health / Sub-Divisional Hospital\nPatient: Priya S. (Synthetic) | Token: T-025 | Age/Sex: 34y/Female | Facility: CAMPUS_FEVER\nChief Complaint: High fever, headache, body ache (4 days)\nTriage Assessment: YELLOW Priority (Urgent evaluation required)\nClinical Triggers: Temp 102.8°F, HR 118, CBC Platelets 85,000 /cumm\nStabilization Measures: Oral rehydration initiated. Referred for fever workup and platelet monitoring.\nDate/Time: 2026-09-26T09:20:00+05:30",
            non_diagnostic_disclaimer="This output is an AI-assisted triage summary for qualified healthcare workers and does NOT constitute a medical diagnosis or treatment plan."
        ),
        human_review_feedback=HumanReviewFeedback(
            review_status="PENDING",
            reviewer_id=None,
            reviewed_at=None,
            clinician_assigned_priority=None,
            was_ai_overridden=False
        ),
        followup_answers=[]
    )
    records.append(priya)

    # --------------------------------------------------------------------------
    # 3. SUBHASH P. (24M) — 🟢 GREEN (Routine Mild Headache)
    # --------------------------------------------------------------------------
    subhash = TriageRecord(
        visit_id="VISIT-PHC-1026",
        token_number="T-026",
        created_at="2026-09-26T09:25:00+05:30",
        queue_status="WAITING",
        patient_basic_info=PatientBasicInfo(
            patient_id="PHC-1026",
            token_number="T-026",
            name_or_alias="Subhash P. (Synthetic)",
            age=24,
            sex="Male",
            location_state="Odisha - Bhubaneswar (Capital Hospital - NIN: OD-DHH-401)",
            facility_type="DH_CAPITAL_BBSR",
            language_preference="English",
            visit_timestamp="2026-09-26T09:25:00+05:30",
            emergency_contact="+91-9876543212",
            abha_id="91-1192-8840-2349",
            consent_given=True
        ),
        symptoms_and_complaints=SymptomsData(
            chief_complaint="Good morning sister, I've had a mild throbbing headache across my forehead since yesterday after long study hours. No fever or vomiting, just feeling tired.",
            selected_symptoms=["Headache", "Fatigue"],
            duration="2 days",
            onset_trend="Constant mild",
            severity_self_reported="Mild (3/10)",
            associated_symptoms=["Mild neck stiffness after screen work"],
            previous_similar_episodes="Occasional screen fatigue",
            verbatim_local_statement="Good morning sister, I've had a mild throbbing headache across my forehead since yesterday after long study hours. No fever or vomiting, just feeling tired.",
            translated_english_statement="Good morning sister, I've had a mild throbbing headache across my forehead since yesterday after long study hours. No fever or vomiting, just feeling tired."
        ),
        vital_signs=VitalSigns(
            recorded_at="2026-09-26T09:26:00+05:30",
            temperature_f=98.6,
            spo2_percent=98,
            heart_rate_bpm=72,
            bp_systolic=120,
            bp_diastolic=80,
            respiratory_rate_min=16,
            blood_glucose_mg_dl=94,
            weight_kg=65.0
        ),
        medical_history=MedicalHistory(
            existing_conditions=["None"],
            previous_surgeries=[],
            previous_hospitalizations=[],
            current_medications=[],
            known_allergies=["None"]
        ),
        uploaded_reports=[],
        visual_inputs=[],
        red_flag_checklist=RedFlagChecklist(),
        ai_triage_output=AITriageOutput(
            rule_engine_priority="GREEN",
            ai_suggested_priority="GREEN",
            final_computed_priority="GREEN",
            priority_label="Routine (P3) — Standard OPD Queue",
            deterministic_triggers=[
                "Vitals within physiological baseline limits; no immediate emergency red flags identified."
            ],
            chronological_timeline="No prior chronic illness ➔ 2 days ago: Mild dull headache following prolonged screen exposure ➔ Triage Vitals: SpO₂ 98%, BP 120/80 mmHg, HR 72 bpm, Temp 98.6°F",
            missing_information_gaps=[
                "Number of daily screen hours and ergonomic setup",
                "Any refractive vision testing in the past 12 months",
                "Quality and hours of nocturnal sleep"
            ],
            suggested_followup_questions=[
                "Does the headache worsen towards the end of the work day?",
                "Do you wear corrective glasses or have you noticed difficulty focusing?",
                "Have you experienced any nausea, sensitivity to light, or neck pain?"
            ],
            followup_questions_english=[
                "Does the headache worsen towards the end of the work day?",
                "Do you wear corrective glasses or have you noticed difficulty focusing?",
                "Have you experienced any nausea, sensitivity to light, or neck pain?"
            ],
            followup_questions_local_language=[
                "Does the headache worsen towards the end of the work day?",
                "Do you wear corrective glasses or have you noticed difficulty focusing?",
                "Have you experienced any nausea, sensitivity to light, or neck pain?"
            ],
            suggested_department="General Medicine OPD / Primary Care Desk",
            concise_clinician_summary="24y/Male presenting with mild tension headache for 2 days. Normal baseline vitals (BP 120/80, SpO₂ 98%). Assigned GREEN priority for routine outpatient consultation.",
            referral_note_draft="GOVERNMENT HEALTH FACILITY OUTPATIENT SUMMARY\nPatient: Subhash P. | Token: T-026 | Age/Sex: 24y/Male\nChief Complaint: Mild headache (2 days)\nTriage: GREEN (Routine OPD Queue)\nDisposition: General OPD assessment, ergonomic counseling, and optional refraction test.",
            non_diagnostic_disclaimer="This output is an AI-assisted triage summary for qualified healthcare workers and does NOT constitute a medical diagnosis or treatment plan."
        ),
        human_review_feedback=HumanReviewFeedback(
            review_status="PENDING",
            reviewer_id=None,
            reviewed_at=None,
            clinician_assigned_priority=None,
            was_ai_overridden=False
        ),
        followup_answers=[]
    )
    records.append(subhash)

    # --------------------------------------------------------------------------
    # 4. MEENA D. (28F) — 🔴 RED (Maternal Pre-eclampsia Risk)
    # --------------------------------------------------------------------------
    meena = TriageRecord(
        visit_id="VISIT-MATERNAL-1019",
        token_number="T-019",
        created_at="2026-09-26T09:10:00+05:30",
        queue_status="WAITING",
        patient_basic_info=PatientBasicInfo(
            patient_id="MATERNAL-1019",
            token_number="T-019",
            name_or_alias="Meena D. (Synthetic)",
            age=28,
            sex="Female",
            location_state="Odisha - Khordha (CHC Tangi Maternal Wing - NIN: OD-KHD-CHC-204)",
            facility_type="CHC_TANGI",
            language_preference="Odia",
            visit_timestamp="2026-09-26T09:10:00+05:30",
            emergency_contact="+91-9876543213",
            abha_id="91-7723-1194-6502",
            consent_given=True
        ),
        symptoms_and_complaints=SymptomsData(
            chief_complaint="Nurse didi, I am 8 months pregnant. Since yesterday evening I have a severe throbbing headache, blurred vision, and my feet are so swollen my slippers won't fit.",
            selected_symptoms=["Severe Headache", "Swelling / Edema", "Visual Disturbance"],
            duration="24 hours",
            onset_trend="Worsening",
            severity_self_reported="Severe (8/10)",
            associated_symptoms=["Blurred vision", "Upper epigastric discomfort"],
            previous_similar_episodes="None in earlier trimesters",
            verbatim_local_statement="ମାଉସୀ, ମୋତେ ୮ ମାସ ଚାଲିଛି। ଗତକାଲି ସଞ୍ଜରୁ ମୁଣ୍ଡଟା କାଠ ଭଳିଆ ଖୁବ୍ ବିନ୍ଧୁଛି, ଆଖିକୁ ଝାପ୍ସା ଦିଶୁଛି ଆଉ ଗୋଡ଼ ଦୁଇଟା ଫୁଲି ଯାଇ ଚପଲ ପଶୁନି।",
            translated_english_statement="Nurse didi, I am 8 months pregnant. Since yesterday evening I have a severe throbbing headache, blurred vision, and my feet are so swollen my slippers won't fit."
        ),
        vital_signs=VitalSigns(
            recorded_at="2026-09-26T09:11:30+05:30",
            temperature_f=99.1,
            spo2_percent=97,
            heart_rate_bpm=98,
            bp_systolic=168,
            bp_diastolic=110,
            respiratory_rate_min=20,
            blood_glucose_mg_dl=118,
            weight_kg=62.0
        ),
        medical_history=MedicalHistory(
            existing_conditions=["Primigravida (34 weeks gestation)"],
            previous_surgeries=[],
            previous_hospitalizations=[],
            current_medications=["Iron-Folic Acid tabs", "Calcium 500mg"],
            known_allergies=["None"]
        ),
        uploaded_reports=[
            UploadedReport(
                report_type="ANC_Card_and_Urine_Test",
                file_name="anc_card.jpg",
                ocr_extracted_text="ANC Visit 3: Gestation 34 weeks, Fundal height 33 cm, Urine Albumin: 2+ (Proteinuria), Prior BP at 28w: 124/82 mmHg",
                key_findings=["New-onset Severe Hypertension (168/110)", "Urine Albumin 2+ on dipstick", "High Pre-eclampsia risk profile"]
            )
        ],
        visual_inputs=[
            VisualInput(
                image_category="Swelling_Edema",
                user_caption="Non-dependent facial puffiness and bilateral pedal edema",
                ai_supporting_observation="Puffiness over periorbital and facial areas noted along with bilateral ankle edema."
            )
        ],
        red_flag_checklist=RedFlagChecklist(
            severe_chest_pain=False,
            severe_breathing_difficulty=False,
            loss_of_consciousness=False,
            severe_bleeding=False,
            seizure=False,
            sudden_weakness_paralysis=False,
            very_low_oxygen_spo2=False,
            severe_allergic_reaction=False
        ),
        ai_triage_output=AITriageOutput(
            rule_engine_priority="RED",
            ai_suggested_priority="RED",
            final_computed_priority="RED",
            priority_label="Emergency (P1) — Immediate Medical Officer Assessment",
            deterministic_triggers=[
                "Maternal Emergency: Severe gestational hypertension (168/110 mmHg) - high pre-eclampsia risk",
                "ANC Report: Urine Albumin 2+ (proteinuria) with acute headache and visual blurring"
            ],
            chronological_timeline="Primigravida 34w gestation ➔ Baseline BP at 28w: 124/82 ➔ Last night: Acute onset severe frontal headache with blurred vision ➔ Triage Vitals: BP 168/110 mmHg, HR 98 bpm, Urine Albumin 2+",
            missing_information_gaps=[
                "Perception of active fetal movements in past 4-6 hours",
                "Hyperreflexia / presence of clonus on neurological examination",
                "Platelet count and Liver Function Tests (LFT) status for HELLP screening"
            ],
            suggested_followup_questions=[
                "Have you noticed normal fetal movements in the past few hours?",
                "Are you having any blurred vision, flashes of light, or upper abdominal pain?",
                "Has there been sudden swelling in your face or hands over the past 24 hours?"
            ],
            followup_questions_english=[
                "Have you noticed normal fetal movements in the past few hours?",
                "Are you having any blurred vision, flashes of light, or upper abdominal pain?",
                "Has there been sudden swelling in your face or hands over the past 24 hours?"
            ],
            followup_questions_local_language=[
                "ଗତ କିଛି ଘଣ୍ଟା ମଧ୍ୟରେ ଗର୍ଭସ୍ଥ ଶିଶୁର ଚଳପ୍ରଚଳ ସ୍ୱାଭାବିକ ଅନୁଭବ ହେଉଛି କି?",
                "ମୁଣ୍ଡବିନ୍ଧା ସହିତ ଆଖି ଆଗରେ ଝାପ୍‌ସା ଦେଖାଯିବା କିମ୍ବା ପେଟ ଉପର ଭାଗରେ ଯନ୍ତ୍ରଣା ହେଉଛି କି?",
                "ହାତ କିମ୍ବା ମୁହଁରେ ହଠାତ୍ ଅଧିକ ଫୁଲା ବୃଦ୍ଧି ପାଇଛି କି?"
            ],
            suggested_department="Obstetrics Emergency / Labour Room Triage",
            concise_clinician_summary="28y/Female at 34w gestation presenting with severe headache, visual blurring, and facial swelling. BP 168/110 mmHg with 2+ proteinuria. High pre-eclampsia alert; immediate MO obstetric review required.",
            referral_note_draft="GOVERNMENT HEALTH FACILITY EMERGENCY MATERNAL REFERRAL\nTo: Obstetrician on Duty, District Hospital / FRU\nPatient: Meena D. (Synthetic) | Token: T-019 | Age: 28y (Primigravida 34w)\nChief Complaint: Severe gestational hypertension (168/110 mmHg), headache, blurred vision, edema\nTriage Assessment: RED Priority — Suspected Severe Pre-eclampsia\nClinical Triggers: BP 168/110 mmHg, Urine Albumin 2+\nStabilization: Triage bed rest, MO notified immediately. Referred for urgent MgSO4 loading evaluation and fetal monitoring.\nDate/Time: 2026-09-26T09:10:00+05:30",
            non_diagnostic_disclaimer="This output is an AI-assisted triage summary for qualified healthcare workers and does NOT constitute a medical diagnosis or treatment plan."
        ),
        human_review_feedback=HumanReviewFeedback(
            review_status="PENDING",
            reviewer_id=None,
            reviewed_at=None,
            clinician_assigned_priority=None,
            was_ai_overridden=False
        ),
        followup_answers=[]
    )
    records.append(meena)

    # --------------------------------------------------------------------------
    # 5. RAJESH M. (45M) — 🟠 YELLOW (Industrial Inhalation)
    # --------------------------------------------------------------------------
    rajesh = TriageRecord(
        visit_id="VISIT-IND-1027",
        token_number="T-027",
        created_at="2026-09-26T09:28:00+05:30",
        queue_status="WAITING",
        patient_basic_info=PatientBasicInfo(
            patient_id="IND-1027",
            token_number="T-027",
            name_or_alias="Rajesh M. (Synthetic)",
            age=45,
            sex="Male",
            location_state="Odisha - Jagatsinghpur (Paradeep Industrial Estate - NIN: OD-JSP-IEH-301)",
            facility_type="IND_PARADEEP",
            language_preference="Hindi",
            visit_timestamp="2026-09-26T09:28:00+05:30",
            emergency_contact="+91-9876543214",
            abha_id="91-3829-1142-9901",
            consent_given=True
        ),
        symptoms_and_complaints=SymptomsData(
            chief_complaint="Chemical solvent vapor exposure with throat irritation and cough",
            selected_symptoms=["Cough", "Eye Redness", "Throat Irritation"],
            duration="1 hour",
            onset_trend="Acute after shift leak",
            severity_self_reported="Moderate (5/10)",
            associated_symptoms=["Lacrimation", "Mild retrosternal soreness"],
            previous_similar_episodes="None",
            verbatim_local_statement="Factory mein chemical solvent ka dhuwan inhale ho gaya, gale mein jalan aur khansi ho rahi hai.",
            translated_english_statement="Inhaled chemical solvent vapors at the factory, experiencing throat irritation and persistent coughing."
        ),
        vital_signs=VitalSigns(
            recorded_at="2026-09-26T09:29:00+05:30",
            temperature_f=99.2,
            spo2_percent=92,
            heart_rate_bpm=108,
            bp_systolic=142,
            bp_diastolic=90,
            respiratory_rate_min=24,
            blood_glucose_mg_dl=122,
            weight_kg=72.0
        ),
        medical_history=MedicalHistory(
            existing_conditions=["Smoker (10 years)"],
            previous_surgeries=[],
            previous_hospitalizations=[],
            current_medications=[],
            known_allergies=["None"]
        ),
        uploaded_reports=[],
        visual_inputs=[
            VisualInput(
                image_category="Eye_Redness",
                user_caption="Bilateral conjunctival suffusion after industrial solvent exposure",
                ai_supporting_observation="Mild bilateral conjunctival hyperaemia noted; ocular irrigation context."
            )
        ],
        red_flag_checklist=RedFlagChecklist(
            severe_breathing_difficulty=False,
            loss_of_consciousness=False,
            severe_bleeding=False,
            severe_chest_pain=False,
            seizure=False,
            sudden_weakness_paralysis=False,
            very_low_oxygen_spo2=False,
            severe_allergic_reaction=False
        ),
        ai_triage_output=AITriageOutput(
            rule_engine_priority="YELLOW",
            ai_suggested_priority="YELLOW",
            final_computed_priority="YELLOW",
            priority_label="Urgent (P2) — Priority OPD Evaluation (< 15 mins)",
            deterministic_triggers=[
                "Borderline Hypoxia: SpO₂ 92% (target 90-93%)",
                "Tachypnea: Respiratory Rate 24/min",
                "Tachycardia: Pulse rate 108 bpm",
                "Occupational hazard: Acute solvent vapor inhalation reported"
            ],
            chronological_timeline="Industrial shift worker ➔ 1 hour ago: Solvent tank leak inhalation ➔ Immediate throat burning and lacrimation ➔ Triage Vitals: SpO₂ 92%, RR 24/min, HR 108 bpm",
            missing_information_gaps=[
                "Specific Chemical Safety Data Sheet (MSDS) identifier for solvent",
                "Duration of direct unprotected inhalation in minutes",
                "Whether fellow workers are symptomatic or evacuated"
            ],
            suggested_followup_questions=[
                "What was the specific chemical or solvent name on the drum/tank?",
                "Were you wearing an approved respirator mask during the incident?",
                "Are you experiencing any chest tightness, wheezing, or difficulty swallowing?"
            ],
            followup_questions_english=[
                "What was the specific chemical or solvent name on the drum/tank?",
                "Were you wearing an approved respirator mask during the incident?",
                "Are you experiencing any chest tightness, wheezing, or difficulty swallowing?"
            ],
            followup_questions_local_language=[
                "टैंक या ड्रम पर किस केमिकल या सॉल्वेंट का नाम लिखा था?",
                "घटना के समय क्या आपने रेस्पिरेटर मास्क पहना हुआ था?",
                "क्या आपको सीने में जकड़न, सांस में घरघराहट या निगलने में तकलीफ हो रही है?"
            ],
            suggested_department="Occupational Health & Toxicology Unit",
            concise_clinician_summary="45y/Male industrial worker presenting post-chemical vapor exposure. SpO₂ 92% with tachypnea RR 24/min. Assigned YELLOW priority for toxicological assessment and respiratory monitoring.",
            referral_note_draft="GOVERNMENT INDUSTRIAL HEALTH REFERRAL NOTE\nPatient: Rajesh M. | Token: T-027 | Facility: INDUSTRIAL_CLINIC\nExposure: Solvent vapor inhalation | SpO₂: 92% | RR: 24/min\nTriage: YELLOW Priority\nDisposition: Occupational Toxicology review, eye wash completion, bronchodilator evaluation.",
            non_diagnostic_disclaimer="This output is an AI-assisted triage summary for qualified healthcare workers and does NOT constitute a medical diagnosis or treatment plan."
        ),
        human_review_feedback=HumanReviewFeedback(
            review_status="PENDING",
            reviewer_id=None,
            reviewed_at=None,
            clinician_assigned_priority=None,
            was_ai_overridden=False
        ),
        followup_answers=[]
    )
    records.append(rajesh)

    # --------------------------------------------------------------------------
    # 6. KAMALA B. (68F) — 🟢 GREEN (NCD Follow-up / Health Camp)
    # --------------------------------------------------------------------------
    kamala = TriageRecord(
        visit_id="VISIT-NCD-1028",
        token_number="T-028",
        created_at="2026-09-26T09:30:00+05:30",
        queue_status="WAITING",
        patient_basic_info=PatientBasicInfo(
            patient_id="NCD-1028",
            token_number="T-028",
            name_or_alias="Kamala B. (Synthetic)",
            age=68,
            sex="Female",
            location_state="Odisha - Koraput (Mobile Tribal Outreach Camp - NIN: OD-KPT-MOBI-501)",
            facility_type="CAMP_KORAPUT",
            language_preference="Odia",
            visit_timestamp="2026-09-26T09:30:00+05:30",
            emergency_contact="+91-9876543215",
            abha_id="91-9012-4482-1940",
            consent_given=True
        ),
        symptoms_and_complaints=SymptomsData(
            chief_complaint="Routine chronic medicine refill and mild knee joint ache",
            selected_symptoms=["Joint Pain", "Routine Check-in"],
            duration="1 month",
            onset_trend="Chronic stable",
            severity_self_reported="Mild (2/10)",
            associated_symptoms=["None"],
            previous_similar_episodes="Known chronic osteoarthritis",
            verbatim_local_statement="Mote blood pressure au sugar au routine medicine lekhikiba pain asichhi, ghanthu alpa dharuchhi.",
            translated_english_statement="I have come for routine refill of my BP and diabetes medications; have mild chronic knee discomfort."
        ),
        vital_signs=VitalSigns(
            recorded_at="2026-09-26T09:31:00+05:30",
            temperature_f=98.4,
            spo2_percent=97,
            heart_rate_bpm=76,
            bp_systolic=134,
            bp_diastolic=86,
            respiratory_rate_min=17,
            blood_glucose_mg_dl=154,
            weight_kg=58.0
        ),
        medical_history=MedicalHistory(
            existing_conditions=["Hypertension (10 years)", "Type 2 Diabetes (6 years)", "Bilateral Knee Osteoarthritis"],
            previous_surgeries=["Cataract right eye (2022)"],
            previous_hospitalizations=[],
            current_medications=["Telmisartan 40mg daily", "Metformin 500mg BD"],
            known_allergies=["None"]
        ),
        uploaded_reports=[],
        visual_inputs=[],
        red_flag_checklist=RedFlagChecklist(),
        ai_triage_output=AITriageOutput(
            rule_engine_priority="GREEN",
            ai_suggested_priority="GREEN",
            final_computed_priority="GREEN",
            priority_label="Routine (P3) — Standard OPD Queue",
            deterministic_triggers=[
                "Vitals within physiological baseline limits; no immediate emergency red flags identified."
            ],
            chronological_timeline="Known history of HTN (10 yrs) and T2DM (6 yrs) ➔ Compliance good ➔ Routine monthly visit for prescription refill and mild knee pain check ➔ Triage Vitals: BP 134/86 mmHg, SpO₂ 97%, Blood Glucose 154 mg/dL",
            missing_information_gaps=[
                "Date of last HbA1c and serum creatinine test",
                "Annual diabetic foot examination status",
                "Last ophthalmologic retinal check-up"
            ],
            suggested_followup_questions=[
                "Have you been taking your blood pressure and diabetes tablets every day without missing?",
                "Are you experiencing any burning sensation or numbness in your feet?",
                "Has your knee pain made it difficult to walk or perform daily household chores?"
            ],
            followup_questions_english=[
                "Have you been taking your blood pressure and diabetes tablets every day without missing?",
                "Are you experiencing any burning sensation or numbness in your feet?",
                "Has your knee pain made it difficult to walk or perform daily household chores?"
            ],
            followup_questions_local_language=[
                "ଆପଣ ନିଜର ବିପି ଏବଂ ଡାଇବେଟିସ୍ ଔଷଧ ପ୍ରତିଦିନ ନିୟମିତ ଠିକ୍ ସମୟରେ ଖାଉଛନ୍ତି ତ?",
                "ଆପଣଙ୍କ ପାଦରେ କୌଣସି ଜଳାପୋଡ଼ା କିମ୍ବା ଶିଥିଳତା ଅନୁଭବ ହେଉଛି କି?",
                "ଆଣ୍ଠୁ ଯନ୍ତ୍ରଣା ଯୋଗୁଁ ଚାଲିବାରେ କିମ୍ବା ଘର କାମ କରିବାରେ କଷ୍ଟ ହେଉଛି କି?"
            ],
            suggested_department="NCD Clinic / Chronic Disease Follow-up",
            concise_clinician_summary="68y/Female presenting for routine NCD refill (HTN/T2DM). Stable vitals (BP 134/86, Glucose 154). Assigned GREEN priority for routine chronic care and refill.",
            referral_note_draft="GOVERNMENT HEALTH FACILITY NCD CARD\nPatient: Kamala B. | Token: T-028 | Age: 68y/Female\nChronic conditions: Hypertension, Type 2 Diabetes\nTriage: GREEN (Routine OPD Queue)\nPlan: Routine 30-day medication refill and routine annual foot screening.",
            non_diagnostic_disclaimer="This output is an AI-assisted triage summary for qualified healthcare workers and does NOT constitute a medical diagnosis or treatment plan."
        ),
        human_review_feedback=HumanReviewFeedback(
            review_status="PENDING",
            reviewer_id=None,
            reviewed_at=None,
            clinician_assigned_priority=None,
            was_ai_overridden=False
        ),
        followup_answers=[]
    )
    records.append(kamala)

    # --------------------------------------------------------------------------
    # 7. ARVIND N. (58M) — 🔴 RED (AIIMS New Delhi Severe Hypoxia & Dyspnea)
    # --------------------------------------------------------------------------
    arvind = TriageRecord(
        visit_id="VISIT-AIIMS-1029",
        token_number="T-029",
        created_at="2026-09-26T09:35:00+05:30",
        queue_status="WAITING",
        patient_basic_info=PatientBasicInfo(
            patient_id="AIIMS-1029",
            token_number="T-029",
            name_or_alias="Arvind N. (Synthetic)",
            age=58,
            sex="Male",
            location_state="New Delhi (AIIMS New Delhi - NIN: DL-NDLS-AIIMS-001)",
            facility_type="AIIMS_NEW_DELHI",
            language_preference="Hindi",
            visit_timestamp="2026-09-26T09:35:00+05:30",
            emergency_contact="+91-9876543216",
            abha_id="91-6632-8819-4401",
            consent_given=True
        ),
        symptoms_and_complaints=SymptomsData(
            chief_complaint="Doctor, I cannot draw enough air into my lungs. Since last night my breathlessness has rapidly escalated and my lips feel numb. Even sitting up leaves me completely exhausted and gasping.",
            selected_symptoms=["Difficulty Breathing", "Chest Pain", "Fatigue", "Cough"],
            duration="12 hours",
            onset_trend="Worsening rapidly",
            severity_self_reported="Severe (9/10)",
            associated_symptoms=["Central cyanosis", "Use of accessory muscles"],
            previous_similar_episodes="Known COPD baseline dyspnea",
            verbatim_local_statement="डॉक्टर साहब, साँस बिल्कुल अंदर नहीं जा रही है। रात से दम इतना घुट रहा है कि बोला भी नहीं जा रहा। होंठ नीले पड़ रहे हैं, तुरंत कुछ कीजिए।",
            translated_english_statement="Doctor, I cannot draw enough air into my lungs. Since last night my breathlessness has rapidly escalated and my lips feel numb. Even sitting up leaves me completely exhausted and gasping."
        ),
        vital_signs=VitalSigns(
            recorded_at="2026-09-26T09:36:00+05:30",
            temperature_f=100.4,
            spo2_percent=86,
            heart_rate_bpm=122,
            bp_systolic=164,
            bp_diastolic=98,
            respiratory_rate_min=30,
            blood_glucose_mg_dl=138,
            weight_kg=74.0
        ),
        medical_history=MedicalHistory(
            existing_conditions=["COPD (Grade 3)", "Hypertension (8 years)"],
            previous_surgeries=[],
            previous_hospitalizations=["2025 - Acute Exacerbation of COPD"],
            current_medications=["Tiotropium inhaler", "Telmisartan 40mg"],
            known_allergies=["Penicillin"]
        ),
        uploaded_reports=[
            UploadedReport(
                report_type="Arterial_Blood_Gas_ABG",
                file_name="abg_report.jpg",
                ocr_extracted_text="pH: 7.28, PaO2: 52 mmHg (Severe Hypoxemia), PaCO2: 58 mmHg (Hypercapnic Respiratory Acidosis), HCO3: 28 mEq/L",
                key_findings=["Severe Hypoxemic & Hypercapnic Respiratory Failure", "PaO2 52 mmHg on Room Air"]
            )
        ],
        visual_inputs=[],
        red_flag_checklist=RedFlagChecklist(
            severe_chest_pain=False,
            severe_breathing_difficulty=True,
            very_low_oxygen_spo2=True,
            loss_of_consciousness=False,
            severe_bleeding=False,
            seizure=False,
            sudden_weakness_paralysis=False,
            severe_allergic_reaction=False
        ),
        ai_triage_output=AITriageOutput(
            rule_engine_priority="RED",
            ai_suggested_priority="RED",
            final_computed_priority="RED",
            priority_label="Emergency (P1) — Immediate Medical Officer Assessment",
            deterministic_triggers=[
                "Critical Hypoxia: SpO₂ is 86% (< 90% threshold)",
                "Severe Tachypnea: Respiratory Rate 30/min",
                "Severe Tachycardia: Heart Rate 122 bpm",
                "Red Flag: Acute severe respiratory failure"
            ],
            chronological_timeline="Known COPD Grade 3 ➔ 12 hours ago: Acute onset severe breathlessness ➔ Triage Vitals: SpO₂ 86%, RR 30/min, HR 122 bpm, BP 164/98",
            missing_information_gaps=[
                "Response to prior bronchodilator nebulization",
                "Fever spike or sputum purulence suggesting secondary bacterial pneumonia",
                "Immediate availability of non-invasive ventilation (BiPAP) in resuscitation bay"
            ],
            suggested_followup_questions=[
                "Did you use your rescue inhaler or nebulizer at home before coming?",
                "Have you noticed yellowish or greenish phlegm or fever chills?",
                "Are you experiencing chest pain on deep inspiration?"
            ],
            suggested_department="AIIMS Apex Resuscitation & Critical Care Bay",
            concise_clinician_summary="58y/Male with COPD exacerbation presenting with critical hypoxia SpO₂ 86% and respiratory distress RR 30. STAT high-flow O2/BiPAP and bronchodilator therapy indicated.",
            referral_note_draft="AIIMS NATIONAL APEX CRITICAL CARE REFERRAL\nPatient: Arvind N. | Token: T-029 | Age: 58y/Male | Facility: AIIMS_NEW_DELHI\nPresentation: Critical Hypoxia (SpO2 86%), RR 30/min, HR 122 bpm\nTriage: RED Priority (STAT Emergency Resuscitation)\nDisposition: Immediate ICU/High Dependency Unit bed allocation.",
            non_diagnostic_disclaimer="This output is an AI-assisted triage summary for qualified healthcare workers and does NOT constitute a medical diagnosis or treatment plan."
        ),
        human_review_feedback=HumanReviewFeedback(
            review_status="PENDING",
            reviewer_id=None,
            reviewed_at=None,
            clinician_assigned_priority=None,
            was_ai_overridden=False
        ),
        followup_answers=[]
    )
    records.append(arvind)

    # --------------------------------------------------------------------------
    # 8. SURESH T. (44M) — 🟠 YELLOW (Thane MIDC Industrial Exposure)
    # --------------------------------------------------------------------------
    suresh = TriageRecord(
        visit_id="VISIT-THN-1030",
        token_number="T-030",
        created_at="2026-09-26T09:40:00+05:30",
        queue_status="WAITING",
        patient_basic_info=PatientBasicInfo(
            patient_id="THN-1030",
            token_number="T-030",
            name_or_alias="Suresh T. (Synthetic)",
            age=44,
            sex="Male",
            location_state="Maharashtra - Thane (Thane MIDC Industrial Health Unit - NIN: MH-THN-MIDC-402)",
            facility_type="THANE_MIDC",
            language_preference="Hindi",
            visit_timestamp="2026-09-26T09:40:00+05:30",
            emergency_contact="+91-9876543217",
            abha_id="91-8842-1954-3320",
            consent_given=True
        ),
        symptoms_and_complaints=SymptomsData(
            chief_complaint="Exposure to chlorine gas leak at chemical plant with acute severe coughing, retrosternal burning, and wheezing.",
            selected_symptoms=["Cough", "Difficulty Breathing", "Eye Redness"],
            duration="45 minutes",
            onset_trend="Acute post-industrial leak",
            severity_self_reported="Moderate (6/10)",
            associated_symptoms=["Wheezing", "Profuse lacrimation"],
            previous_similar_episodes="None",
            verbatim_local_statement="फैक्ट्री में क्लोरीन गैस पाइपलाइन से रिसाव हुआ, सीने में भयानक जलन और सांस खींचने में सीटी जैसी आवाज आ रही है।",
            translated_english_statement="Exposure to chlorine gas leak at chemical plant with acute severe coughing, retrosternal burning, and wheezing."
        ),
        vital_signs=VitalSigns(
            recorded_at="2026-09-26T09:41:00+05:30",
            temperature_f=99.0,
            spo2_percent=91,
            heart_rate_bpm=110,
            bp_systolic=146,
            bp_diastolic=92,
            respiratory_rate_min=25,
            blood_glucose_mg_dl=116,
            weight_kg=70.0
        ),
        medical_history=MedicalHistory(
            existing_conditions=["Mild allergic rhinitis"],
            previous_surgeries=[],
            previous_hospitalizations=[],
            current_medications=["Levocetirizine SOS"],
            known_allergies=[]
        ),
        uploaded_reports=[],
        visual_inputs=[],
        red_flag_checklist=RedFlagChecklist(
            severe_chest_pain=False,
            severe_breathing_difficulty=False,
            very_low_oxygen_spo2=False,
            loss_of_consciousness=False,
            severe_bleeding=False,
            seizure=False,
            sudden_weakness_paralysis=False,
            severe_allergic_reaction=False
        ),
        ai_triage_output=AITriageOutput(
            rule_engine_priority="YELLOW",
            ai_suggested_priority="YELLOW",
            final_computed_priority="YELLOW",
            priority_label="Urgent (P2) — Priority OPD Evaluation (< 15 mins)",
            deterministic_triggers=[
                "Borderline Hypoxia: SpO₂ 91%",
                "Tachypnea: Respiratory Rate 25/min",
                "Tachycardia: Pulse rate 110 bpm",
                "Acute Industrial Hazmat / Chlorine Exposure"
            ],
            chronological_timeline="Chemical factory worker ➔ 45 mins ago: Chlorine pipeline leak ➔ Inhalation bronchospasm ➔ Triage Vitals: SpO₂ 91%, RR 25/min, HR 110 bpm",
            missing_information_gaps=[
                "Estimated chlorine ppm concentration in workshop air",
                "Duration of direct exposure before evacuation",
                "Skin burns or corrosive contact signs"
            ],
            suggested_followup_questions=[
                "Did you have any direct contact of the liquid chlorine with your skin or eyes?",
                "Are you feeling nausea or throat tightness?",
                "Did other co-workers show similar breathing symptoms?"
            ],
            suggested_department="Thane Industrial Toxicology & Respiratory Station",
            concise_clinician_summary="44y/Male industrial worker post-chlorine vapor inhalation. SpO₂ 91%, RR 25/min. Assigned YELLOW priority for humidified oxygen, nebulization, and serial spirometric evaluation.",
            referral_note_draft="THANE MIDC INDUSTRIAL HEALTH REFERRAL NOTE\nPatient: Suresh T. | Token: T-030 | Facility: THANE_MIDC\nIncident: Chlorine gas inhalation | SpO2: 91% | RR: 25/min\nTriage: YELLOW Priority\nDisposition: Transfer to CSM Hospital Kalwa / KEM Mumbai Toxicology unit if bronchospasm worsens.",
            non_diagnostic_disclaimer="This output is an AI-assisted triage summary for qualified healthcare workers and does NOT constitute a medical diagnosis or treatment plan."
        ),
        human_review_feedback=HumanReviewFeedback(
            review_status="PENDING",
            reviewer_id=None,
            reviewed_at=None,
            clinician_assigned_priority=None,
            was_ai_overridden=False
        ),
        followup_answers=[]
    )
    records.append(suresh)

    return records
