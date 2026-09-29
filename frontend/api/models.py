from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# ==============================================================================
# Domain 1: Patient Basic Info & Registration
# ==============================================================================
class PatientBasicInfo(BaseModel):
    patient_id: str = Field(default="PHC-1001", description="Unique or synthetic patient ID")
    token_number: str = Field(default="T-001", description="Queue token identifier, e.g. T-024")
    name_or_alias: str = Field(default="Anonymous Patient", description="Name or synthetic alias for privacy")
    age: int = Field(default=35, ge=0, le=125, description="Patient age in years")
    sex: str = Field(default="Other", description="Male, Female, or Other")
    location_state: str = Field(default="Odisha", description="State or district")
    facility_type: str = Field(default="PHC_OPD", description="Facility scenario identifier")
    language_preference: str = Field(default="Odia", description="Preferred language (Odia, Hindi, English)")
    visit_timestamp: str = Field(default_factory=lambda: datetime.now().isoformat(), description="ISO Timestamp of arrival")
    emergency_contact: Optional[str] = Field(default=None, description="Contact number for emergency")
    abha_id: Optional[str] = Field(default=None, description="Ayushman Bharat Health Account ID, e.g. 91-4821-9923-0192")
    consent_given: bool = Field(default=True, description="Informed consent confirmed")
    unconscious_bypass: bool = Field(default=False, description="Emergency unconscious bypass for trauma/arrest")


# ==============================================================================
# Domain 2: Symptoms & Complaints
# ==============================================================================
class SymptomsData(BaseModel):
    chief_complaint: str = Field(default="", description="Main presenting symptom in English")
    selected_symptoms: List[str] = Field(default_factory=list, description="Common symptom tags selected")
    duration: str = Field(default="1 day", description="Symptom duration")
    onset_trend: str = Field(default="Gradual", description="Worsening rapidly, Gradual, Stable, Fluctuating")
    severity_self_reported: str = Field(default="Moderate (5/10)", description="Patient-reported severity scale")
    associated_symptoms: List[str] = Field(default_factory=list, description="Secondary symptoms reported")
    previous_similar_episodes: Optional[str] = Field(default=None, description="Prior occurrences if any")
    verbatim_local_statement: Optional[str] = Field(default="", description="Exact words in native script/phonetics")
    translated_english_statement: Optional[str] = Field(default="", description="English translation of statement")


# ==============================================================================
# Domain 3: Vital Signs
# ==============================================================================
class VitalSigns(BaseModel):
    recorded_at: str = Field(default_factory=lambda: datetime.now().isoformat())
    temperature_f: Optional[float] = Field(default=98.6, description="Body temperature in Fahrenheit")
    spo2_percent: Optional[int] = Field(default=98, ge=0, le=100, description="Oxygen Saturation SpO2 %")
    heart_rate_bpm: Optional[int] = Field(default=75, ge=0, le=300, description="Heart Rate / Pulse bpm")
    bp_systolic: Optional[int] = Field(default=120, ge=40, le=300, description="Systolic Blood Pressure mmHg")
    bp_diastolic: Optional[int] = Field(default=80, ge=20, le=200, description="Diastolic Blood Pressure mmHg")
    respiratory_rate_min: Optional[int] = Field(default=18, ge=0, le=80, description="Respiratory Rate per minute")
    blood_glucose_mg_dl: Optional[int] = Field(default=110, ge=20, le=800, description="Random Blood Glucose mg/dL")
    weight_kg: Optional[float] = Field(default=60.0, description="Body weight in kg")


# ==============================================================================
# Domain 4: Medical History
# ==============================================================================
class MedicalHistory(BaseModel):
    existing_conditions: List[str] = Field(default_factory=list, description="Chronic illnesses (HTN, DM, Asthma)")
    previous_surgeries: List[str] = Field(default_factory=list, description="Surgical history")
    previous_hospitalizations: List[str] = Field(default_factory=list, description="Prior admissions")
    current_medications: List[str] = Field(default_factory=list, description="Active prescriptions")
    known_allergies: List[str] = Field(default_factory=list, description="Known drug/food allergies")
    family_history: Optional[str] = Field(default=None, description="Significant family diseases")


