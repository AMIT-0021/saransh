# Software Requirements Specification (SRS): Saransh (सारांश)

**Project:** Saransh (सारांश)  
**Standard Alignment:** IEEE 830 / ISO-IEC-IEEE 29148 Adapted for Rapid AI Healthcare Prototyping  
**Version:** 1.0

---

## 1. System Overview & Scope

Saransh (सारांश) is a client-server web application with offline-first caching designed to collect multimodal patient intake data (voice, vernacular text, vital signs, medical report images, and supporting clinical photos), process them through a **Hybrid Deterministic + Generative AI Pipeline**, and render a prioritized outpatient queue and structured triage note for human clinical verification.

---

## 2. Complete Data Dictionary (All 10 Required Data Domains)

To satisfy the complete specification, the system models **10 core clinical and operational data structures**:

### 2.1 Domain 1–8: Input Data Schema (`TriageIntakePayload`)
```json
{
  "patient_basic_info": {
    "patient_id": "PHC-1024",
    "token_number": "T-024",
    "name_or_alias": "Ramesh K. (Synthetic)",
    "age": 62,
    "sex": "Male",
    "location_state": "Odisha",
    "facility_type": "PHC_OPD",
    "language_preference": "Odia",
    "visit_timestamp": "2026-09-26T09:15:00+05:30",
    "emergency_contact": "+91-98XXXXXX10",
    "consent_given": true
  },
  "symptoms_and_complaints": {
    "chief_complaint": "Chest discomfort and difficulty breathing",
    "selected_symptoms": ["Chest Pain", "Difficulty Breathing", "Sweating"],
    "duration": "2 hours",
    "onset_trend": "Worsening rapidly",
    "severity_self_reported": "Severe (8/10)",
    "associated_symptoms": ["Dizziness", "Left arm heaviness"],
    "previous_similar_episodes": "Mild breathlessness 6 months ago on exertion",
    "verbatim_local_statement": "Mote bahut chest pain heuchhi au saans nebaku kasta heuchhi.",
    "translated_english_statement": "I am having severe chest pain and finding it very difficult to breathe."
  },
  "vital_signs": {
    "recorded_at": "2026-09-26T09:16:30+05:30",
    "temperature_f": 99.8,
    "spo2_percent": 89,
    "heart_rate_bpm": 112,
    "bp_systolic": 158,
    "bp_diastolic": 96,
    "respiratory_rate_min": 26,
    "blood_glucose_mg_dl": 142,
    "weight_kg": 68.0
  },
  "medical_history": {
    "existing_conditions": ["Hypertension (5 years)", "Type 2 Diabetes"],
    "previous_surgeries": ["None"],
    "previous_hospitalizations": ["2024 - Viral Pneumonia"],
    "current_medications": ["Amlodipine 5mg irregular", "Metformin 500mg"],
    "known_allergies": ["Sulfa drugs"],
    "family_history": "Father had cardiac disease"
  },
  "uploaded_reports": [
    {
      "report_type": "Blood_Report_CBC_Lipid",
      "file_name": "prev_ecg_and_lipid.jpg",
      "ocr_extracted_text": "Hb: 12.8 g/dL, WBC: 11,400 /cumm, LDL: 168 mg/dL, Prior ECG: LVH strain pattern",
      "key_findings": ["Elevated WBC (11,400)", "Dyslipidemia (LDL 168)", "Prior LVH on ECG"]
    }
  ],
  "visual_inputs": [
    {
      "image_category": "Swelling_Edema",
      "user_caption": "Mild bilateral ankle swelling noticed for 3 days",
      "ai_supporting_observation": "Visible mild pitting-type pedal swelling noted as supporting clinical context; requires physical examination."
    }
  ],
  "red_flag_checklist": {
    "severe_breathing_difficulty": true,
    "loss_of_consciousness": false,
    "severe_bleeding": false,
    "severe_chest_pain": true,
    "seizure": false,
    "sudden_weakness_paralysis": false,
    "very_low_oxygen_spo2": true,
    "severe_allergic_reaction": false
  }
}
```

