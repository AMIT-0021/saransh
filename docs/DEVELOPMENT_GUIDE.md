# Antigravity IDE Development & Execution Guide: Saransh (सारांश)

**Target IDE:** Google Antigravity IDE  
**Workspace Path:** `C:\Users\AMITRAZ\.gemini\antigravity\scratch\swasthya-triage-ai`

---

## 1. Recommended Project Directory Structure

When you open `C:\Users\AMITRAZ\.gemini\antigravity\scratch\swasthya-triage-ai` in Antigravity IDE, your codebase should follow this clean monorepo layout:

```text
swasthya-triage-ai/
├── docs/                          # Master Reference Docs for Antigravity Agents
│   ├── PRD.md
│   ├── SRS.md
│   ├── ARCHITECTURE.md
│   ├── UI_UX_DESIGN.md
│   └── DEVELOPMENT_GUIDE.md
├── backend/                       # Python FastAPI + Hybrid AI Triage Engine
│   ├── main.py                    # FastAPI server, CORS, REST endpoints
│   ├── models.py                  # Pydantic v2 schemas (All 10 data domains)
│   ├── triage_rules.py            # Deterministic clinical safety rule engine
│   ├── ai_service.py              # Gemini 2.5 Flash multimodal SDK integration
│   ├── seed_data.py               # 6 realistic India-wide synthetic demo cases
│   ├── requirements.txt           # fastapi, uvicorn, google-genai, pydantic, python-multipart
│   └── .env.example               # GEMINI_API_KEY=your_key_here
└── frontend/                      # React + Vite + Tailwind CSS + Lucide Icons
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx                # Role switcher, Facility bar, Offline sync state
        ├── data/
        │   └── syntheticCases.js  # Pre-loaded 1-click demo cases & translations
        ├── utils/
        │   ├── localTriageRules.js# Client-side deterministic fallback for Offline Mode
        │   └── offlineQueue.js    # LocalStorage / IndexedDB queue persistence
        └── components/
            ├── HeaderBar.jsx      # Facility selector, Language toggle, Safety disclaimer
            ├── IntakeStation.jsx  # Registration + Voice + Vitals + Report OCR upload
            ├── TriageResultCard.jsx # Explainable priority, Timeline, Follow-up questions
            ├── DoctorDashboard.jsx  # RED/YELLOW/GREEN queue + Resource counters
            └── ClinicianReviewModal.jsx # Human-in-the-loop override + Referral slip export
```

---

## 2. Step-by-Step Build Roadmap in Antigravity IDE

### Step 1: Environment & API Key Setup (15 mins)
1. Get a free **Gemini API Key** from Google AI Studio (`https://aistudio.google.com/`).
2. Set `GEMINI_API_KEY` in `backend/.env`.
3. Note: Even if internet drops during the hackathon venue demo, we build `ai_service.py` with a **Smart Deterministic + Rich Synthetic Fallback Mode** so the app never crashes even without internet or API quota!

### Step 2: Backend Core & Deterministic Safety Engine (Hour 1–3)
1. Implement `backend/models.py` with all 10 required data models (`PatientBasicInfo`, `SymptomsData`, `VitalSigns`, `MedicalHistory`, `UploadedReport`, `VisualInput`, `RedFlagChecklist`, `AITriageOutput`, `HumanReviewFeedback`).
2. Implement `backend/triage_rules.py` containing the hard vital thresholds ($\text{SpO}_2 < 90\% \rightarrow \text{RED}$, $\text{Systolic BP} \ge 180 \rightarrow \text{RED}$, $\text{Temp} \ge 101.5^\circ\text{F} \rightarrow \text{YELLOW}$) and Red-Flag triggers.
3. Implement `backend/ai_service.py` using `from google import genai` and `gemini-2.5-flash` with `response_schema=AITriageSynthesis`.

