# Saransh (सारांश) — BPUT Hackathon Pitch Deck Script

> **File:** `Saransh_BPUT_Hackathon_Pitch.pptx` (Saved on your Desktop)  
> **Format:** 16:9 Widescreen Professional Deck (8 Slides)  
> **Design Theme:** Clinical Navy & Medical Teal (High-Contrast Hospital Aesthetic)

---

### Slide 1: Title & One-Line Vision
* **Header Tag:** BPUT HACKATHON 2026 • AI HEALTHCARE TRACK
* **Main Title:** Saransh (सारांश)
* **Subtitle:** Multimodal Human-in-the-Loop Healthcare Triage Assistant for Government and Institutional Facilities
* **Pitch Quote:**  
  *“An explainable, non-diagnostic clinical triage platform that turns chaotic multilingual waiting rooms into prioritized clinical lanes—combining Vernacular Voice (Odia/Hindi), Lab Report OCR, Vital Signs, and Deterministic Red-Flag Rules while keeping final decisions with qualified doctors.”*
* **Core Pillars:**
  1. 🎤 Multimodal Voice (Odia/Hindi live speech + idiom normalizer)
  2. 🛡️ Deterministic Safety Rules (Hard SpO2 < 90% floor)
  3. 🏥 3-Lane Hospital Queue (RED, YELLOW, GREEN)
  4. 📄 NHM Referral Engine (1-click transfer slip with 108 ambulance)

---

### Slide 2: The Problem (Morning Outpatient Bottlenecks)
* **Card 1: 🚨 Unprioritized First-Come Queue:** 200–400 patients arrive during 8 AM–12 PM. Silent hypoxia and atypical chest pain wait in the same queue as mild headaches.
* **Card 2: 🗣️ Vernacular & Linguistic Barrier:** Rural patients describe symptoms in cultural idioms (*'Chhati fatijiba'*, *'Pathara bhali bhari'*). Rotating doctors struggle with speed and accurate local transcription.
* **Card 3: 📑 Paper Overload & Missing Info:** Crumpled lab reports, handwritten slips, and under 90 seconds per patient lead to missed drug allergies or unrecorded comorbidity timelines.
* **Card 4: 🚑 Broken Referral Continuity:** Rural PHCs transfer deteriorating patients to District Hospitals or SCB Medical College with scribbled scrap notes, missing departure vitals.

---

### Slide 3: System Ideation & Design Thinking Blueprint
* **Visual Blueprint:** High-resolution architectural ideation concept (`docs/saransh_ideation.jpg`) featuring illuminated stethoscope-to-neural network workflow, multilingual Indic speech wave spectrums, and the 3 clinical priority output lanes.
* **💡 The Ideation Spark & Core Hypothesis:**
  * *"Can we convert subjective colloquial distress ('Chhati pathara bhali bhari') into objective, life-saving clinical urgency lanes in <30 seconds—while guaranteeing zero AI hallucination on vital signs?"*
* **⚙️ The 4 Converging Technologies & Design Thinking:**
  1. **User-Centric Empathy (The ASHA/ANM Reality):** Frontline staff have under 90s per patient. We designed an interactive 2D Anatomical Body Map so non-literate patients can visually tap pain points with zero typing.
  2. **Sovereign Indic Vernacular AI (Sarvam AI):** Integrating India's `Saaras:v3` & `Bulbul:v3` to recognize spoken Odia & Hindi cultural idioms, outputting phonetic transcripts & standardized medical English.
  3. **The Mathematical Safety Guardrail (AIIMS/WHO):** Refusing black-box LLM risk: vital thresholds enforce an unbreakable floor via `MAX(Rule, AI)`. If SpO₂ < 90%, it locks RED regardless of AI output.
  4. **National Health Continuity (ABDM FHIR R4):** Transitioning from lost paper scraps to tamper-evident referral slips with SHA-256 cryptographic hashes for seamless PHC-to-MCH ambulance handoffs.

---

### Slide 4: Our Solution & Hybrid Safety Architecture
* **The Core Architectural Choice:** Why NOT an Autonomous Black-Box LLM?
  * *Pure LLMs Hallucinate:* Autonomous models can change priority randomly or give unauthorized medical prescriptions.
  * *Saransh Hybrid Solution:* Separates **Clinical Safety** (deterministic) from **Linguistic Processing** (generative).
* **The 3 Priority Tiers:**
  * 🔴 **RED — EMERGENCY (P1):** Immediate MO care (0 min wait). SpO2 < 90%, BP >= 180, severe chest pain, dyspnea, seizure.
  * 🟠 **YELLOW — URGENT (P2):** Priority Fast-Track (< 15-20 min target). SpO2 90-93%, Temp >= 101.5°F, Platelets < 100k, maternal pre-eclampsia.
  * 🟢 **GREEN — ROUTINE (P3):** Standard OPD Consultation. SpO2 >= 94%, stable baseline, tension headache, chronic refill.
* **The Safety Mandate:** Final priority is strictly `MAX(Rule_Engine_Priority, AI_Advisory_Priority)`—the AI can never downgrade an emergency.

---