### 2.2 Domain 9 & 10: AI Triage Output & Human-in-the-Loop Feedback Schema (`TriageRecord`)
```json
{
  "ai_triage_output": {
    "rule_engine_priority": "RED",
    "ai_suggested_priority": "RED",
    "final_computed_priority": "RED",
    "priority_label": "Emergency — Immediate Clinical Assessment",
    "deterministic_triggers": [
      "SpO2 89% is below critical hypoxia threshold (< 90%)",
      "Red-Flag reported: Severe Chest Pain + Severe Breathing Difficulty",
      "Tachypnea (RR 26/min) and Tachycardia (HR 112 bpm)"
    ],
    "chronological_timeline": "5 yrs HTN/DM (irregular meds) -> 3 days mild ankle swelling -> 2 hours ago acute onset severe chest pain & dyspnea worsening rapidly.",
    "missing_information_gaps": [
      "Exact time of last Amlodipine/Metformin dose",
      "Whether pain radiates to jaw/back or changes with posture",
      "Current 12-lead ECG status at facility"
    ],
    "suggested_followup_questions": [
      "Did the chest pain start suddenly while resting or during physical work?",
      "Have you taken any aspirin or blood pressure medicine this morning?",
      "Are you feeling sweaty, nauseous, or lightheaded right now?"
    ],
    "suggested_department": "Emergency / Acute Cardiac & Respiratory Bay",
    "referral_note_draft": "URGENT REFERRAL NOTE: 62M presenting to PHC with 2-hr acute chest discomfort, dyspnea, SpO2 89% on room air, BP 158/96, HR 112. Known HTN/T2DM. Stabilize oxygen and refer for immediate 12-lead ECG / Troponin / Medical Officer review.",
    "non_diagnostic_disclaimer": "This output is an AI-assisted triage summary for qualified healthcare workers and does NOT constitute a medical diagnosis."
  },
  "human_review_feedback": {
    "review_status": "VERIFIED_BY_CLINICIAN",
    "reviewer_id": "DR-MO-402 (Dr. S. Mohanty, MBBS)",
    "reviewed_at": "2026-09-26T09:18:10+05:30",
    "clinician_assigned_priority": "RED",
    "was_ai_overridden": false,
    "clinician_corrections": "Confirmed SpO2 89%; started O2 at 4L/min via nasal prongs; stat ECG ordered.",
    "missing_info_resolved": ["Pain started at rest at 7:15 AM", "No morning medication taken"],
    "escalation_triggered": true,
    "ai_summary_quality_rating": 5
  }
}
```

---

## 3. Deterministic Safety-First Triage Rule Engine Specification

> [!CAUTION]
> **Safety-First Rule (Rubric 20%):** The LLM **cannot downgrade** a priority category triggered by the deterministic vital-sign and red-flag engine. The final suggested priority is strictly `MAX(Rule_Engine_Priority, LLM_Advisory_Priority)`.

### 3.1 Truth Table for Priority Classification

