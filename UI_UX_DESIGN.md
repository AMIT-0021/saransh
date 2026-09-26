# UI/UX Design Specification: Saransh (सारांश)

**Design Philosophy:** *"Zero-Cognitive-Load Clinical Clarity"* — Built for high-volume Indian government hospitals, PHCs, and public health camps where frontline health workers need large tap targets, unmistakable color semantics, vernacular scripts (`English / हिन्दी / ଓଡ଼ିଆ`), and instant transparency into why a patient was flagged.

---

## 1. Visual Identity & Clinical Color System

| Semantic Token | Hex Code | Tailwind Class | Clinical Usage Rules |
| :--- | :---: | :--- | :--- |
| **Emergency RED (P1)** | `#DC2626` | `bg-red-600 text-white border-red-700` | Reserved strictly for `RED` priority tokens, $\text{SpO}_2 < 90\%$ alerts, and active Red-Flag badges. Includes subtle pulse ring (`animate-pulse`) on unacknowledged emergency tokens. |
| **Urgent YELLOW/AMBER (P2)** | `#D97706` | `bg-amber-500 text-white border-amber-600` | Used for `YELLOW` priority queue cards, high fever ($101.5^\circ\text{F}+$), abnormal lab report flags, and missing-info warning chips. |
| **Routine GREEN (P3)** | `#059669` | `bg-emerald-600 text-white border-emerald-700` | Used for `GREEN` routine OPD queue items and normal baseline vital-sign indicators. |
| **Clinical Trust Navy** | `#0F172A` | `bg-slate-900 text-slate-50` | Primary navigation header, facility resource telemetry bar, and clinician verification drawer header. |
| **Advisory Banner Blue** | `#EFF6FF` | `bg-blue-50 border-blue-300 text-blue-900` | Persistent Non-Diagnostic Disclaimer banner & AI Explainability rationale box. |

---

## 2. Persistent Global Top Bar (Every Screen)

Every screen displays a unified institutional header containing:
1. **Brand & Facility Selector:** `Saransh (सारांश)` + Dropdown (`🏥 PHC / District OPD` | `🏭 Industrial Estate Clinic` | `🎓 Campus Fever Desk` | `🤰 Maternal Clinic` | `⛺ Public Health Camp`).
2. **Connectivity & Sync Badge:** `🟢 Online (Cloud + Local Sync)` or `🟠 Offline Mode (Local Queue Active - 3 Pending Sync)`.
3. **Language Switcher Pill:** `EN English` | `हिन्दी Hindi` | `ଓଡ଼ିଆ Odia` (switches UI labels and AI follow-up question language).
4. **Mandatory Non-Diagnostic Safety Strip:**
   > ⚠️ **CLINICAL ADVISORY TOOL ONLY:** *Saransh (सारांश) structures patient information and flags urgency signals. It does NOT provide medical diagnosis or treatment prescriptions. Final triage and clinical decisions rest solely with qualified healthcare personnel.*

---

## 3. Wireframes & Component Breakdown (The 7 Core Prototype Screens)

### Screen 1: Role Switcher & Facility Login
* **Purpose:** Demonstrates role-based access control (`RBAC`) for the **10% Privacy & Responsible AI** rubric criterion.
* **Layout:** Split card selector:
  - **Card A — Frontline Health Worker / Triage Nurse (`Intake Station`):** Access to Registration, Multimodal Symptom/Voice/OCR Capture, Vitals Entry, and AI Follow-up Questions.
  - **Card B — Medical Officer / Reviewing Doctor (`Clinical Command Dashboard`):** Access to Prioritized Queue (`RED/YELLOW/GREEN`), AI Clinical Summary, Human-in-the-Loop Override, and Referral Slip Export.
  - **Quick Demo Shortcut Bar:** `[ ⚡ Load 3 Synthetic Demo Patients (RED, YELLOW, GREEN) ]` for instant judge walkthrough.

