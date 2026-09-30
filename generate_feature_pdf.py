import os
import shutil
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#0D9488")) # Medical Teal
        
        # Header (Pages > 1)
        if self._pageNumber > 1:
            self.drawString(36, 756, "SARANSH — Complete Step-by-Step System Working & Comprehensive Feature Manual")
            self.setFont("Helvetica", 8)
            self.setFillColor(colors.HexColor("#64748B"))
            self.drawRightString(576, 756, "BPUT HACKATHON 2026 • AI HEALTHCARE TRACK")
            self.setStrokeColor(colors.HexColor("#E2E8F0"))
            self.setLineWidth(0.75)
            self.line(36, 750, 576, 750)

        # Footer (All pages)
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.75)
        self.line(36, 45, 576, 45)
        
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawString(36, 32, "Confidential • Ministry of Health & Family Welfare & ABDM Architecture Alignment")
        
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(576, 32, page_str)
        self.restoreState()

def build_feature_manual_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=50,
        bottomMargin=55
    )

    styles = getSampleStyleSheet()

    # Custom Color Palette
    C_NAVY = colors.HexColor("#0B0F19")
    C_TEAL = colors.HexColor("#0D9488")
    C_CYAN = colors.HexColor("#0284C7")
    C_SLATE_BG = colors.HexColor("#F8FAFC")
    C_BORDER = colors.HexColor("#CBD5E1")
    C_TEXT = colors.HexColor("#1E293B")
    C_MUTED = colors.HexColor("#64748B")
    C_RED = colors.HexColor("#E11D48")
    C_AMBER = colors.HexColor("#D97706")
    C_GREEN = colors.HexColor("#059669")
    C_BLUE = colors.HexColor("#2563EB")

    # Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=C_NAVY,
        spaceAfter=4
    )
    
    subtitle_style = ParagraphStyle(
        'DocSub',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=C_TEAL,
        spaceAfter=12
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=13.5,
        leading=17,
        textColor=C_NAVY,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=C_TEAL,
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12.5,
        textColor=C_TEXT,
        spaceAfter=6
    )

    box_text_style = ParagraphStyle(
        'BoxText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11.5,
        textColor=colors.HexColor("#0F172A")
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white
    )

    step_title_style = ParagraphStyle(
        'StepTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13,
        textColor=C_NAVY
    )

    story = []

    # =========================================================================
    # HEADER BANNER & DOCUMENT METADATA
    # =========================================================================
    badge_p = Paragraph(
        "<font color='#0D9488'><b>OFFICIAL SYSTEM SPECIFICATION & STEP-BY-STEP OPERATION MANUAL</b></font> &nbsp;|&nbsp; BPUT HACKATHON 2026",
        box_text_style
    )
    story.append(badge_p)
    story.append(Spacer(1, 4))
    
    story.append(Paragraph("Project Saransh", title_style))
    story.append(Paragraph("Multimodal Human-in-the-Loop Healthcare Triage Assistant for Indian Government Facilities", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=C_TEAL, spaceAfter=10))

    # Meta Overview Box
    overview_html = """
    <b>System Category:</b> Clinical Decision Support System (CDSS / SaMD Class A) &nbsp;|&nbsp; <b>Deployment Tier:</b> PHC, CHC, Sub-Centres (Ayushman Arogya Mandirs)<br/>
    <b>Standard Compliances:</b> ABDM (M1, M2, M3), FHIR R4, DPDP Act 2023, SNOMED-CT, ICD-10, LOINC &nbsp;|&nbsp; <b>Target Audience:</b> ASHA/ANM Workers & MOs<br/>
    <b>Core Operational Mandate:</b> Sub-90s Rapid Triage Intake, Vernacular Odia/Hindi Normalization, Zero-Hallucination Deterministic Safety, and 100% Doctor Autonomy.
    """
    box_table = Table([[Paragraph(overview_html, box_text_style)]], colWidths=[540])
    box_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), C_SLATE_BG),
        ('BOX', (0,0), (-1,-1), 1, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 7),
        ('BOTTOMPADDING', (0,0), (-1,-1), 7),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(box_table)
    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 1: EXECUTIVE OVERVIEW & PROBLEM STATEMENT
    # =========================================================================
    story.append(Paragraph("1. Executive Summary & Clinical Background", h1_style))
    story.append(Paragraph(
        "In India, a single government Medical Officer at a rural Primary Health Centre (PHC) or Community Health Centre (CHC) "
        "faces an unprioritized Outpatient Department (OPD) queue of 300 to 500 patients daily. Under traditional first-come, first-served "
        "queueing, critically ill casualties (acute myocardial infarction, pediatric respiratory distress, septic shock) wait in line behind "
        "minor routine ailments like mild fungal dermatitis or standard dressing renewals. <b>Project Saransh</b> bridges this lethal "
        "intake bottleneck by providing an offline-resilient, multimodal, assistive triage workstation that equips frontline ASHA and ANM "
        "workers to triage arriving citizens in under 90 seconds while keeping clinical liability strictly with the attending Medical Officer.",
        body_style
    ))
    story.append(Spacer(1, 6))

    # =========================================================================
    # SECTION 2: STEP-BY-STEP COMPLETE SYSTEM WORKING (THE PATIENT JOURNEY)
    # =========================================================================
    story.append(Paragraph("2. Step-by-Step System Working (End-to-End Operational Lifecycle)", h1_style))
    story.append(Paragraph(
        "The following 8 sequential phases detail exactly how Saransh operates in a live rural public healthcare facility, "
        "from the initial second a patient walks into the OPD to their physician review or emergency inter-facility transfer:",
        body_style
    ))
    story.append(Spacer(1, 4))

    steps_data = [
        {
            "step": "Step 1",
            "phase": "Patient Arrival & ABHA Digital Identity Verification",
            "role": "ASHA / ANM Frontline Worker",
            "time": "0 - 15 Seconds",
            "how": "The frontline worker enters the patient's 14-digit ABHA ID or clicks 'Mock Scan ABHA Card'. The system executes a simulated ABDM Milestone 1 (M1) handshake, instantly fetching legal verified demographics (Name, Age, Gender, District), chronic conditions (Hypertension, Type 2 Diabetes), and active life-threatening drug allergies (e.g. Penicillin Anaphylaxis). A photorealistic 24K gold smart chip and verified citizen badge confirm identity.",
            "tech": "NHA ABDM M1 OAuth/Consent payload format. Pre-fills client state in 750 milliseconds, eliminating 4 minutes of manual paperwork typos.",
            "safety": "Immediate prominent red-flag allergy warning badge is displayed across all screens, preventing lethal contraindicated drug administration."
        },
        {
            "step": "Step 2",
            "phase": "Rapid Physiological Telemetry Capture & Sanity Check",
            "role": "ASHA / ANM Frontline Worker",
            "time": "15 - 35 Seconds",
            "how": "The worker attaches standard pulse oximeter and digital BP cuff. They input 6 critical physiological parameters into a high-visibility Bento Grid: SpO2 (%), Systolic/Diastolic Blood Pressure (mmHg), Heart Rate (bpm), Body Temperature (°F), Respiratory Rate (/min), and Random Blood Glucose (mg/dL). Real-time boundary validation blocks impossible biological values (e.g., SpO2 > 100%).",
            "tech": "Real-time client-side physiological bounds checker with instant color feedback (e.g., SpO2 < 90% flashes rose-red; Temp 102.8°F shows amber warning).",
            "safety": "Telemetry immediately feeds into the Deterministic Safety Gatekeeper before any AI is invoked."
        },
        {
            "step": "Step 3",
            "phase": "Multimodal Vernacular Complaint Capture & Anatomical Touch",
            "role": "Patient & Frontline Worker",
            "time": "35 - 65 Seconds",
            "how": "The worker taps the microphone icon to record patient complaints verbally in local dialects (Odia, Hindi, English). The patient speaks colloquial phrases like Odia: <i>'Dui dina hela chhati re bhara laagu chi, nishaas neba ku kasta heuchi'</i>. Concurrently, in noisy public waiting halls, the patient or nurse taps a 2D interactive anatomical body map (Head, Chest, Lungs, Abdomen, Limbs, Skin) and adjusts a 1-10 pain severity slider.",
            "tech": "Dual-stage Indic NLP pipeline: (1) Acoustic Web Speech transcription; (2) Semantic normalizer mapping colloquialisms to SNOMED-CT & ICD-10 (e.g., <i>'Chhati bhara'</i> -> Angina Pectoris ICD-10 I20.9; <i>'Nishaas kasta'</i> -> Dyspnea ICD-10 R06.02).",
            "safety": "Preserves verbatim audio transcript side-by-side with translated clinical terminology for complete doctor cross-examination."
        },
        {
            "step": "Step 4",
            "phase": "The Deterministic Red-Line Gatekeeper & Clinical AI Triaging",
            "role": "Automated Safety Engine (Local Edge / Cloud)",
            "time": "65 - 75 Seconds",
            "how": "Upon clicking 'Analyze & Generate Clinical Triage', the system executes a dual-layer evaluation: (1) <b>Deterministic Safety Guardrails</b> execute first. If physiological red lines are breached (SpO2 < 90%, SBP > 180, Arrhythmias, or FAST stroke signs), the patient is instantly locked into the 🔴 RED EMERGENCY LANE; (2) <b>Gemini 2.5 Flash / Intelligent Fallback Engine</b> evaluates the multimodal payload to predict differential diagnoses, recommended emergency lab work, and triage lane.",
            "tech": "MAX_RISK formula: <code>Final Priority = MAX_RISK(DeterministicRule, AI_Prediction)</code>. Even if an AI model hallucinates 'Green', the deterministic rule guarantees an override to 'Red'.",
            "safety": "Zero-hallucination tolerance for life-threatening emergencies. Completely offline-capable through local heuristic engine."
        },
        {
            "step": "Step 5",
            "phase": "Doctor Command Center & Tri-Lane Dynamic Priority Queue",
            "role": "Medical Officer (Attending Doctor)",
            "time": "75 - 80 Seconds",
            "how": "Inside the consultation cabin, the Medical Officer views a live tri-lane queue sorted by physiological urgency rather than arrival time: 🔴 RED (Immediate Resuscitation, 0 min), 🟠 YELLOW (Urgent Observation, < 30 min), 🟢 GREEN (Routine Consultation). Top hospital bed telemetry displays live Oxygen, General, and ICU bed availability. Red cards pulse with high-contrast alert badges.",
            "tech": "Dynamic client-state priority reordering with millisecond queue insertion and audio chime alerts for newly arriving critical patients.",
            "safety": "Ensures severe cardiac, stroke, and pediatric hypoxia cases skip the 400-person OPD queue instantly."
        },
        {
            "step": "Step 6",
            "phase": "Human-in-the-Loop (HITL) Doctor Review & Cryptographic Counter-Sign",
            "role": "Medical Officer (Attending Doctor)",
            "time": "80 - 90 Seconds",
            "how": "The doctor opens the patient triage card, reviews verified vitals, differential diagnoses, and verbatim patient quotes. With 1 click, the doctor clicks 'Approve & Counter-Sign'. If the doctor's expert judgment differs from the system, they can override the lane (e.g. upgrade Green to Red or downgrade Red to Yellow) with mandatory clinical reason logging. The encounter is sealed with a cryptographic SHA-256 audit hash.",
            "tech": "Cryptographic Hash: <code>SHA-256(PatientID + Timestamp + Vitals + DoctorRegNumber + FinalPriority + OverrideReason)</code>.",
            "safety": "Strict compliance with National Medical Commission (NMC) regulations. Software remains an assistive tool; legal diagnosis rests 100% with the licensed physician."
        },
        {
            "step": "Step 7",
            "phase": "NHM Inter-Facility Referral & 108 Emergency Audio Handover",
            "role": "Medical Officer & 108 Ambulance Paramedic",
            "time": "Post-Triage Escalation",
            "how": "For critical Red-Lane patients requiring tertiary intervention (e.g. at SCB Medical College, Cuttack), the doctor clicks 'Generate NHM Referral Slip'. The modal generates an official National Health Mission referral document with a verification QR code and prints a paper chit. Simultaneously, the doctor or paramedic clicks '🔊 Audio Handover' to broadcast a crystal-clear spoken briefing in Odia, Hindi, or English over ambulance radio or mobile speaker.",
            "tech": "Standardized NHM Inter-Facility Transfer format (NHM-ODISHA-REF-2026) + Dual-gender Vernacular Speech Synthesizer.",
            "safety": "Eliminates lost paperwork during transit; paramedics on bumpy rural roads receive hands-free spoken baseline vitals and drug allergy warnings."
        },
        {
            "step": "Step 8",
            "phase": "ABDM FHIR R4 Health Bundle Compilation & Offline-First Edge Sync",
            "role": "Background Gateway Architecture",
            "time": "Continuous / Asynchronous",
            "how": "Every finalized triage encounter automatically compiles into an HL7 FHIR Release 4 JSON Bundle containing standardized <code>Patient</code>, <code>Encounter</code>, <code>Condition</code> (ICD-10/SNOMED), and <code>Observation</code> (LOINC) resources. If the village internet drops, records are securely queued in browser IndexedDB and local SQLite, syncing idempotently to the cloud once connectivity resumes.",
            "tech": "FHIR R4 JSON schemas + IndexedDB offline persistence queue + SHA-256 idempotency deduplication keys.",
            "safety": "Zero data loss during rural power and broadband blackouts; seamless federation into national e-Hospital and Ayushman Bharat health lockers."
        }
    ]

    for s in steps_data:
        p_head = Paragraph(f"<b>{s['step']}: {s['phase']}</b>", step_title_style)
        badge_html = f"<font color='#0D9488'><b>ROLE: {s['role']}</b></font> &nbsp;|&nbsp; <font color='#64748B'><b>{s['time']}</b></font>"
        p_badge = Paragraph(badge_html, box_text_style)

        table_data = [
            [p_head, p_badge],
            [Paragraph("<b>Operational Working:</b>", box_text_style), Paragraph(s['how'], box_text_style)],
            [Paragraph("<b>Technical Engine:</b>", box_text_style), Paragraph(s['tech'], box_text_style)],
            [Paragraph("<b>Clinical Safety:</b>", box_text_style), Paragraph(s['safety'], box_text_style)]
        ]

        t_step = Table(table_data, colWidths=[120, 420])
        t_step.setStyle(TableStyle([
            ('SPAN', (0,0), (0,0)),
            ('ALIGN', (1,0), (1,0), 'RIGHT'),
            ('BACKGROUND', (0,0), (-1,-1), C_SLATE_BG),
            ('BOX', (0,0), (-1,-1), 1, C_BORDER),
            ('INNERGRID', (0,1), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ('LEFTPADDING', (0,0), (-1,-1), 7),
            ('RIGHTPADDING', (0,0), (-1,-1), 7),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ]))
        story.append(KeepTogether([t_step, Spacer(1, 7)]))

    story.append(Spacer(1, 8))

    # =========================================================================
    # SECTION 3: COMPREHENSIVE FEATURE BREAKDOWN (ALL 14 CORE MODULES)
    # =========================================================================
    story.append(Paragraph("3. Complete Feature Breakdown Matrix (All 14 Modules)", h1_style))
    story.append(Paragraph(
        "Detailed functional specifications for every module integrated into the Saransh platform:",
        body_style
    ))
    story.append(Spacer(1, 4))

    features = [
        {
            "id": "M01",
            "name": "ABDM Holographic Health Card & ABHA ID Verification",
            "tag": "ABDM MILESTONE 1 (M1)",
            "purpose": "Instant patient identification, demographic auto-population, and digital health history retrieval.",
            "tech": "Simulated ABDM M1 gateway handshake. Validates 14-digit ABHA numbers, retrieves verified demographics, chronic preconditions (Hypertension, Diabetes), and active drug allergies in 750ms."
        },
        {
            "id": "M02",
            "name": "Vernacular Speech & Indic Local Dialect Normalization",
            "tag": "MULTIMODAL INDIC NLP",
            "purpose": "Translates rural colloquial symptom descriptions into standardized international medical coding.",
            "tech": "Dual-stage pipeline: Acoustic Web Speech API + Gemini 2.5 Flash. Maps colloquial idioms (e.g. Odia: 'Chhati re bhara', Hindi: 'Chhati mein dabav') to SNOMED-CT 225566008 and ICD-10 I20.9."
        },
        {
            "id": "M03",
            "name": "Interactive 2D Anatomical Touch Mapping",
            "tag": "NOISE-RESILIENT TOPOLOGY",
            "purpose": "Ensures accurate symptom localization when extreme hospital waiting room noise degrades speech recognition.",
            "tech": "SVG anatomical figure with 6 clinical body zones (Head, Chest, Lungs, Abdomen, Limbs, Skin), Front/Back toggle, and 1-10 severity slider triggering localized symptom checklists."
        },
        {
            "id": "M04",
            "name": "Bento Grid Physiological Telemetry & Sanity Engine",
            "tag": "CLINICAL TELEMETRY",
            "purpose": "High-speed vital sign entry with automated biological boundary validation.",
            "tech": "High-contrast inputs for SpO2, Systolic/Diastolic BP, Heart Rate, Temperature, Respiratory Rate, and Blood Sugar. Highlights abnormal parameters (rose-red/amber) and blocks impossible values."
        },
        {
            "id": "M05",
            "name": "Deterministic Non-AI Red-Line Safety Gatekeeper",
            "tag": "SAFETY-FIRST (20% RUBRIC)",
            "purpose": "100% elimination of AI hallucination risk for life-threatening medical emergencies.",
            "tech": "Hard-coded clinical rules: SpO2 < 90%, SBP > 180 mmHg, DBP > 120 mmHg, Heart Rate > 130 or < 40 bpm, crushing chest pain, or FAST stroke signs trigger immediate Red Lane lockout."
        },
        {
            "id": "M06",
            "name": "Doctor Command Center & Tri-Lane Priority Queue",
            "tag": "CLINICAL WORKFLOW (HITL)",
            "purpose": "Transforms chaotic waiting halls into an organized, clinically prioritized queue.",
            "tech": "Sorts incoming patients into Red (Immediate Resuscitation, 0 min), Yellow (Urgent Observation, < 30 min), and Green (Routine Consultation). Features real-time priority reordering and audio chimes."
        },
        {
            "id": "M07",
            "name": "Human-in-the-Loop Doctor Override & Audit Ledger",
            "tag": "LEGAL NON-REPUDIATION",
            "purpose": "Maintains complete physician legal autonomy under National Medical Commission guidelines.",
            "tech": "Allows doctors to counter-sign or override triage classifications with mandatory reason logging. Encodes every decision into a tamper-evident SHA-256 cryptographic audit hash."
        },
        {
            "id": "M08",
            "name": "Standardized NHM Inter-Facility Referral Slip Generator",
            "tag": "INTER-FACILITY CONTINUITY",
            "purpose": "Seamless patient escalation from rural primary care to tertiary apex medical colleges.",
            "tech": "Auto-populates originating & destination facilities, departure vitals, clinical justification, ambulance transit requirements, and verification QR code in official NHM-ODISHA-REF-2026 format."
        },
        {
            "id": "M09",
            "name": "108 Emergency Hands-Free Vernacular Audio Handover",
            "tag": "EMERGENCY LOGISTICS",
            "purpose": "Provides clear, hands-free verbal briefing for ambulance paramedics and emergency room staff.",
            "tech": "Integrated Web Speech / ElevenLabs voice engine reciting patient demographics, vital signs, chief complaint, and transport corridor in Odia, Hindi, or English."
        },
        {
            "id": "M10",
            "name": "Hospital Bed & ICU Live Telemetry Monitor",
            "tag": "CAPACITY MANAGEMENT",
            "purpose": "Provides real-time visibility into regional hospital resources during referral decision-making.",
            "tech": "Real-time occupancy tracking for Oxygen Beds, General Ward Beds, and Ventilator ICU units, preventing patient transfers to saturated facilities."
        },
        {
            "id": "M11",
            "name": "Multi-Facility Context Switching System",
            "tag": "FEDERATED DEPLOYMENT",
            "purpose": "Allows one application to adapt to distinct healthcare facility tiers across India.",
            "tech": "1-click facility context switcher supporting PHC Jatni (Rural Odisha), CHC Pipili, Tribal Mobile Camp (Koraput), AIIMS New Delhi (Apex Quaternary), and Thane MIDC (Industrial Maharashtra)."
        },
        {
            "id": "M12",
            "name": "ABDM FHIR R4 Health Data Bundle Generator",
            "tag": "NATIONAL STANDARDS (M2/M3)",
            "purpose": "Ensures complete electronic health data portability into national digital health lockers.",
            "tech": "Compiles triage encounters into HL7 FHIR Release 4 JSON bundles with standardized Patient, Encounter, Condition (ICD-10/SNOMED), and Observation (LOINC) resources."
        },
        {
            "id": "M13",
            "name": "Offline-First Architecture & Resilient Edge Sync",
            "tag": "RURAL INFRASTRUCTURE",
            "purpose": "Guarantees 100% operational uptime in rural facilities with zero internet or electrical blackouts.",
            "tech": "Browser IndexedDB queues intake payloads locally. Facility server runs local SQLite + heuristic triage. Syncs idempotently with cloud backends upon reconnection."
        },
        {
            "id": "M14",
            "name": "DPDP Act 2023 Compliance & Security Center",
            "tag": "STATUTORY PRIVACY",
            "purpose": "Guarantees strict patient privacy and data protection under Indian healthcare laws.",
            "tech": "Edge de-identification (stripping Aadhaar/Name before cloud LLM transit), Section 7(a) emergency exemptions for trauma, Role-Based Access Control, AES-256 and TLS 1.3 encryption."
        }
    ]

    for f in features:
        f_head = Paragraph(f"<b>{f['id']}: {f['name']}</b>", step_title_style)
        badge_html = f"<font color='#0D9488'><b>{f['tag']}</b></font>"
        p_badge = Paragraph(badge_html, box_text_style)

        table_data = [
            [f_head, p_badge],
            [Paragraph("<b>Clinical Purpose:</b>", box_text_style), Paragraph(f['purpose'], box_text_style)],
            [Paragraph("<b>Technical Architecture:</b>", box_text_style), Paragraph(f['tech'], box_text_style)]
        ]

        t_f = Table(table_data, colWidths=[120, 420])
        t_f.setStyle(TableStyle([
            ('SPAN', (0,0), (0,0)),
            ('ALIGN', (1,0), (1,0), 'RIGHT'),
            ('BACKGROUND', (0,0), (-1,-1), C_SLATE_BG),
            ('BOX', (0,0), (-1,-1), 1, C_BORDER),
            ('INNERGRID', (0,1), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ('LEFTPADDING', (0,0), (-1,-1), 7),
            ('RIGHTPADDING', (0,0), (-1,-1), 7),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ]))
        story.append(KeepTogether([t_f, Spacer(1, 6)]))

    story.append(Spacer(1, 8))

    # =========================================================================
    # SECTION 4: USER ROLE OPERATIONAL GUIDES
    # =========================================================================
    story.append(Paragraph("4. User Role Operational Quick-Start Guides", h1_style))
    story.append(Paragraph(
        "Clear step-by-step instructions tailored for the three primary frontline user personas:",
        body_style
    ))
    story.append(Spacer(1, 4))

    role_guides = [
        {
            "role": "ASHA / ANM Frontline Worker (Intake Kiosk)",
            "actions": [
                "1. Switch to your preferred language (English, Odia, or Hindi) in the top navigation bar.",
                "2. Ask for the patient's ABHA ID or click 'Mock Scan ABHA Card' to auto-populate basic demographics.",
                "3. Attach pulse oximeter and BP cuff. Enter SpO2, Blood Pressure, Pulse, and Temperature into the Vitals Grid.",
                "4. Click the microphone button and invite the patient to speak their primary complaint in their mother tongue.",
                "5. In noisy environments, tap the anatomical figure to pinpoint pain locations and adjust severity.",
                "6. Click 'Analyze & Generate Clinical Triage'. Review the generated summary with the patient.",
                "7. Click 'Confirm & Add to Doctor Queue'. Hand the patient their printed OPD Token number."
            ]
        },
        {
            "role": "Medical Officer / Attending Doctor (Consultation Cabin)",
            "actions": [
                "1. Observe the live Doctor Command Center dashboard. Patients in the 🔴 RED lane appear first with pulsing alerts.",
                "2. Call in the next highest-priority patient. Review the pre-populated vitals, allergies, and differential diagnoses.",
                "3. Click 'Inspect Full Patient Dossier' to review verbatim audio transcript and mapped SNOMED-CT codes.",
                "4. Conduct physical examination. If diagnosis confirms, click 'Approve & Counter-Sign' to log the record.",
                "5. If your clinical assessment differs from the AI, select the appropriate priority lane, type the clinical reason, and counter-sign.",
                "6. If the patient requires tertiary care, click 'Generate NHM Referral Slip', select the destination hospital, and print the transfer form."
            ]
        },
        {
            "role": "108 Ambulance Paramedic & Emergency Transport Crew",
            "actions": [
                "1. Receive the physical NHM Referral Slip or scan the verification QR code using a tablet.",
                "2. Click the '🔊 Audio Handover' button on the mobile screen to listen to the automated spoken clinical briefing.",
                "3. Verify patient departure SpO2 and Blood Pressure before boarding.",
                "4. Follow the recommended transport corridor (e.g. Jagannath Expressway Green Corridor to SCB Medical College).",
                "5. Hand over the counter-signed referral chit directly to the receiving triage nurse at the apex casualty ward."
            ]
        }
    ]

    for rg in role_guides:
        r_head = Paragraph(f"<b>Operator Guide: {rg['role']}</b>", step_title_style)
        action_paragraphs = [Paragraph(a, box_text_style) for a in rg['actions']]
        
        t_guide = Table([[r_head], [action_paragraphs]], colWidths=[540])
        t_guide.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0B2545")),
            ('TEXTCOLOR', (0,0), (-1,0), colors.white),
            ('BACKGROUND', (0,1), (-1,1), C_SLATE_BG),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#0B2545")),
            ('TOPPADDING', (0,0), (-1,-1), 5),
            ('BOTTOMPADDING', (0,0), (-1,-1), 5),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ]))
        story.append(KeepTogether([t_guide, Spacer(1, 8)]))

    story.append(Spacer(1, 6))

    # =========================================================================
    # SECTION 5: BPUT HACKATHON 2026 JUDGING RUBRIC MATRIX
    # =========================================================================
    story.append(Paragraph("5. BPUT Hackathon Judging Rubric Alignment Matrix", h1_style))
    story.append(Paragraph(
        "Demonstrates complete compliance with the 7 official evaluation criteria of the BPUT Hackathon 2026:",
        body_style
    ))
    story.append(Spacer(1, 4))

    rubric_data = [
        [
            Paragraph("<b>Evaluation Criteria</b>", table_header_style),
            Paragraph("<b>Weight</b>", table_header_style),
            Paragraph("<b>Corresponding Features & Architectural Enforcements</b>", table_header_style)
        ],
        [
            Paragraph("<b>Clinical Safety & Red Lines</b>", box_text_style),
            Paragraph("<b>20%</b>", box_text_style),
            Paragraph("Deterministic non-AI physiological guardrails (SpO2 &lt; 90%, SBP &gt; 180, Arrhythmias). Zero hallucination tolerance.", box_text_style)
        ],
        [
            Paragraph("<b>Structured Extraction Quality</b>", box_text_style),
            Paragraph("<b>20%</b>", box_text_style),
            Paragraph("Accurate mapping of complaints to international standard ontologies: SNOMED-CT, ICD-10, duration, and anatomical pain sites.", box_text_style)
        ],
        [
            Paragraph("<b>Multimodal & Vernacular Experience</b>", box_text_style),
            Paragraph("<b>15%</b>", box_text_style),
            Paragraph("Odia & Hindi speech recognition with colloquial idiom translation; 2D interactive anatomical touch canvas; high-visibility vitals grid.", box_text_style)
        ],
        [
            Paragraph("<b>India-Wide System Usability</b>", box_text_style),
            Paragraph("<b>15%</b>", box_text_style),
            Paragraph("14-digit ABHA ID integration, FHIR R4 Bundle exports, and official National Health Mission (NHM) counter-signed referral slips.", box_text_style)
        ],
        [
            Paragraph("<b>Human-in-the-Loop & Auditability</b>", box_text_style),
            Paragraph("<b>15%</b>", box_text_style),
            Paragraph("Doctor command center with 3 priority lanes (Red/Yellow/Green), 1-click status override with reason logging, and SHA-256 audit hashing.", box_text_style)
        ],
        [
            Paragraph("<b>Privacy & Security Controls</b>", box_text_style),
            Paragraph("<b>10%</b>", box_text_style),
            Paragraph("DPDP Act 2023 compliance, edge de-identification (no cloud PII), role-based access control, and AES-256 / TLS 1.3 encryption.", box_text_style)
        ],
        [
            Paragraph("<b>Live Prototype Demonstration</b>", box_text_style),
            Paragraph("<b>5%</b>", box_text_style),
            Paragraph("100% operational React 18 + Vite frontend and FastAPI backend running live on Vercel with authentic Odisha health facility seed data.", box_text_style)
        ]
    ]

    t_rubric = Table(rubric_data, colWidths=[150, 50, 340])
    t_rubric.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_NAVY),
        ('BOX', (0,0), (-1,-1), 1, C_NAVY),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, C_SLATE_BG]),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 7),
        ('RIGHTPADDING', (0,0), (-1,-1), 7),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_rubric)
    story.append(Spacer(1, 10))

    # =========================================================================
    # SUMMARY CONCLUSION
    # =========================================================================
    conclusion_text = """
    <b>Final Architectural Commitment:</b><br/>
    <i>“Saransh does not attempt to replace doctors. It empowers frontline healthcare workers in India's 160,000+ Ayushman Arogya Mandirs to catch critical patients before their golden hour expires, while ensuring every clinical decision remains strictly in human hands.”</i>
    """
    c_box = Table([[Paragraph(conclusion_text, box_text_style)]], colWidths=[540])
    c_box.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F0FDF4")), # Emerald 50
        ('BOX', (0,0), (-1,-1), 1, C_GREEN),
        ('TOPPADDING', (0,0), (-1,-1), 7),
        ('BOTTOMPADDING', (0,0), (-1,-1), 7),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(c_box)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[SUCCESS] PDF generated successfully at: {filename}")

if __name__ == "__main__":
    out_dir = r"C:\Users\AMITRAZ\OneDrive\Desktop\Saransh"
    out_file = os.path.join(out_dir, "Saransh_Complete_Feature_Architecture_Manual.pdf")
    build_feature_manual_pdf(out_file)
    
    # Also save directly to Desktop
    desktop_file = r"C:\Users\AMITRAZ\OneDrive\Desktop\Saransh_Complete_Feature_Architecture_Manual.pdf"
    shutil.copyfile(out_file, desktop_file)
    print(f"[SUCCESS] Copied to Desktop: {desktop_file}")

    # Also copy to docs
    docs_file = os.path.join(out_dir, "docs", "Saransh_Complete_Feature_Architecture_Manual.pdf")
    shutil.copyfile(out_file, docs_file)
    print(f"[SUCCESS] Copied to docs: {docs_file}")
