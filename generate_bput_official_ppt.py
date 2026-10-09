import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_official_bput_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Executive MedTech Color Palette (Clean Obsidian Navy & Medical Teal)
    C_BG = RGBColor(11, 15, 25)            # Deep Slate Navy #0B0F19
    C_CARD = RGBColor(19, 26, 42)          # Elevated Card #131A2A
    C_CARD_HOVER = RGBColor(26, 36, 56)    # Interactive Card #1A2438
    C_TEAL = RGBColor(20, 184, 166)        # Electric Medical Teal #14B8A6
    C_TEAL_DARK = RGBColor(13, 148, 136)   # Deep Teal #0D9488
    C_CYAN = RGBColor(56, 189, 248)        # Sky Cyan #38BDF8
    C_WHITE = RGBColor(255, 255, 255)
    C_OFFWHITE = RGBColor(241, 245, 249)   # Slate 100
    C_MUTED = RGBColor(148, 163, 184)      # Slate 400
    C_BORDER = RGBColor(39, 50, 75)        # Slate 700 Border
    
    # Priority & Severity Colors
    C_RED = RGBColor(244, 63, 94)          # Crimson Emergency
    C_AMBER = RGBColor(245, 158, 11)       # Amber Urgent
    C_GREEN = RGBColor(16, 185, 129)       # Emerald Routine

    def add_base(slide, slide_num, title_text, subtitle_text=""):
        # Fullscreen Dark Background
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = C_BG
        bg.line.fill.background()

        # Top Teal Accent Strip
        strip = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, Inches(0.08))
        strip.fill.solid()
        strip.fill.fore_color.rgb = C_TEAL
        strip.line.fill.background()

        # Top Header Pill (BPUT Track Tag)
        tag_w = Inches(4.8)
        tag_pill = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.32), tag_w, Inches(0.32))
        tag_pill.fill.solid()
        tag_pill.fill.fore_color.rgb = RGBColor(17, 30, 48)
        tag_pill.line.color.rgb = C_TEAL_DARK
        tag_pill.line.width = Pt(1)
        tf_tag = tag_pill.text_frame
        p_t = tf_tag.paragraphs[0]
        p_t.text = "BPUT HACKATHON • PROBLEM STATEMENT 1"
        p_t.alignment = PP_ALIGN.CENTER
        p_t.font.size = Pt(9.5)
        p_t.font.bold = True
        p_t.font.color.rgb = C_CYAN
        p_t.font.name = "Arial"

        # Right-aligned Slide Number Pill
        num_pill = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(12.0), Inches(0.32), Inches(0.55), Inches(0.32))
        num_pill.fill.solid()
        num_pill.fill.fore_color.rgb = RGBColor(17, 30, 48)
        num_pill.line.color.rgb = C_BORDER
        num_pill.line.width = Pt(1)
        tf_num = num_pill.text_frame
        p_n = tf_num.paragraphs[0]
        p_n.text = str(slide_num)
        p_n.alignment = PP_ALIGN.CENTER
        p_n.font.size = Pt(10)
        p_n.font.bold = True
        p_n.font.color.rgb = C_WHITE
        p_n.font.name = "Arial"

        # Main Slide Title
        t_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.68), Inches(11.733), Inches(0.65))
        tf = t_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title_text
        p.font.size = Pt(22)
        p.font.bold = True
        p.font.color.rgb = C_WHITE
        p.font.name = "Arial"

        if subtitle_text:
            p_sub = tf.add_paragraph()
            p_sub.text = subtitle_text
            p_sub.font.size = Pt(11)
            p_sub.font.color.rgb = C_CYAN
            p_sub.font.name = "Arial"
            p_sub.space_before = Pt(3)

        # Subtle Horizontal Separator Line
        line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.4), Inches(11.733), Inches(0.015))
        line.fill.solid()
        line.fill.fore_color.rgb = C_BORDER
        line.line.fill.background()

        # Official Standard Footer
        f_box = slide.shapes.add_textbox(Inches(0.8), Inches(7.08), Inches(11.733), Inches(0.35))
        tf_f = f_box.text_frame
        p_f = tf_f.paragraphs[0]
        p_f.text = "Saransh (सारांश)  |  Team: CODEX  |  Team ID: BH26PS07T060  |  Educational prototype — advisory, non-diagnostic"
        p_f.font.size = Pt(9)
        p_f.font.color.rgb = C_MUTED
        p_f.font.name = "Arial"

    # =========================================================================
    # SLIDE 1: TITLE HERO SLIDE
    # =========================================================================
    slide1 = prs.slides.add_slide(blank_layout)
    bg1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = C_BG
    bg1.line.fill.background()

    # Top Glow Bar
    top_bar = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, Inches(0.12))
    top_bar.fill.solid()
    top_bar.fill.fore_color.rgb = C_TEAL
    top_bar.line.fill.background()

    # Problem Statement Badge
    b1 = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.85), Inches(6.5), Inches(0.42))
    b1.fill.solid()
    b1.fill.fore_color.rgb = RGBColor(17, 30, 48)
    b1.line.color.rgb = C_TEAL
    b1.line.width = Pt(1.5)
    tf_b1 = b1.text_frame
    pb1 = tf_b1.paragraphs[0]
    pb1.text = "BPUT HACKATHON 2026 • PROBLEM STATEMENT 1"
    pb1.alignment = PP_ALIGN.CENTER
    pb1.font.size = Pt(11)
    pb1.font.bold = True
    pb1.font.color.rgb = C_CYAN
    pb1.font.name = "Arial"

    # Hero Main Card
    main_hero = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.45), Inches(11.733), Inches(3.6))
    main_hero.fill.solid()
    main_hero.fill.fore_color.rgb = C_CARD
    main_hero.line.color.rgb = C_BORDER
    main_hero.line.width = Pt(1.5)
    tf_mh = main_hero.text_frame
    tf_mh.word_wrap = True

    p_t1 = tf_mh.paragraphs[0]
    p_t1.text = "Saransh (सारांश)"
    p_t1.font.size = Pt(36)
    p_t1.font.bold = True
    p_t1.font.color.rgb = C_WHITE
    p_t1.font.name = "Arial"

    p_sub1 = tf_mh.add_paragraph()
    p_sub1.text = "Multimodal Healthcare Triage Assistant for Government and Institutional Health Facilities"
    p_sub1.font.size = Pt(17)
    p_sub1.font.bold = True
    p_sub1.font.color.rgb = C_TEAL
    p_sub1.space_before = Pt(4)

    p_desc1 = tf_mh.add_paragraph()
    p_desc1.text = "Human-in-the-loop, non-diagnostic triage support transforming chaotic multilingual waiting rooms into structured, prioritised clinical lanes."
    p_desc1.font.size = Pt(12)
    p_desc1.font.color.rgb = C_OFFWHITE
    p_desc1.space_before = Pt(8)

    p_meta1 = tf_mh.add_paragraph()
    p_meta1.text = "Team: CODEX   |   Team ID: BH26PS07T060   |   Educational prototype for triage support only. Synthetic data only."
    p_meta1.font.size = Pt(11)
    p_meta1.font.bold = True
    p_meta1.font.color.rgb = C_CYAN
    p_meta1.space_before = Pt(12)

    # 4 Bottom Bento Features on Title Slide
    title_pillars = [
        ("🛡️ Rules Decide, LLM Summarises", "Urgency flags come from transparent clinical rules; AI never diagnoses."),
        ("🗣️ Vernacular + Voice First", "Odia, Hindi & regional speech in; standardized clinical English note out."),
        ("🔍 Missing-Info Engine", "Detects absent clinical history and prompts frontline staff with follow-ups."),
        ("🏥 One Tool, Many Settings", "PHC, CHC, campus fever bay, maternal check-in, and rural health camps.")
    ]
    for i, (tp_title, tp_desc) in enumerate(title_pillars):
        x = Inches(0.8 + i * 2.98)
        card = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(5.25), Inches(2.8), Inches(1.65))
        card.fill.solid()
        card.fill.fore_color.rgb = C_CARD
        card.line.color.rgb = C_BORDER
        card.line.width = Pt(1)
        tf_c = card.text_frame
        tf_c.word_wrap = True
        pt = tf_c.paragraphs[0]
        pt.text = tp_title
        pt.font.size = Pt(11)
        pt.font.bold = True
        pt.font.color.rgb = C_WHITE
        pd = tf_c.add_paragraph()
        pd.text = tp_desc
        pd.font.size = Pt(9.5)
        pd.font.color.rgb = C_MUTED
        pd.space_before = Pt(4)

    # =========================================================================
    # SLIDE 2: IDEATION
    # =========================================================================
    slide2 = prs.slides.add_slide(blank_layout)
    add_base(slide2, 2, "Ideation", "A safety-first assistant that turns messy symptoms, voice and reports into one structured, prioritised note for a qualified reviewer.")

    # Left: Core Pillars (4 Cards)
    left_tenets = [
        ("Rules decide, LLM summarises", "Urgency flags come from transparent deterministic rules; AI never diagnoses or prescribes.", C_TEAL),
        ("Vernacular + voice first", "Spoken Hindi, Odia and other regional languages in; standardized clinical English note out.", C_CYAN),
        ("Missing-info engine", "Actively finds what is absent from intake and prompts the frontline worker with targeted follow-ups.", C_GREEN),
        ("One tool, many settings", "Scalable profiles: General OPD queue, factory clinic, campus fever bay, maternal care, and mobile health camps.", C_AMBER)
    ]
    for i, (t_h, t_d, col) in enumerate(left_tenets):
        y = Inches(1.6 + i * 1.3)
        c = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), y, Inches(5.7), Inches(1.18))
        c.fill.solid()
        c.fill.fore_color.rgb = C_CARD
        c.line.color.rgb = col
        c.line.width = Pt(1.5)
        tfc = c.text_frame
        tfc.word_wrap = True
        p1 = tfc.paragraphs[0]
        p1.text = f"• {t_h}"
        p1.font.size = Pt(12)
        p1.font.bold = True
        p1.font.color.rgb = col
        p2 = tfc.add_paragraph()
        p2.text = t_d
        p2.font.size = Pt(10)
        p2.font.color.rgb = C_OFFWHITE
        p2.space_before = Pt(2)

    # Right: Existing Models Fall Short & Our Strategic Gap
    r_card = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.6), Inches(5.733), Inches(5.1))
    r_card.fill.solid()
    r_card.fill.fore_color.rgb = C_CARD
    r_card.line.color.rgb = C_BORDER
    r_card.line.width = Pt(1.5)
    tfr = r_card.text_frame
    tfr.word_wrap = True

    pr_t = tfr.paragraphs[0]
    pr_t.text = "⚠️ Why Existing Models Fall Short:"
    pr_t.font.size = Pt(14)
    pr_t.font.bold = True
    pr_t.font.color.rgb = C_RED

    fall_shorts = [
        ("Symptom checkers:", "Diagnostic-first, English-only, high hallucination risk, consumer-facing rather than clinical staff."),
        ("Telemedicine platforms:", "Facilitates video consults, but lacks structured frontline intake and emergency queue sorting."),
        ("Point-solution Imaging AI:", "Narrow focus on radiology images; ignores multimodal vernacular intake and referral continuity."),
        ("HMIS / Heavy EHRs:", "Clunky manual typing, complex forms, negligible regional voice NLP, fails on low-bandwidth rural devices.")
    ]
    for fh, fd in fall_shorts:
        p = tfr.add_paragraph()
        p.text = f"• {fh} {fd}"
        p.font.size = Pt(10)
        p.font.color.rgb = C_OFFWHITE
        p.space_before = Pt(4)

    pr_gap = tfr.add_paragraph()
    pr_gap.text = "🎯 Our Strategic Gap & Breakthrough:"
    pr_gap.font.size = Pt(14)
    pr_gap.font.bold = True
    pr_gap.font.color.rgb = C_TEAL
    pr_gap.space_before = Pt(10)

    p_gap_b = tfr.add_paragraph()
    p_gap_b.text = "A lightweight, reviewer-facing clinical triage layer placed directly in front of existing government hospital workflows — bridging vernacular patients and busy medical officers without altering existing backend systems."
    p_gap_b.font.size = Pt(10.5)
    p_gap_b.font.color.rgb = C_CYAN
    p_gap_b.space_before = Pt(3)

    # =========================================================================
    # SLIDE 3: PROBLEM RELEVANCE
    # =========================================================================
    slide3 = prs.slides.add_slide(blank_layout)
    add_base(slide3, 3, "Problem Relevance", "Directly matches the government brief across PHCs, CHCs, health camps, industrial clinics and campus centres.")

    # 6 Grid Cards of Real-World Pain Points
    relevance_points = [
        ("🚨 1. Overcrowded OPDs & Camps", "200–400 patients arrive during crowded morning hours; doctors get under 90 seconds per patient with zero structured intake.", C_RED),
        ("🗣️ 2. Language Diversity", "Patients speak regional languages (Odia, Hindi dialects), while medical documentation and clinical notes are standardized in English.", C_AMBER),
        ("📑 3. Paper Reports & Photos", "Reports are crumpled paper or camera photos; critical numeric parameters, previous trends, and timelines get lost in the rush.", C_CYAN),
        ("🏥 4. Specialist Scarcity", "Rural PHCs and camps lack specialists; handoff transfer notes are weak or scribbled on scrap paper without baseline vitals.", C_TEAL),
        ("⏳ 5. Unprioritized First-Come Queues", "Urgent emergencies (silent hypoxia SpO2 < 90%, crushing chest pain) wait in the exact same line as mild routine check-ins.", C_RED),
        ("📶 6. Uneven Digital Maturity", "Rural facilities face low bandwidth, shared mobile devices, and lack formal EHR hardware at frontline stations.", C_GREEN)
    ]
    for i, (title, body, col) in enumerate(relevance_points):
        col_idx = i % 2
        row_idx = i // 2
        x = Inches(0.8 + col_idx * 5.95)
        y = Inches(1.6 + row_idx * 1.55)
        card = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(5.75), Inches(1.42))
        card.fill.solid()
        card.fill.fore_color.rgb = C_CARD
        card.line.color.rgb = col
        card.line.width = Pt(1.5)
        tf = card.text_frame
        tf.word_wrap = True
        pt = tf.paragraphs[0]
        pt.text = title
        pt.font.size = Pt(12)
        pt.font.bold = True
        pt.font.color.rgb = col
        pb = tf.add_paragraph()
        pb.text = body
        pb.font.size = Pt(9.5)
        pb.font.color.rgb = C_OFFWHITE
        pb.space_before = Pt(3)

    # Bottom Match Banner
    banner = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.35), Inches(11.733), Inches(0.6))
    banner.fill.solid()
    banner.fill.fore_color.rgb = RGBColor(17, 30, 48)
    banner.line.color.rgb = C_TEAL
    banner.line.width = Pt(1)
    tf_b = banner.text_frame
    pb = tf_b.paragraphs[0]
    pb.text = "🎯 The Essential Gap: Structured, language-ready, prioritised information reaching the right healthcare professional in time."
    pb.font.size = Pt(11)
    pb.font.bold = True
    pb.font.color.rgb = C_CYAN
    pb.alignment = PP_ALIGN.CENTER

    # =========================================================================
    # SLIDE 4: SOLUTION
    # =========================================================================
    slide4 = prs.slides.add_slide(blank_layout)
    add_base(slide4, 4, "Solution", "A 4-step pipeline turning multimodal frontline inputs into structured, reviewer-facing priority intelligence.")

    # 4 Sequential Steps (Horizontally Arranged)
    steps = [
        ("1. Collect", "Patient or worker enters symptoms by text or voice in English, Hindi, or Odia.\n\n• Audio voice recording\n• 2D Anatomical Body Map\n• ABHA ID scan & consent", C_TEAL),
        ("2. Extract", "Multimodal OCR reads lab reports and prescriptions; values and dates become a timeline.\n\n• CBC, ECG, report OCR\n• Numeric value parsing\n• Chronological timeline", C_CYAN),
        ("3. Flag", "Rules-based risk flags and category tags set an urgency signal. No diagnosis.\n\n• Hard SpO2 < 90% floor\n• MAX(Rule, AI) logic\n• Instant Red alert tone", C_RED),
        ("4. Review", "Nurse or doctor sees a structured note, follow-up questions and queue order, then decides.\n\n• 3-Lane doctor queue\n• Clinician override log\n• 1-Click referral slip", C_GREEN)
    ]
    for i, (s_title, s_desc, col) in enumerate(steps):
        x = Inches(0.8 + i * 2.98)
        card = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(1.6), Inches(2.8), Inches(3.6))
        card.fill.solid()
        card.fill.fore_color.rgb = C_CARD
        card.line.color.rgb = col
        card.line.width = Pt(1.5)
        tf = card.text_frame
        tf.word_wrap = True
        pt = tf.paragraphs[0]
        pt.text = s_title
        pt.font.size = Pt(15)
        pt.font.bold = True
        pt.font.color.rgb = col
        pd = tf.add_paragraph()
        pd.text = s_desc
        pd.font.size = Pt(10)
        pd.font.color.rgb = C_OFFWHITE
        pd.space_before = Pt(6)

    # Bottom Summary Output Card
    bot_card = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(5.35), Inches(11.733), Inches(1.55))
    bot_card.fill.solid()
    bot_card.fill.fore_color.rgb = C_CARD
    bot_card.line.color.rgb = C_BORDER
    tf_bc = bot_card.text_frame
    tf_bc.word_wrap = True

    p_out = tf_bc.paragraphs[0]
    p_out.text = "📋 Standardized Clinical Outputs & Multi-Setting Scenarios:"
    p_out.font.size = Pt(12)
    p_out.font.bold = True
    p_out.font.color.rgb = C_WHITE

    p_out1 = tf_bc.add_paragraph()
    p_out1.text = "• Core Outputs: One-page triage note + prioritised clinical queue (🔴 RED, 🟠 YELLOW, 🟢 GREEN) + referral draft, always labelled advisory and reviewer-facing."
    p_out1.font.size = Pt(10)
    p_out1.font.color.rgb = C_CYAN
    p_out1.space_before = Pt(3)

    p_out2 = tf_bc.add_paragraph()
    p_out2.text = "• Supported Scenarios: Primary OPD queue, industrial-estate screening, campus fever bay, maternal follow-up, chronic check-in, health camps, and inter-facility referral notes."
    p_out2.font.size = Pt(10)
    p_out2.font.color.rgb = C_OFFWHITE
    p_out2.space_before = Pt(2)

    # =========================================================================
    # SLIDE 5: IMPACT
    # =========================================================================
    slide5 = prs.slides.add_slide(blank_layout)
    add_base(slide5, 5, "Impact", "Empowering patients, frontline workers, and institutional facilities with measurable pilot metrics.")

    # 3 Stakeholder Columns
    impact_cols = [
        ("👥 Patients", [
            "Speak in their own mother tongue (Odia/Hindi).",
            "Urgent and critical cases reach clinicians sooner.",
            "Clear, tamper-evident referral handoff documentation.",
            "Zero cost and zero complex device requirements."
        ], C_CYAN),
        ("👩‍⚕️ Health Workers", [
            "Less typing and repetitive documentation overhead.",
            "Guided follow-up questions to uncover missing history.",
            "Consistent, standardized clinical handoff notes.",
            "Easy 2D body map for non-literate patients."
        ], C_TEAL),
        ("🏥 Facilities", [
            "Better queue order and structured emergency lanes.",
            "Auditable clinician override records and audit trails.",
            "Stronger, verified referral links to higher tertiary centres.",
            "Real-time emergency bay bed telemetry tracking."
        ], C_GREEN)
    ]
    for i, (ih, items, col) in enumerate(impact_cols):
        x = Inches(0.8 + i * 3.98)
        c = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(1.6), Inches(3.78), Inches(2.9))
        c.fill.solid()
        c.fill.fore_color.rgb = C_CARD
        c.line.color.rgb = col
        c.line.width = Pt(1.5)
        tfc = c.text_frame
        tfc.word_wrap = True
        pt = tfc.paragraphs[0]
        pt.text = ih
        pt.font.size = Pt(14)
        pt.font.bold = True
        pt.font.color.rgb = col
        for it in items:
            pi = tfc.add_paragraph()
            pi.text = f"• {it}"
            pi.font.size = Pt(10)
            pi.font.color.rgb = C_OFFWHITE
            pi.space_before = Pt(4)

    # Bottom: Pilot Success Metrics
    met_card = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(4.7), Inches(11.733), Inches(2.2))
    met_card.fill.solid()
    met_card.fill.fore_color.rgb = C_CARD
    met_card.line.color.rgb = C_BORDER
    tf_met = met_card.text_frame
    tf_met.word_wrap = True

    p_mh = tf_met.paragraphs[0]
    p_mh.text = "📊 Pilot Success Metrics (To be measured objectively, not assumed):"
    p_mh.font.size = Pt(13)
    p_mh.font.bold = True
    p_mh.font.color.rgb = C_WHITE

    metrics = [
        ("⏱️ Time to Reviewer Attention:", "Time from patient arrival to reviewer attention for flagged urgent cases (Target: <30 seconds)."),
        ("📑 Report OCR Accuracy:", "Share of paper lab report values correctly extracted, verified against staff audits (Target: >95%)."),
        ("🩺 Reviewer Agreement Rate:", "Reviewer edits per note and degree of agreement with deterministic urgency flags (Target: >90%)."),
        ("⏳ Frontline Staff Time Saved:", "Staff-reported time saved per patient intake (Reduced from 8–10 minutes down to <2 minutes).")
    ]
    for mh, md in metrics:
        pm = tf_met.add_paragraph()
        pm.text = f"• {mh} {md}"
        pm.font.size = Pt(10)
        pm.font.color.rgb = C_OFFWHITE
        pm.space_before = Pt(3)

    # =========================================================================
    # SLIDE 6: TECHNICAL DEPTH
    # =========================================================================
    slide6 = prs.slides.add_slide(blank_layout)
    add_base(slide6, 6, "Technical Depth", "Full-stack architecture engineered with transparent deterministic safety guardrails.")

    tech_blocks = [
        ("🎨 Frontend Layer", "React 18 PWA, Vite, Tailwind CSS, Web Speech API, offline-first IndexedDB, responsive mobile & desktop view.", C_CYAN),
        ("⚡ Backend Engine", "FastAPI (Python 3.11+), Pydantic v2 strict schemas across all clinical domains, RESTful JSON API.", C_TEAL),
        ("🗣️ Speech & Translation", "Sarvam AI (Saaras:v3 ASR, Bulbul:v3 TTS, Mayura:v1) + Web Speech API fallback for Odia & Hindi.", C_GREEN),
        ("📑 OCR & Vision", "Gemini 2.5 Flash multimodal document OCR + OpenCV image pre-processing for CBC slips and ECG waveforms.", C_CYAN),
        ("🧠 AI Intelligence Layer", "Gemini 2.5 Flash for timeline extraction, structured summaries, and missing-info follow-up questions.", C_TEAL),
        ("🛡️ Safety & Governance", "Deterministic rule engine (Python/JS), AES encryption, immutable clinician audit log, DPDP Act compliance.", C_RED)
    ]
    for i, (title, desc, col) in enumerate(tech_blocks):
        col_idx = i % 3
        row_idx = i // 3
        x = Inches(0.8 + col_idx * 3.98)
        y = Inches(1.6 + row_idx * 1.7)
        c = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(3.78), Inches(1.55))
        c.fill.solid()
        c.fill.fore_color.rgb = C_CARD
        c.line.color.rgb = col
        c.line.width = Pt(1.5)
        tf = c.text_frame
        tf.word_wrap = True
        pt = tf.paragraphs[0]
        pt.text = title
        pt.font.size = Pt(12.5)
        pt.font.bold = True
        pt.font.color.rgb = col
        pd = tf.add_paragraph()
        pd.text = desc
        pd.font.size = Pt(9.5)
        pd.font.color.rgb = C_OFFWHITE
        pd.space_before = Pt(3)

    # Bottom: How Safety is Engineered
    eng_card = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(5.15), Inches(11.733), Inches(1.75))
    eng_card.fill.solid()
    eng_card.fill.fore_color.rgb = C_CARD
    eng_card.line.color.rgb = C_BORDER
    tf_eng = eng_card.text_frame
    tf_eng.word_wrap = True

    pe_h = tf_eng.paragraphs[0]
    pe_h.text = "🔒 How Safety is Engineered (Zero-Hallucination Mandate):"
    pe_h.font.size = Pt(13)
    pe_h.font.bold = True
    pe_h.font.color.rgb = C_WHITE

    safeties = [
        ("Deterministic Urgency Rules:", "Deterministic rules set urgency; the LLM is summary-only with constrained Pydantic schemas. AI cannot downgrade an emergency (MAX(Rule, AI))."),
        ("Dual-Source Verification:", "OCR and translation show confidence indicators alongside original verbatim text for instant human verification."),
        ("Auditability & Explainability:", "Every flag stores its exact trigger rule (e.g. SpO2 < 90% -> RED), ensuring every decision is clinically explainable and auditable.")
    ]
    for sh, sd in safeties:
        p = tf_eng.add_paragraph()
        p.text = f"• {sh} {sd}"
        p.font.size = Pt(10)
        p.font.color.rgb = C_OFFWHITE
        p.space_before = Pt(2.5)

    # =========================================================================
    # SLIDE 7: PROTOTYPE ARCHITECTURE
    # =========================================================================
    slide7 = prs.slides.add_slide(blank_layout)
    add_base(slide7, 7, "Prototype Architecture", "End-to-end 4-stage dataflow with unified governance across every operational layer.")

    arch_stages = [
        ("1. CAPTURE", "Text / voice / report photo with explicit consent\n\n• Patient / worker text\n• Voice in Odia / Hindi\n• Report photo / PDF\n• Consent gate & 2D Body Map", C_CYAN),
        ("2. PROCESS", "Convert everything to clean, anonymised text\n\n• Sarvam Speech-to-text\n• Indic <> English translation\n• OCR + document clean-up\n• PII Anonymiser & ID token", C_TEAL),
        ("3. UNDERSTAND + FLAG", "Rules decide urgency; LLM only summarises\n\n• Clinical entity extractor\n• Chronological timeline builder\n• Missing-info detector\n• Deterministic Red Flag rules", C_AMBER),
        ("4. HUMAN REVIEW", "Qualified clinical staff decide, edit or escalate\n\n• 3-lane priority queue\n• Reviewer doctor dashboard\n• ABDM referral note draft\n• Emergency siren escalation", C_GREEN)
    ]
    for i, (title, desc, col) in enumerate(arch_stages):
        x = Inches(0.8 + i * 2.98)
        c = slide7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(1.6), Inches(2.8), Inches(3.7))
        c.fill.solid()
        c.fill.fore_color.rgb = C_CARD
        c.line.color.rgb = col
        c.line.width = Pt(1.5)
        tf = c.text_frame
        tf.word_wrap = True
        pt = tf.paragraphs[0]
        pt.text = title
        pt.font.size = Pt(13)
        pt.font.bold = True
        pt.font.color.rgb = col
        pd = tf.add_paragraph()
        pd.text = desc
        pd.font.size = Pt(9.5)
        pd.font.color.rgb = C_OFFWHITE
        pd.space_before = Pt(4)

    # Bottom Governance Layer
    gov_card = slide7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(5.45), Inches(11.733), Inches(1.45))
    gov_card.fill.solid()
    gov_card.fill.fore_color.rgb = RGBColor(17, 30, 48)
    gov_card.line.color.rgb = C_TEAL
    gov_card.line.width = Pt(1.5)
    tf_gov = gov_card.text_frame
    tf_gov.word_wrap = True

    pg_h = tf_gov.paragraphs[0]
    pg_h.text = "🛡️ DATA GOVERNANCE & PRIVACY (Enforced Across All Layers):"
    pg_h.font.size = Pt(12)
    pg_h.font.bold = True
    pg_h.font.color.rgb = C_WHITE

    pg_items = [
        "Role-Based Access Control (Nurse Intake vs. Doctor Review)",
        "Local AES-256 Encryption & Ephemeral Processing",
        "Minimal Data Retention with Auto-Delete Policies",
        "Deterministic Emergency Flag Skips Routine Waiting Queues",
        "Targeted Follow-up Questions Loop Directly Back to Frontline Worker"
    ]
    pg_p = tf_gov.add_paragraph()
    pg_p.text = "   •   ".join(pg_items)
    pg_p.font.size = Pt(9.5)
    pg_p.font.color.rgb = C_CYAN
    pg_p.space_before = Pt(4)

    # =========================================================================
    # SLIDE 8: EXECUTION FEASIBILITY
    # =========================================================================
    slide8 = prs.slides.add_slide(blank_layout)
    add_base(slide8, 8, "Execution Feasibility", "High feasibility across technical, operational, and economic pillars with robust risk mitigation.")

    # 3 Feasibility Dimensions
    feas_cards = [
        ("⚙️ Technical Feasibility", "Built on mature open-source tools & sovereign APIs; zero custom model training required; lightweight and easily maintained.", C_TEAL),
        ("🤝 Operational Feasibility", "Assists the frontline worker, never replaces the doctor; intuitive ergonomics require under 15 minutes of training.", C_CYAN),
        ("💰 Economic Feasibility", "Open-source architecture; runs on modest local laptops or cloud tiers; negligible per-facility operating expense.", C_GREEN)
    ]
    for i, (title, desc, col) in enumerate(feas_cards):
        x = Inches(0.8 + i * 3.98)
        c = slide8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(1.6), Inches(3.78), Inches(1.7))
        c.fill.solid()
        c.fill.fore_color.rgb = C_CARD
        c.line.color.rgb = col
        c.line.width = Pt(1.5)
        tf = c.text_frame
        tf.word_wrap = True
        pt = tf.paragraphs[0]
        pt.text = title
        pt.font.size = Pt(13)
        pt.font.bold = True
        pt.font.color.rgb = col
        pd = tf.add_paragraph()
        pd.text = desc
        pd.font.size = Pt(10)
        pd.font.color.rgb = C_OFFWHITE
        pd.space_before = Pt(3)

    # Risks and Mitigations Table / Grid
    risk_card = slide8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(3.45), Inches(11.733), Inches(3.45))
    risk_card.fill.solid()
    risk_card.fill.fore_color.rgb = C_CARD
    risk_card.line.color.rgb = C_BORDER
    tf_risk = risk_card.text_frame
    tf_risk.word_wrap = True

    pr_h = tf_risk.paragraphs[0]
    pr_h.text = "⚠️ Key Risks & Built-in Architectural Mitigations:"
    pr_h.font.size = Pt(13)
    pr_h.font.bold = True
    pr_h.font.color.rgb = C_WHITE

    risks = [
        ("OCR errors on poor report images:", "Confidence indicators shown alongside raw photo; mandatory nurse verification before saving values."),
        ("Translation nuances / dialect errors:", "Original verbatim regional audio and phonetic transliteration displayed beside translation for full clinical context."),
        ("LLM hallucination on emergency triage:", "Summary-only role for generative AI; deterministic clinical rules alone compute and enforce urgency scores (MAX(Rule, AI))."),
        ("Low rural network connectivity:", "Offline-tolerant PWA with local IndexedDB queue and mirror rule engine; auto-syncs when connectivity returns.")
    ]
    for rh, rd in risks:
        p = tf_risk.add_paragraph()
        p.text = f"• {rh} {rd}"
        p.font.size = Pt(10)
        p.font.color.rgb = C_OFFWHITE
        p.space_before = Pt(3)

    p_sc = tf_risk.add_paragraph()
    p_sc.text = "📌 Prototype Scope: Synthetic patient cohort and sample reports; includes multimodal intake, OCR, rules flags, and reviewer dashboard."
    p_sc.font.size = Pt(10.5)
    p_sc.font.bold = True
    p_sc.font.color.rgb = C_TEAL
    p_sc.space_before = Pt(6)

    # =========================================================================
    # SLIDE 9: FUTURE SCALABILITY
    # =========================================================================
    slide9 = prs.slides.add_slide(blank_layout)
    add_base(slide9, 9, "Future Scalability", "A 3-phase rollout roadmap with institutional scale-up levers for national public health impact.")

    # 3 Phased Horizons
    phases = [
        ("Phase 1: Working Prototype", "• Single facility interactive demo\n• Multimodal intake (Voice + OCR + Body Map)\n• Deterministic rules + AI summary\n• Reviewer dashboard with synthetic cohort", C_CYAN),
        ("Phase 2: Facility Clinical Pilot", "• Deployment in 1 designated PHC / CHC\n• Real clinical workflows & nurse shadowing\n• Patient informed consent validation\n• Medical officer usability feedback", C_TEAL),
        ("Phase 3: District & State Scale", "• Multi-facility unified dashboard\n• Shared state clinical rule library\n• Direct 108 ambulance referral network\n• Connection to SCB Medical College", C_GREEN)
    ]
    for i, (p_title, p_desc, col) in enumerate(phases):
        x = Inches(0.8 + i * 3.98)
        c = slide9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(1.6), Inches(3.78), Inches(2.3))
        c.fill.solid()
        c.fill.fore_color.rgb = C_CARD
        c.line.color.rgb = col
        c.line.width = Pt(1.5)
        tf = c.text_frame
        tf.word_wrap = True
        pt = tf.paragraphs[0]
        pt.text = p_title
        pt.font.size = Pt(13)
        pt.font.bold = True
        pt.font.color.rgb = col
        pd = tf.add_paragraph()
        pd.text = p_desc
        pd.font.size = Pt(9.5)
        pd.font.color.rgb = C_OFFWHITE
        pd.space_before = Pt(4)

    # 5 Scale-Up Levers Card
    lev_card = slide9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(4.05), Inches(11.733), Inches(2.85))
    lev_card.fill.solid()
    lev_card.fill.fore_color.rgb = C_CARD
    lev_card.line.color.rgb = C_BORDER
    tf_lev = lev_card.text_frame
    tf_lev.word_wrap = True

    pl_h = tf_lev.paragraphs[0]
    pl_h.text = "🚀 Institutional Scale-Up Levers:"
    pl_h.font.size = Pt(13)
    pl_h.font.bold = True
    pl_h.font.color.rgb = C_WHITE

    levers = [
        ("Multilingual Vernacular Expansion:", "Expanding to all 22 official Indian languages using sovereign models from Sarvam AI and Bhashini."),
        ("On-Device Edge Models:", "Quantized lightweight SLMs (e.g. Gemma 2B via WebGPU) for 100% disconnected remote tribal health camps."),
        ("ABDM / ABHA & HMIS Integration:", "Full M3 Milestone sync with National Health Authority health lockers and state e-Hospital portals."),
        ("Setting-Specific Rule Packs:", "Specialized clinical rule packs for Maternal Care, Occupational Health, and Fever Outbreak Surveillance."),
        ("Flexible Deployment Architecture:", "Cloud or on-premises deployment adhering to state government IT and DPDP Act privacy guidelines.")
    ]
    for lh, ld in levers:
        p = tf_lev.add_paragraph()
        p.text = f"• {lh} {ld}"
        p.font.size = Pt(10)
        p.font.color.rgb = C_OFFWHITE
        p.space_before = Pt(3)

    # =========================================================================
    # SLIDE 10: THANK YOU
    # =========================================================================
    slide10 = prs.slides.add_slide(blank_layout)
    bg10 = slide10.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    bg10.fill.solid()
    bg10.fill.fore_color.rgb = C_BG
    bg10.line.fill.background()

    # Top Glow Bar
    top_bar10 = slide10.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, Inches(0.12))
    top_bar10.fill.solid()
    top_bar10.fill.fore_color.rgb = C_TEAL
    top_bar10.line.fill.background()

    # Center Hero Card
    hero10 = slide10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.5), Inches(1.5), Inches(10.333), Inches(4.5))
    hero10.fill.solid()
    hero10.fill.fore_color.rgb = C_CARD
    hero10.line.color.rgb = C_TEAL
    hero10.line.width = Pt(2)
    tf10 = hero10.text_frame
    tf10.word_wrap = True

    p_ty = tf10.paragraphs[0]
    p_ty.text = "THANK YOU"
    p_ty.alignment = PP_ALIGN.CENTER
    p_ty.font.size = Pt(40)
    p_ty.font.bold = True
    p_ty.font.color.rgb = C_WHITE
    p_ty.font.name = "Arial"

    p_team = tf10.add_paragraph()
    p_team.text = "Team: CODEX   |   Team ID: BH26PS07T060"
    p_team.alignment = PP_ALIGN.CENTER
    p_team.font.size = Pt(18)
    p_team.font.bold = True
    p_team.font.color.rgb = C_CYAN
    p_team.space_before = Pt(8)

    p_ps = tf10.add_paragraph()
    p_ps.text = "BPUT Hackathon 2026: Multimodal Healthcare Triage Assistant for Government and Institutional Health Facilities"
    p_ps.alignment = PP_ALIGN.CENTER
    p_ps.font.size = Pt(13)
    p_ps.font.color.rgb = C_OFFWHITE
    p_ps.space_before = Pt(6)

    p_quote = tf10.add_paragraph()
    p_quote.text = "“Our goal: Help frontline healthcare staff prioritize patients faster and safer, while keeping clinical decisions strictly in human hands.”"
    p_quote.alignment = PP_ALIGN.CENTER
    p_quote.font.size = Pt(13)
    p_quote.font.bold = True
    p_quote.font.italic = True
    p_quote.font.color.rgb = C_TEAL
    p_quote.space_before = Pt(14)

    p_disc = tf10.add_paragraph()
    p_disc.text = "Educational prototype for triage support only. Not a diagnostic tool. Synthetic data only."
    p_disc.alignment = PP_ALIGN.CENTER
    p_disc.font.size = Pt(10.5)
    p_disc.font.color.rgb = C_MUTED
    p_disc.space_before = Pt(12)

    # Save to desktop and project folder
    target_paths = [
        r"C:\Users\AMITRAZ\OneDrive\Desktop\Saransh\Saransh_BPUT_Official_Pitch.pptx",
        r"C:\Users\AMITRAZ\OneDrive\Desktop\Saransh_BPUT_Official_Pitch.pptx"
    ]
    saved = []
    for p in target_paths:
        try:
            prs.save(p)
            saved.append(p)
            print(f"[SUCCESS] Saved official presentation: {p}")
        except Exception as e:
            print(f"[ERROR] Could not save to {p}: {e}")

    print(f"\nOfficial 10-slide BPUT presentation generated successfully! ({len(saved)} copies saved)")

if __name__ == "__main__":
    create_official_bput_presentation()
