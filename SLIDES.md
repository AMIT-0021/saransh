# Saransh (सारांश) — Official BPUT Hackathon Pitch Deck Script

> **Files Generated & Ready to Present:**
> * 📄 **Desktop PPTX:** [`C:\Users\AMITRAZ\OneDrive\Desktop\Saransh_BPUT_Official_Pitch.pptx`](file:///C:/Users/AMITRAZ/OneDrive/Desktop/Saransh_BPUT_Official_Pitch.pptx)
> * 📁 **Project PPTX:** [`Saransh_BPUT_Official_Pitch.pptx`](file:///C:/Users/AMITRAZ/OneDrive/Desktop/Saransh/Saransh_BPUT_Official_Pitch.pptx)
> * **Format:** 16:9 Widescreen Professional Deck (10 Slides)
> * **Theme:** Clean Obsidian Slate Navy & Medical Electric Teal (`#0B0F19` / `#14B8A6`)
> * **Team ID:** `BH26PS07T060` | **Team Name:** `CODEX` | **Problem Statement:** `PS01`

---

### Slide 1: Title & Hero
* **Header Tag:** `BPUT HACKATHON 2026 • PROBLEM STATEMENT 1`
* **Main Title:** **Saransh (सारांश)**
* **Subtitle:** Multimodal Healthcare Triage Assistant for Government and Institutional Health Facilities
* **Pitch Quote:**  
  *“Human-in-the-loop, non-diagnostic triage support transforming chaotic multilingual waiting rooms into structured, prioritised clinical lanes.”*
* **Metadata:** Team: CODEX | Team ID: BH26PS07T060 | Educational prototype for triage support only. Synthetic data only.
* **4 Core Pillars:**
  1. 🛡️ **Rules decide, LLM summarises:** Urgency flags come from transparent clinical rules; AI never diagnoses.
  2. 🗣️ **Vernacular + voice first:** Odia, Hindi & regional speech in; standardized clinical English note out.
  3. 🔍 **Missing-info engine:** Detects absent clinical history and prompts frontline staff with follow-ups.
  4. 🏥 **One tool, many settings:** PHC, CHC, campus fever bay, maternal check-in, and rural health camps.

---

### Slide 2: Ideation
* **Top Idea:** *A safety-first assistant that turns messy symptoms, voice and reports into one structured, prioritised note for a qualified reviewer.*
* **Core Tenets:**
  * **Rules decide, LLM summarises:** Urgency flags come from transparent deterministic rules; AI never diagnoses or prescribes.
  * **Vernacular + voice first:** Spoken Hindi, Odia and other regional languages in; standardized clinical English note out.
  * **Missing-info engine:** Actively finds what is absent from intake and prompts the frontline worker with targeted follow-ups.
  * **One tool, many settings:** Scalable profiles: General OPD queue, factory clinic, campus fever bay, maternal care, and mobile health camps.
* **Existing Models Fall Short:**
  * *Symptom checkers:* Diagnostic-first, English-only, high hallucination risk, consumer-facing.
  * *Telemedicine platforms:* Video consults, but lacks structured intake and queue sorting.
  * *Point-solution Imaging AI:* Narrow radiology focus; ignores multimodal vernacular intake.
  * *HMIS / Heavy EHRs:* Clunky manual typing, negligible regional voice NLP, fails on rural devices.
* **Our Strategic Gap:**  
  *A lightweight, reviewer-facing clinical triage layer placed directly in front of existing government hospital workflows.*

---

### Slide 3: Problem Relevance
* **Subtitle:** *Directly matches the government brief across PHCs, CHCs, health camps, industrial clinics and campus centres.*
* **6 Ground Realities:**
  1. 🚨 **Overcrowded OPDs & Camps:** 200–400 patients arrive in crowded morning hours; doctors have <90 seconds per patient with zero structured intake.
  2. 🗣️ **Language Diversity:** Patients speak regional languages (Odia, Hindi dialects), while clinical notes are standardized in English.
  3. 📑 **Paper Reports & Photos:** Reports are crumpled paper or photos; critical numeric parameters and timelines get lost.
  4. 🏥 **Specialist Scarcity:** Rural PHCs lack specialists; transfer notes are scribbled on scrap paper without baseline vitals.
  5. ⏳ **Unprioritized First-Come Queues:** Critical emergencies (silent hypoxia SpO2 < 90%, crushing chest pain) wait behind mild routine check-ins.
  6. 📶 **Uneven Digital Maturity:** Low rural bandwidth, shared mobile devices, and lack of formal EHR hardware at frontline stations.
* **The Essential Gap:**  
  *Structured, language-ready, prioritised information reaching the right healthcare professional in time.*

---

### Slide 4: Solution
* **Subtitle:** *A 4-step pipeline turning multimodal frontline inputs into structured, reviewer-facing priority intelligence.*
* **The 4 Steps:**
  1. **Collect:** Patient or worker enters symptoms by text or voice in English, Hindi, or Odia. 2D Anatomical Body Map + ABHA ID scan & consent.
  2. **Extract:** Multimodal OCR reads lab reports and prescriptions; values and dates become an explainable timeline.
  3. **Flag:** Rules-based risk flags and category tags set an urgency signal. Hard SpO2 < 90% floor. No diagnosis.
  4. **Review:** Nurse or doctor sees a structured note, follow-up questions and queue order, then decides.
* **Standardized Outputs:**  
  *One-page triage note + prioritised clinical queue (🔴 RED, 🟠 YELLOW, 🟢 GREEN) + referral draft, always labelled advisory and reviewer-facing.*
* **Supported Scenarios:**  
  *Primary OPD queue, industrial-estate screening, campus fever bay, maternal follow-up, chronic check-in, health camps, and inter-facility referral notes.*

---

### Slide 5: Impact
* **Subtitle:** *Empowering patients, frontline workers, and institutional facilities with measurable pilot metrics.*
* **3 Stakeholder Value Pillars:**
  * **👥 Patients:** Speak in their mother tongue (Odia/Hindi); urgent cases reach clinicians sooner; clear referral handoff documentation.
  * **👩‍⚕️ Health Workers:** Less typing and paperwork; guided follow-up questions; consistent, standardized clinical handoff notes.
  * **🏥 Facilities:** Better queue order; auditable clinician override records; real-time emergency bed telemetry tracking.
* **Pilot Success Metrics (To be measured, not assumed):**
  * ⏱️ **Time to Reviewer Attention:** Arrival to clinician attention for flagged urgent cases (Target: <30 seconds).
  * 📑 **Report OCR Accuracy:** Share of paper lab report values correctly extracted, verified by staff (Target: >95%).
  * 🩺 **Reviewer Agreement Rate:** Reviewer agreement with deterministic urgency flags (Target: >90%).
  * ⏳ **Frontline Staff Time Saved:** Frontline worker intake time reduced from 8–10 minutes to under 2 minutes.

---

### Slide 6: Technical Depth
* **Subtitle:** *Full-stack architecture engineered with transparent deterministic safety guardrails.*
* **6 Modular Architecture Layers:**
  1. 🎨 **Frontend:** React 18 PWA, Vite, Tailwind CSS, Web Speech API, offline-first IndexedDB, responsive layout.
  2. ⚡ **Backend Engine:** FastAPI (Python 3.11+), Pydantic v2 strict schemas across all clinical domains, RESTful JSON API.
  3. 🗣️ **Speech & Translation:** Sarvam AI (Saaras:v3 ASR, Bulbul:v3 TTS, Mayura:v1) + Web Speech API fallback for Odia & Hindi.
  4. 📑 **OCR & Vision:** Gemini 2.5 Flash multimodal document OCR + OpenCV image pre-processing for CBC slips and ECG waveforms.
  5. 🧠 **AI Intelligence Layer:** Gemini 2.5 Flash for timeline extraction, structured summaries, and missing-info follow-up questions.
  6. 🛡️ **Safety & Governance:** Deterministic rule engine (Python/JS), AES encryption, immutable clinician audit log, DPDP Act compliance.
* **How Safety is Engineered:**
  * *Deterministic Urgency Rules:* Rules set urgency; LLM is summary-only. AI cannot downgrade an emergency (`MAX(Rule, AI)`).
  * *Dual-Source Verification:* OCR and translation show confidence indicators alongside original verbatim text.
  * *Auditability:* Every flag stores its exact trigger rule (e.g. SpO2 < 90% -> RED), ensuring every decision is clinically auditable.

---

### Slide 7: Prototype Architecture
* **Subtitle:** *End-to-end 4-stage dataflow with unified governance across every operational layer.*
* **4 Stages:**
  1. **CAPTURE (With Explicit Consent):** Text / voice / report photo | Voice in Odia/Hindi | Consent gate & 2D Body Map.
  2. **PROCESS (Clean & De-Identify):** Sarvam Speech-to-text | Indic <> English translation | OCR clean-up | PII Anonymiser.
  3. **UNDERSTAND + FLAG (Dual-Engine Core):** Entity extractor | Timeline builder | Missing-info detector | Deterministic Red Flags.
  4. **HUMAN REVIEW (Clinician Command):** 3-lane priority queue | Reviewer doctor dashboard | ABDM referral draft | Emergency siren.
* **Data Governance (All Layers):**  
  *Role-Based Access Control | Local AES-256 Encryption | Minimal Data Retention | Emergency Flag Skips Queue | Follow-ups Loop Back.*

---

### Slide 8: Execution Feasibility
* **Subtitle:** *High feasibility across technical, operational, and economic pillars with robust risk mitigation.*
* **3 Feasibility Dimensions:**
  * ⚙️ **Technical:** Built on mature open-source tools & sovereign APIs; zero custom model training required; lightweight and maintainable.
  * 🤝 **Operational:** Assists the frontline worker, never replaces the doctor; intuitive ergonomics require under 15 minutes of training.
  * 💰 **Economic:** Open-source stack; runs on modest local laptops or cloud tiers; negligible per-facility operating expense.
* **Risks & Built-in Architectural Mitigations:**
  * *OCR errors:* Confidence indicators shown alongside raw photo; mandatory nurse verification.
  * *Translation nuances:* Original verbatim regional audio and phonetic transliteration displayed beside translation.
  * *LLM hallucination:* Summary-only role; deterministic clinical rules alone compute urgency (`MAX(Rule, AI)`).
  * *Low connectivity:* Offline-tolerant PWA with local IndexedDB queue; auto-syncs when online.
* **Prototype Scope:**  
  *Synthetic patient cohort and sample reports; includes multimodal intake, OCR, rules flags, and reviewer dashboard.*

---

### Slide 9: Future Scalability
* **Subtitle:** *A 3-phase rollout roadmap with institutional scale-up levers for national public health impact.*
* **3 Phased Horizons:**
  * **Phase 1: Working Prototype:** Single facility interactive demo, multimodal intake, deterministic rules + AI summary, reviewer dashboard.
  * **Phase 2: Facility Clinical Pilot:** Deployment in 1 designated PHC/CHC (e.g., PHC Jatni), real clinical workflows, nurse shadowing, consent validation.
  * **Phase 3: District & State Scale:** Multi-facility unified dashboard, shared state clinical rule library, direct 108 ambulance referral network to SCB Medical College.
* **5 Institutional Scale-Up Levers:**
  1. 🌐 *Multilingual Expansion:* All 22 official Indian languages via Sarvam AI and Bhashini.
  2. 📱 *On-Device Edge Models:* Quantized lightweight SLMs (e.g. Gemma 2B via WebGPU) for 100% disconnected camps.
  3. 🪪 *ABDM / ABHA Integration:* Full M3 Milestone sync with National Health Authority health lockers.
  4. 📋 *Setting-Specific Rule Packs:* Specialized packs for Maternal Care, Occupational Health, and Outbreak Surveillance.
  5. ☁️ *Flexible Deployment:* Cloud or on-premises deployment adhering to state government IT and DPDP Act guidelines.

---

### Slide 10: Thank You Slide
* **Title:** **THANK YOU**
* **Project:** **Saransh (सारांश)** — *Right Priority. Right Facility. Right on Time.*
* **Team:** `CODEX` | **Team ID:** `BH26PS07T060`
* **Track:** `BPUT Hackathon 2026 • Problem Statement 1`
* **Closing Quote:**  
  *“Our goal: Help frontline healthcare staff prioritize patients faster and safer, while keeping clinical decisions strictly in human hands.”*
* **Regulatory Disclaimer:**  
  *Educational prototype for triage support only. Not a diagnostic tool. Synthetic data only.*
