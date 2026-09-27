import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_ultra_premium_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Ultra-Premium Color Palette (Apple Keynote / MedTech Obsidian Aesthetic)
    C_DARK_BG = RGBColor(11, 15, 25)        # Deep Obsidian Navy #0B0F19
    C_CARD_BG = RGBColor(19, 26, 42)        # Elevated Slate Card #131A2A
    C_CARD_HOVER = RGBColor(26, 36, 56)     # Brighter Card Accent
    C_TEAL_CYAN = RGBColor(20, 184, 166)    # Electric Teal #14B8A6
    C_TEAL_DEEP = RGBColor(13, 148, 136)    # Medical Teal #0D9488
    C_CYAN_GLOW = RGBColor(56, 189, 248)    # Sky Cyan #38BDF8
    C_WHITE = RGBColor(255, 255, 255)
    C_OFFWHITE = RGBColor(241, 245, 249)    # Slate 100
    C_MUTED = RGBColor(148, 163, 184)       # Slate 400
    C_BORDER = RGBColor(39, 50, 75)         # Card Border
    C_BORDER_ACTIVE = RGBColor(13, 148, 136)
    
    # Priority Semantics
    C_RED_ROSE = RGBColor(244, 63, 94)      # Crimson #F43F5E
    C_RED_BG = RGBColor(60, 15, 25)
    C_AMBER = RGBColor(245, 158, 11)        # Warm Amber #F59E0B
    C_AMBER_BG = RGBColor(55, 30, 10)
    C_EMERALD = RGBColor(16, 185, 129)      # Emerald #10B981
    C_EMERALD_BG = RGBColor(15, 45, 30)

    def add_slide_base(slide, title_text, track_pill="BPUT HACKATHON 2026 • AI HEALTHCARE TRACK"):
        # Dark Canvas
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = C_DARK_BG
        bg.line.fill.background()

        # Top Ambient Gradient Strip
        strip = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, Inches(0.08))
        strip.fill.solid()
        strip.fill.fore_color.rgb = C_TEAL_CYAN
        strip.line.fill.background()

        # Track Pill
        pill = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.35), Inches(4.5), Inches(0.35))
        pill.fill.solid()
        pill.fill.fore_color.rgb = RGBColor(17, 30, 48)
        pill.line.color.rgb = C_TEAL_DEEP
        pill.line.width = Pt(1)
        tf_pill = pill.text_frame
        p_p = tf_pill.paragraphs[0]
        p_p.alignment = PP_ALIGN.CENTER
        p_p.text = track_pill.upper()
        p_p.font.size = Pt(9.5)
        p_p.font.bold = True
        p_p.font.color.rgb = C_CYAN_GLOW
        p_p.font.name = "Arial"

        # Main Slide Title
        t_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.72), Inches(11.7), Inches(0.65))
        tf = t_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title_text
        p.font.size = Pt(23)
        p.font.bold = True
        p.font.color.rgb = C_WHITE
        p.font.name = "Arial"

        # Subtle separator
        line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.4), Inches(11.733), Inches(0.015))
        line.fill.solid()
        line.fill.fore_color.rgb = C_BORDER
        line.line.fill.background()

    # =========================================================================
    # SLIDE 1: TITLE HERO (Obsidian & Electric Teal Keynote Style)
    # =========================================================================
    slide1 = prs.slides.add_slide(blank_layout)
    bg1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = C_DARK_BG
    bg1.line.fill.background()

    # Top Glow Bar
    top_bar = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, Inches(0.12))
    top_bar.fill.solid()
    top_bar.fill.fore_color.rgb = C_TEAL_CYAN
    top_bar.line.fill.background()

    # Top Badge
    b1 = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.9), Inches(5.8), Inches(0.42))
    b1.fill.solid()
    b1.fill.fore_color.rgb = RGBColor(17, 30, 48)
    b1.line.color.rgb = C_TEAL_CYAN
    b1.line.width = Pt(1.5)
    tf_b1 = b1.text_frame
    pb1 = tf_b1.paragraphs[0]
    pb1.alignment = PP_ALIGN.CENTER
    pb1.text = "🏛️ BPUT HACKATHON 2026 • HEALTHCARE INNOVATION TRACK"
    pb1.font.size = Pt(10.5)
    pb1.font.bold = True
    pb1.font.color.rgb = C_CYAN_GLOW

    # Huge Hero Title
    hero_box = slide1.shapes.add_textbox(Inches(0.8), Inches(1.45), Inches(11.7), Inches(1.8))
    tf_hero = hero_box.text_frame
    tf_hero.word_wrap = True
    ph1 = tf_hero.paragraphs[0]
    ph1.text = "Saransh (सारांश)"
    ph1.font.size = Pt(56)
    ph1.font.bold = True
    ph1.font.color.rgb = C_WHITE
    ph1.font.name = "Arial"

    ph2 = tf_hero.add_paragraph()
    ph2.text = "Multimodal Human-in-the-Loop Healthcare Triage Assistant for Government & Institutional Health Facilities"
    ph2.font.size = Pt(18)
    ph2.font.bold = True
    ph2.font.color.rgb = C_TEAL_CYAN
    ph2.space_before = Pt(6)

    # Hero Pitch Card (Bento Box Glow)
    hero_card = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(3.45), Inches(11.733), Inches(1.5))
    hero_card.fill.solid()
    hero_card.fill.fore_color.rgb = C_CARD_BG
    hero_card.line.color.rgb = C_TEAL_DEEP
    hero_card.line.width = Pt(1.5)
    tf_hc = hero_card.text_frame
    tf_hc.word_wrap = True
    phc = tf_hc.paragraphs[0]
    phc.text = "“Right Priority. Right Facility. Right on Time.”"
    phc.font.size = Pt(18)
    phc.font.bold = True
    phc.font.color.rgb = C_WHITE
    phc_sub = tf_hc.add_paragraph()
    phc_sub.text = "An explainable, non-diagnostic clinical triage assistant that combines Vernacular Voice (Odia/Hindi), Lab Report OCR, Visual Symptom Signals, and Deterministic Vital Checks to structure chaotic hospital queues into prioritized clinical lanes—without replacing clinical judgment."
    phc_sub.font.size = Pt(12)
    phc_sub.font.color.rgb = C_OFFWHITE
    phc_sub.space_before = Pt(6)

    # 4 Bottom Bento Stats / Pillars
    pillars = [
        ("🎤 Multimodal Voice", "Odia, Hindi & English speech + Vernacular Dialect Normalizer (SNOMED-CT)"),
        ("🛡️ Safety-First Rule Floor", "MAX(Rule, AI) guarantee — SpO2 < 90% locks RED, AI cannot downgrade"),
        ("🏥 3-Lane Doctor Command", "Live clinical queue (🔴 Emergency, 🟠 Urgent, 🟢 Routine) with bed telemetry"),
        ("📄 NHM Government Referral", "1-Click formal transfer slip from PHC Jatni to SCB Cuttack with 108 escort")
    ]
    for i, (p_title, p_desc) in enumerate(pillars):
        x = Inches(0.8 + i * 2.98)
        card = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(5.15), Inches(2.8), Inches(1.8))
        card.fill.solid()
        card.fill.fore_color.rgb = C_CARD_BG
        card.line.color.rgb = C_BORDER
        card.line.width = Pt(1)

        # Top colored accent
        accent_bar = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, x, Inches(5.15), Inches(2.8), Inches(0.06))
        accent_bar.fill.solid()
        accent_bar.fill.fore_color.rgb = C_TEAL_CYAN
        accent_bar.line.fill.background()

        tf_c = card.text_frame
        tf_c.word_wrap = True
        pt = tf_c.paragraphs[0]
        pt.text = p_title
        pt.font.size = Pt(12)
        pt.font.bold = True
        pt.font.color.rgb = C_WHITE
        pd = tf_c.add_paragraph()
        pd.text = p_desc
        pd.font.size = Pt(9.5)
        pd.font.color.rgb = C_MUTED
        pd.space_before = Pt(4)

    # =========================================================================
    # SLIDE 2: THE PROBLEM (Bento Grid of Hospital Realities)
    # =========================================================================
    slide2 = prs.slides.add_slide(blank_layout)
    add_slide_base(slide2, "The Ground Reality: Outpatient Bottlenecks in Government PHCs/CHCs")

    problems = [
        ("🚨 1. Unprioritized First-Come Queues", 
         "• 200–400 patients arrive during crowded morning hours at PHCs/CHCs.\n• Critical cases (silent hypoxia SpO2 < 90%, crushing chest pain, pre-eclampsia) wait in the exact same first-come queue as mild tension headaches.\n• Clinical deterioration occurs silently while waiting for consultation.",
         C_RED_ROSE, C_RED_BG),
        ("🗣️ 2. Vernacular Idioms & Linguistic Barrier",
         "• Rural patients describe pain in colloquial cultural idioms ('Chhati fatijiba', 'Pathara bhali bhari', 'Jhalare thanda').\n• Generic AI and translation tools fail or translate literally.\n• Rotating medical officers from other regions struggle with speed and local dialect transcription.",
         C_AMBER, C_AMBER_BG),
        ("📑 3. Paper Lab Overload & Missing Info",
         "• Patients carry crumpled paper CBC slips, prior ECGs, and handwritten slips.\n• Frontline nurses have under 90 seconds per patient.\n• Critical details (drug allergies like Penicillin anaphylaxis, exact pain onset timing) are missed in the rush.",
         C_CYAN_GLOW, RGBColor(15, 30, 45)),
        ("🚑 4. Broken Referral Handoff Continuity",
         "• When a rural PHC transfers an emergency to District Hospital or SCB Medical College, referral notes are scribbled on paper scrap.\n• Destination hospital has zero pre-arrival telemetry or baseline vital trends, wasting precious golden hour time.",
         C_TEAL_CYAN, RGBColor(12, 35, 35))
    ]

    for i, (title, body, border_c, fill_c) in enumerate(problems):
        col = i % 2
        row = i // 2
        x = Inches(0.8 + col * 5.95)
        y = Inches(1.65 + row * 2.7)
        card = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(5.75), Inches(2.5))
        card.fill.solid()
        card.fill.fore_color.rgb = C_CARD_BG
        card.line.color.rgb = border_c
        card.line.width = Pt(1.5)

        tf = card.text_frame
        tf.word_wrap = True
        pt = tf.paragraphs[0]
        pt.text = title
        pt.font.size = Pt(14)
        pt.font.bold = True
        pt.font.color.rgb = border_c
        pb = tf.add_paragraph()
        pb.text = body
        pb.font.size = Pt(10.5)
        pb.font.color.rgb = C_OFFWHITE
        pb.space_before = Pt(6)

    # =========================================================================
    # SLIDE 3: OUR SOLUTION & HYBRID SAFETY ARCHITECTURE
    # =========================================================================
    slide3 = prs.slides.add_slide(blank_layout)
    add_slide_base(slide3, "Our Solution: Hybrid Deterministic + Generative Triage Engine")

    # Left Column: The Architectural Breakthrough
    left_c = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.65), Inches(5.7), Inches(5.35))
    left_c.fill.solid()
    left_c.fill.fore_color.rgb = C_CARD_BG
    left_c.line.color.rgb = C_TEAL_CYAN
    left_c.line.width = Pt(1.5)
    tf_l = left_c.text_frame
    tf_l.word_wrap = True

    p = tf_l.paragraphs[0]
    p.text = "Why NOT a Generic Black-Box LLM?"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = C_WHITE

    sol_points = [
        ("❌ Pure LLM Pitfall:", "Autonomous LLMs can hallucinate, downgrade critical vitals, or generate unauthorized medical prescriptions."),
        ("🛡️ The Saransh Hybrid Innovation:", "We separate Clinical Safety from Linguistic Processing:"),
        ("1. Deterministic Rule Engine (100% Explainable):", "Hard clinical vital checks in pure Python/JS. SpO2 < 90% = RED. Systolic BP >= 180 = RED. Severe Chest Pain = RED. Zero AI hallucination on vitals."),
        ("2. Generative Multimodal AI (Gemini 2.5 Flash):", "Used strictly for multimodal transcription, CBC/ECG OCR extraction, chronological timeline stepper, and Odia/Hindi follow-up question generation."),
        ("3. MAX(Rule, AI) Safety Floor Ceiling:", "Programmatic guarantee: The AI model cannot downgrade a patient flagged as an emergency by clinical rules."),
        ("4. Strict Advisory Mandate:", "Persistent disclaimer: Clinical decision support tool for qualified staff; does not diagnose or prescribe.")
    ]
    for h, d in sol_points:
        p_item = tf_l.add_paragraph()
        p_item.text = f"{h} {d}"
        p_item.font.size = Pt(10)
        p_item.font.color.rgb = C_OFFWHITE
        p_item.space_before = Pt(6)

    # Right Column: The 3 Priority Tiers (Eye-Catching Cards)
    tiers = [
        ("🔴 RED — EMERGENCY (P1)", "Immediate Medical Officer Care (0 min wait)", 
         "SpO2 < 90% • Systolic BP >= 180 or < 85 • Severe Retrosternal Chest Pain • Acute Dyspnea • Active Seizure • Anaphylaxis", C_RED_ROSE, C_RED_BG),
        ("🟠 YELLOW — URGENT (P2)", "Priority Fast-Track OPD (< 15-20 min target)", 
         "SpO2 90-93% • Temp >= 101.5°F • Abnormal CBC (Platelets < 100k) • High-Risk Maternal Pre-eclampsia (BP 168/110)", C_AMBER, C_AMBER_BG),
        ("🟢 GREEN — ROUTINE (P3)", "Standard Outpatient Queue Consultation", 
         "SpO2 >= 94% • Baseline Stable Vitals • Mild Tension Headache • Chronic Medication Refill • Minor Cold/Cough", C_EMERALD, C_EMERALD_BG)
    ]
    for i, (t_title, t_sla, t_criteria, t_col, t_bg) in enumerate(tiers):
        y = Inches(1.65 + i * 1.78)
        card = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.75), y, Inches(5.78), Inches(1.65))
        card.fill.solid()
        card.fill.fore_color.rgb = C_CARD_BG
        card.line.color.rgb = t_col
        card.line.width = Pt(1.5)

        tf_t = card.text_frame
        tf_t.word_wrap = True
        pt = tf_t.paragraphs[0]
        pt.text = t_title
        pt.font.size = Pt(13)
        pt.font.bold = True
        pt.font.color.rgb = t_col

        psla = tf_t.add_paragraph()
        psla.text = f"Queue SLA: {t_sla}"
        psla.font.size = Pt(10)
        psla.font.bold = True
        psla.font.color.rgb = C_WHITE
        psla.space_before = Pt(2)

        pcrit = tf_t.add_paragraph()
        pcrit.text = f"Clinical Triggers: {t_criteria}"
        pcrit.font.size = Pt(9.5)
        pcrit.font.color.rgb = C_MUTED
        pcrit.space_before = Pt(3)

    # =========================================================================
    # SLIDE 4: MULTIMODAL INGESTION & VERNACULAR DIALECT NORMALIZER
    # =========================================================================
    slide4 = prs.slides.add_slide(blank_layout)
    add_slide_base(slide4, "Multimodal Ingestion: Voice, Vision, Vitals & Vernacular Dialects")

    innovations = [
        ("🗣️ Vernacular Dialect Normalizer",
         "• Solves Indian cultural idiom gap by mapping to SNOMED-CT & ICD-10:\n  - 'ଛାତି ଫାଟିଯିବା' ➔ Severe Stabbing Chest Pain [ALERT]\n  - 'ପଥର ଭଳି ଭାରି' ➔ Crushing Chest Heaviness [ALERT]\n  - 'ଝାଳରେ ଥଣ୍ଡା' ➔ Cold Diaphoresis / Shock Sign [ALERT]\n  - '୨ ଘଣ୍ଟା ହେଲା' ➔ Acute Onset (2 hours ago)\n• Preserves exact spoken voice for legal records while outputting clinical English for doctors."),
        ("🪪 Holographic ABDM / ABHA Sync",
         "• Ayushman Bharat Digital Mission (ABDM) Integration:\n• 1-Click mock QR scan fetches verified ABHA ID (e.g. 91-4821-9923-0192)\n• Instantly pulls synced longitudinal medical history (Hypertension 5y, Type 2 Diabetes)\n• Highlights critical drug allergy alerts (Penicillin Anaphylaxis) before nurse enters symptoms."),
        ("👤 2D Anatomical Body Map",
         "• Visual symptom selector for non-literate patients:\n• Head/Neuro, Chest/Cardiac, Lungs/Dyspnea, Abdomen, Limbs/Edema, Skin/Rashes\n• Clicking body zones automatically suggests corresponding clinical symptoms\n• Bridges language and literacy barriers in rural health camps."),
        ("📑 Single-Call Multimodal OCR",
         "• Document extraction via Gemini 2.5 Flash in a single API call:\n• Reads quantitative values from CBC reports (Platelets 85k), ECG slips (LVH strain pattern), prescriptions\n• Tags non-diagnostic supporting photos of pedal edema and rashes.")
    ]
    for i, (c_title, c_text) in enumerate(innovations):
        x = Inches(0.8 + i * 2.98)
        card = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(1.65), Inches(2.8), Inches(5.35))
        card.fill.solid()
        card.fill.fore_color.rgb = C_CARD_BG
        card.line.color.rgb = C_BORDER
        card.line.width = Pt(1)

        # Top Accent
        acc = slide4.shapes.add_shape(MSO_SHAPE.RECTANGLE, x, Inches(1.65), Inches(2.8), Inches(0.08))
        acc.fill.solid()
        acc.fill.fore_color.rgb = C_TEAL_CYAN
        acc.line.fill.background()

        tf = card.text_frame
        tf.word_wrap = True
        pt = tf.paragraphs[0]
        pt.text = c_title
        pt.font.size = Pt(12)
        pt.font.bold = True
        pt.font.color.rgb = C_WHITE

        pb = tf.add_paragraph()
        pb.text = c_text
        pb.font.size = Pt(9.5)
        pb.font.color.rgb = C_OFFWHITE
        pb.space_before = Pt(8)

    # =========================================================================
    # SLIDE 5: HUMAN-IN-THE-LOOP CLINICAL REVIEW & DOCTOR QUEUE
    # =========================================================================
    slide5 = prs.slides.add_slide(blank_layout)
    add_slide_base(slide5, "Doctor Command Dashboard & Human-in-the-Loop Governance")

    # Left Box: Doctor Dashboard Visual Simulation
    left_dash = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.65), Inches(6.4), Inches(5.35))
    left_dash.fill.solid()
    left_dash.fill.fore_color.rgb = C_CARD_BG
    left_dash.line.color.rgb = C_TEAL_CYAN
    left_dash.line.width = Pt(1.5)
    tf_ld = left_dash.text_frame
    tf_ld.word_wrap = True

    pld = tf_ld.paragraphs[0]
    pld.text = "🏥 HOSPITAL LIVE TRIAGE COMMAND CENTER"
    pld.font.size = Pt(14)
    pld.font.bold = True
    pld.font.color.rgb = C_CYAN_GLOW

    pld_sub = tf_ld.add_paragraph()
    pld_sub.text = "Bed Telemetry: Emergency Bays: 3/5 Available • Doctors On Duty: 5 • Active Waiting: 6"
    pld_sub.font.size = Pt(9.5)
    pld_sub.font.color.rgb = C_MUTED
    pld_sub.space_before = Pt(2)

    live_lanes = [
        ("🔴 RED LANE (Immediate Emergency Care)", "T-024 • Ramesh K. (62M) • SpO2 89% • Crushing Chest Pain • Wait: 1m", C_RED_ROSE),
        ("🔴 RED LANE (Maternal Pre-eclampsia)", "T-019 • Meena D. (28F) • BP 168/110 • 34w Gestation • Wait: 3m", C_RED_ROSE),
        ("🟠 YELLOW LANE (Priority Outpatient)", "T-025 • Priya S. (34F) • Temp 102.8°F • CBC Platelets 85k • Wait: 7m", C_AMBER),
        ("🟠 YELLOW LANE (Occupational Screening)", "T-027 • Rajesh M. (45M) • Paradeep Chemical Inhalation • Wait: 9m", C_AMBER),
        ("🟢 GREEN LANE (Routine Consultation)", "T-026 • Subhash P. (24M) • Mild Study Tension Headache • Wait: 12m", C_EMERALD)
    ]
    for l_title, l_desc, l_col in live_lanes:
        p_lt = tf_ld.add_paragraph()
        p_lt.text = l_title
        p_lt.font.size = Pt(10)
        p_lt.font.bold = True
        p_lt.font.color.rgb = l_col
        p_lt.space_before = Pt(6)
        p_ldesc = tf_ld.add_paragraph()
        p_ldesc.text = f"   {l_desc}"
        p_ldesc.font.size = Pt(9)
        p_ldesc.font.color.rgb = C_OFFWHITE

    # Right Box: Human-in-the-Loop Safeguards (Rubric 15%)
    right_gov = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.45), Inches(1.65), Inches(5.08), Inches(5.35))
    right_gov.fill.solid()
    right_gov.fill.fore_color.rgb = C_CARD_BG
    right_gov.line.color.rgb = C_BORDER
    right_gov.line.width = Pt(1)
    tf_rg = right_gov.text_frame
    tf_rg.word_wrap = True

    prg = tf_rg.paragraphs[0]
    prg.text = "⚖️ Human-in-the-Loop Safeguards (15% Rubric)"
    prg.font.size = Pt(14)
    prg.font.bold = True
    prg.font.color.rgb = C_WHITE

    gov_points = [
        ("1. Doctor Verification Drawer:", "Reviewing Medical Officer (MO) reviews the structured timeline, missing information gaps, and raw voice statement before patient enters."),
        ("2. 1-Click Priority Override:", "Doctor can upgrade (e.g. YELLOW to RED) or downgrade priority with complete clinical freedom."),
        ("3. Mandatory Clinical Justification:", "System forces clinician to enter reason (e.g. 'Repeat SpO2 is 97% on warm finger; chest tenderness is reproducible muscular strain')."),
        ("4. Immutable Audit Trail:", "Every decision records Reviewer ID (e.g. DR-MO-402), timestamp, AI original priority vs. final clinician priority for clinical accountability."),
        ("5. Dynamic Follow-Up Questions:", "Presents 3 high-yield questions in Odia/Hindi for nurse to ask at bedside.")
    ]
    for gh, gd in gov_points:
        p_g = tf_rg.add_paragraph()
        p_g.text = f"{gh} {gd}"
        p_g.font.size = Pt(9.5)
        p_g.font.color.rgb = C_OFFWHITE
        p_g.space_before = Pt(6)

    # =========================================================================
    # SLIDE 6: ODISHA HEALTHCARE NETWORK & NHM REFERRAL SLIP
    # =========================================================================
    slide6 = prs.slides.add_slide(blank_layout)
    add_slide_base(slide6, "Odisha Public Health Network & Official NHM Referral Engine")

    # Top Network Box
    net_box = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.65), Inches(11.733), Inches(1.85))
    net_box.fill.solid()
    net_box.fill.fore_color.rgb = C_CARD_BG
    net_box.line.color.rgb = C_TEAL_CYAN
    tf_net = net_box.text_frame
    tf_net.word_wrap = True

    p_nt = tf_net.paragraphs[0]
    p_nt.text = "🏛️ Complete 6-Tier All-India Facility Network (National Health Facility Registry / NIN Standard):"
    p_nt.font.size = Pt(13)
    p_nt.font.bold = True
    p_nt.font.color.rgb = C_CYAN_GLOW

    p_nb = tf_net.add_paragraph()
    p_nb.text = "• PHC Jatni, Khordha (OD-KHD-PHC-102) ➔ Rural First-Line Triage\n• CHC Tangi, Khordha (OD-KHD-CHC-204) ➔ Block-Level Community Health Center\n• Capital Hospital, Bhubaneswar (OD-DHH-401) ➔ 750-Bed District Headquarter Hospital\n• SCB Medical College, Cuttack (OD-MCH-001) ➔ Apex Tertiary Emergency & Trauma Bay\n• Paradeep Industrial Unit (OD-JSP-IEH-301) ➔ Industrial Port Trust Occupational Screening\n• Koraput Mobile Health Camp (OD-KPT-MOBI-501) ➔ Tribal Health Mission Outreach\n• Flagship National Anchors: AIIMS New Delhi (DL-NDLS-AIIMS-001) & Thane MIDC Maharashtra (MH-THN-MIDC-402)"
    p_nb.font.size = Pt(10)
    p_nb.font.color.rgb = C_OFFWHITE
    p_nb.space_before = Pt(4)

    # Bottom Referral Slip Box
    ref_box = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(3.7), Inches(11.733), Inches(3.3))
    ref_box.fill.solid()
    ref_box.fill.fore_color.rgb = RGBColor(28, 18, 28)
    ref_box.line.color.rgb = C_RED_ROSE
    ref_box.line.width = Pt(1.5)
    tf_ref = ref_box.text_frame
    tf_ref.word_wrap = True

    p_rt = tf_ref.paragraphs[0]
    p_rt.text = "📄 GOVERNMENT OF ODISHA • HEALTH & FAMILY WELFARE DEPARTMENT — NHM CLINICAL REFERRAL SLIP"
    p_rt.font.size = Pt(12)
    p_rt.font.bold = True
    p_rt.font.color.rgb = C_RED_ROSE

    p_rb = tf_ref.add_paragraph()
    p_rb.text = "Referring Facility: Primary Health Center (PHC) Jatni, Khordha (NIN: OD-KHD-PHC-102)\nReferred To: Emergency Resuscitation Bay, Capital Hospital Bhubaneswar / SCB Medical College, Cuttack\nPatient: Ramesh K. | ABHA ID: 91-4821-9923-0192 | Token: T-024 | Age/Sex: 62y/Male\nChief Complaint: Retrosternal crushing chest pain & severe dyspnea (2 hours duration)\nTriage Classification: 🔴 RED PRIORITY (Immediate Medical Officer Assessment Required)\nDeparture Vitals: SpO₂ 89% (Room Air), BP 158/96 mmHg, Pulse 112 bpm, RR 26/min, Temp 99.8°F\nPre-Referral Stabilization: Oxygen initiated via nasal cannula at 4 L/min. Aspirin 300mg stat administered.\nEscort Logistics: 108 Emergency Ambulance Dispatched • Emergency Transfer Barcode Generated for Zero-Wait Reception"
    p_rb.font.size = Pt(10)
    p_rb.font.color.rgb = C_OFFWHITE
    p_rb.space_before = Pt(6)

    # =========================================================================
    # SLIDE 7: TECHNICAL STACK & OFFLINE-FIRST RESILIENCE
    # =========================================================================
    slide7 = prs.slides.add_slide(blank_layout)
    add_slide_base(slide7, "Technical Architecture: Modern, Scalable & Offline-Resilient")

    tech_pillars = [
        ("🎨 Modern React Frontend",
         "• React 18, Vite, Tailwind CSS\n• Lucide Medical Icons & Bento Vitals\n• Web Speech API (or-IN, hi-IN, en-IN)\n• SpeechSynthesis audio question playback\n• Interactive 2D Anatomical Body Map\n• Holographic ABHA verified card widget"),
        ("⚡ FastAPI High-Speed Backend",
         "• Python 3.11+ with async FastAPI\n• Strict Pydantic v2 schemas (all 10 domains)\n• Interactive OpenAPI 3.1 Swagger Docs (/docs)\n• In-memory clinical queue with persistence\n• Zero-delay response (<50ms deterministic scoring)"),
        ("🧠 Gemini 2.5 Flash Multimodal AI",
         "• Official google-genai Python SDK\n• Native audio, text, and report OCR in 1 call\n• Enforces strict Pydantic JSON response_schema\n• Intelligent local fallback mode when offline\n• Culturally empathetic Odia & Hindi prompts"),
        ("📶 Offline-First PWA Resilience",
         "• IndexedDB / LocalStorage queue buffer\n• Client-side mirror deterministic rule engine\n• If rural PHC internet cuts out, triage never stops\n• Auto-syncs queued patients when back online\n• 100% demo safety on hackathon stage")
    ]
    for i, (t_title, t_desc) in enumerate(tech_pillars):
        x = Inches(0.8 + i * 2.98)
        c = slide7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(1.65), Inches(2.8), Inches(5.35))
        c.fill.solid()
        c.fill.fore_color.rgb = C_CARD_BG
        c.line.color.rgb = C_BORDER
        c.line.width = Pt(1)

        # Top line
        hl = slide7.shapes.add_shape(MSO_SHAPE.RECTANGLE, x, Inches(1.65), Inches(2.8), Inches(0.08))
        hl.fill.solid()
        hl.fill.fore_color.rgb = C_TEAL_CYAN
        hl.line.fill.background()

        tf = c.text_frame
        tf.word_wrap = True
        pt = tf.paragraphs[0]
        pt.text = t_title
        pt.font.size = Pt(12)
        pt.font.bold = True
        pt.font.color.rgb = C_WHITE

        pb = tf.add_paragraph()
        pb.text = t_desc
        pb.font.size = Pt(9.5)
        pb.font.color.rgb = C_OFFWHITE
        pb.space_before = Pt(8)

    # =========================================================================
    # SLIDE 8: 100% RUBRIC MASTERY & FUTURE ROADMAP
    # =========================================================================
    slide8 = prs.slides.add_slide(blank_layout)
    bg8 = slide8.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    bg8.fill.solid()
    bg8.fill.fore_color.rgb = C_DARK_BG
    bg8.line.fill.background()

    # Top Strip
    top_s8 = slide8.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, Inches(0.12))
    top_s8.fill.solid()
    top_s8.fill.fore_color.rgb = C_TEAL_CYAN
    top_s8.line.fill.background()

    # Title
    t_box8 = slide8.shapes.add_textbox(Inches(0.8), Inches(0.55), Inches(11.7), Inches(0.8))
    tf8 = t_box8.text_frame
    p8 = tf8.paragraphs[0]
    p8.text = "Evaluation Criteria Mastery & Future Roadmap"
    p8.font.size = Pt(26)
    p8.font.bold = True
    p8.font.color.rgb = C_WHITE

    # Left: 100% Rubric Scorecard
    rub_card = slide8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.5), Inches(5.7), Inches(5.5))
    rub_card.fill.solid()
    rub_card.fill.fore_color.rgb = C_CARD_BG
    rub_card.line.color.rgb = C_TEAL_CYAN
    rub_card.line.width = Pt(1.5)
    tf_rub = rub_card.text_frame
    tf_rub.word_wrap = True

    prt = tf_rub.paragraphs[0]
    prt.text = "🎯 Official Hackathon Weightage Scorecard:"
    prt.font.size = Pt(14)
    prt.font.bold = True
    prt.font.color.rgb = C_CYAN_GLOW

    rubrics = [
        ("Safety-First Triage Workflow (20%)", "MAX(Rule, AI) priority ceiling; zero LLM downgrade on critical hypoxia"),
        ("Information Extraction & Summary (20%)", "Chronological timeline stepper, missing clinical info, Odia follow-up questions"),
        ("Multimodal Capability (15%)", "Voice in Odia/Hindi + Lab Report OCR + Visual symptom signals + Vitals"),
        ("India-Wide Relevance & Accessibility (15%)", "8 facilities across 6 tiers, ABDM/ABHA integration, 2D Body Map for non-literate"),
        ("Human-Review & Escalation (15%)", "Doctor command queue, clinician override with audit trail, NHM referral slip"),
        ("Privacy & Responsible AI (10%)", "Informed consent gate, PII masking, local offline storage, advisory disclaimer"),
        ("Demo Quality (5%)", "Instant 1-click synthetic profiles, zero-latency local execution, Swagger docs")
    ]
    for r_title, r_desc in rubrics:
        p_r = tf_rub.add_paragraph()
        p_r.text = f"• {r_title}: {r_desc}"
        p_r.font.size = Pt(9.5)
        p_r.font.color.rgb = C_OFFWHITE
        p_r.space_before = Pt(4)

    # Right: Future Scope & Vision
    fut_card = slide8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.5), Inches(5.733), Inches(5.5))
    fut_card.fill.solid()
    fut_card.fill.fore_color.rgb = C_CARD_BG
    fut_card.line.color.rgb = C_BORDER
    tf_fut = fut_card.text_frame
    tf_fut.word_wrap = True

    pft = tf_fut.paragraphs[0]
    pft.text = "🚀 Future Scope & Institutional Deployment:"
    pft.font.size = Pt(14)
    pft.font.bold = True
    pft.font.color.rgb = C_WHITE

    future_points = [
        ("ABDM M3 Milestone Integration:", "Direct connection with official National Health Authority (NHA) health lockers via OAuth2/OTP."),
        ("eSanjeevani Telemedicine Bridge:", "Automated handoff of YELLOW urgent triage notes to remote specialist tele-consultations."),
        ("IoT Bluetooth Medical Device Pairing:", "Direct wireless Bluetooth sync with portable pulse oximeters, digital BP cuffs, and glucometers."),
        ("Public Health Outbreak Epidemiology:", "De-identified spatial clustering of fever/respiratory cases across Odisha districts for early Dengue/Malaria outbreak detection.")
    ]
    for fh, fd in future_points:
        pf = tf_fut.add_paragraph()
        pf.text = f"• {fh} {fd}"
        pf.font.size = Pt(10)
        pf.font.color.rgb = C_OFFWHITE
        pf.space_before = Pt(6)

    # Final Hero Quote
    p_concl = tf_fut.add_paragraph()
    p_concl.text = "“Our mission: Help frontline healthcare staff prioritize patients faster and safer, while keeping clinical decisions strictly in human hands.”"
    p_concl.font.size = Pt(11.5)
    p_concl.font.bold = True
    p_concl.font.italic = True
    p_concl.font.color.rgb = C_TEAL_CYAN
    p_concl.space_before = Pt(14)

    # Save presentation with graceful file lock handling
    saved_paths = []
    target_names = [
        "Saransh_Ultra_Premium_Pitch.pptx",
        "Saransh_BPUT_Keynote_Pitch.pptx",
        "Saransh_BPUT_Hackathon_Pitch.pptx"
    ]
    target_dirs = [
        r"C:\Users\AMITRAZ\OneDrive\Desktop\Saransh",
        r"C:\Users\AMITRAZ\OneDrive\Desktop"
    ]
    
    for filename in target_names:
        for tdir in target_dirs:
            out_file = os.path.join(tdir, filename)
            try:
                prs.save(out_file)
                saved_paths.append(out_file)
                print(f"[SUCCESS] Saved: {out_file}")
            except PermissionError:
                print(f"[LOCKED] Could not overwrite {out_file} (currently open in PowerPoint). Skipped.")
            except Exception as e:
                print(f"[ERROR] Could not save to {out_file}: {e}")
                
    print(f"Ultra-premium presentation generated successfully! Saved to {len(saved_paths)} locations.")

if __name__ == "__main__":
    create_ultra_premium_presentation()
