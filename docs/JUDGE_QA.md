# Saransh (सारांश) — Judge Q&A Defense Bible
**BPUT Hackathon 2026 • Master Answers for Technical & Clinical Inquiries**

---

### ❓ Question 1: "What if your AI hallucinates a diagnosis and causes medical negligence?"
> **⭐ Knockout Answer:**
> *"Saransh is strictly a **Triage and Prioritization Assistant**, NOT a diagnostic engine. 
> To prevent hallucination risk, we implement a **Deterministic Red-Line Architecture**: 
> Critical physiological thresholds (such as $\text{SpO}_2 < 90\%$, Systolic BP $> 180\text{ mmHg}$, or extreme heart rates) are evaluated by deterministic, non-AI Python logic BEFORE and AFTER the LLM runs. If a red line triggers, the patient is locked into the 🔴 RED emergency lane immediately, regardless of what an AI might think. 
> Furthermore, all recommendations are purely drafts until an accredited Medical Officer reviews and counter-signs them on their dashboard."*

---

### ❓ Question 2: "Why not just use ChatGPT or a mobile form app like Google Forms?"
> **⭐ Knockout Answer:**
> *"Three reasons: 
> 1. **Clinical Safety:** Generic LLMs lack deterministic physiological guardrails and cannot enforce emergency triage protocols.
> 2. **Vernacular & Multimodal Dialect Normalization:** Rural patients describe symptoms idiomatically (e.g. *'Chhati re bhara laagu chi'* in Odia). Generic forms require medical English, whereas Saransh maps colloquial speech and 2D touch pinpointing directly into formal **SNOMED-CT** and **ICD-10** codes.
> 3. **Government Interoperability:** Saransh produces valid **ABDM FHIR R4 Bundles** and **NHM counter-signed referral slips**, integrating directly into the national health stack rather than sitting in an isolated silo."*

---

### ❓ Question 3: "What happens in deep rural Odisha when broadband/4G cuts off?"
> **⭐ Knockout Answer:**
> *"Saransh is engineered with an **Offline-First Architecture**:
> In the frontend, patient registrations, audio snippets, and vitals are queued in local browser **IndexedDB**. 
> At the facility level, the server runs a local embedded **SQLite engine** paired with local deterministic triage rules. The ASHA worker can continue screening patients with zero internet. Once connectivity is restored, the client automatically synchronizes queued records with the district ABDM gateway using an idempotency token to prevent duplicates."*

---

### ❓ Question 4: "Is this compliant with the Digital Personal Data Protection (DPDP) Act 2023?"
> **⭐ Knockout Answer:**
> *"Yes. We adhere strictly to data minimization and patient consent:
> 1. **Edge De-Identification:** Patient PII (Name, Phone number, Aadhaar) is stripped on the local device. The clinical text sent for LLM normalization contains only de-identified tokens (e.g., `Patient_M62`).
> 2. **Consent-Gated Processing:** Step 1 of the intake requires explicit patient consent (or emergency bypass protocol for unconscious casualties).
> 3. **Data Residency:** All structured health records remain encrypted on local/state-approved institutional servers under ABDM data stewardship."*

---

### ❓ Question 5: "Who takes legal liability if a triaged patient deteriorates?"
> **⭐ Knockout Answer:**
> *"The legal and clinical decision remains 100% with the licensed **Medical Officer**. 
> Saransh acts as an intake accelerator and prioritizer, exactly like a digital triage nurse's triage slip. 
> Every triage card has an audit-tracked review modal where the doctor can confirm or override the priority with 1 click. The official NHM referral slip embeds the doctor's registration number and a cryptographic timestamp hash, ensuring clear legal accountability under the National Medical Commission (NMC) regulations."*

---

### ❓ Question 6: "How does this integrate into India's ABDM and hospital HMIS?"
> **⭐ Knockout Answer:**
> *"Saransh is built on the **National Health Authority (NHA) ABDM standards**:
> - **Milestone 1 (M1):** 14-digit ABHA ID validation and demographic prefill.
> - **Milestone 2 (M2):** Standardized **FHIR R4 Bundle** generation encapsulating Encounter, Patient, Condition (ICD-10), and Observation (vitals) resources.
> - **Milestone 3 (M3):** Ready for consent-based health data exchange across Health Information Providers (HIP) and Health Information Users (HIU)."*

---

### ❓ Question 7: "How accurate is your speech recognition in a noisy rural PHC?"
> **⭐ Knockout Answer:**
> *"We account for noisy frontline environments through **multimodal redundancy**:
> If ambient OPD noise degrades speech transcription, the ASHA worker or patient simply relies on our **2D Anatomical Body Map** to tap the exact pain zone, accompanied by high-contrast Bento grid vitals input. The system never relies on audio alone — it synthesizes voice, touch coordinates, and objective vitals together."*

---

### ❓ Question 8: "What is the operational cost to run this per PHC?"
> **⭐ Knockout Answer:**
> *"Near zero additional infrastructure cost:
> The frontend runs on any standard Rs. 8,000 Android tablet or desktop browser already provided to PHCs under the Ayushman Bharat infrastructure grant. 
> For backend inference, our deterministic rule engine uses virtually zero compute, and text normalization calls to Gemini 2.5 Flash cost less than **₹0.04 (4 paise)** per patient intake. It is designed to scale across all 160,000+ Ayushman Arogya Mandirs affordably."*