# ==============================================================================
# Domain 5: Uploaded Reports & OCR
# ==============================================================================
class UploadedReport(BaseModel):
    report_type: str = Field(default="Blood_Report_CBC", description="Type of lab report or prescription")
    file_name: str = Field(default="report.jpg", description="Name of uploaded file")
    ocr_extracted_text: str = Field(default="", description="Text extracted from image")
    key_findings: List[str] = Field(default_factory=list, description="Significant abnormal parameters")
    file_data_base64: Optional[str] = Field(default=None, description="Base64 encoded preview image if available")


# ==============================================================================
# Domain 6: Supporting Visual Inputs
# ==============================================================================
class VisualInput(BaseModel):
    image_category: str = Field(default="General_Observation", description="Swelling_Edema, Skin_Rash, Wound, Eye_Redness")
    user_caption: Optional[str] = Field(default="", description="Description of the visual area")
    ai_supporting_observation: Optional[str] = Field(default="", description="Non-diagnostic objective visual observation")
    image_data_base64: Optional[str] = Field(default=None, description="Base64 encoded visual image if available")


# ==============================================================================
# Domain 7: Red-Flag Checklist
# ==============================================================================
class RedFlagChecklist(BaseModel):
    severe_breathing_difficulty: bool = Field(default=False, description="Stridor, severe dyspnea, retractions")
    loss_of_consciousness: bool = Field(default=False, description="Unresponsive, syncope, altered mental state")
    severe_bleeding: bool = Field(default=False, description="Active uncontrolled hemorrhage")
    severe_chest_pain: bool = Field(default=False, description="Crushing central chest pain with radiation")
    seizure: bool = Field(default=False, description="Active or recent convulsion / post-ictal state")
    sudden_weakness_paralysis: bool = Field(default=False, description="Facial droop, slurred speech, hemiparesis")
    very_low_oxygen_spo2: bool = Field(default=False, description="Known severe hypoxia")
    severe_allergic_reaction: bool = Field(default=False, description="Facial/tongue swelling, anaphylaxis")


# ==============================================================================
# Domain 8: Combined Triage Intake Payload
# ==============================================================================
class TriageIntakePayload(BaseModel):
    patient_basic_info: PatientBasicInfo = Field(default_factory=PatientBasicInfo)
    symptoms_and_complaints: SymptomsData = Field(default_factory=SymptomsData)
    vital_signs: VitalSigns = Field(default_factory=VitalSigns)
    medical_history: MedicalHistory = Field(default_factory=MedicalHistory)
    uploaded_reports: List[UploadedReport] = Field(default_factory=list)
    visual_inputs: List[VisualInput] = Field(default_factory=list)
    red_flag_checklist: RedFlagChecklist = Field(default_factory=RedFlagChecklist)


# ==============================================================================
# Domain 9: AI Triage Output & Clinical Synthesis
# ==============================================================================
class AITriageOutput(BaseModel):
    rule_engine_priority: str = Field(default="GREEN", description="RED, YELLOW, or GREEN")
    ai_suggested_priority: str = Field(default="GREEN", description="RED, YELLOW, or GREEN")
    final_computed_priority: str = Field(default="GREEN", description="MAX(rule, ai) priority floor")
    priority_label: str = Field(default="Routine — Standard OPD Queue", description="Human-readable urgency label")
    deterministic_triggers: List[str] = Field(default_factory=list, description="Specific clinical rules that fired")
    chronological_timeline: str = Field(default="", description="Structured step-by-step history progression")
    missing_information_gaps: List[str] = Field(default_factory=list, description="Vital clinical questions still missing")
    suggested_followup_questions: List[str] = Field(default_factory=list, description="3 high-yield questions for nurse")
    followup_questions_english: List[str] = Field(default_factory=list, description="Follow-up questions in English")
    followup_questions_local_language: List[str] = Field(default_factory=list, description="Follow-up questions in Odia/Hindi")
    suggested_department: str = Field(default="General Medicine OPD", description="Suggested clinic department or bay")
    concise_clinician_summary: str = Field(default="", description="3-sentence handover summary for reviewing doctor")
    referral_note_draft: str = Field(default="", description="Standardized referral note for tertiary care")
    non_diagnostic_disclaimer: str = Field(
        default="This output is an AI-assisted triage summary for qualified healthcare workers and does NOT constitute a medical diagnosis or treatment prescription.",
        description="Mandatory advisory safety notice"
    )


