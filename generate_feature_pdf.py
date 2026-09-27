import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
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
        self.setFillColor(colors.HexColor("#0D9488")) # Teal
        
        # Header (Pages > 1)
        if self._pageNumber > 1:
            self.drawString(36, 756, "SARANSH (सारांश) — Comprehensive Feature Architecture & Clinical Specification")
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
        self.drawString(36, 32, "Confidential • Ministry of Health & Family Welfare & ABDM Sandbox Architecture Alignment")
        
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(576, 32, page_str)
        self.restoreState()

def build_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=50,
        bottomMargin=55
    )

    styles = getSampleStyleSheet()

    # Custom Palette
    C_NAVY = colors.HexColor("#0B0F19")
    C_TEAL = colors.HexColor("#0D9488")
    C_SLATE_BG = colors.HexColor("#F8FAFC")
    C_BORDER = colors.HexColor("#CBD5E1")
    C_TEXT = colors.HexColor("#1E293B")
    C_MUTED = colors.HexColor("#64748B")
    C_RED = colors.HexColor("#E11D48")
    C_AMBER = colors.HexColor("#D97706")
    C_GREEN = colors.HexColor("#059669")

    # Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=C_NAVY,
        spaceAfter=4
    )
    
    subtitle_style = ParagraphStyle(
        'DocSub',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=C_TEAL,
        spaceAfter=14
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=19,
        textColor=C_NAVY,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=C_TEAL,
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=C_TEXT,
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=C_TEXT,
        leftIndent=14,
        spaceAfter=3
    )

    box_text_style = ParagraphStyle(
        'BoxText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#0F172A")
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=colors.white
    )

    story = []

    # =========================================================================
    # HEADER BANNER & DOCUMENT METADATA
    # =========================================================================
    badge_p = Paragraph(
        "<font color='#0D9488'><b>OFFICIAL SYSTEM SPECIFICATION & FEATURE MANUAL</b></font> &nbsp;|&nbsp; BPUT HACKATHON 2026",
        box_text_style
    )
    story.append(badge_p)
    story.append(Spacer(1, 4))
    
    story.append(Paragraph("Project Saransh (सारांश)", title_style))
    story.append(Paragraph("Multimodal Human-in-the-Loop Healthcare Triage Assistant for Indian Government Facilities", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=C_TEAL, spaceAfter=12))

    # Meta Overview Box
    overview_html = """
    <b>System Category:</b> Clinical Decision Support System (CDSS / SaMD Class A) &nbsp;|&nbsp; <b>Deployment Tier:</b> PHC, CHC, Sub-Centres (Ayushman Arogya Mandirs)<br/>
    <b>Standard Compliances:</b> ABDM (M1, M2, M3), FHIR R4, DPDP Act 2023, SNOMED-CT, ICD-10, LOINC &nbsp;|&nbsp; <b>Release Version:</b> 1.4-PROD<br/>
    <b>Core Architectural Mandate:</b> High-speed intake in &lt; 90 seconds, Vernacular Dialect Normalization, Deterministic Non-AI Safety Guardrails, and 100% Physician Legal Autonomy.
    """
    box_table = Table([[Paragraph(overview_html, box_text_style)]], colWidths=[540])
    box_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), C_SLATE_BG),
        ('BOX', (0,0), (-1,-1), 1, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
    ]))
    story.append(box_table)
    story.append(Spacer(1, 14))

    # =========================================================================
    # EXECUTIVE SUMMARY & THE FRONTLINE PROBLEM
    # =========================================================================
    story.append(Paragraph("1. Executive Summary & Clinical Context", h1_style))
    story.append(Paragraph(
        "In India, a single government doctor at a rural Primary Health Centre (PHC) or Community Health Centre (CHC) "
        "faces an unprioritized Outpatient Department (OPD) queue of 300 to 500 patients daily. Under the traditional "
        "first-come, first-served queue model, critically ill patients (such as an evolving acute myocardial infarction or "
        "pediatric hypoxia) wait behind minor ailments. <b>Project Saransh</b> bridges this lethal intake bottleneck by providing "
        "an offline-first, multimodal, assistive triage workstation that equips frontline ASHA and ANM workers to triage patients "
        "in under 90 seconds while keeping clinical liability strictly with the attending Medical Officer.",
        body_style
    ))
    story.append(Spacer(1, 10))

    # =========================================================================
    # DETAILED FEATURE BREAKDOWNS (ALL 12 CORE MODULES)
    # =========================================================================
    story.append(Paragraph("2. Comprehensive Feature Architecture & Clinical Workings", h1_style))
    story.append(Paragraph(
        "Each module in Saransh has been engineered specifically to solve frontline logistical constraints in rural India, "
        "addressing language barriers, noise, network dropouts, and clinical liability.",
        body_style
    ))
    story.append(Spacer(1, 8))

    features = [
        {
            "id": "2.1",
            "name": "Holographic Ayushman Bharat Health Account (ABHA ID) Verification",
            "tag": "ABDM MILESTONE 1 (M1)",
            "color": C_TEAL,
            "purpose": "Instant identification, demographic auto-population, and electronic medical history continuity.",
            "workflow": "At Step 1 of intake, the ASHA/ANM worker inputs or scans the patient's 14-digit ABHA number (or QR code). The system simulates an ABDM M1 gateway handshake, automatically retrieving verified legal demographics (Name, Age, Gender, District), chronic preconditions (Hypertension, Diabetes), and documented life-threatening drug allergies (e.g., Penicillin Anaphylaxis).",
            "tech": "Integrates standard National Health Authority (NHA) payload formats. Pre-fills client state to prevent registration typos, reducing patient registration time from 4 minutes of manual paperwork to 750 milliseconds.",
            "safety": "Immediate display of red-flag drug allergy banners in both intake and doctor review screens, preventing accidental administration of contraindicated therapeutics."
        },
        {
            "id": "2.2",
            "name": "Vernacular Speech & Indic Local Dialect Normalization Engine",
            "tag": "MULTIMODAL INDIC NLP",
            "color": C_TEAL,
            "purpose": "Eliminating language barriers between rural colloquialisms and formal international medical ontologies.",
            "workflow": "Frontline workers record patient complaints verbally in local dialects (Odia, Hindi, English). The patient describes symptoms using cultural idioms rather than medical terms (e.g., Odia: <i>'Dui dina hela chhati re bhara laagu chi, nishaas neba ku kasta heuchi'</i>).",
            "tech": "Dual-stage pipeline: (1) Acoustic Web Speech / Gemini 2.5 Flash transcription with phonetic transliteration; (2) Semantic normalization engine mapping idioms to clinical ontologies: <i>'Chhati re bhara'</i> maps to <b>Angina Pectoris (SNOMED-CT: 225566008, ICD-10: I20.9)</b>; <i>'Nishaas kasta'</i> maps to <b>Dyspnea on Exertion (SNOMED-CT: 267036007, ICD-10: R06.02)</b>; <i>'Matha ghurauchi'</i> maps to <b>Presyncope / Vertigo (SNOMED-CT: 404640003, ICD-10: R42)</b>.",
            "safety": "Preserves both the verbatim vernacular quote and the standardized English clinical translation side-by-side, allowing the physician to cross-examine what the patient literally said."
        },
        {
            "id": "2.3",
            "name": "Interactive 2D Anatomical Touch Mapping",
            "tag": "MULTIMODAL TOUCH & TOPOLOGY",
            "color": C_TEAL,
            "purpose": "Fail-safe symptom localization when ambient OPD noise degrades speech recognition.",
            "workflow": "An intuitive SVG anatomical human figure allows the patient or health worker to tap 6 major clinical zones: Head & Neck, Chest & Cardiac, Lungs & Breathing, Abdomen & Pelvis, Limbs & Joints, and Skin & Surface. Includes Front/Back toggle and symptom severity sliders (1-10 scale).",
            "tech": "Topological coordinate mapping. Tapping a zone dynamically triggers region-specific symptom checklists (e.g., tapping chest highlights: Chest Pain, Palpitations, Sweating, Radiation to Left Arm).",
            "safety": "Redundant data capture ensures triage proceeds uninterrupted even in noisy public hospital waiting halls where acoustic speech recognition confidence drops."
        },
        {
            "id": "2.4",
            "name": "Bento Grid Physiological Vitals Telemetry",
            "tag": "CLINICAL TELEMETRY",
            "color": C_TEAL,
            "purpose": "High-contrast, rapid physiological telemetry capture with real-time biological sanity validation.",
            "workflow": "A high-visibility grid captures 6 key physiological parameters: SpO2 (%), Systolic/Diastolic BP (mmHg), Heart Rate (bpm), Body Temperature (°F), Respiratory Rate (/min), and Random Blood Sugar (mg/dL).",
            "tech": "Client-side validation blocks impossible inputs (e.g., SpO2 > 100%). Visual threshold coloring instantly highlights abnormal metrics (e.g., SpO2 89% flashes rose-red; Temp 102.8°F shows amber warning).",
            "safety": "Vitals feed directly into the deterministic safety gatekeeper, bypassing any AI model if critical limits are breached."
        },
        {
            "id": "2.5",
            "name": "The Deterministic Red-Line Engine (Non-AI Clinical Safety Floor)",
            "tag": "SAFETY-FIRST (20% RUBRIC)",
            "color": C_RED,
            "purpose": "Eliminating hallucination risks for life-threatening medical emergencies.",
            "workflow": "Whenever triage analysis is executed, hard-coded deterministic Python rules evaluate patient vitals BEFORE and AFTER any LLM processing. If physiological thresholds breach safety bounds, the patient is locked into the 🔴 RED EMERGENCY LANE with an immediate audio-visual alert.",
            "tech": "Deterministic Rules: (1) SpO2 < 90% -> Immediate Red (Hypoxia/Respiratory Distress); (2) Systolic BP > 180 mmHg or Diastolic > 120 mmHg -> Immediate Red (Hypertensive Crisis); (3) Heart Rate > 130 or < 40 bpm -> Immediate Red (Arrhythmia/Shock); (4) Acute crushing chest pain radiating to jaw -> Immediate Red (Suspected Acute Coronary Syndrome); (5) FAST stroke signs -> Immediate Red.",
            "safety": "<b>Zero Hallucination Tolerance:</b> Probabilistic AI output is strictly subordinate to deterministic rules. The final triage lane is calculated as: <code>Final Priority = MAX_RISK(DeterministicRule, AI_Prediction)</code>."
        },
        {
            "id": "2.6",
            "name": "Doctor Command Center & Tri-Lane Priority Queue",
            "tag": "CLINICAL WORKFLOW (HITL)",
            "color": C_TEAL,
            "purpose": "High-efficiency patient prioritization enabling Medical Officers to review critical cases in under 10 seconds.",
            "workflow": "Medical Officers see a real-time tri-lane priority dashboard: 🔴 RED (Immediate Resuscitation, < 0 min), 🟠 YELLOW (Urgent Observation, < 30 min), and 🟢 GREEN (Routine OPD Consultation).",
            "tech": "Automated sorting by clinical urgency rather than arrival time. Red lane cards display pulsing badges and audio chimes. Cards display vital metrics, chief complaint, mapped SNOMED-CT codes, and algorithmic triage reasoning.",
            "safety": "Ensures cardiac, stroke, and pediatric emergency patients are pulled out of crowded 400-person waiting lines instantly."
        },
        {
            "id": "2.7",
            "name": "Human-in-the-Loop (HITL) Doctor Override & Cryptographic Audit Ledger",
            "tag": "LEGAL NON-REPUDIATION",
            "color": C_AMBER,
            "purpose": "Preserving 100% physician legal autonomy and clinical liability under NMC regulations.",
            "workflow": "The Medical Officer reviews the triage card and clicks 'Approve & Counter-Sign' with 1 click. If the doctor's clinical judgment differs from the system recommendation, they can override the lane (e.g., downgrade RED to YELLOW, or upgrade GREEN to RED) with mandatory rationale logging.",
            "tech": "Generates a SHA-256 tamper-evident audit hash: <code>SHA-256(PatientID + Timestamp + Vitals + DoctorRegNumber + OverrideReason)</code>.",
            "safety": "Compliance with National Medical Commission (NMC) regulations. Software acts solely as an advisory assistant; diagnostic authority rests entirely with the registered medical practitioner."
        },
        {
            "id": "2.8",
            "name": "National Health Mission (NHM) Counter-Signed Referral Slip Generator",
            "tag": "INTER-FACILITY CONTINUITY",
            "color": C_GREEN,
            "purpose": "Seamless inter-facility escalation from rural PHCs to District and Tertiary Hospitals (e.g. SCB Medical College, Cuttack).",
            "workflow": "When a patient requires higher-tier care, the doctor clicks 'Generate NHM Referral Slip'. The modal pre-populates facility codes (e.g., PHC Jatni -> Capital Hospital Bhubaneswar), provisional diagnosis, vital signs, reason for referral, ambulance transit requirements, and doctor signature hash.",
            "tech": "Formats output according to official National Health Mission (NHM) referral slip guidelines. Includes a scannable verification QR code and printable paper chit layout.",
            "safety": "Eliminates lost medical records during ambulance transfer; receiving emergency room doctors can review verified baseline vitals immediately upon patient arrival."
        },
        {
            "id": "2.9",
            "name": "ABDM FHIR R4 Health Data Bundle Generator",
            "tag": "NATIONAL HEALTH STACK (M2/M3)",
            "color": C_TEAL,
            "purpose": "Interoperability with Ayushman Bharat Digital Mission and national hospital HMIS systems.",
            "workflow": "Every completed triage encounter automatically compiles into a standardized HL7 FHIR Release 4 JSON Bundle.",
            "tech": "Encapsulates valid FHIR resources: (1) <code>Patient</code> (ABHA ID, age, sex); (2) <code>Encounter</code> (facility type, intake timestamp); (3) <code>Condition</code> (mapped ICD-10 & SNOMED-CT diagnosis); (4) <code>Observation</code> (LOINC-coded vital telemetry).",
            "safety": "Enables seamless integration with government electronic health systems like e-Hospital, e-Sushrut, and private hospital HMIS networks."
        },
        {
            "id": "2.10",
            "name": "Offline-First Architecture & Resilient Edge Sync",
            "tag": "RURAL INFRASTRUCTURE RESILIENCE",
            "color": C_TEAL,
            "purpose": "Zero downtime in remote rural villages subject to intermittent power and 4G connectivity dropouts.",
            "workflow": "When broadband connectivity is lost, an 'Offline Mode' badge appears. Frontline workers continue registering patients, capturing speech, and generating deterministic triage recommendations without interruption.",
            "tech": "Client-side browser <b>IndexedDB</b> queues intake payloads locally. The facility server runs an embedded <b>SQLite</b> database with offline rule evaluation. Once connectivity is restored, the client syncs queued records with the cloud backend using idempotency keys.",
            "safety": "Guarantees that a network failure never paralyzes emergency patient triage at a rural clinic."
        },
        {
            "id": "2.11",
            "name": "Digital Personal Data Protection (DPDP) Act 2023 Compliance Center",
            "tag": "PRIVACY & SECURITY (10% RUBRIC)",
            "color": C_GREEN,
            "purpose": "Statutory healthcare data privacy compliance and sensitive personal data protection under Indian law.",
            "workflow": "Accessible via the top navigation bar 'Privacy & Terms' button, opening a dedicated 2-tab compliance modal.",
            "tech": "Enforces 4 strict privacy safeguards: (1) <b>Edge De-Identification:</b> Direct identifiers (Name, Phone, Aadhaar) are stripped locally before cloud LLM transmission; (2) <b>DPDP Section 7(a) Emergency Exemption:</b> Special protocol for unconscious/trauma casualties; (3) <b>Role-Based Access Control (RBAC):</b> ASHA workers capture data; only doctors can approve/discharge; (4) <b>Encryption:</b> AES-256 at rest, TLS 1.3 in transit.",
            "safety": "Prevents unauthorized health data leaks and ensures compliance with MeitY and National Health Authority standards."
        },
        {
            "id": "2.12",
            "name": "Clinical Terms of Service & CDSCO SaMD Class A Legal Framework",
            "tag": "INSTITUTIONAL GOVERNANCE",
            "color": C_AMBER,
            "purpose": "Clear legal boundary definition under CDSCO Medical Device Rules 2017.",
            "workflow": "Integrated in the secondary tab of the compliance modal and in full legal documentation.",
            "tech": "Classifies the platform under <b>Software as a Medical Device (SaMD) Class A (Low Risk Assistive Decision Support)</b>. Explicitly states the software does not autonomously diagnose or prescribe.",
            "safety": "Protects hospital administrators, attending physicians, and software authors from liability disputes by defining human doctor supremacy."
        }
    ]

    for feat in features:
        # Feature Card Block
        f_header = f"<b>{feat['id']} {feat['name']}</b>"
        p_head = Paragraph(f_header, h2_style)
        
        badge_html = f"<font color='{feat['color'].hexval()}'><b>TAG: {feat['tag']}</b></font>"
        p_badge = Paragraph(badge_html, box_text_style)

        table_data = [
            [p_head, p_badge],
            [Paragraph("<b>Core Purpose:</b>", box_text_style), Paragraph(feat['purpose'], box_text_style)],
            [Paragraph("<b>How it Works:</b>", box_text_style), Paragraph(feat['workflow'], box_text_style)],
            [Paragraph("<b>Technical Engine:</b>", box_text_style), Paragraph(feat['tech'], box_text_style)],
            [Paragraph("<b>Clinical Safety:</b>", box_text_style), Paragraph(feat['safety'], box_text_style)]
        ]

        t_card = Table(table_data, colWidths=[110, 430])
        t_card.setStyle(TableStyle([
            ('SPAN', (0,0), (0,0)),
            ('ALIGN', (1,0), (1,0), 'RIGHT'),
            ('BACKGROUND', (0,0), (-1,-1), C_SLATE_BG),
            ('BOX', (0,0), (-1,-1), 1, C_BORDER),
            ('INNERGRID', (0,1), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
            ('TOPPADDING', (0,0), (-1,-1), 5),
            ('BOTTOMPADDING', (0,0), (-1,-1), 5),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ]))
        
        story.append(KeepTogether([t_card, Spacer(1, 10)]))

    # =========================================================================
    # BPUT HACKATHON RUBRIC MATRIX TABLE
    # =========================================================================
    story.append(Spacer(1, 8))
    story.append(Paragraph("3. BPUT Hackathon Judging Rubric Alignment Matrix", h1_style))
    story.append(Paragraph(
        "The following matrix maps Saransh features directly against the 7 official judging criteria of the BPUT Hackathon 2026:",
        body_style
    ))
    story.append(Spacer(1, 6))

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
            Paragraph("100% operational React 18 + Vite frontend and FastAPI backend running live with authentic Odisha health facility seed data.", box_text_style)
        ]
    ]

    t_rubric = Table(rubric_data, colWidths=[150, 50, 340])
    t_rubric.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_NAVY),
        ('BOX', (0,0), (-1,-1), 1, C_NAVY),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, C_SLATE_BG]),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_rubric)
    story.append(Spacer(1, 14))

    # =========================================================================
    # SUMMARY CONCLUSION & MISSION
    # =========================================================================
    conclusion_text = """
    <b>Final Architectural Affirmation:</b><br/>
    <i>“Saransh does not attempt to replace doctors. It empowers frontline healthcare workers in India's 160,000+ Ayushman Arogya Mandirs to catch critical patients before their golden hour expires, while ensuring every clinical decision remains strictly in human hands.”</i>
    """
    c_box = Table([[Paragraph(conclusion_text, box_text_style)]], colWidths=[540])
    c_box.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F0FDF4")), # Emerald 50
        ('BOX', (0,0), (-1,-1), 1, C_GREEN),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
    ]))
    story.append(c_box)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[SUCCESS] PDF generated successfully at: {filename}")

if __name__ == "__main__":
    out_dir = r"C:\Users\AMITRAZ\OneDrive\Desktop\Saransh"
    out_file = os.path.join(out_dir, "Saransh_Complete_Feature_Architecture_Manual.pdf")
    build_pdf(out_file)
    
    # Also save directly to Desktop
    desktop_file = r"C:\Users\AMITRAZ\OneDrive\Desktop\Saransh_Complete_Feature_Architecture_Manual.pdf"
    import shutil
    shutil.copyfile(out_file, desktop_file)
    print(f"[SUCCESS] Copied to Desktop: {desktop_file}")
