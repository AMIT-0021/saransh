# Saransh (सारांश) — 3-Minute Hackathon Live Pitch & Demo Script
**BPUT Hackathon 2026 • Track: Healthcare AI**

---

## ⏱️ Timeline Overview (Total: 3 Minutes)

| Time | Stage | Screen / Action | Key Speaking Points |
| :--- | :--- | :--- | :--- |
| **0:00 – 0:40** | **The Hook & Problem** | Slide Deck (Slide 1 & 2) | Doctor-patient ratio 1:1,511; chaos in rural PHCs; lost golden hour. |
| **0:40 – 1:30** | **Intake & Vernacular Demo** | Live Web App (`localhost:5173`) | ABHA 1-click scan, Odia vernacular voice, 2D anatomical body map. |
| **1:30 – 2:15** | **Safety & Doctor Handoff** | Live Web App (Triage + Queue) | Deterministic Red-Line ($\text{SpO}_2 < 90\%$), Doctor 1-click approval & NHM referral slip. |
| **2:15 – 2:45** | **Architecture & Compliance** | Slide Deck (Slide 7 & 8) | ABDM M1–M3, FHIR R4 Bundles, Offline-first IndexedDB resilience. |
| **2:45 – 3:00** | **Punchy Conclusion** | Slide Deck (Slide 10) | "AI assists, humans decide. Transforming frontline triage across 160,000+ Ayushman Arogya Mandirs." |

---

## 🎙️ Word-for-Word Speaking Script

### Part 1: The Hook & The Crisis (0:00 – 0:40)
*(Presenter 1 points to Slide 1 & 2)*

> "Respected judges, in India today, one doctor serves over **1,500 patients**. 
> 
> Walk into any rural Primary Health Centre — like **PHC Jatni** or **CHC Tangi** in Khordha — and you will see 300 to 500 anxious patients waiting outside a single doctor's room. Registration is strictly first-come, first-served. 
> 
> That means a 62-year-old farmer experiencing a silent heart attack waits in the exact same line behind someone with a mild seasonal cough. By the time he reaches the consultation table, the **Golden Hour** is gone. 
> 
> To solve this, we built **Saransh (सारांश)** — an offline-first, multimodal, human-in-the-loop assistive triage suite engineered specifically for Indian public healthcare facilities."

---

### Part 2: Live Intake & Vernacular Intelligence (0:40 – 1:30)
*(Switch to Browser at `http://localhost:5173`. Click 'Intake Station' or load synthetic Case: Ramesh K.)*

> "Let us show you how an ASHA or ANM worker uses Saransh in under 90 seconds.
> 
> **First, Patient Identity:** With one tap, we scan the patient's 14-digit **Ayushman Bharat Health Account (ABHA ID)**. The system pulls verified demographics, existing hypertension, and critical drug allergies.
> 
> **Second, Multimodal Vernacular Intake:** Rural patients don't speak medical English. Our patient speaks in Odia:
> *'Dui dina hela chhati re bhara laagu chi, nishaas neba ku kasta heuchi.'*
> 
> Notice how Saransh doesn't just transcribe — our **Indic Dialect Normalizer** maps colloquial idioms directly into international standards:
> - *'Chhati re bhara'* $\rightarrow$ **Angina Pectoris (SNOMED-CT: 225566008, ICD-10: I20.9)**
> - *'Nishaas kasta'* $\rightarrow$ **Dyspnea on Exertion (SNOMED-CT: 267036007)**
> 
> The patient taps their exact discomfort zone on our **interactive 2D anatomical map** — selecting the left retrosternal chest radiating to the arm."

---

### Part 3: The Deterministic Red Line & Doctor Dashboard (1:30 – 2:15)
*(Click 'Analyze & Triage', show the Red Alert, then click 'Doctor Dashboard')*

> "Now, here is our most critical innovation: **The Deterministic Red-Line Engine**.
> 
> LLMs can hallucinate. In healthcare, a hallucination can cost a life. 
> That is why Saransh enforces **non-AI hard-coded clinical rules**. 
> When our Bento vitals register an **$\text{SpO}_2$ of 89%** and a heart rate of 112 bpm, the system bypasses all probabilistic generation and instantly locks the patient into the **🔴 RED LANE (Immediate Emergency)**.
> 
> Now, look at the **Doctor Command Center**:
> The Medical Officer instantly sees three clear clinical swimlanes:
> - 🔴 **RED:** Immediate Resuscitation & SCB Cuttack referral
> - 🟠 **YELLOW:** Urgent Observation (< 30 min)
> - 🟢 **GREEN:** Routine OPD Consultation
> 
> The doctor reviews the structured summary, verifies the vitals, and with **one click counter-signs** the triage note. If the doctor disagrees, they can override the lane with a single tap, preserving full human autonomy.
> 
> With another click, an official **NHM (National Health Mission) Counter-Signed Referral Slip** is generated with hospital tracking code and doctor signature hash, ready for ambulance handoff."

---

### Part 4: National Integration & Architecture (2:15 – 2:45)
*(Switch back to Slide 7 & 8)*

> "Under the hood, Saransh is built for real Indian conditions:
> 1. **ABDM Milestones 1 to 3 Compliant:** All patient encounters generate standard **FHIR R4 Bundles** for condition, observation, and encounter schemas.
> 2. **Offline-First Resilience:** In remote villages where 4G drops, Saransh queues patient intakes in local browser IndexedDB and our embedded SQLite engine, syncing seamlessly once connection restores.
> 3. **DPDP Act 2023 Compliant:** Patient personally identifiable information is sanitized on the edge before any cloud synthesis occurs."

---

### Part 5: Impact & The Winning Close (2:45 – 3:00)
*(Presenter faces judges with confidence)*

> "Saransh does not replace doctors. It empowers overburdened frontline healthcare workers to catch critical patients before it is too-late.
> 
> **AI assists, but human doctors decide.**
> 
> Thank you, and we welcome your questions!"

---

## 💡 Quick Tips for the Live Demonstration

- [ ] **Do NOT type manually during the demo:** Use the preloaded synthetic case (Ramesh K. 62M) or the 1-click ABHA scan button. Typing live increases typo risks.
- [ ] **Keep both windows ready:** Have the **Slides** open on one desktop/tab and **`http://localhost:5173`** open on another. Use <kbd>Alt</kbd> + <kbd>Tab</kbd> to switch smoothly.
- [ ] **Point out the Odia text on screen:** Judges in Odisha will immediately appreciate the cultural relevance and authentic vernacular dialect handling.
- [ ] **Emphasize 'Deterministic Rules':** Whenever judges hear 'AI in medicine', their first thought is hallucination. Hammering the fact that vitals use **hard Python guardrails** addresses their main hesitation immediately.