# ==============================================================================
# Domain 10: Human-in-the-Loop Clinician Feedback & Review
# ==============================================================================
class HumanReviewFeedback(BaseModel):
    review_status: str = Field(default="PENDING", description="PENDING, VERIFIED_BY_CLINICIAN, or OVERRIDDEN")
    reviewer_id: Optional[str] = Field(default=None, description="Doctor/Clinician ID e.g. DR-MO-402")
    reviewed_at: Optional[str] = Field(default=None, description="ISO timestamp of review")
    clinician_assigned_priority: Optional[str] = Field(default=None, description="RED, YELLOW, or GREEN")
    was_ai_overridden: bool = Field(default=False, description="True if clinician changed priority")
    override_reason: Optional[str] = Field(default=None, description="Mandatory clinical justification for override")
    clinician_corrections: Optional[str] = Field(default=None, description="Additional clinician notes or orders")
    missing_info_resolved: List[str] = Field(default_factory=list, description="Missing gaps answered during review")
    escalation_triggered: bool = Field(default=False, description="True if sent to Emergency Bay / District Transfer")
    ai_summary_quality_rating: Optional[int] = Field(default=None, ge=1, le=5, description="1-5 rating on AI utility")


# ==============================================================================
# Full Triage Record & Operational Queue Schemas
# ==============================================================================
class FollowupAnswer(BaseModel):
    question: str
    answer: str

class FollowupSubmission(BaseModel):
    answers: List[FollowupAnswer]

class ClinicianReviewPayload(BaseModel):
    final_priority: str = Field(description="RED, YELLOW, or GREEN")
    reviewer_id: str = Field(default="DR-MO-402 (Medical Officer)")
    override_reason: Optional[str] = None
    clinician_notes: Optional[str] = None
    admit_action: Optional[str] = Field(default="ADMIT_BAY", description="ADMIT_BAY, FAST_TRACK_OPD, DISCHARGE, REFERRAL_TRANSFER")
    missing_info_resolved: List[str] = Field(default_factory=list)
    rating: Optional[int] = Field(default=5, ge=1, le=5)

class TriageRecord(BaseModel):
    visit_id: str
    token_number: str
    created_at: str = Field(default_factory=lambda: datetime.now().isoformat())
    queue_status: str = Field(default="WAITING", description="WAITING, IN_REVIEW, COMPLETED, REFERRED")
    triage_lane: str = Field(default="GREEN", description="RED, YELLOW, or GREEN")
    patient_basic_info: PatientBasicInfo
    symptoms_and_complaints: SymptomsData
    vital_signs: VitalSigns
    medical_history: MedicalHistory
    uploaded_reports: List[UploadedReport] = Field(default_factory=list)
    visual_inputs: List[VisualInput] = Field(default_factory=list)
    red_flag_checklist: RedFlagChecklist
    ai_triage_output: AITriageOutput
    human_review_feedback: HumanReviewFeedback = Field(default_factory=HumanReviewFeedback)
    followup_answers: List[FollowupAnswer] = Field(default_factory=list)

