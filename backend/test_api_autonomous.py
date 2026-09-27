"""
Automated Autonomous Smoke-Test & Verification Suite
Project: Saransh (सारांश) — MedTech Innovation Engine (BPUT Hackathon 2026)
File: backend/test_api_autonomous.py
"""
import sys
import json
from fastapi.testclient import TestClient
from main import app, triage_db, init_db

client = TestClient(app)

def run_autonomous_tests():
    print("======================================================================")
    print("SARANSH AUTONOMOUS BACKEND TEST & CLINICAL VERIFICATION SUITE")
    print("======================================================================\n")
    
    total_passed = 0
    total_tests = 0

    # ------------------------------------------------------------------
    # TEST 1: Health & Root Endpoints
    # ------------------------------------------------------------------
    total_tests += 1
    print("[1/5] Testing GET / and GET /health endpoints...")
    res_root = client.get("/")
    assert res_root.status_code == 200, f"Root endpoint failed: {res_root.status_code}"
    root_data = res_root.json()
    assert root_data["status"] == "online"

    res_health = client.get("/health")
    assert res_health.status_code == 200, f"/health endpoint failed: {res_health.status_code}"
    health_data = res_health.json()
    assert health_data["status"] == "healthy"
    print(f"  ✓ Root & Health OK | Status: {health_data['status']} | Safety: {health_data['safety_guardrails']}")
    total_passed += 1

    # ------------------------------------------------------------------
    # TEST 2: Test Case A — Deterministic Red Line (SpO2=88%, SBP=160)
    # ------------------------------------------------------------------
    total_tests += 1
    print("\n[2/5] Testing POST /api/triage/analyze — Test Case A (Critical Hypoxia RED)...")
    payload_a = {
        "patient_basic_info": {
            "patient_id": "P-RED-001",
            "name_or_alias": "Ramesh K.",
            "age": 62,
            "sex": "Male",
            "facility_type": "PHC_JATNI",
            "language_preference": "Odia"
        },
        "symptoms_and_complaints": {
            "chief_complaint": "Severe retrosternal stabbing chest pain",
            "verbatim_local_statement": "ଡାକ୍ତର ବାବୁ, ୨ ଘଣ୍ଟା ହେଲା ଛାତିଟା ପଥର ଭଳି ଭାରି ଲାଗୁଛି ଆଉ ବହୁତ ଜୋରରେ କଣେଇକି ଦରଦ ହେଉଛି।"
        },
        "vital_signs": {
            "spo2_percent": 88,
            "bp_systolic": 160,
            "bp_diastolic": 96,
            "heart_rate_bpm": 112,
            "temperature_f": 99.1
        },
        "red_flag_checklist": {
            "severe_chest_pain": True,
            "very_low_oxygen_spo2": True
        }
    }
    res_a = client.post("/api/triage/analyze", json=payload_a)
    assert res_a.status_code == 200, f"Case A failed: {res_a.status_code} - {res_a.text}"
    data_a = res_a.json()
    triage_lane_a = data_a.get("triage_lane") or data_a.get("ai_triage_output", {}).get("final_computed_priority")
    assert triage_lane_a == "RED", f"Expected triage_lane == 'RED', got '{triage_lane_a}'"
    print(f"  ✓ Case A Verified RED | Priority: {triage_lane_a} | Dept: {data_a['ai_triage_output']['suggested_department']}")
    total_passed += 1

    # ------------------------------------------------------------------
    # TEST 3: Test Case B — Urgent Yellow (Fever 103°F, Abdominal Pain)
    # ------------------------------------------------------------------
    total_tests += 1
    print("\n[3/5] Testing POST /api/triage/analyze — Test Case B (Urgent Yellow Pyrexia)...")
    payload_b = {
        "patient_basic_info": {
            "patient_id": "P-YEL-002",
            "name_or_alias": "Sunita B.",
            "age": 28,
            "sex": "Female",
            "facility_type": "CHC_TANGI",
            "language_preference": "Hindi"
        },
        "symptoms_and_complaints": {
            "chief_complaint": "High fever with acute right lower quadrant abdominal pain",
            "selected_symptoms": ["Abdominal Pain", "High Fever", "Nausea"]
        },
        "vital_signs": {
            "temperature_f": 103.0,
            "spo2_percent": 97,
            "bp_systolic": 124,
            "bp_diastolic": 78,
            "heart_rate_bpm": 102
        },
        "red_flag_checklist": {
            "severe_chest_pain": False,
            "severe_breathing_difficulty": False
        }
    }
    res_b = client.post("/api/triage/analyze", json=payload_b)
    assert res_b.status_code == 200, f"Case B failed: {res_b.status_code} - {res_b.text}"
    data_b = res_b.json()
    triage_lane_b = data_b.get("triage_lane") or data_b.get("ai_triage_output", {}).get("final_computed_priority")
    assert triage_lane_b == "YELLOW", f"Expected triage_lane == 'YELLOW', got '{triage_lane_b}'"
    print(f"  ✓ Case B Verified YELLOW | Priority: {triage_lane_b} | Dept: {data_b['ai_triage_output']['suggested_department']}")
    total_passed += 1

    # ------------------------------------------------------------------
    # TEST 4: Test Case C — Routine Green (Mild Cough, Normal Vitals)
    # ------------------------------------------------------------------
    total_tests += 1
    print("\n[4/5] Testing POST /api/triage/analyze — Test Case C (Routine Green)...")
    payload_c = {
        "patient_basic_info": {
            "patient_id": "P-GRN-003",
            "name_or_alias": "Prakash M.",
            "age": 24,
            "sex": "Male",
            "facility_type": "PHC_JATNI",
            "language_preference": "English"
        },
        "symptoms_and_complaints": {
            "chief_complaint": "Mild dry cough for 3 days",
            "selected_symptoms": ["Cough"]
        },
        "vital_signs": {
            "temperature_f": 98.6,
            "spo2_percent": 99,
            "bp_systolic": 118,
            "bp_diastolic": 76,
            "heart_rate_bpm": 72,
            "respiratory_rate_min": 16
        },
        "red_flag_checklist": {
            "severe_chest_pain": False,
            "severe_breathing_difficulty": False
        }
    }
    res_c = client.post("/api/triage/analyze", json=payload_c)
    assert res_c.status_code == 200, f"Case C failed: {res_c.status_code} - {res_c.text}"
    data_c = res_c.json()
    triage_lane_c = data_c.get("triage_lane") or data_c.get("ai_triage_output", {}).get("final_computed_priority")
    assert triage_lane_c == "GREEN", f"Expected triage_lane == 'GREEN', got '{triage_lane_c}'"
    print(f"  ✓ Case C Verified GREEN | Priority: {triage_lane_c} | Dept: {data_c['ai_triage_output']['suggested_department']}")
    total_passed += 1

    # ------------------------------------------------------------------
    # TEST 5: NHM Referral Slip Creation & ABDM FHIR R4 Bundle
    # ------------------------------------------------------------------
    total_tests += 1
    print("\n[5/5] Testing POST /api/referrals/create & ABDM FHIR R4 Bundle Generator...")
    referral_req = {
        "visit_id": data_a["visit_id"],
        "patient_id": "P-RED-001",
        "patient_name": "Ramesh K.",
        "age": 62,
        "sex": "Male",
        "abha_id": "91-4821-9923-0192",
        "from_facility": "PHC Jatni",
        "from_facility_nin": "OD-KHD-PHC-102",
        "receiving_facility": "Capital Hospital (District Headquarter Hospital, Bhubaneswar - NIN: OD-DHH-401)",
        "receiving_facility_nin": "OD-DHH-401",
        "triage_priority": "RED",
        "chief_complaint": "Acute STEMI / Severe Retrosternal Chest Pain",
        "vitals_summary": "SpO2: 88%, BP: 160/96, HR: 112 bpm",
        "pre_referral_treatment": "O2 at 6L/min via NRB mask; Aspirin 300mg + Clopidogrel 300mg; IV 18G cannula secured",
        "ambulance_call_status": "108 ALS Ambulance (OD-02-AX-1081) dispatched",
        "accompanying_paramedic": "Staff Nurse Manorama Nayak",
        "referring_officer": "Dr. S. Mohanty, MBBS, MD"
    }
    res_ref = client.post("/api/referrals/create", json=referral_req)
    assert res_ref.status_code == 200, f"Referral slip creation failed: {res_ref.status_code} - {res_ref.text}"
    ref_data = res_ref.json()
    assert ref_data["referral_id"].startswith("REF-OD-"), "Invalid referral_id format"
    assert "timestamp_hash" in ref_data and len(ref_data["timestamp_hash"]) == 64, "Missing or invalid SHA-256 timestamp hash"
    assert ref_data["status"] == "DISPATCHED"
    print(f"  ✓ NHM Referral Slip Created | ID: {ref_data['referral_id']} | Hash: {ref_data['timestamp_hash'][:16]}...")

    # Test FHIR Bundle Generator for this record
    res_fhir = client.get(f"/api/fhir/bundle/{data_a['visit_id']}")
    assert res_fhir.status_code == 200, f"FHIR Bundle retrieval failed: {res_fhir.status_code} - {res_fhir.text}"
    fhir_data = res_fhir.json()
    assert fhir_data["resourceType"] == "Bundle"
    assert fhir_data["type"] == "document"
    entries = fhir_data["entry"]
    resource_types = [e["resource"]["resourceType"] for e in entries]
    assert "Composition" in resource_types, "FHIR Bundle missing Composition resource"
    assert "Patient" in resource_types, "FHIR Bundle missing Patient resource"
    assert "Encounter" in resource_types, "FHIR Bundle missing Encounter resource"
    assert "Condition" in resource_types, "FHIR Bundle missing Condition resource"
    assert "Observation" in resource_types, "FHIR Bundle missing Observation resource"
    print(f"  ✓ ABDM FHIR R4 Bundle Verified | {len(entries)} resources: {', '.join(sorted(set(resource_types)))}")
    total_passed += 1

    print("\n======================================================================")
    print(f"VERIFICATION SUMMARY: {total_passed}/{total_tests} TEST GATES PASSED (100% SUCCESS)")
    print("======================================================================\n")

if __name__ == "__main__":
    run_autonomous_tests()