| Priority Level | Color / Code | Deterministic Vital-Sign Thresholds (Any 1 Triggers) | Deterministic Clinical Red Flags (Any 1 Triggers) | Queue SLA & Routing |
| :--- | :---: | :--- | :--- | :--- |
| **Emergency** | 🔴 `RED` (P1) | • $\text{SpO}_2 < 90\%$ <br>• $\text{HR} > 130\text{ bpm}$ or $< 45\text{ bpm}$ <br>• $\text{Systolic BP} > 180$ or $< 85\text{ mmHg}$ <br>• $\text{Respiratory Rate} > 28/\text{min}$ or $< 10/\text{min}$ <br>• $\text{Temp} > 104.0^\circ\text{F}$ <br>• $\text{Blood Glucose} < 60$ or $> 350\text{ mg/dL}$ | • Severe breathing difficulty <br>• Severe chest pain <br>• Loss of consciousness / altered mental state <br>• Active severe bleeding <br>• Active or post-ictal seizure <br>• Sudden paralysis / slurred speech <br>• Anaphylaxis / severe allergic swelling | **Immediate (0 min wait)** <br>Direct alert to Emergency Bay & Medical Officer |
| **Urgent** | 🟠 `YELLOW` (P2) | • $\text{SpO}_2\ 90\% - 93\%$ <br>• $\text{HR}\ 105 - 130\text{ bpm}$ <br>• $\text{Systolic BP}\ 150 - 180\text{ mmHg}$ <br>• $\text{Respiratory Rate}\ 22 - 28/\text{min}$ <br>• $\text{Temp}\ 101.0^\circ\text{F} - 104.0^\circ\text{F}$ <br>• $\text{Blood Glucose}\ 220 - 350\text{ mg/dL}$ | • Persistent high fever ($\ge 3\text{ days}$) <br>• Moderate abdominal pain or persistent vomiting <br>• High-risk age ($> 60\text{ yrs}$ or $< 5\text{ yrs}$) with comorbidity <br>• Abnormal lab report flag (e.g., low platelets, high WBC) <br>• Pregnancy with headache/swelling | **Priority Queue (< 15–20 min)** <br>Fast-track OPD Room / Priority Nurse Station |
| **Routine** | 🟢 `GREEN` (P3) | • $\text{SpO}_2 \ge 94\%$ <br>• $\text{HR}\ 60 - 104\text{ bpm}$ <br>• $\text{BP}\ 90/60 - 149/90\text{ mmHg}$ <br>• $\text{Respiratory Rate}\ 12 - 21/\text{min}$ <br>• $\text{Temp} < 101.0^\circ\text{F}$ | • Mild cough / cold / sore throat <br>• Mild chronic joint or headache without red flags <br>• Routine prescription refill / NCD check-in | **Standard Queue** <br>General OPD / Telemedicine Desk |

---

## 4. Functional Requirements (FR)

* **FR-01 (Multilingual Audio Transcription & Translation):** The system shall accept audio recordings (`WebM/WAV`) or Web Speech API streams in English, Hindi (`hi-IN`), and Odia (`or-IN`) and produce both a native script/phonetic transcript and a standardized English medical summary using Gemini 2.5 Flash.
* **FR-02 (Report & Visual Multimodal Extraction):** When a user uploads an image (`JPEG/PNG/PDF`) of a diagnostic report or visible symptom, the system shall classify the document type, extract quantitative test parameters (highlighting out-of-range values), and describe visible findings using non-diagnostic clinical terminology.
* **FR-03 (Missing Information & Follow-up Question Generation):** For every intake session, the AI engine shall identify 2–4 critical missing clinical details (e.g., onset speed, radiation, medication compliance, pregnancy status) and generate 3 plain-language follow-up questions translated into the patient's selected language so the health worker can ask them immediately.
* **FR-04 (Dynamic Queue Sorting):** The Doctor Dashboard queue shall sort active tokens first by Priority (`RED` > `YELLOW` > `GREEN`), second by Escalation Flag, and third by arrival timestamp (`FIFO` within the same priority tier).
* **FR-05 (Human Override & Audit Logging):** A logged-in clinician shall be able to modify the AI-suggested priority category, edit the structured triage note, and click `Approve & Route`. Any discrepancy between AI priority and Clinician priority shall be recorded in the `human_review_feedback` table with a timestamp and Reviewer ID.

---

## 5. Non-Functional Requirements (NFR) & Responsible AI Controls

* **NFR-01 (Latency):** Deterministic rule-engine triage scoring shall execute in `< 50 ms` locally/on-server; full multimodal LLM structured extraction and OCR shall complete in `< 4.5 seconds` using `gemini-2.5-flash`.
* **NFR-02 (Offline / Low-Bandwidth Resilience):** If network connectivity fails, the frontend shall execute client-side deterministic vital-sign/red-flag rules immediately, store the intake packet in `IndexedDB / LocalStorage`, assign an offline token (`OFF-T-001`), and auto-sync when connectivity returns.
* **NFR-03 (Privacy, Consent & Data Minimization):**
  1. Intake cannot proceed until the `Informed Consent for Triage Assistance` toggle is checked (or bypassed solely via the `Emergency Unconscious Override` button).
  2. In Demo Mode, a visible badge confirms `SYNTHETIC DATA ONLY — NO REAL PATIENT PII`.
  3. Automatic PII scrubbing strips phone numbers and Aadhaar/ID strings before sending text payloads to external LLM endpoints.


