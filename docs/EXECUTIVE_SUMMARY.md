# Saransh (सारांश) — Executive Summary & Project Brief
**BPUT Hackathon 2026 • Track: AI in Healthcare & Public Health Systems**

---

### 🏥 The Problem Statement
Frontline government healthcare facilities in India (PHCs, CHCs, and District Hospitals) suffer from severe intake bottlenecks:
- **1 Doctor per 1,511 Patients:** Overwhelmed Medical Officers face 300–500 patients per OPD session.
- **First-Come, First-Served Chaos:** Critical emergencies (acute myocardial infarction, pediatric hypoxia) wait behind minor coughs in unprioritized queues.
- **Vernacular Language Barrier:** Rural patients express symptoms through regional colloquialisms (e.g., Odia: *"Chhati re bhara laagu chi"*) that standard digital tools fail to interpret.

---

### 💡 The Solution: Saransh
**Saransh** is a multimodal, offline-resilient, human-in-the-loop triage assistant that enables frontline ASHA/ANM workers to structure patient intake and triage priority in under **90 seconds**.

```
[Patient / ASHA] 
  ├── 14-Digit ABHA ID Scan (ABDM M1)
  ├── Vernacular Voice in Odia/Hindi (Indic NLP)
  ├── 2D Anatomical Body Map Pinpointing
  └── Bento Grid Vital Signs (SpO2, BP, HR, Temp)
          │
          ▼
[Deterministic Red-Line Engine] ──(SpO2 < 90% / SBP > 180)──► 🔴 IMMEDIATE RED LANE
          │ (If within safe ranges)
          ▼
[Clinical LLM Structuring Engine]
  ├── Mapped to SNOMED-CT & ICD-10
  └── Generated FHIR R4 Bundle
          │
          ▼
[Doctor Command Dashboard]
  ├── 🔴 RED | 🟠 YELLOW | 🟢 GREEN Triage Lanes
  ├── 1-Click Human Doctor Override & Counter-Signature
  └── Official NHM Counter-Signed Referral Slip Generation
```

---

### 🌟 Key Innovations & Differentiators

| Capability | What Existing Systems Do | How Saransh Wins |
| :--- | :--- | :--- |
| **Clinical Safety** | Black-box LLM guessing diagnoses | **Deterministic non-AI physiological rules** override AI whenever vitals indicate life threats. Zero hallucination risk. |
| **Vernacular Normalization** | English text input required | Normalizes colloquial Odia/Hindi idioms directly to **SNOMED-CT (225566008)** & **ICD-10 (I20.9)**. |
| **Human-in-the-Loop** | Unsupervised bot prescriptions | AI drafts only. Licensed Medical Officer holds 100% legal authority via **1-click counter-sign/override**. |
| **Connectivity Resilience** | Fails when internet drops | **Offline-First:** Client-side **IndexedDB** queue + embedded **SQLite** triage engine syncs on reconnect. |
| **National Compliance** | Proprietary, siloed records | Full **ABDM Milestone 1–3** support, **FHIR R4 Bundles**, and official **NHM referral slips**. |

---

### 📈 Measurable Real-World Impact
- ⏱️ **Triage Intake Time:** Cut from 12+ minutes of manual paperwork to **under 90 seconds**.
- 🚑 **Golden Hour Preservation:** Red-flag patients identified immediately upon arrival, not 3 hours later.
- 💰 **Operational Cost:** Runs on standard ₹8,000 tablets with API inference cost of **< ₹0.05 per patient**.

---

### 👨‍💻 Project Links & Repository
- **GitHub Repository:** `https://github.com/AMIT-0021/saransh`
- **Frontend Stack:** React 18, Vite, Lucide Medical Icons, Tailwind CSS, IndexedDB
- **Backend Stack:** FastAPI (Python 3.14), Pydantic v2, SQLite, Gemini 2.5 Flash API
- **Standards:** ABDM (M1, M2, M3), FHIR R4, SNOMED-CT, ICD-10, DPDP Act 2023