class QueueItem(BaseModel):
    visit_id: str
    token_number: str
    patient_id: str
    name_or_alias: str
    age: int
    sex: str
    language_preference: str
    facility_type: str
    priority: str
    priority_label: str
    chief_complaint: str
    vitals_summary: str
    department: str
    wait_time_minutes: int
    queue_status: str
    escalation_triggered: bool
    created_at: str
    abha_id: Optional[str] = None

class FacilityStats(BaseModel):
    emergency_beds_available: int = 3
    emergency_beds_total: int = 5
    general_beds_available: int = 18
    general_beds_total: int = 24
    doctors_on_duty: int = 4
    nurses_available: int = 8
    pending_sync_count: int = 0
    facility_id: str = "PHC_JATNI"
    facility_name: str = "PHC Jatni"
    facility_nin: str = "OD-KHD-PHC-102"
    district: str = "Khordha"
    oxygen_level_percent: int = 98
    oxygen_status: str = "Normal (42 L/min manifold)"
    ambulance_status: str = "OD-02-AX-1081 (ALS Standby at Jatni)"
    occupancy_rate_percent: int = 40
    last_updated: Optional[str] = None
    bay_allocations: List[dict] = Field(default_factory=list)
    active_doctors: List[str] = Field(default_factory=list)
    active_nurses: List[str] = Field(default_factory=list)

class QueueDashboardResponse(BaseModel):
    active_queue: List[QueueItem]
    red_count: int
    yellow_count: int
    green_count: int
    total_waiting: int
    facility_stats: FacilityStats

# ==============================================================================
# NHM Referral & FHIR R4 Bundle Schemas
# ==============================================================================
class ReferralSlipRequest(BaseModel):
    visit_id: Optional[str] = None
    patient_id: str = "PHC-1001"
    patient_name: str = "Anonymous Patient"
    age: int = 35
    sex: str = "Male"
    abha_id: Optional[str] = "91-4821-9923-0192"
    from_facility: str = "PHC Jatni"
    from_facility_nin: str = "OD-KHD-PHC-102"
    receiving_facility: str = "Capital Hospital (District Headquarter Hospital, Bhubaneswar - NIN: OD-DHH-401)"
    receiving_facility_nin: str = "OD-DHH-401"
    triage_priority: str = "RED"
    chief_complaint: str = "Severe Chest Pain / Acute Coronary Syndrome"
    vitals_summary: str = "SpO2: 89%, BP: 158/96 mmHg, HR: 112 bpm"
    pre_referral_treatment: Optional[str] = "High-flow O2 at 6L/min via NRB mask; Aspirin 300mg + Clopidogrel 300mg stat; IV line 18G secured"
    ambulance_call_status: Optional[str] = "108 ALS Ambulance (OD-02-AX-1081) dispatched from Jatni base station"
    accompanying_paramedic: Optional[str] = "Sister Manorama Nayak (Staff Nurse) + EMT R. K. Sahoo"
    referral_reason: Optional[str] = "Tertiary coronary angiography & ICU care not available at PHC"
    referring_officer: str = "Dr. S. Mohanty, MBBS, MD (Medical Officer In-Charge)"

class ReferralSlipResponse(BaseModel):
    referral_id: str
    token_number: Optional[str] = None
    timestamp_hash: str
    dispatch_timestamp: str
    status: str = "DISPATCHED"
    from_facility: str
    from_facility_nin: str
    receiving_facility: str
    receiving_facility_nin: str
    triage_priority: str
    patient_id: str
    patient_name: str
    age: int
    sex: str
    abha_id: Optional[str] = None
    chief_complaint: str
    departure_vitals: str
    pre_referral_stabilization: str
    ambulance_coordination: str
    accompanying_staff: str
    referring_doctor: str
    nhm_odisha_corridor: str
    digital_signature_hash: str
    verification_qr_data: str

class FHIRBundleResponse(BaseModel):
    resourceType: str = "Bundle"
    id: str
    meta: Dict[str, Any]
    type: str = "document"
    timestamp: str
    entry: List[Dict[str, Any]]

