# Saransh (सारांश) — Clinical Security, Privacy & Data Protection Policy
**Standard Operating Procedure for Government Health Facilities (PHCs, CHCs, District Hospitals)**
**Aligned with India DPDP Act 2023 & Ayushman Bharat Digital Mission (ABDM) Health Data Management Policy**

---

## 1. Executive Statement & Scope
Project **Saransh (सारांश)** is an assistive, human-in-the-loop healthcare triage solution deployed at frontline public healthcare facilities (Primary Health Centres, Community Health Centres, and Sub-Centres / Ayushman Arogya Mandirs). 

Because triage involves **Sensitive Personal Data (SPD)** including biometric identifiers, physiological telemetry, and clinical histories, this document establishes the binding cryptographic, architectural, and procedural safeguards enforced by the Saransh software stack.

---

## 2. Regulatory Compliance Framework

Saransh complies with the following national and international statutory frameworks:

| Regulation / Standard | Governing Body | Enforced Compliance in Saransh |
| :--- | :--- | :--- |
| **DPDP Act 2023** | Ministry of Electronics & IT (MeitY), GoI | Notice, explicit consent collection, purpose limitation, right to erasure, edge de-identification. |
| **ABDM HDMP 2022** | National Health Authority (NHA) | 14-digit ABHA validation, FHIR R4 Bundle encoding, federated Health Information Exchange (HIE). |
| **EHR Standards for India** | Ministry of Health & Family Welfare (MoHFW) | Standardized clinical vocabularies (SNOMED-CT for symptoms, ICD-10 for conditions, LOINC for vitals). |
| **DISHA Guidelines** | MoHFW / National E-Health Authority | Patient privacy ownership, strict purpose-bound healthcare data processing. |

---

## 3. Core Privacy Architecture Principles

### 3.1 Edge-Based De-Identification (No Raw PII to AI)
* **Zero PII Cloud Ingestion:** Before any patient text, audio transcript, or symptom description is dispatched to cloud inference APIs (e.g. Gemini 2.5 Flash), the client-side/edge application strips all direct identifiers:
  * Patient Name $\rightarrow$ Pseudonymous Token (e.g., `PAT_ENC_9821`)
  * Phone Number & Aadhaar $\rightarrow$ Completely redacted
  * Address / Village $\rightarrow$ General district code only (e.g., `OD-KHD`)
* The LLM processes **only physiological and clinical facts** (e.g. *"62M, crushing retrosternal pain, SpO2 89%, 2 hours onset"*), ensuring that cloud processors never possess the keys to re-identify an individual.

### 3.2 Granular Patient Consent & Emergency Bypass Protocol
1. **Informed Consent (Standard Intake):**
   * Prior to entering triage data, the ASHA/ANM worker must verify verbal consent from the patient or legal guardian, toggled via a mandatory verification checkpoint in Step 1.
   * Consent can be revoked at any time prior to final discharge.
2. **Unconscious Casualty Protocol (Section 7 DPDP Act 2023 Exemption):**
   * Under Section 7(a) of the DPDP Act 2023 (processing for medical emergencies involving threat to life), if a patient arrives unconscious, in shock, or altered sensorium:
   * The intake worker toggles **"Unconscious / Critical Casualty Bypass"**.
   * The bypass is logged as an emergency clinical event and must be counter-signed by the attending Medical Officer upon initial resuscitation.

---

## 4. Technical Security Controls

### 4.1 Cryptographic Encryption Standards
* **Data in Transit:** All client-to-server and server-to-gateway network communication is enforced via **TLS 1.3** using modern cipher suites (`ECDHE-ECDSA-AES256-GCM-SHA384`). Plain HTTP is strictly rejected.
* **Data at Rest:** 
  * Local edge caches (IndexedDB on field tablets) are encrypted using **AES-GCM-256** with facility-derived keys stored in Android KeyStore / WebCrypto API.
  * Server-side relational stores (SQLite / PostgreSQL) utilize transparent volume encryption (LUKS / AES-256).

### 4.2 Role-Based Access Control (RBAC) & Principle of Least Privilege
Saransh implements strict hierarchical access boundaries:

```
┌────────────────────────────────────────────────────────┐
│               FRONT-LINE ASHA / ANM INTAKE             │
│   Permissions: Capture Voice, Input Vitals, View Token │
│   Restrictions: CANNOT discharge, CANNOT alter triage  │
└──────────────────────────┬─────────────────────────────┘
                           │ (Forward to Triage Queue)
                           ▼
┌────────────────────────────────────────────────────────┐
│            LICENSED MEDICAL OFFICER (DOCTOR)           │
│   Permissions: View Full Note, 1-Click Counter-Sign,   │
│                Clinical Priority Override, Discharge,  │
│                Issue NHM Referral Slip                 │
│   Credentials: NMC / State Medical Council Reg Number  │
└──────────────────────────┬─────────────────────────────┘
                           │ (System Audit)
                           ▼
┌────────────────────────────────────────────────────────┐
│                 INSTITUTIONAL AUDITOR                  │
│   Permissions: View Cryptographic Audit Logs,          │
│                Inspect Triage Override Statistics      │
│   Restrictions: Read-only, No Clinical Modifying Power │
└────────────────────────────────────────────────────────┘
```

### 4.3 Immutable Audit Logging & Non-Repudiation
* Every triage event is assigned a cryptographic checksum:
  $$\text{Audit Hash} = \text{SHA-256}(\text{PatientToken} + \text{Timestamp} + \text{Vitals} + \text{DoctorRegNo})$$
* If a Medical Officer overrides an AI-suggested triage lane (e.g. downgrades a RED to YELLOW, or upgrades a GREEN to RED), the system **mandates an override rationale** and permanently records the change in an append-only audit ledger.
* This guarantees complete legal non-repudiation under National Medical Commission guidelines.

---

## 5. Offline-First Resilience & Data Sovereignty

* **Zero Overseas Leakage:** In accordance with Indian Data Sovereignty mandates, health records are hosted strictly within sovereign Indian data centres (NIC / MeghRaj Cloud / State Data Centres).
* **Local Offline Quarantine:** In remote areas with broadband outages, records remain encrypted locally in browser IndexedDB. They are transmitted through mutual TLS only after connectivity to the authenticated district node is re-established.

---

## 6. Patient Rights (Under DPDP Act 2023)
Patients whose data is triaged via Saransh retain statutory rights:
1. **Right to Access & Summary:** Patients can request an instant digital or printed **ABDM FHIR R4 Health Record Summary** or NHM referral slip.
2. **Right to Correction:** Medical Officers can rectify inaccurate historical entries via an addendum note.
3. **Right to Erasure / Data Minimization:** Non-clinical temporary cache data (audio voice recordings) is automatically purged after speech normalization, retaining only the structured clinical transcript.

---

## 7. Incident Response & Breach Notification Protocol
In the unlikely event of an unauthorized data exposure:
* The facility Medical Superintendent is notified within **1 hour**.
* The **Data Protection Board of India (DPBI)** and **Indian Computer Emergency Response Team (CERT-In)** will be notified within statutory deadlines (**6 hours** for CERT-In; without undue delay for DPBI).
* Access tokens for the compromised facility endpoint are immediately revoked via automated key rotation.

---

**Authorized by:** Project Saransh Clinical & Technical Safety Architecture Board  
**Effective Date:** September 2026 • Version 1.2-PROD  
**Facility Tracking:** Primary Health Centre (PHC) & Community Health Centre (CHC) Deployment Tier