### Screen 2: Patient Registration & Informed Consent Gate
* **Fields:**
  - `Patient ID / ABHA Mock ID` (Auto-generated e.g. `PHC-1024`) & `Token Badge` (`T-024`)
  - `Age`, `Sex`, `State/District` (`Odisha - Khordha`), `Preferred Language` (`Odia / Hindi / English`)
  - `Facility Scenario Preset` (Pre-populates relevant check-in questions)
  - **Mandatory Consent Toggle:** *"Patient / Attendant consents to AI-assisted symptom transcription and report extraction for clinical triage support."* (Plus an `Emergency Unconscious Bypass` toggle for trauma/unresponsive cases).

### Screen 3: Multimodal Symptom & Document Intake Hub
A 4-quadrant interactive workspace on a single screen (no deep nested menus):

```
+-----------------------------------------------------------------------------------+
|  TOKEN: T-024 | Ramesh K. (62M) | Language: ଓଡ଼ିଆ (Odia)       [1-Click Demo Fill] |
+-----------------------------------------+-----------------------------------------+
| 1. 🎤 VOICE & LOCAL LANGUAGE INPUT      | 2. ☑ RAPID SYMPTOM & RED-FLAG TAGS      |
| [ 🎙️ Hold or Click to Speak in Odia ]   | Red Flags (Immediate Escalation):       |
|                                         | [x] Severe Chest Pain  [x] Short Breath |
| Verbatim Transcript (Odia/Phonetic):    | [ ] Unconscious        [ ] Seizure      |
| "Mote bahut chest pain heuchhi au       |                                         |
|  saans nebaku kasta heuchhi."           | Common Symptoms & Duration:             |
|                                         | [x] Sweating  [x] Dizziness             |
| AI English Translation:                 | Duration: [ 2 Hours ] Trend: [Worsening]|
| "I am having severe chest pain and      |                                         |
|  difficulty breathing."                 |                                         |
+-----------------------------------------+-----------------------------------------+
| 3. 📄 UPLOAD LAB REPORT / PRESCRIPTION  | 4. 📷 SUPPORTING VISUAL PHOTO (Optional)|
| [ + Drop CBC / ECG / Discharge Report ] | [ + Upload Skin Rash / Swelling / Wound]|
| Preview: prev_ecg_and_lipid.jpg         | Preview: ankle_edema_sample.jpg         |
| Extracted by OCR:                       | Advisory Note:                          |
| • WBC: 11,400 /cumm (Elevated)          | "Supporting visual context only (mild   |
| • LDL: 168 mg/dL | Prior LVH on ECG     |  pedal swelling); non-diagnostic."      |
+-----------------------------------------+-----------------------------------------+
```

### Screen 4: Vital Signs Station (With Real-Time Threshold Alerts)
* **Interactive Sliders / Numeric Pads with Instant Color Coding:**
  - **$\text{SpO}_2$ (%):** `89%` → Immediately turns **🔴 RED (`< 90% Critical Hypoxia`)**
  - **Heart Rate (bpm):** `112 bpm` → Turns **🟠 AMBER (`> 105 bpm Tachycardia`)**
  - **Blood Pressure (mmHg):** `158 / 96` → Turns **🟠 AMBER (`Stage 2 HTN`)**
  - **Temperature (°F):** `99.8°F` → **🟢 GREEN**
  - **Respiratory Rate (/min):** `26 /min` → Turns **🟠 AMBER (`Tachypnea`)**
  - **Blood Glucose (mg/dL):** `142 mg/dL` → **🟢 GREEN**
* **Primary CTA:** `[ 🧠 Run Hybrid AI Triage & Generate Structured Note ]`

### Screen 5: AI Triage Output, Timeline & Follow-Up Question Prompt (Nurse View)
Immediately after clicking Analyze, the health worker sees:
1. **Computed Priority Banner:** `🔴 RED — HIGH PRIORITY (EMERGENCY)`
2. **Explainable Trigger Badges:**
   - `Rule Engine Trigger: SpO₂ 89% (< 90% threshold)`
   - `Rule Engine Trigger: Severe Chest Pain + Breathing Difficulty`
   - `Multimodal OCR Signal: Prior ECG shows LVH; History of HTN/DM`