### Slide 4: Multimodal Ingestion & Vernacular Dialect Normalizer
* **🗣️ Vernacular Dialect Normalizer:**  
  Maps spoken Odia/Hindi idioms to SNOMED-CT / ICD-10 (*"ଛାତି ଫାଟିଯିବା"* ➔ Severe Stabbing Chest Pain [ALERT]; *"ପଥର ଭଳି ଭାରି"* ➔ Crushing Chest Heaviness [ALERT]). Preserves verbatim voice for medico-legal truth while outputting clinical English for doctors.
* **🪪 Holographic ABDM / ABHA Sync:**  
  1-click mock scan fetches verified ABHA ID (e.g. `91-4821-9923-0192`), pre-populates chronic conditions, and triggers critical drug allergy alerts (Penicillin Anaphylaxis) before triage begins.
* **👤 2D Anatomical Body Map:**  
  Clickable anatomical selector for non-literate patients (Head, Chest, Lungs, Abdomen, Limbs, Skin) to point visually to pain.
* **📑 Single-Call Document OCR:**  
  Gemini 2.5 Flash extracts quantitative values from CBC slips (Platelets 85k), ECGs (LVH strain pattern), and prescription images.

---

### Slide 5: Human-in-the-Loop Clinical Review & Doctor Queue
* **🏥 Hospital Live Triage Command Center:**  
  Sorted lanes with active patient wait times:
  * 🔴 RED: Ramesh K. (62M, SpO2 89%, Chest Pain) & Meena D. (28F, Maternal 34w BP 168/110)
  * 🟠 YELLOW: Priya S. (34F, Temp 102.8°F, CBC Platelets 85k)
  * 🟢 GREEN: Subhash P. (24M, Mild Study Tension Headache)
* **⚖️ Human-in-the-Loop Governance (15% Rubric):**
  1. Doctor Verification Drawer with chronological timeline and missing info checklist.
  2. 1-Click Priority Override (upgrade/downgrade).
  3. Mandatory Clinical Justification logging.
  4. Immutable Reviewer ID audit trail.
  5. Real-time Emergency Bed Telemetry (3/5 available).

---

### Slide 6: Odisha Public Health Network & NHM Referral Slip
* **🏛️ Real 6-Tier All-India Facility Network:**
  * PHC Jatni (Khordha - NIN: `OD-KHD-PHC-102`)
  * CHC Tangi (Khordha - NIN: `OD-KHD-CHC-204`)
  * Capital Hospital, Bhubaneswar (DHH - NIN: `OD-DHH-401`)
  * SCB Medical College & Hospital, Cuttack (MCH - NIN: `OD-MCH-001`)
  * Paradeep Industrial Estate Health Unit (NIN: `OD-JSP-IEH-301`)
  * Koraput Mobile Public Health Camp (NIN: `OD-KPT-MOBI-501`)
  * Flagship National Anchors: AIIMS New Delhi (`DL-NDLS-AIIMS-001`) & Thane MIDC Maharashtra (`MH-THN-MIDC-402`)
* **📄 Official NHM Clinical Referral Slip:**  
  Formally formatted under Government of Odisha Health & Family Welfare Department / National Health Mission. Displays patient ABHA, departure vitals (SpO2 89%, BP 158/96), pre-referral oxygen stabilization (`4 L/min via nasal cannula`), initial aspirin dose, and **108 Emergency Ambulance transfer escort**.

---

### Slide 7: Technical Architecture & Offline PWA Resilience
* **🎨 Modern React Frontend:** React 18, Vite, Tailwind CSS, Web Speech API, SpeechSynthesis audio question playback, 2D Body Map, and Bento Grid vitals.
* **⚡ FastAPI Backend:** Python 3.11+, Pydantic v2 strict schemas (all 10 hackathon domains), interactive Swagger docs (`/docs`), <50ms deterministic scoring.
* **🧠 Gemini 2.5 Flash Multimodal AI:** Official `google-genai` SDK, native voice/report OCR in 1 call, structured JSON `response_schema`.
* **📶 Offline-First PWA Resilience:** LocalStorage queue buffer + client-side mirror rule engine. If rural PHC Wi-Fi is lost, triage never stops. Auto-syncs when reconnected.

---

### Slide 8: Evaluation Rubric Mastery & Future Roadmap
* **🎯 100% Hackathon Rubric Alignment:**
  * Safety-First Triage (20%): MAX(Rule, AI) ceiling, zero emergency downgrade.
  * Information Extraction (20%): Chronological timeline stepper, Odia follow-up questions.
  * Multimodal Capability (15%): Voice in Odia/Hindi + Lab OCR + Visuals + Vitals.
  * India-Wide Relevance (15%): 8 facilities across 6 tiers, ABDM/ABHA integration, Body Map.
  * Human-Review & Escalation (15%): Doctor queue, clinician override audit log, NHM referral slip.
  * Privacy & Responsible AI (10%): Informed consent gate, PII scrubbing, advisory disclaimer.
  * Demo Quality (5%): 1-click synthetic profiles, zero-latency execution.
* **🚀 Future Scope:**
  * Full ABDM M3 Milestone OAuth2/OTP health locker sync.
  * eSanjeevani Telemedicine bridge for YELLOW priority cases.
  * IoT Bluetooth medical device pairing (pulse oximeters, digital BP cuffs).
  * Epidemiological outbreak clustering for early Dengue/Malaria surveillance.
* **Closing Line:**  
  *“Our goal: Help frontline healthcare staff prioritize patients faster and safer, while keeping clinical decisions in human hands.”*