### Step 3: Frontend Multimodal Intake & Live Voice/OCR (Hour 4–8)
1. Build `IntakeStation.jsx` featuring:
   - **1-Click Synthetic Patient Presets** at the top (`🔴 Case 1: Ramesh - 62M Odia Chest Pain/Hypoxia`, `🟠 Case 2: Priya - 34F Hindi Fever + CBC Report`, `🟢 Case 3: Subhash - 24M Mild Headache`, `🔴 Case 4: Meena - 28F Maternal Pre-eclampsia Risk`).
   - **Web Speech API + Audio Recording** supporting `English (en-IN)`, `Hindi (hi-IN)`, and `Odia (or-IN)` with automatic sample transcript injection if the venue mic is noisy.
   - **Sample Medical Report Cards & Image Upload** (allows uploading real photos of reports OR selecting built-in high-res sample CBC / ECG / Prescription cards).

### Step 4: Doctor Dashboard, Human-in-the-Loop Override & Referral Note (Hour 9–12)
1. Build `DoctorDashboard.jsx` showing real-time `RED`, `YELLOW`, and `GREEN` lanes + Hospital Bed/Staff telemetry.
2. Build `ClinicianReviewModal.jsx` where the judge can see:
   - The AI-generated **Chronological Timeline**
   - **Missing Information Gaps** & **Follow-up Questions**
   - **1-Click Clinician Override** (e.g., changing `YELLOW` to `RED` or `RED` to `YELLOW` with mandatory clinical justification and Reviewer ID logging).
   - **Printable Referral Slip Generator** for PHC-to-District Hospital transfer.

---

## 3. Ready-to-Use Prompts for Antigravity IDE

You can paste these exact prompts into Antigravity IDE (or ask me right now) to generate the entire working application:

### Prompt 1 — Build Complete Backend + Frontend Prototype
> *"Read `docs/PRD.md`, `docs/SRS.md`, `docs/ARCHITECTURE.md`, and `docs/UI_UX_DESIGN.md`. Now scaffold and implement the complete working `Saransh (सारांश)` application inside `C:\Users\AMITRAZ\.gemini\antigravity\scratch\swasthya-triage-ai`, including the Python FastAPI backend (`main.py`, `triage_rules.py`, `ai_service.py` with `gemini-2.5-flash` + offline deterministic fallback) and the React + Tailwind frontend with all 7 screens, 4 one-click synthetic demo cases (Odia/Hindi/English), live queue prioritization, human-in-the-loop override modal, and referral slip generator."*

---

## 4. Winning 3-Minute Live Demo Script for National Healthcare Hackathon Judges

1. **0:00 – 0:30 (The Hook & Safety Mandate):**
   - Point to the persistent top safety banner: *"Saransh (सारांश) is explicitly non-diagnostic. It uses a Hybrid Deterministic Rule-Engine + Gemini 2.5 Flash multimodal pipeline to turn chaotic multilingual patient intake into a prioritized queue and structured triage note."*
2. **0:30 – 1:30 (Live Multimodal Intake in Odia + Lab Report OCR):**
   - Switch Facility Mode to `🏥 PHC / District OPD` and Language to `ଓଡ଼ିଆ (Odia)`.
   - Load/speak **Patient 1 (Ramesh, 62M)**: *"Mote bahut chest pain heuchhi au saans nebaku kasta heuchhi."*
   - Enter Vitals ($\text{SpO}_2 = 89\%$, $\text{HR} = 112\text{ bpm}$) and attach the prior ECG/Lipid report image.
   - Click **Analyze**: Show how the Deterministic Rule Engine immediately locks `🔴 RED PRIORITY`, while Gemini extracts the chronological timeline, flags missing info, and generates **3 follow-up questions in Odia** for the nurse to ask on the spot!
3. **1:30 – 2:30 (Doctor Dashboard, Human-in-the-Loop Override & Referral):**
   - Switch to the **Doctor / Reviewer Dashboard**. Show how Token `T-024 (Ramesh)` jumped ahead of `YELLOW` and `GREEN` tokens to the top of the `RED Emergency` lane.
   - Click **Review & Sign Off**: Demonstrate the **Human-in-the-Loop Override** (logging Reviewer ID `DR-MO-402`), check off the missing information items, and click **Generate Referral Note** to produce an instant PHC-to-District Hospital transfer summary.
4. **2:30 – 3:00 (Offline Mode & India-Wide Scenarios):**
   - Toggle the **Offline Mode Switch** in the header to show that even when rural PHC internet drops, the local deterministic triage engine and IndexedDB queue continue registering and prioritizing patients seamlessly.