3. **Interactive "Missing Info & Follow-Up Questions to Ask Patient Now" Box:**
   - Displays 3 high-yield questions in **both English and Odia/Hindi** so the nurse can ask the patient before sending them to the doctor:
     - *Q1 (Odia):* `"छाती दरद केतेबेले आरम्भ हेला - आराम कोला बेले ना काम कोला बेले?"` (*"Did chest pain start at rest or during exertion?"*) → Quick Answer Chip: `[At Rest]` `[On Exertion]`
     - *Q2:* `"आजी सखालु बीपी बटी खाईछन्ति की?"` (*"Did you take your BP medicine this morning?"*) → Quick Answer Chip: `[Yes]` `[Missed Dose]`

### Screen 6: Hospital Command & Doctor Queue Dashboard
```
+-----------------------------------------------------------------------------------+
| 🏥 HOSPITAL RESOURCE BAR: Emergency Beds: 3/5 | General Beds: 18 | Doctors: 5     |
+-----------------------------------------------------------------------------------+
| 🔴 RED - EMERGENCY QUEUE (Immediate Assessment)                          (2 Cases)|
| --------------------------------------------------------------------------------- |
| [T-024] Ramesh K. | 62M | Odia  | SpO2: 89% | HR: 112 | Chest Pain & Dyspnea      |
|         Dept: Emergency Cardiac Bay | Wait: 1m | [ 🔍 REVIEW & SIGN OFF ]         |
| [T-019] Meena D.  | 28F | Hindi | BP: 168/110| Maternal 34w | Headache + Edema    |
|         Dept: Obstetrics Emergency  | Wait: 3m | [ 🔍 REVIEW & SIGN OFF ]         |
+-----------------------------------------------------------------------------------+
| 🟠 YELLOW - URGENT PRIORITY QUEUE (< 15 Min Target)                      (2 Cases)|
| --------------------------------------------------------------------------------- |
| [T-025] Priya S.  | 34F | Hindi | Temp: 102.4°F | CBC: Platelets 95k | Fever 4d   |
|         Dept: Medicine Priority OPD | Wait: 8m | [ 🔍 REVIEW & SIGN OFF ]         |
+-----------------------------------------------------------------------------------+
| 🟢 GREEN - ROUTINE OPD QUEUE                                             (1 Case) |
| --------------------------------------------------------------------------------- |
| [T-026] Subhash P.| 24M | Eng   | SpO2: 98% | Temp: 98.6°F | Mild Tension Headache|
|         Dept: General OPD / Telemed | Wait: 14m| [ 🔍 REVIEW & SIGN OFF ]         |
+-----------------------------------------------------------------------------------+
```

### Screen 7: Human-in-the-Loop Clinician Verification & Referral Drawer
When the doctor clicks `[ 🔍 REVIEW & SIGN OFF ]` on `T-024`:
* **Left Column (Structured Triage Note):**
  - **Chronological Timeline:** Visual step line (`5 yrs HTN/DM` → `3d Ankle Swelling` → `2h Acute Chest Pain at rest`).
  - **Multimodal Evidence Tabs:** Audio Transcript (`Odia` + `English`), Uploaded Report OCR highlights, Vitals table.
* **Right Column (Human Verification & Action Panel):**
  - **Confirm or Override Priority:** `[ 🔴 Keep RED ]` `[ 🟠 Downgrade to YELLOW ]` `[ 🟢 Downgrade to GREEN ]`
  - **Mandatory Override Reason (if changed):** e.g., *"Pulse oximeter probe was cold/misplaced; repeat SpO2 is 97%, pain is reproducible chest wall tenderness."*
  - **Clinician Assessment Note Input:** Free-text box for doctor's orders.
  - **Action Buttons:**
    - `[ ✅ Verify & Admit to Emergency Bay ]`
    - `[ 📄 Generate Standardized Referral Slip (District Hospital) ]` (Opens printable/downloadable referral modal).


