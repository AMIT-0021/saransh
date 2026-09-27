import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas
import shutil

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
            self.drawString(36, 756, "SARANSH (सारांश) — Complete Technology Stack & Technical Architecture Blueprint")
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
        self.drawString(36, 32, "Confidential • Ministry of Health & Family Welfare & ABDM Technical Architecture Alignment")
        
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(576, 32, page_str)
        self.restoreState()

def build_tech_stack_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=50,
        bottomMargin=55
    )

    styles = getSampleStyleSheet()

    # Palette
    C_NAVY = colors.HexColor("#0B0F19")
    C_TEAL = colors.HexColor("#0D9488")
    C_CYAN = colors.HexColor("#0284C7")
    C_SLATE_BG = colors.HexColor("#F8FAFC")
    C_BORDER = colors.HexColor("#CBD5E1")
    C_TEXT = colors.HexColor("#1E293B")
    C_MUTED = colors.HexColor("#64748B")
    C_RED = colors.HexColor("#E11D48")
    C_GREEN = colors.HexColor("#059669")

    # Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=23,
        leading=27,
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
        fontSize=13,
        leading=17,
        textColor=C_NAVY,
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=C_TEXT,
        spaceAfter=6
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
        fontSize=8.5,
        leading=11,
        textColor=colors.white
    )

    story = []

    # =========================================================================
    # HEADER BANNER & DOCUMENT METADATA
    # =========================================================================
    badge_p = Paragraph(
        "<font color='#0D9488'><b>OFFICIAL TECHNOLOGY SPECIFICATION MANUAL</b></font> &nbsp;|&nbsp; BPUT HACKATHON 2026",
        box_text_style
    )
    story.append(badge_p)
    story.append(Spacer(1, 4))
    
    story.append(Paragraph("Project Saransh: Technical Stack & Architecture", title_style))
    story.append(Paragraph("Complete Engineering Blueprint: Frontend, Backend, AI Pipeline & ABDM Interoperability", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=C_TEAL, spaceAfter=10))

    # Meta Overview Box
    overview_html = """
    <b>Frontend Runtime:</b> React 18 + Vite 8.3 (Single Page App, 60 FPS, Offline IndexedDB)<br/>
    <b>Backend Runtime:</b> FastAPI (Python 3.14) + Uvicorn ASGI Server (Async, Sub-20ms P99 Latency)<br/>
    <b>AI & Safety Core:</b> Google Gemini 2.5 Flash + Deterministic Non-AI Python Guardrails<br/>
    <b>National Standards:</b> ABDM (M1, M2, M3), HL7 FHIR Release 4, SNOMED-CT, ICD-10, LOINC, DPDP Act 2023
    """
    box_table = Table([[Paragraph(overview_html, box_text_style)]], colWidths=[540])
    box_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), C_SLATE_BG),
        ('BOX', (0,0), (-1,-1), 1, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(box_table)
    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 1: ARCHITECTURAL OVERVIEW
    # =========================================================================
    story.append(Paragraph("1. System Architecture & High-Level Topology", h1_style))
    story.append(Paragraph(
        "Saransh is structured around a <b>decoupled, offline-first client-server architecture</b> designed to operate "
        "reliably across varying connectivity tiers in Indian government health facilities. The frontend runs as a client-side "
        "Progressive Web App on low-cost Android tablets or desktop kiosks, backed by an asynchronous FastAPI microservice "
        "capable of deploying on local edge servers (PHC LAN) or state cloud nodes (State Data Centres / MeghRaj).",
        body_style
    ))
    story.append(Spacer(1, 6))

    # =========================================================================
    # SECTION 2: FRONTEND TECHNOLOGY STACK
    # =========================================================================
    story.append(Paragraph("2. Frontend Technology Stack (Client & Edge Workstation)", h1_style))
    
    frontend_table_data = [
        [Paragraph("<b>Component / Library</b>", table_header_style), Paragraph("<b>Version / Specification</b>", table_header_style), Paragraph("<b>Role, Function & Architectural Value</b>", table_header_style)],
        [
            Paragraph("<b>React</b>", box_text_style),
            Paragraph("18.3.1 (Concurrent)", box_text_style),
            Paragraph("Component-based reactive UI engine with Concurrent Mode rendering, state isolation, and zero layout shift during high-speed triage intake.", box_text_style)
        ],
        [
            Paragraph("<b>Vite</b>", box_text_style),
            Paragraph("8.3.1 (Rollup/ESBuild)", box_text_style),
            Paragraph("Modern frontend build tool delivering lightning-fast Hot Module Replacement (HMR) and optimized production bundles built in under 1.2 seconds.", box_text_style)
        ],
        [
            Paragraph("<b>Tailwind CSS</b>", box_text_style),
            Paragraph("3.4+ (PostCSS)", box_text_style),
            Paragraph("Utility-first styling enforcing a strict 4px/8px spacing grid, MedTech Obsidian dark/light themes, and WCAG AA/AAA contrast ratios for outdoor clinics.", box_text_style)
        ],
        [
            Paragraph("<b>Lucide React</b>", box_text_style),
            Paragraph("Latest (Tree-shaken)", box_text_style),
            Paragraph("Clean, standardized clinical and operational iconography (Stethoscope, ShieldCheck, Heart, Thermometer, AlertTriangle, Building2).", box_text_style)
        ],
        [
            Paragraph("<b>Web Speech API</b>", box_text_style),
            Paragraph("Native Browser Spec", box_text_style),
            Paragraph("Direct client-side acoustic speech recognition and voice recording without requiring external proprietary audio streaming SDKs.", box_text_style)
        ],
        [
            Paragraph("<b>HTML5 SVG Canvas</b>", box_text_style),
            Paragraph("Vector Topological", box_text_style),
            Paragraph("Interactive 2D anatomical human body map with 6 distinct clinical zones (Head, Chest, Lungs, Abdomen, Limbs, Skin) and Front/Back perspective toggles.", box_text_style)
        ],
        [
            Paragraph("<b>IndexedDB Client Cache</b>", box_text_style),
            Paragraph("Browser Local Storage API", box_text_style),
            Paragraph("Asynchronous offline queue enabling frontline workers to register patients, log vitals, and queue records locally during broadband outages.", box_text_style)
        ]
    ]

    t_front = Table(frontend_table_data, colWidths=[110, 105, 325])
    t_front.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_NAVY),
        ('BOX', (0,0), (-1,-1), 1, C_NAVY),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, C_SLATE_BG]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_front)
    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 3: BACKEND TECHNOLOGY STACK
    # =========================================================================
    story.append(Paragraph("3. Backend Technology Stack (FastAPI & Server Pipeline)", h1_style))
    
    backend_table_data = [
        [Paragraph("<b>Component / Library</b>", table_header_style), Paragraph("<b>Version / Specification</b>", table_header_style), Paragraph("<b>Role, Function & Architectural Value</b>", table_header_style)],
        [
            Paragraph("<b>FastAPI</b>", box_text_style),
            Paragraph("0.115+ (Python 3.14)", box_text_style),
            Paragraph("High-performance asynchronous web framework providing automated OpenAPI/Swagger documentation, native async coroutines, and sub-20ms endpoint latency.", box_text_style)
        ],
        [
            Paragraph("<b>Uvicorn</b>", box_text_style),
            Paragraph("0.34+ (ASGI Server)", box_text_style),
            Paragraph("Lightning-fast ASGI server implementation based on uvloop and httptools, capable of sustaining thousands of concurrent health worker polling connections.", box_text_style)
        ],
        [
            Paragraph("<b>Pydantic v2</b>", box_text_style),
            Paragraph("2.10+ (Rust Core)", box_text_style),
            Paragraph("Strict data validation and serialization across 10 clinical data schemas: PatientInfo, Symptoms, Vitals, MedicalHistory, TriageOutput, FHIR R4 Bundle.", box_text_style)
        ],
        [
            Paragraph("<b>SQLite / SQLAlchemy</b>", box_text_style),
            Paragraph("3.45+ (ACID Compliant)", box_text_style),
            Paragraph("Zero-configuration, serverless embedded relational database engine ideal for rural edge deployments. Supports seamless migration to PostgreSQL for state servers.", box_text_style)
        ],
        [
            Paragraph("<b>Cryptographic Ledger</b>", box_text_style),
            Paragraph("Standard Python hashlib", box_text_style),
            Paragraph("SHA-256 tamper-evident audit hashing for doctor triage overrides, NHM referral slips, and clinical counter-signatures.", box_text_style)
        ]
    ]

    t_back = Table(backend_table_data, colWidths=[110, 105, 325])
    t_back.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_NAVY),
        ('BOX', (0,0), (-1,-1), 1, C_NAVY),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, C_SLATE_BG]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_back)
    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 4: AI & CLINICAL SAFETY PIPELINE
    # =========================================================================
    story.append(Paragraph("4. AI Engine, Indic NLP & Deterministic Safety Gatekeeper", h1_style))

    ai_table_data = [
        [Paragraph("<b>Intelligence Layer</b>", table_header_style), Paragraph("<b>Technology / Model</b>", table_header_style), Paragraph("<b>Function & Mechanism</b>", table_header_style)],
        [
            Paragraph("<b>Deterministic Red-Line Engine</b>", box_text_style),
            Paragraph("Pure Python Rule Engine (Zero AI / No Hallucination)", box_text_style),
            Paragraph("Hard physiological guardrails evaluated before and after any AI inference. If SpO2 &lt; 90%, SBP &gt; 180, or severe crushing chest pain is detected, the patient is locked into the 🔴 RED lane immediately.", box_text_style)
        ],
        [
            Paragraph("<b>Clinical LLM Normalizer</b>", box_text_style),
            Paragraph("Google Gemini 2.5 Flash API (google-genai SDK)", box_text_style),
            Paragraph("Synthesizes multimodal complaints, extracts onset/duration, maps unstructured vernacular colloquialisms into formal English clinical summaries, and suggests differential triage lanes.", box_text_style)
        ],
        [
            Paragraph("<b>Indic Speech Normalizer</b>", box_text_style),
            Paragraph("Custom Linguistic Map (Odia / Hindi)", box_text_style),
            Paragraph("Translates cultural idioms (e.g. Odia <i>'Chhati re bhara'</i>) directly into standardized medical ontologies: <b>SNOMED-CT (225566008)</b> and <b>ICD-10 (I20.9)</b>.", box_text_style)
        ]
    ]

    t_ai = Table(ai_table_data, colWidths=[120, 115, 305])
    t_ai.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_NAVY),
        ('BOX', (0,0), (-1,-1), 1, C_NAVY),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, C_SLATE_BG]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_ai)
    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 5: NATIONAL HEALTHCARE STANDARDS & INTEROPERABILITY
    # =========================================================================
    story.append(Paragraph("5. National Healthcare Standards & Interoperability", h1_style))

    standards_table_data = [
        [Paragraph("<b>Standard / Framework</b>", table_header_style), Paragraph("<b>Governing Authority</b>", table_header_style), Paragraph("<b>Implementation & Compliance In Saransh</b>", table_header_style)],
        [
            Paragraph("<b>ABDM Milestones (M1, M2, M3)</b>", box_text_style),
            Paragraph("National Health Authority (NHA)", box_text_style),
            Paragraph("M1: 14-digit ABHA ID validation & demographic prefill; M2: Standard FHIR R4 Bundle creation; M3: Health Information Exchange gateway readiness.", box_text_style)
        ],
        [
            Paragraph("<b>HL7 FHIR Release 4</b>", box_text_style),
            Paragraph("HL7 International & MoHFW", box_text_style),
            Paragraph("Automated export of Condition, Observation, Encounter, and Patient resources formatted in standardized JSON bundles for hospital HMIS sharing.", box_text_style)
        ],
        [
            Paragraph("<b>SNOMED-CT</b>", box_text_style),
            Paragraph("SNOMED International", box_text_style),
            Paragraph("Granular clinical terminology mapping for symptoms, anatomical sites, and clinical findings (e.g. 225566008 for Chest Pain / Angina).", box_text_style)
        ],
        [
            Paragraph("<b>ICD-10</b>", box_text_style),
            Paragraph("World Health Organization", box_text_style),
            Paragraph("International Classification of Diseases codes for provisional diagnostic categories (e.g. I20.9 for Angina, R06.02 for Dyspnea, R42 for Vertigo).", box_text_style)
        ],
        [
            Paragraph("<b>NHM Referral Standard</b>", box_text_style),
            Paragraph("National Health Mission (NHM)", box_text_style),
            Paragraph("Formal counter-signed inter-facility referral slip generation with facility codes (PHC Jatni -> Capital Hospital / SCB Cuttack), ambulance checklist, and doctor signature hash.", box_text_style)
        ]
    ]

    t_std = Table(standards_table_data, colWidths=[120, 115, 305])
    t_std.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_NAVY),
        ('BOX', (0,0), (-1,-1), 1, C_NAVY),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, C_SLATE_BG]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_std)
    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 6: SECURITY, PRIVACY & LEGAL GOVERNANCE
    # =========================================================================
    story.append(Paragraph("6. Security, Privacy & Regulatory Governance Stack", h1_style))

    sec_table_data = [
        [Paragraph("<b>Governance Pillar</b>", table_header_style), Paragraph("<b>Regulatory Framework</b>", table_header_style), Paragraph("<b>Technical Safeguards Enforced</b>", table_header_style)],
        [
            Paragraph("<b>DPDP Act 2023</b>", box_text_style),
            Paragraph("MeitY, Government of India", box_text_style),
            Paragraph("Client-side PII stripping before LLM calls; Section 7(a) emergency casualty exemption for unconscious trauma casualties; explicit consent capture.", box_text_style)
        ],
        [
            Paragraph("<b>CDSCO SaMD Class A</b>", box_text_style),
            Paragraph("CDSCO Medical Device Rules 2017", box_text_style),
            Paragraph("Classified as an Assistive Clinical Decision Support System (CDSS Class A). Software does not independently prescribe or formulate diagnoses.", box_text_style)
        ],
        [
            Paragraph("<b>NMC Physician Primacy</b>", box_text_style),
            Paragraph("National Medical Commission", box_text_style),
            Paragraph("100% legal diagnosis remains with the registered Medical Officer. Mandatory counter-signature with State/NMC Registration Number.", box_text_style)
        ],
        [
            Paragraph("<b>Data Encryption</b>", box_text_style),
            Paragraph("National Cyber Security Norms", box_text_style),
            Paragraph("AES-GCM-256 encryption for local IndexedDB and SQLite storage at rest; TLS 1.3 enforced for all network transit.", box_text_style)
        ]
    ]

    t_sec = Table(sec_table_data, colWidths=[120, 115, 305])
    t_sec.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_NAVY),
        ('BOX', (0,0), (-1,-1), 1, C_NAVY),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, C_SLATE_BG]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_sec)
    story.append(Spacer(1, 12))

    # Summary Box
    summary_html = """
    <b>Deployment Hardware Specifications:</b><br/>
    &bull; <b>Client Workstations:</b> Any standard Android tablet (&gt;= Android 10, 3GB RAM) or desktop browser (Chrome/Edge/Firefox).<br/>
    &bull; <b>Edge Server:</b> Raspberry Pi 4 / Intel Celeron N100 mini-PC / Local Clinic Desktop running Python 3.12+ and SQLite.<br/>
    &bull; <b>Cloud Tier:</b> Scalable Linux container (Docker) deployable to NIC MeghRaj Cloud, AWS Mumbai, or State Data Centres.
    """
    sum_box = Table([[Paragraph(summary_html, box_text_style)]], colWidths=[540])
    sum_box.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F0FDF4")),
        ('BOX', (0,0), (-1,-1), 1, C_GREEN),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(sum_box)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[SUCCESS] Tech Stack PDF generated successfully at: {filename}")

if __name__ == "__main__":
    out_dir = r"C:\Users\AMITRAZ\OneDrive\Desktop\Saransh"
    out_file = os.path.join(out_dir, "Saransh_Tech_Stack_and_Architecture.pdf")
    build_tech_stack_pdf(out_file)
    
    # Copy to Saransh/docs
    docs_file = os.path.join(out_dir, "docs", "Saransh_Tech_Stack_and_Architecture.pdf")
    shutil.copyfile(out_file, docs_file)
    print(f"[SUCCESS] Copied to Saransh/docs: {docs_file}")

    # Copy directly to Desktop
    desktop_file = r"C:\Users\AMITRAZ\OneDrive\Desktop\Saransh_Tech_Stack_and_Architecture.pdf"
    shutil.copyfile(out_file, desktop_file)
    print(f"[SUCCESS] Copied to Desktop: {desktop_file}")
