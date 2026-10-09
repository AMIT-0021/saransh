export const SYNTHETIC_CASES = [
  {
    id: "RAMESH_CARDIAC_RED",
    badgeLabel: "🔴 Ramesh K. (62M) — Odia Chest Pain & Hypoxia (SpO2 89%)",
    priorityHint: "RED",
    patient_basic_info: {
      patient_id: "PHC-1024",
      token_number: "T-024",
      name_or_alias: "Ramesh K. (Synthetic)",
      age: 62,
      sex: "Male",
      location_state: "Odisha - Khordha (PHC Jatni - NIN: OD-KHD-PHC-102)",
      facility_type: "PHC_JATNI",
      language_preference: "Odia",
      consent_given: true,
      unconscious_bypass: false,
      emergency_contact: "+91-9876543210",
      abha_id: "91-4821-9923-0192"
    },
    symptoms_and_complaints: {
      chief_complaint: "Doctor, for the past 2 hours my chest feels crushed under heavy stone with unbearable stabbing pain. I can barely breathe, and I'm breaking into a cold sweat. Please check me quickly, it feels like my chest is tearing.",
      selected_symptoms: ["Chest Pain", "Difficulty Breathing", "Sweating", "Dizziness"],
      duration: "2 hours",
      onset_trend: "Worsening rapidly",
      severity_self_reported: "Severe (8/10)",
      associated_symptoms: ["Left arm heaviness", "Cold diaphoresis"],
      previous_similar_episodes: "Mild breathlessness 6 months ago on climbing stairs",
      verbatim_local_statement: "ଡାକ୍ତର ବାବୁ, ୨ ଘଣ୍ଟା ହେଲା ଛାତିଟା ପଥର ଭଳି ଭାରି ଲାଗୁଛି ଆଉ ବହୁତ ଜୋରରେ କଣେଇକି ଦରଦ ହେଉଛି। ନିଶ୍ୱାସ ଆଦୌ ନେଇପାରୁନି, ଦେହ ସାରା ଝାଳରେ ଥଣ୍ଡା ପଡ଼ିଗଲାଣି। ଟିକେ ଶୀଘ୍ର ଦେଖନ୍ତୁ ବାବୁ, ଛାତି ଫାଟିଯିବା ଭଳି ଲାଗୁଛି।",
      phonetic_transliteration: "Doctor babu, 2 ghanta hela chhatita pathara bhali bhari laguchhi au bahut jor re kaneiki darada heuchhi. Nishwas aadou neiparuni, deha sara jhalare thanda padigalani. Tike shighra dekhantu babu, chhati fatijiba bhali laguchhi.",
      translated_english_statement: "Doctor, for the past 2 hours my chest feels crushed under heavy stone with unbearable stabbing pain. I can barely breathe, and I'm breaking into a cold sweat. Please check me quickly, it feels like my chest is tearing."
    },
    vital_signs: {
      temperature_f: 99.8,
      spo2_percent: 89,
      heart_rate_bpm: 112,
      bp_systolic: 158,
      bp_diastolic: 96,
      respiratory_rate_min: 26,
      blood_glucose_mg_dl: 142,
      weight_kg: 68
    },
    medical_history: {
      existing_conditions: ["Hypertension (5 years)", "Type 2 Diabetes"],
      previous_surgeries: [],
      previous_hospitalizations: ["2024 - Viral Pneumonia"],
      current_medications: ["Amlodipine 5mg irregular", "Metformin 500mg"],
      known_allergies: ["Penicillin (Severe Allergy Risk)", "Sulfa drugs"],
      family_history: "Father had myocardial infarction at age 58"
    },
    uploaded_reports: [
      {
        report_type: "ECG_and_Lipid_Profile",
        file_name: "prev_ecg_and_lipid.jpg",
        ocr_extracted_text: "Hb: 12.8 g/dL, WBC: 11,400 /cumm, Total Cholesterol: 228 mg/dL, LDL: 168 mg/dL, Prior ECG: LVH strain pattern, ST depression V5-V6",
        key_findings: ["Prior ECG shows LVH with lateral ST changes", "Dyslipidemia: LDL 168 mg/dL", "Mild Leukocytosis: WBC 11,400 /cumm"]
      }
    ],
    visual_inputs: [
      {
        image_category: "Swelling_Edema",
        user_caption: "Mild bilateral ankle swelling noticed for 3 days",
        ai_supporting_observation: "Visible mild pitting pedal edema noted; non-diagnostic physical context."
      }
    ],
    red_flag_checklist: {
      severe_chest_pain: true,
      severe_breathing_difficulty: true,
      very_low_oxygen_spo2: true,
      loss_of_consciousness: false,
      severe_bleeding: false,
      seizure: false,
      sudden_weakness_paralysis: false,
      severe_allergic_reaction: false
    }
  },
  {
    id: "PRIYA_FEVER_YELLOW",
    badgeLabel: "🟠 Priya S. (34F) — Hindi Campus High Fever (102.8°F) & Low Platelets",
    priority: "YELLOW",
    priorityHint: "YELLOW",
    patient_basic_info: {
      patient_id: "CAMPUS-1025",
      token_number: "T-025",
      name_or_alias: "Priya S. (Synthetic)",
      age: 34,
      sex: "Female",
      location_state: "Odisha - Khordha (CHC Tangi - NIN: OD-KHD-CHC-204)",
      facility_type: "CHC_TANGI",
      language_preference: "Hindi",
      consent_given: true,
      unconscious_bypass: false,
      emergency_contact: "+91-9876543211",
      abha_id: "91-5912-3341-8842"
    },
    symptoms_and_complaints: {
      chief_complaint: "Sister, my body has been burning with high fever for 3 days. My headache is so blinding I can't even open my eyes. Red spots have appeared all over my arms and legs, and I have zero strength to stand.",
      selected_symptoms: ["High Fever", "Headache", "Body Ache", "Nausea"],
      duration: "3 days",
      onset_trend: "Fluctuating with chills",
      severity_self_reported: "Moderate (6/10)",
      associated_symptoms: ["Retro-orbital eye pain", "Petechial rash", "Extreme fatigue"],
      previous_similar_episodes: "None",
      verbatim_local_statement: "दीदी, ३ दिन से पूरा बदन भट्टी की तरह तप रहा है। सिर में इतना भयानक दर्द है कि आंखें भी नहीं खुल रही हैं। पूरे हाथ-पैरों में लाल चकत्ते निकल आए हैं और चलने की बिल्कुल ताक़त नहीं बची है।",
      phonetic_transliteration: "Didi, 3 din se pura badan bhatti ki tarah tap raha hai. Sir mein itna bhayanak dard hai ki aankhein bhi nahi khul rahi hain. Pure haath-pairon mein laal chakatte nikal aaye hain aur chalne ki bilkul taaqat nahi bachi hai.",
      translated_english_statement: "Sister, my body has been burning with high fever for 3 days. My headache is so blinding I can't even open my eyes. Red spots have appeared all over my arms and legs, and I have zero strength to stand."
    },
    vital_signs: {
      temperature_f: 102.8,
      spo2_percent: 96,
      heart_rate_bpm: 118,
      bp_systolic: 114,
      bp_diastolic: 76,
      respiratory_rate_min: 22,
      blood_glucose_mg_dl: 108,
      weight_kg: 54
    },
    medical_history: {
      existing_conditions: [],
      previous_surgeries: [],
      previous_hospitalizations: [],
      current_medications: ["Paracetamol 650mg SOS"],
      known_allergies: []
    },
    uploaded_reports: [
      {
        report_type: "Complete_Blood_Count_CBC",
        file_name: "cbc_report.jpg",
        ocr_extracted_text: "Hemoglobin: 11.2 g/dL, Total Leukocyte Count (TLC): 3,400 /cumm (Leukopenia), Platelet Count: 85,000 /cumm (Thrombocytopenia)",
        key_findings: ["Thrombocytopenia: Platelet count 85,000 /cumm", "Mild Leukopenia: TLC 3,400 /cumm"]
      }
    ],
    visual_inputs: [],
    red_flag_checklist: {
      severe_chest_pain: false,
      severe_breathing_difficulty: false,
      very_low_oxygen_spo2: false,
      loss_of_consciousness: false,
      severe_bleeding: false,
      seizure: false,
      sudden_weakness_paralysis: false,
      severe_allergic_reaction: false
    }
  },
  {
    id: "AARAV_PEDIATRIC_YELLOW",
    badgeLabel: "🟠 Aarav S. (8M) — Hindi / Odia Pediatric Acute Abdomen & Vomiting",
    priority: "YELLOW",
    priorityHint: "YELLOW",
    patient_basic_info: {
      patient_id: "PED-1028",
      token_number: "T-028",
      name_or_alias: "Aarav S. (Synthetic)",
      age: 8,
      sex: "Male",
      location_state: "Odisha - Khordha (CHC Tangi Pediatric Bay - NIN: OD-KHD-CHC-204)",
      facility_type: "CHC_TANGI",
      language_preference: "Hindi",
      consent_given: true,
      unconscious_bypass: false,
      emergency_contact: "+91-9876543218",
      abha_id: "91-3319-4482-7701"
    },
    symptoms_and_complaints: {
      chief_complaint: "Sister, my tummy hurts very badly. I threw up twice since morning and cannot eat anything, it hurts so much.",
      selected_symptoms: ["Severe Abdominal Pain", "Vomiting", "Fever"],
      duration: "12 hours",
      onset_trend: "Worsening colicky pain",
      severity_self_reported: "Moderate (6/10)",
      associated_symptoms: ["Right lower quadrant guarding", "Inability to keep liquids down"],
      previous_similar_episodes: "None",
      verbatim_local_statement: "दीदी, पेट में बहुत तेज दर्द हो रहा है। सुबह से दो बार उल्टी हो गई और कुछ भी खाया नहीं जा रहा, बहुत रोना आ रहा है।",
      phonetic_transliteration: "Didi, pet mein bahut tez dard ho raha hai. Subah se do baar ulti ho gayi aur kuch bhi khaya nahi ja raha, bahut rona aa raha hai.",
      translated_english_statement: "Sister, my tummy hurts very badly. I threw up twice since morning and cannot eat anything, it hurts so much."
    },
    vital_signs: {
      temperature_f: 100.4,
      spo2_percent: 98,
      heart_rate_bpm: 112,
      bp_systolic: 102,
      bp_diastolic: 66,
      respiratory_rate_min: 24,
      blood_glucose_mg_dl: 98,
      weight_kg: 24
    },
    medical_history: {
      existing_conditions: ["Fully immunized for age"],
      previous_surgeries: [],
      previous_hospitalizations: [],
      current_medications: ["Oral rehydration solution SOS"],
      known_allergies: []
    },
    uploaded_reports: [
      {
        report_type: "Complete_Blood_Count_CBC",
        file_name: "pediatric_cbc.jpg",
        ocr_extracted_text: "Hemoglobin: 12.1 g/dL, TLC (WBC): 12,800 /cumm (Mild Leukocytosis with Neutrophilia 78%), Platelets: 2,40,000 /cumm, Urine Routine: Normal",
        key_findings: ["Mild Leukocytosis (WBC 12,800 /cumm)", "Neutrophilia 78% suggestive of acute inflammatory response", "Suspected acute mesenteric lymphadenitis vs early appendicitis"]
      }
    ],
    visual_inputs: [],
    red_flag_checklist: {
      severe_chest_pain: false,
      severe_breathing_difficulty: false,
      very_low_oxygen_spo2: false,
      loss_of_consciousness: false,
      severe_bleeding: false,
      seizure: false,
      sudden_weakness_paralysis: false,
      severe_allergic_reaction: false
    }
  },
  {
    id: "SUBHASH_HEADACHE_GREEN",
    badgeLabel: "🟢 Subhash P. (24M) — English Mild Screen Fatigue & Tension Headache",
    priority: "GREEN",
    priorityHint: "GREEN",
    patient_basic_info: {
      patient_id: "PHC-1026",
      token_number: "T-026",
      name_or_alias: "Subhash P. (Synthetic)",
      age: 24,
      sex: "Male",
      location_state: "Odisha - Bhubaneswar (Capital Hospital - NIN: OD-DHH-401)",
      facility_type: "DH_CAPITAL_BBSR",
      language_preference: "English",
      consent_given: true,
      unconscious_bypass: false,
      emergency_contact: "+91-9876543212",
      abha_id: "91-1192-8840-2349"
    },
    symptoms_and_complaints: {
      chief_complaint: "Good morning sister, I've had a mild throbbing headache across my forehead since yesterday after long study hours. No fever or vomiting, just feeling tired.",
      selected_symptoms: ["Headache", "Fatigue"],
      duration: "2 days",
      onset_trend: "Constant mild",
      severity_self_reported: "Mild (3/10)",
      associated_symptoms: ["Mild neck stiffness after screen work"],
      previous_similar_episodes: "Occasional screen fatigue",
      verbatim_local_statement: "Good morning sister, I've had a mild throbbing headache across my forehead since yesterday after long study hours. No fever or vomiting, just feeling tired.",
      phonetic_transliteration: "Good morning sister, I've had a mild throbbing headache across my forehead since yesterday after long study hours. No fever or vomiting, just feeling tired.",
      translated_english_statement: "Good morning sister, I've had a mild throbbing headache across my forehead since yesterday after long study hours. No fever or vomiting, just feeling tired."
    },
    vital_signs: {
      temperature_f: 98.6,
      spo2_percent: 98,
      heart_rate_bpm: 72,
      bp_systolic: 120,
      bp_diastolic: 80,
      respiratory_rate_min: 16,
      blood_glucose_mg_dl: 94,
      weight_kg: 65
    },
    medical_history: {
      existing_conditions: [],
      previous_surgeries: [],
      previous_hospitalizations: [],
      current_medications: [],
      known_allergies: []
    },
    uploaded_reports: [],
    visual_inputs: [],
    red_flag_checklist: {
      severe_chest_pain: false,
      severe_breathing_difficulty: false,
      very_low_oxygen_spo2: false,
      loss_of_consciousness: false,
      severe_bleeding: false,
      seizure: false,
      sudden_weakness_paralysis: false,
      severe_allergic_reaction: false
    }
  },
  {
    id: "MEENA_MATERNAL_RED",
    badgeLabel: "🔴 Meena D. (28F) — Odia Maternal 34w Pre-eclampsia Risk (BP 168/110)",
    priority: "RED",
    priorityHint: "RED",
    patient_basic_info: {
      patient_id: "MATERNAL-1019",
      token_number: "T-019",
      name_or_alias: "Meena D. (Synthetic)",
      age: 28,
      sex: "Female",
      location_state: "Odisha - Khordha (CHC Tangi Maternal Wing - NIN: OD-KHD-CHC-204)",
      facility_type: "CHC_TANGI",
      language_preference: "Odia",
      consent_given: true,
      unconscious_bypass: false,
      emergency_contact: "+91-9876543213",
      abha_id: "91-7723-1194-6502"
    },
    symptoms_and_complaints: {
      chief_complaint: "Nurse didi, I am 8 months pregnant. Since yesterday evening I have a severe throbbing headache, blurred vision, and my feet are so swollen my slippers won't fit.",
      selected_symptoms: ["Severe Headache", "Swelling / Edema", "Visual Disturbance"],
      duration: "24 hours",
      onset_trend: "Worsening",
      severity_self_reported: "Severe (8/10)",
      associated_symptoms: ["Blurred vision", "Upper epigastric discomfort"],
      previous_similar_episodes: "None in earlier trimesters",
      verbatim_local_statement: "ମାଉସୀ, ମୋତେ ୮ ମାସ ଚାଲିଛି। ଗତକାଲି ସଞ୍ଜରୁ ମୁଣ୍ଡଟା କାଠ ଭଳିଆ ଖୁବ୍ ବିନ୍ଧୁଛି, ଆଖିକୁ ଝାପ୍ସା ଦିଶୁଛି ଆଉ ଗୋଡ଼ ଦୁଇଟା ଫୁଲି ଯାଇ ଚପଲ ପଶୁନି।",
      phonetic_transliteration: "Mausi, mote 8 masa chalichhi. Gatakali sanjaru mundata katha bhalia khub bindhuchhi, aakhiku jhapsa disuchhi au goda duita fuli jai chapala pasuni.",
      translated_english_statement: "Nurse didi, I am 8 months pregnant. Since yesterday evening I have a severe throbbing headache, blurred vision, and my feet are so swollen my slippers won't fit."
    },
    vital_signs: {
      temperature_f: 99.1,
      spo2_percent: 97,
      heart_rate_bpm: 98,
      bp_systolic: 168,
      bp_diastolic: 110,
      respiratory_rate_min: 20,
      blood_glucose_mg_dl: 118,
      weight_kg: 62
    },
    medical_history: {
      existing_conditions: ["Primigravida (34 weeks gestation)"],
      previous_surgeries: [],
      previous_hospitalizations: [],
      current_medications: ["Iron-Folic Acid tabs", "Calcium 500mg"],
      known_allergies: []
    },
    uploaded_reports: [
      {
        report_type: "ANC_Card_and_Urine_Test",
        file_name: "anc_card.jpg",
        ocr_extracted_text: "ANC Visit 3: Gestation 34 weeks, Fundal height 33 cm, Urine Albumin: 2+ (Proteinuria), Prior BP at 28w: 124/82 mmHg",
        key_findings: ["New-onset Severe Hypertension (168/110)", "Urine Albumin 2+ on dipstick", "High Pre-eclampsia risk profile"]
      }
    ],
    visual_inputs: [
      {
        image_category: "Swelling_Edema",
        user_caption: "Non-dependent facial puffiness and bilateral pedal edema",
        ai_supporting_observation: "Puffiness over periorbital and facial areas noted along with bilateral ankle edema."
      }
    ],
    red_flag_checklist: {
      severe_chest_pain: false,
      severe_breathing_difficulty: false,
      very_low_oxygen_spo2: false,
      loss_of_consciousness: false,
      severe_bleeding: false,
      seizure: false,
      sudden_weakness_paralysis: false,
      severe_allergic_reaction: false
    }
  },
  {
    id: "RAJESH_TOXIC_YELLOW",
    badgeLabel: "🟠 Rajesh M. (45M) — Hindi Industrial Solvent Inhalation (SpO2 92%)",
    priorityHint: "YELLOW",
    patient_basic_info: {
      patient_id: "IND-1027",
      token_number: "T-027",
      name_or_alias: "Rajesh M. (Synthetic)",
      age: 45,
      sex: "Male",
      location_state: "Odisha - Jagatsinghpur (Paradeep Industrial Estate - NIN: OD-JSP-IEH-301)",
      facility_type: "IND_PARADEEP",
      language_preference: "Hindi",
      consent_given: true,
      unconscious_bypass: false,
      emergency_contact: "+91-9876543214",
      abha_id: "91-3829-1142-9901"
    },
    symptoms_and_complaints: {
      chief_complaint: "Chemical solvent vapor exposure with acute throat irritation, lacrimation, and persistent coughing.",
      selected_symptoms: ["Cough", "Eye Redness", "Throat Irritation"],
      duration: "1 hour",
      onset_trend: "Acute after shift leak",
      severity_self_reported: "Moderate (5/10)",
      associated_symptoms: ["Lacrimation", "Retrosternal soreness"],
      previous_similar_episodes: "None",
      verbatim_local_statement: "फैक्ट्री में केमिकल सॉल्वेंट का धुआं सांस में चला गया, गले में जलन और लगातार खांसी हो रही है।",
      phonetic_transliteration: "Factory mein chemical solvent ka dhuwan saans mein chala gaya, gale mein jalan aur lagataar khansi ho rahi hai.",
      translated_english_statement: "Inhaled chemical solvent vapors at the factory, experiencing acute throat irritation and persistent coughing."
    },
    vital_signs: {
      temperature_f: 99.2,
      spo2_percent: 92,
      heart_rate_bpm: 108,
      bp_systolic: 142,
      bp_diastolic: 90,
      respiratory_rate_min: 24,
      blood_glucose_mg_dl: 122,
      weight_kg: 72
    },
    medical_history: {
      existing_conditions: ["Smoker (10 years)"],
      previous_surgeries: [],
      previous_hospitalizations: [],
      current_medications: [],
      known_allergies: []
    },
    uploaded_reports: [],
    visual_inputs: [
      {
        image_category: "Eye_Redness",
        user_caption: "Bilateral conjunctival suffusion after solvent exposure",
        ai_supporting_observation: "Mild bilateral conjunctival hyperaemia noted; ocular irrigation context."
      }
    ],
    red_flag_checklist: {
      severe_chest_pain: false,
      severe_breathing_difficulty: false,
      very_low_oxygen_spo2: false,
      loss_of_consciousness: false,
      severe_bleeding: false,
      seizure: false,
      sudden_weakness_paralysis: false,
      severe_allergic_reaction: false
    }
  },
  {
    id: "KAMALA_NCD_GREEN",
    badgeLabel: "🟢 Kamala B. (68F) — Odia Mobile Health Camp NCD Check-In & Joint Pain",
    priorityHint: "GREEN",
    patient_basic_info: {
      patient_id: "CAMP-1028",
      token_number: "T-028",
      name_or_alias: "Kamala B. (Synthetic)",
      age: 68,
      sex: "Female",
      location_state: "Odisha - Koraput (Mobile Tribal Outreach Camp - NIN: OD-KPT-MOBI-501)",
      facility_type: "CAMP_KORAPUT",
      language_preference: "Odia",
      consent_given: true,
      unconscious_bypass: false,
      emergency_contact: "+91-9876543215",
      abha_id: "91-9012-4482-1940"
    },
    symptoms_and_complaints: {
      chief_complaint: "Routine chronic medicine refill for blood pressure and diabetes with mild knee joint ache.",
      selected_symptoms: ["Joint Pain", "Routine Check-in"],
      duration: "1 month",
      onset_trend: "Chronic stable",
      severity_self_reported: "Mild (2/10)",
      associated_symptoms: ["None"],
      previous_similar_episodes: "Known chronic bilateral knee osteoarthritis",
      verbatim_local_statement: "ମୋତେ ବ୍ଲଡ୍ ପ୍ରେସର ଆଉ ସୁଗାର ନିୟମିତ ଔଷଧ ଲେଖାଇବାକୁ ଆସିଛି, ଆଣ୍ଠୁ ଅଳ୍ପ ବିନ୍ଧୁଛି।",
      phonetic_transliteration: "Mote blood pressure au sugar niyamita aushadha lekhaibaku aasichhi, aanthu alpa bindhuchhi.",
      translated_english_statement: "I have come for routine refill of my BP and diabetes medications; have mild chronic knee discomfort."
    },
    vital_signs: {
      temperature_f: 98.4,
      spo2_percent: 97,
      heart_rate_bpm: 76,
      bp_systolic: 134,
      bp_diastolic: 86,
      respiratory_rate_min: 17,
      blood_glucose_mg_dl: 154,
      weight_kg: 58
    },
    medical_history: {
      existing_conditions: ["Hypertension (10 years)", "Type 2 Diabetes (6 years)", "Bilateral Knee Osteoarthritis"],
      previous_surgeries: ["Cataract right eye (2022)"],
      previous_hospitalizations: [],
      current_medications: ["Telmisartan 40mg daily", "Metformin 500mg BD"],
      known_allergies: []
    },
    uploaded_reports: [],
    visual_inputs: [],
    red_flag_checklist: {
      severe_chest_pain: false,
      severe_breathing_difficulty: false,
      very_low_oxygen_spo2: false,
      loss_of_consciousness: false,
      severe_bleeding: false,
      seizure: false,
      sudden_weakness_paralysis: false,
      severe_allergic_reaction: false
    }
  },
  {
    id: "ARVIND_RESPIRATORY_RED",
    badgeLabel: "🔴 Arvind N. (58M) — AIIMS New Delhi Hypoxia & Severe Dyspnea (SpO2 86%)",
    priorityHint: "RED",
    patient_basic_info: {
      patient_id: "AIIMS-1029",
      token_number: "T-029",
      name_or_alias: "Arvind N. (Synthetic)",
      age: 58,
      sex: "Male",
      location_state: "New Delhi (AIIMS New Delhi - NIN: DL-NDLS-AIIMS-001)",
      facility_type: "AIIMS_NEW_DELHI",
      language_preference: "Hindi",
      consent_given: true,
      unconscious_bypass: false,
      emergency_contact: "+91-9876543216",
      abha_id: "91-6632-8819-4401"
    },
    symptoms_and_complaints: {
      chief_complaint: "Doctor, I cannot draw enough air into my lungs. Since last night my breathlessness has rapidly escalated and my lips feel numb. Even sitting up leaves me completely exhausted and gasping.",
      selected_symptoms: ["Difficulty Breathing", "Chest Pain", "Fatigue", "Cough"],
      duration: "12 hours",
      onset_trend: "Worsening rapidly",
      severity_self_reported: "Severe (9/10)",
      associated_symptoms: ["Central cyanosis", "Use of accessory muscles"],
      previous_similar_episodes: "Known COPD baseline dyspnea",
      verbatim_local_statement: "डॉक्टर साहब, साँस बिल्कुल अंदर नहीं जा रही है। रात से दम इतना घुट रहा है कि बोला भी नहीं जा रहा। होंठ नीले पड़ रहे हैं, तुरंत कुछ कीजिए।",
      phonetic_transliteration: "Doctor sahab, saans bilkul andar nahi jaa rahi hai. Raat se dam itna ghut raha hai ki bola bhi nahi jaa raha. Hoth neele pad rahe hain, turant kuch kijiye.",
      translated_english_statement: "Doctor, I cannot breathe in at all. Since last night my chest is suffocating so severely I can barely speak. My lips feel numb, please help immediately."
    },
    vital_signs: {
      temperature_f: 100.4,
      spo2_percent: 86,
      heart_rate_bpm: 122,
      bp_systolic: 164,
      bp_diastolic: 98,
      respiratory_rate_min: 30,
      blood_glucose_mg_dl: 138,
      weight_kg: 74
    },
    medical_history: {
      existing_conditions: ["COPD (Grade 3)", "Hypertension (8 years)"],
      previous_surgeries: [],
      previous_hospitalizations: ["2025 - Acute Exacerbation of COPD"],
      current_medications: ["Tiotropium inhaler", "Telmisartan 40mg"],
      known_allergies: ["Penicillin"]
    },
    uploaded_reports: [
      {
        report_type: "Arterial_Blood_Gas_ABG",
        file_name: "abg_report.jpg",
        ocr_extracted_text: "pH: 7.28, PaO2: 52 mmHg (Severe Hypoxemia), PaCO2: 58 mmHg (Hypercapnic Respiratory Acidosis), HCO3: 28 mEq/L",
        key_findings: ["Severe Hypoxemic & Hypercapnic Respiratory Failure", "PaO2 52 mmHg on Room Air"]
      }
    ],
    visual_inputs: [],
    red_flag_checklist: {
      severe_chest_pain: false,
      severe_breathing_difficulty: true,
      very_low_oxygen_spo2: true,
      loss_of_consciousness: false,
      severe_bleeding: false,
      seizure: false,
      sudden_weakness_paralysis: false,
      severe_allergic_reaction: false
    }
  },
  {
    id: "SURESH_CHEMICAL_YELLOW",
    badgeLabel: "🟠 Suresh T. (44M) — Thane MIDC Industrial Chlorine Exposure (SpO2 91%)",
    priorityHint: "YELLOW",
    patient_basic_info: {
      patient_id: "THN-1030",
      token_number: "T-030",
      name_or_alias: "Suresh T. (Synthetic)",
      age: 44,
      sex: "Male",
      location_state: "Maharashtra - Thane (Thane MIDC Industrial Health Unit - NIN: MH-THN-MIDC-402)",
      facility_type: "THANE_MIDC",
      language_preference: "Hindi",
      consent_given: true,
      unconscious_bypass: false,
      emergency_contact: "+91-9876543217",
      abha_id: "91-8842-1954-3320"
    },
    symptoms_and_complaints: {
      chief_complaint: "Exposure to chlorine gas leak at chemical plant with acute severe coughing, retrosternal burning, and wheezing.",
      selected_symptoms: ["Cough", "Difficulty Breathing", "Eye Redness"],
      duration: "45 minutes",
      onset_trend: "Acute post-industrial leak",
      severity_self_reported: "Moderate (6/10)",
      associated_symptoms: ["Wheezing", "Profuse lacrimation"],
      previous_similar_episodes: "None",
      verbatim_local_statement: "फैक्ट्री में क्लोरीन गैस पाइपलाइन से रिसाव हुआ, सीने में भयानक जलन और सांस खींचने में सीटी जैसी आवाज आ रही है।",
      phonetic_transliteration: "Factory mein chlorine gas pipeline se risav hua, seene mein bhayanak jalan aur saans kheenchne mein seeti jaisi aawaz aa rahi hai.",
      translated_english_statement: "Chlorine gas leaked from the factory pipeline; experiencing severe chest burning and high-pitched wheezing when breathing in."
    },
    vital_signs: {
      temperature_f: 99.0,
      spo2_percent: 91,
      heart_rate_bpm: 110,
      bp_systolic: 146,
      bp_diastolic: 92,
      respiratory_rate_min: 25,
      blood_glucose_mg_dl: 116,
      weight_kg: 70
    },
    medical_history: {
      existing_conditions: ["Mild allergic rhinitis"],
      previous_surgeries: [],
      previous_hospitalizations: [],
      current_medications: ["Levocetirizine SOS"],
      known_allergies: []
    },
    uploaded_reports: [],
    visual_inputs: [],
    red_flag_checklist: {
      severe_chest_pain: false,
      severe_breathing_difficulty: false,
      very_low_oxygen_spo2: false,
      loss_of_consciousness: false,
      severe_bleeding: false,
      seizure: false,
      sudden_weakness_paralysis: false,
      severe_allergic_reaction: false
    }
  }
];

export const FACILITY_SCENARIOS = [
  {
    id: "PHC_JATNI",
    label: "🏥 PHC Jatni (Khordha - NIN: OD-KHD-PHC-102)",
    name: "PHC Jatni",
    nin: "OD-KHD-PHC-102",
    tier: "Primary Health Centre (PHC)",
    district: "Khordha",
    referral: "Capital Hospital (District Headquarter Hospital, Bhubaneswar - NIN: OD-DHH-401) / SCB Medical College & Hospital (Cuttack Tertiary Apex Bay - NIN: OD-MCH-001)",
    desc: "Primary Health Center • NIN: OD-KHD-PHC-102"
  },
  {
    id: "CHC_TANGI",
    label: "🏥 CHC Tangi (Khordha - NIN: OD-KHD-CHC-204)",
    name: "CHC Tangi",
    nin: "OD-KHD-CHC-204",
    tier: "Community Health Centre (CHC)",
    district: "Khordha",
    referral: "Capital Hospital / AIIMS Bhubaneswar",
    desc: "Community Health Center • NIN: OD-KHD-CHC-204"
  },
  {
    id: "DH_CAPITAL_BBSR",
    label: "🏥 Capital Hospital (District Headquarter Hospital, Bhubaneswar - NIN: OD-DHH-401)",
    name: "Capital Hospital",
    nin: "OD-DHH-401",
    tier: "District Headquarter Hospital (DHH)",
    district: "Bhubaneswar / Khordha",
    referral: "SCB Medical College & Hospital (Cuttack Tertiary Apex Bay - NIN: OD-MCH-001)",
    desc: "District Headquarter Hospital • NIN: OD-DHH-401"
  },
  {
    id: "MCH_SCB_CUTTACK",
    label: "🏥 SCB Medical College & Hospital (Cuttack Tertiary Apex Bay - NIN: OD-MCH-001)",
    name: "SCB Medical College & Hospital",
    nin: "OD-MCH-001",
    tier: "Tertiary Medical College & Hospital (MCH)",
    district: "Cuttack",
    referral: "Apex State Trauma & Resuscitation Center",
    desc: "Tertiary Care & Apex Emergency Bay • NIN: OD-MCH-001"
  },
  {
    id: "IND_PARADEEP",
    label: "🏭 Paradeep Industrial Health Unit (IOCL/Port Trust Belt - NIN: OD-JSP-IEH-301)",
    name: "Paradeep Industrial Health Unit",
    nin: "OD-JSP-IEH-301",
    tier: "Occupational & Industrial Health Unit",
    district: "Jagatsinghpur",
    referral: "District Hospital Jagatsinghpur / SCB Medical College",
    desc: "Occupational Health Center • Industrial Estate"
  },
  {
    id: "CAMP_KORAPUT",
    label: "⛺ Mobile Public Health Camp (Koraput Tribal Outreach - NIN: OD-KPT-MOBI-501)",
    name: "Mobile Public Health Camp (Koraput Tribal Outreach)",
    nin: "OD-KPT-MOBI-501",
    tier: "NHM Tribal Outreach Mobile Unit",
    district: "Koraput",
    referral: "Saheed Laxman Nayak (SLN) Medical College, Koraput",
    desc: "National Health Mission Tribal Outreach"
  },
  {
    id: "AIIMS_NEW_DELHI",
    label: "🏛️ AIIMS New Delhi (National Apex Institute - NIN: DL-NDLS-AIIMS-001)",
    name: "AIIMS New Delhi",
    nin: "DL-NDLS-AIIMS-001",
    tier: "National Apex Medical Institute & Quaternary Center",
    district: "New Delhi",
    referral: "AIIMS Apex Trauma Center & Critical Resuscitation Bay",
    desc: "National Apex Referral Center • NIN: DL-NDLS-AIIMS-001"
  },
  {
    id: "THANE_MIDC",
    label: "🏭 Thane MIDC Industrial Health Unit (Maharashtra - NIN: MH-THN-MIDC-402)",
    name: "Thane MIDC Industrial Health Unit",
    nin: "MH-THN-MIDC-402",
    tier: "Industrial Occupational Health Center",
    district: "Thane / Mumbai Suburban",
    referral: "Chhatrapati Shivaji Maharaj Hospital, Kalwa / KEM Hospital Mumbai",
    desc: "Industrial Worker Screening • Western Zone"
  }
];



export const SAMPLE_REPORTS = [
  {
    id: "CBC_PLATELETS",
    name: "CBC Lab Slip (Platelets 85,000 / TLC 3,400)",
    report_type: "Complete_Blood_Count_CBC",
    text: "Hemoglobin: 11.2 g/dL, Total Leukocyte Count (TLC): 3,400 /cumm, Platelet Count: 85,000 /cumm (Thrombocytopenia), Hematocrit: 34.2%",
    findings: ["Thrombocytopenia: Platelet 85k", "Mild Leukopenia: TLC 3,400 /cumm"]
  },
  {
    id: "ECG_LVH",
    name: "Prior 12-Lead ECG Slip (LVH Strain Pattern)",
    report_type: "ECG_Report",
    text: "Sinus Rhythm with rate 98 bpm. PR interval 160 ms. Sokolow-Lyon criteria positive for Left Ventricular Hypertrophy (LVH). ST-T wave inversion in leads V5, V6, I, aVL.",
    findings: ["LVH Strain Pattern", "Lateral ST-T depression", "Prior hypertensive cardiac remodeling"]
  },
  {
    id: "ANC_URINE",
    name: "Maternal ANC Card (Albumin 2+ / BP 168/110)",
    report_type: "ANC_Card_and_Urine_Test",
    text: "ANC Visit 3 (34 weeks): Fundal height 33cm. Urine Protein Dipstick: 2+ Albuminuria. Sitting BP: 168/110 mmHg. FHR 142 bpm regular.",
    findings: ["Urine Protein 2+", "Severe Hypertension 168/110 mmHg", "High pre-eclampsia risk"]
  },
  {
    id: "LIPID_PROFILE",
    name: "Lipid Profile & Glucose (LDL 168 / FBS 195)",
    report_type: "Lipid_and_Glucose",
    text: "Fasting Blood Sugar: 195 mg/dL (Elevated). Total Cholesterol: 242 mg/dL. LDL Cholesterol: 168 mg/dL (High). Serum Creatinine: 1.1 mg/dL.",
    findings: ["Uncontrolled Fasting Glucose 195 mg/dL", "Dyslipidemia: LDL 168 mg/dL"]
  }
];

export const SAMPLE_AUDIO_SCRIPTS = {
  Odia: [
    {
      label: "🔴 ଛାତିରେ ଭାରି ପଥର ଭଳି ଦରଦ ଓ ଝାଳ (Ramesh - 62Y Male)",
      age: 62,
      gender: "Male",
      text: "ଡାକ୍ତର ବାବୁ, ୨ ଘଣ୍ଟା ହେଲା ଛାତିଟା ପଥର ଭଳି ଭାରି ଲାଗୁଛି ଆଉ ବହୁତ ଜୋରରେ କଣେଇକି ଦରଦ ହେଉଛି। ନିଶ୍ୱାସ ଆଦୌ ନେଇପାରୁନି, ଦେହ ସାରା ଝାଳରେ ଥଣ୍ଡା ପଡ଼ିଗଲାଣି। ଟିକେ ଶୀଘ୍ର ଦେଖନ୍ତୁ ବାବୁ, ଛାତି ଫାଟିଯିବା ଭଳି ଲାଗୁଛି।",
      phonetic: "Doctor babu, 2 ghanta hela chhatita pathara bhali bhari laguchhi au bahut jor re kaneiki darada heuchhi. Nishwas aadou neiparuni, deha sara jhalare thanda padigalani. Tike shighra dekhantu babu, chhati fatijiba bhali laguchhi.",
      translation: "Doctor, for the past 2 hours my chest feels crushed under heavy stone with unbearable stabbing pain. I can barely breathe, and I'm breaking into a cold sweat. Please check me quickly, it feels like my chest is tearing."
    },
    {
      label: "🟠 ୩ ଦିନ ହେଲା ଭୀଷଣ ଜ୍ୱର ଓ ବିନ୍ଧା (Priya - 34Y Female)",
      age: 34,
      gender: "Female",
      text: "ଦିଦି, ୩ ଦିନ ହେଲା ଦେହ ସାରା ନିଆଁ ଭଳି ତାତିଛି। ମୁଣ୍ଡଟା ଏତେ ଜୋରରେ ବିନ୍ଧୁଛି ଯେ ଆଖି ଖୋଲି ହେଉନି। ହାତ ଗୋଡ଼ରେ ଲାଲ୍ ଦାଗ ବାହାରି ପଡ଼ିଛି ଆଉ ଚାଲିବାକୁ ଜମା ବଳ ପାଉନି।",
      phonetic: "Didi, 3 dina hela deha sara nia bhali tatichhi. Mundata ete jor re bindhuchhi je aakhi kholi heuni. Hata godare laal daga bahari padichhi au chalibaku jama bala pauni.",
      translation: "Sister, my body has been burning with high fever for 3 days. My headache is so blinding I can't even open my eyes. Red petechial rashes have appeared on my arms and legs, and I have zero strength to stand."
    },
    {
      label: "🟡 ପିଲାଙ୍କ ପେଟବିନ୍ଧା ଓ ବାନ୍ତି (Aarav - 8Y Male Child / ୮ ବର୍ଷର ଶିଶୁ ଆରଭ)",
      age: 8,
      gender: "Male",
      text: "ଦିଦି, ପେଟଟା ଭୀଷଣ ବିନ୍ଧୁଛି। ସକାଳୁ ୨ ଥର ବାନ୍ତି ହେଲାଣି ଆଉ କିଛି ଖାଇ ହେଉନି, ବହୁତ କଷ୍ଟ ହେଉଛି।",
      phonetic: "Didi, petata bhisana bindhuchhi. Sakalu 2 thara banti helani au kichhi khai heuni, bahut kasta heuchhi.",
      translation: "Sister, my tummy hurts very badly. I threw up twice since morning and cannot eat anything, it hurts a lot."
    },
    {
      label: "🟢 ସାମାନ୍ୟ ମୁଣ୍ଡବିନ୍ଧା ଓ ଥକାପଣ (Subhash - 24Y Male)",
      age: 24,
      gender: "Male",
      text: "ନମସ୍କାର ଦିଦି, ଗତକାଲି ରାତିରେ ଅନେକ ସମୟ ଧରି ପାଠ ପଢ଼ିବା ପରେ ମଥାଟା ସାମାନ୍ୟ ବିନ୍ଧୁଛି। ଜ୍ୱର କି ବାନ୍ତି କିଛି ନାହିଁ, କେବଳ ଟିକେ ଥକା ଲାଗୁଛି।",
      phonetic: "Namaskar didi, gatakali raatire aneka samaya dhari patha padhiba pare mathata samanya bindhuchhi. Jwara ki banti kichhi naahi, kebala tike thaka laguchhi.",
      translation: "Good morning sister, I've had a mild throbbing headache across my forehead since yesterday after long study hours. No fever or vomiting, just feeling tired."
    },
    {
      label: "🔴 ଗର୍ଭାବସ୍ଥା ୮ ମାସ ମୁଣ୍ଡବିନ୍ଧା ଓ ଗୋଡ଼ଫୁଲା (Meena - 28Y Female Maternal / ମୀନା)",
      age: 28,
      gender: "Female",
      text: "ମାଉସୀ, ମୋତେ ୮ ମାସ ଚାଲିଛି। ଗତକାଲି ସଞ୍ଜରୁ ମୁଣ୍ଡଟା କାଠ ଭଳିଆ ଖୁବ୍ ବିନ୍ଧୁଛି, ଆଖିକୁ ଝାପ୍ସା ଦିଶୁଛି ଆଉ ଗୋଡ଼ ଦୁଇଟା ଫୁଲି ଯାଇ ଚପଲ ପଶୁନି।",
      phonetic: "Mausi, mote 8 masa chalichhi. Gatakali sanjaru mundata katha bhalia khub bindhuchhi, aakhiku jhapsa disuchhi au goda duita fuli jai chapala pasuni.",
      translation: "Nurse didi, I am 8 months pregnant. Since yesterday evening I have a severe throbbing headache, blurred vision, and my feet are so swollen my slippers won't fit."
    }
  ],
  Hindi: [
    {
      label: "🔴 सीने में भारी पत्थर जैसा दर्द और पसीना (Ramesh - 62Y Male)",
      age: 62,
      gender: "Male",
      text: "डॉक्टर साहब, २ घंटे से सीने में भारी पत्थर जैसा दर्द हो रहा है और बहुत तेज चुभन महसूस हो रही है। सांस बिल्कुल नहीं आ रही, शरीर पसीने से ठंडा पड़ गया है। कृपया जल्दी देखें, लग रहा है सीना फट जाएगा।",
      phonetic: "Doctor sahab, 2 ghante se seene mein bhari patthar jaisa dard ho raha hai aur bahut tez chubhan mehsoos ho rahi hai. Saans bilkul nahi aa rahi, shareer paseene se thanda pad gaya hai. Kripya jaldi dekhein, lag raha hai seena phat jayega.",
      translation: "Doctor, for the past 2 hours my chest feels crushed under heavy stone with unbearable stabbing pain. I can barely breathe, and I'm breaking into a cold sweat. Please check me quickly, it feels like my chest is tearing."
    },
    {
      label: "🟠 पूरा बदन भट्टी जैसा तप रहा है (Priya - 34Y Female)",
      age: 34,
      gender: "Female",
      text: "दीदी, ३ दिन से पूरा बदन भट्टी की तरह तप रहा है। सिर में इतना भयानक दर्द है कि आंखें भी नहीं खुल रही हैं। पूरे हाथ-पैरों में लाल चकत्ते निकल आए हैं और चलने की बिल्कुल ताक़त नहीं बची है।",
      phonetic: "Didi, 3 din se pura badan bhatti ki tarah tap raha hai. Sir mein itna bhayanak dard hai ki aankhein bhi nahi khul rahi hain. Pure haath-pairon mein laal chakatte nikal aaye hain aur chalne ki bilkul taaqat nahi bachi hai.",
      translation: "Sister, my body has been burning with high fever for 3 days. My headache is so blinding I can't even open my eyes. Red spots have appeared all over my arms and legs, and I have zero strength to stand."
    },
    {
      label: "🟡 बच्चे के पेट में तेज दर्द व उल्टी (Aarav - 8Y Male Child / ८ वर्ष का बालक)",
      age: 8,
      gender: "Male",
      text: "दीदी, पेट में बहुत तेज दर्द हो रहा है। सुबह से दो बार उल्टी हो गई और कुछ भी खाया नहीं जा रहा, बहुत रोना आ रहा है।",
      phonetic: "Didi, pet mein bahut tez dard ho raha hai. Subah se do baar ulti ho gayi aur kuch bhi khaya nahi ja raha, bahut rona aa raha hai.",
      translation: "Sister, my tummy hurts very badly. I threw up twice since morning and cannot eat anything, it hurts so much."
    },
    {
      label: "🟢 हल्की थकान व पढ़ाई से सिरदर्द (Subhash - 24Y Male)",
      age: 24,
      gender: "Male",
      text: "नमस्ते दीदी, कल देर रात तक स्क्रीन पर पढ़ाई करने के बाद से माथे में हल्का-हल्का दर्द है। कोई बुखार या उल्टी नहीं है, बस थोड़ी थकान महसूस हो रही है।",
      phonetic: "Namaste didi, kal der raat tak screen par padhai karne ke baad se maathe mein halka-halka dard hai. Koi bukhar ya ulti nahi hai, bas thodi thakan mehsoos ho rahi hai.",
      translation: "Good morning sister, I've had a mild throbbing headache across my forehead since yesterday after long study hours. No fever or vomiting, just feeling tired."
    },
    {
      label: "🔴 गर्भावस्था ८ माह सिरदर्द व पैरों में सूजन (Meena - 28Y Female Maternal / मीना)",
      age: 28,
      gender: "Female",
      text: "नर्स दीदी, मुझे ८ महीने का गर्भ है। कल शाम से सिर बहुत तेज फटने जैसा दर्द कर रहा है, आंखों के आगे धुंधलापन आ रहा है और दोनों पैर इतने सूज गए हैं कि चप्पल नहीं आ रही।",
      phonetic: "Nurse didi, mujhe 8 mahine ka garbh hai. Kal shaam se सिर bahut tez phatne jaisa dard kar raha hai, aankhon ke aage dhundhlapan aa raha hai aur dono pair itne sooj gaye hain ki chappal nahi aa rahi.",
      translation: "Nurse didi, I am 8 months pregnant. Since yesterday evening I have a severe throbbing headache, blurred vision, and my feet are so swollen my slippers won't fit."
    }
  ],
  English: [
    {
      label: "🔴 Sudden Crushing Chest Pain & Sweating (Ramesh - 62Y Male)",
      age: 62,
      gender: "Male",
      text: "Doctor, for the past 2 hours my chest feels crushed under heavy stone with unbearable stabbing pain. I can barely breathe, and I'm breaking into a cold sweat. Please check me quickly, it feels like my chest is tearing.",
      phonetic: "Doctor, for the past 2 hours my chest feels crushed under heavy stone with unbearable stabbing pain. I can barely breathe, and I'm breaking into a cold sweat. Please check me quickly, it feels like my chest is tearing.",
      translation: "Doctor, for the past 2 hours my chest feels crushed under heavy stone with unbearable stabbing pain. I can barely breathe, and I'm breaking into a cold sweat. Please check me quickly, it feels like my chest is tearing."
    },
    {
      label: "🟠 Burning High Fever & Body Ache (Priya - 34Y Female)",
      age: 34,
      gender: "Female",
      text: "Sister, for the past 3 days my entire body has been burning with high fever. My headache is so severe that I can't even open my eyes. Red spots have appeared across my arms and legs, and I have zero strength to stand.",
      phonetic: "Sister, for the past 3 days my entire body has been burning with high fever. My headache is so severe that I can't even open my eyes. Red spots have appeared across my arms and legs, and I have zero strength to stand.",
      translation: "Sister, my body has been burning with high fever for 3 days. My headache is so blinding I can't even open my eyes. Red spots have appeared all over my arms and legs, and I have zero strength to stand."
    },
    {
      label: "🟡 Severe Tummy Pain & Vomiting (Aarav - 8Y Male Child)",
      age: 8,
      gender: "Male",
      text: "Sister, my stomach hurts so much. I threw up twice this morning and I can't eat anything, it hurts really bad.",
      phonetic: "Sister, my stomach hurts so much. I threw up twice this morning and I can't eat anything, it hurts really bad.",
      translation: "Sister, my stomach hurts so much. I threw up twice this morning and I can't eat anything, it hurts really bad."
    },
    {
      label: "🟢 Mild Screen Fatigue & Study Headache (Subhash - 24Y Male)",
      age: 24,
      gender: "Male",
      text: "Good morning sister, I've had a mild throbbing headache across my forehead since yesterday after long study hours. No fever or vomiting, just feeling tired.",
      phonetic: "Good morning sister, I've had a mild throbbing headache across my forehead since yesterday after long study hours. No fever or vomiting, just feeling tired.",
      translation: "Good morning sister, I've had a mild throbbing headache across my forehead since yesterday after long study hours. No fever or vomiting, just feeling tired."
    },
    {
      label: "🔴 Maternal 34w Pre-eclampsia & Swelling (Meena - 28Y Female Maternal)",
      age: 28,
      gender: "Female",
      text: "Nurse didi, I am 8 months pregnant. Since yesterday evening I have a severe throbbing headache, blurred vision, and my feet are so swollen my slippers won't fit.",
      phonetic: "Nurse didi, I am 8 months pregnant. Since yesterday evening I have a severe throbbing headache, blurred vision, and my feet are so swollen my slippers won't fit.",
      translation: "Nurse didi, I am 8 months pregnant. Since yesterday evening I have a severe throbbing headache, blurred vision, and my feet are so swollen my slippers won't fit."
    }
  ],
  Bengali: [
    {
      label: "🔴 বুকটা পাথরের মতো ভারী ও তীব্র চিনচিনে ব্যথা (Ramesh - 62Y Male)",
      age: 62,
      gender: "Male",
      text: "ডাক্তারবাবু, ২ ঘণ্টা ধরে বুকটা পাথরের মতো ভারী লাগছে আর খুব তীব্র চিনচিনে ব্যথা হচ্ছে। শ্বাস একদম নিতে পারছি না, সারা শরীর ঘামে ঠান্ডা হয়ে গেছে। একটু তাড়াতাড়ি দেখুন বাবু, মনে হচ্ছে বুকটা ফেটে যাবে।",
      phonetic: "Daktarbabu, 2 ghonta dhore bukta pathorer moto bhari lagchhe ar khub tibro chinchine byatha hochhe. Shwas ekdom nite parchhi na, sara shorir ghame thanda hoye gechhe. Ektu taratari dekhun babu, mone hochhe bukta phete jabe.",
      translation: "Doctor, for the past 2 hours my chest feels crushed under heavy stone with unbearable stabbing pain. I can barely breathe, and I'm breaking into a cold sweat. Please check me quickly, it feels like my chest is tearing."
    },
    {
      label: "🟠 পুরো শরীর আগুনের মতো জ্বলছে ও তীব্র যন্ত্রণা (Priya - 34Y Female)",
      age: 34,
      gender: "Female",
      text: "দিদি, ৩ দিন ধরে পুরো শরীর আগুনের মতো জ্বলছে। মাথায় এত তীব্র যন্ত্রণা যে চোখ খুলতে পারছি না। হাত-পায়ে লাল দাগ ফুটে উঠেছে আর হাঁটার একদম শক্তি নেই।",
      phonetic: "Didi, 3 din dhore puro shorir aguner moto jwolchhe. Mathay eto tibro jontrona je chokh khulte parchhi na. Hath-paye laal daag phute uthechhe ar haatar ekdom shokti nei.",
      translation: "Sister, my body has been burning with high fever for 3 days. My headache is so blinding I can't even open my eyes. Red spots have appeared all over my arms and legs, and I have zero strength to stand."
    },
    {
      label: "🟡 পেটে খুব জোরে ব্যথা ও বমি (Aarav - 8Y Male Child)",
      age: 8,
      gender: "Male",
      text: "দিদি, পেটে খুব জোরে ব্যথা করছে। সকাল থেকে দু'বার বমি হয়ে গেছে আর কিছুই খেতে পারছি না, খুব কষ্ট হচ্ছে।",
      phonetic: "Didi, pete khub jore byatha korchhe. Sokal theke dubar bomi hoye gechhe ar kichhui khete parchhi na, khub koshto hochhe.",
      translation: "Sister, my tummy hurts very badly. I threw up twice since morning and cannot eat anything, it hurts a lot."
    },
    {
      label: "🟢 পরীক্ষার পর কপালে হালকা ব্যথা ও ক্লান্তি (Subhash - 24Y Male)",
      age: 24,
      gender: "Male",
      text: "নমস্কার দিদি, কাল রাতে পরীক্ষার পড়ার পর কপালে হালকা ব্যথা করছে। কোনো জ্বর বা বমি নেই, শুধু একটু ক্লান্তি লাগছে।",
      phonetic: "Nomoshkar didi, kaal raate porikshar porar por kopale halka byatha korchhe. Kono jwor ba bomi nei, shudhu ektu klanti lagchhe.",
      translation: "Good morning sister, I've had a mild throbbing headache across my forehead since yesterday after long study hours. No fever or vomiting, just feeling tired."
    },
    {
      label: "🔴 গর্ভাবস্থা ৮ মাস মাথায় যন্ত্রণা ও পা ফোলা (Meena - 28Y Female Maternal)",
      age: 28,
      gender: "Female",
      text: "নার্স দিদি, আমার ৮ মাসের গর্ভ চলছে। কাল সন্ধ্যা থেকে মাথায় প্রচণ্ড যন্ত্রণা হচ্ছে, চোখের সামনে সব ঝাপসা দেখছি আর দুটো পা এত ফুলে গেছে যে চটি পরতে পারছি না।",
      phonetic: "Nurse didi, amar 8 masher gorbho cholchhe. Kaal sondhya theke mathay prochondo jontrona hochhe, chokher shamne shob jhapsa dekhchhi ar duto pa eto phule gechhe je choti porte parchhi na.",
      translation: "Nurse didi, I am 8 months pregnant. Since yesterday evening I have a severe throbbing headache, blurred vision, and my feet are so swollen my slippers won't fit."
    }
  ],
  Tamil: [
    {
      label: "🔴 நெஞ்சு பாராங்கல் போல அழுத்துகிறது மற்றும் தாங்க முடியாத வலி (Ramesh - 62Y Male)",
      age: 62,
      gender: "Male",
      text: "டாக்டர் ஐயா, இரண்டு மணி நேரமாக நெஞ்சு பாராங்கல் போல அழுத்துகிறது மற்றும் தாங்க முடியாத ஊசி குத்துவது போன்ற வலி இருக்கிறது. மூச்சு விடவே முடியவில்லை, உடல் முழுவதும் குளிர்ந்து வியர்த்து கொட்டுகிறது. சீக்கிரம் பாருங்கள் ஐயா, நெஞ்சு வெடிப்பது போல் இருக்கிறது.",
      phonetic: "Doctor aiya, irandu mani neramaga nenju paarangal pola aluthugirathu matrum thaanga mudiyatha oosi kuthuvathu pondra vali irukkirathu. Moochu vidave mudiyavillai, udal muzhuvathum kulirnthu viyarthu kottugirathu. Seekiram paarungal aiya, nenju vedippathu pol irukkirathu.",
      translation: "Doctor, for the past 2 hours my chest feels crushed under heavy stone with unbearable stabbing pain. I can barely breathe, and I'm breaking into a cold sweat. Please check me quickly, it feels like my chest is tearing."
    },
    {
      label: "🟠 உடம்பு நெருப்பு போல கொதிக்கிறது மற்றும் கடுமையான தலைவலி (Priya - 34Y Female)",
      age: 34,
      gender: "Female",
      text: "அக்கா, 3 நாட்களாக உடம்பு நெருப்பு போல கொதிக்கிறது. தலை பயங்கரமாக வலிக்கிறது, கண்ணையே திறக்க முடியவில்லை. கை கால்களில் சிவப்பு புள்ளிகள் வந்துவிட்டன, எழுந்து நடக்கக் கூட தெம்பு இல்லை.",
      phonetic: "Akka, 3 naatkalaga udambu neruppu pola kothikkirathu. Thalai bayangaramaaga valikkirathu, kannaiye thirakka mudiyavillai. Kai kaalgalil sivappu pulligal vanthuvittana, ezhunthu nadakka kooda thembu illai.",
      translation: "Sister, my body has been burning with high fever for 3 days. My headache is so blinding I can't even open my eyes. Red spots have appeared all over my arms and legs, and I have zero strength to stand."
    },
    {
      label: "🟡 வயிறு பயங்கரமா வலிக்குது வாந்தி எடுத்திட்டேன் (Aarav - 8Y Male Child)",
      age: 8,
      gender: "Male",
      text: "அக்கா, வயிறு ரொம்ப பயங்கரமா வலிக்குது. காலையில இருந்து ரெண்டு தடவ வாந்தி எடுத்திட்டேன், ஒண்ணுமே சாப்பிட முடியல, ரொம்ப கஷ்டமா இருக்கு.",
      phonetic: "Akka, vayiru romba bayangarama valikkuthu. Kaalaiyila irunthu rendu thadava vaanthi eduthitten, onnumey saapida mudiyala, romba kashtama irukku.",
      translation: "Sister, my tummy hurts very badly. I threw up twice since morning and cannot eat anything, it hurts a lot."
    },
    {
      label: "🟢 தேர்வுக்கு படித்ததால் லேசான தலைவலி (Subhash - 24Y Male)",
      age: 24,
      gender: "Male",
      text: "வணக்கம் அக்கா, நேற்று இரவு தேர்வுக்கு படித்ததால் நெற்றியில் லேசான தலைவலி இருக்கிறது. காய்ச்சல் அல்லது வாந்தி எதுவும் இல்லை, கொஞ்சம் சோர்வாக உள்ளது.",
      phonetic: "Vanakkam akka, netru iravu thervukku padithathaal netriyil lesaana thalaivali irukkirathu. Kaaichal allathu vaanthi ethuvum illai, konjam sorvaaga ullathu.",
      translation: "Good morning sister, I've had a mild throbbing headache across my forehead since yesterday after long study hours. No fever or vomiting, just feeling tired."
    },
    {
      label: "🔴 8 மாத கர்ப்பம் தலைவலி மற்றும் கால்கள் வீக்கம் (Meena - 28Y Female Maternal)",
      age: 28,
      gender: "Female",
      text: "நர்ஸ் அக்கா, எனக்கு 8 மாத கர்ப்பம். நேற்று மாலையில் இருந்து தலை பயங்கரமாக வலிக்கிறது, கண்ணும் மங்கலாக தெரிகிறது, இரண்டு கால்களும் வீங்கி செருப்பு கூட போட முடியவில்லை.",
      phonetic: "Nurse akka, enakku 8 maatha karppam. Netru maalaiyil irunthu thalai bayangaramaaga valikkirathu, kannum mangalaaga therigirathu, irandu kaalgalum veengi seruppu kooda poda mudiyavillai.",
      translation: "Nurse didi, I am 8 months pregnant. Since yesterday evening I have a severe throbbing headache, blurred vision, and my feet are so swollen my slippers won't fit."
    }
  ],
  Telugu: [
    {
      label: "🔴 గుండె మీద రాయి పెట్టినట్లు బరువుగా విపరీతమైన నొప్పి (Ramesh - 62Y Male)",
      age: 62,
      gender: "Male",
      text: "డాక్టర్ గారూ, రెండు గంటల నుంచి గుండె మీద రాయి పెట్టినట్లు బరువుగా ఉంది మరియు విపరీతమైన పొడుస్తున్న నొప్పిగా ఉంది. ఊపిరి అస్సలు ఆడటం లేదు, ఒళ్లంతా చల్లటి చెమటలు పట్టేస్తున్నాయి. త్వరగా చూడండి బాబూ, గుండె పగిలిపోయేలా ఉంది.",
      phonetic: "Doctor garoo, rendu gantala nunchi gunde meeda raayi pettinatlu baruvuga undi mariyu vipareetamaina podustunna noppiga undi. Oopiri assalu aadatam ledu, ollantaa challati chematalu pattesthunnaayi. Tvaraga choodandi baboo, gunde pagilipoyela undi.",
      translation: "Doctor, for the past 2 hours my chest feels crushed under heavy stone with unbearable stabbing pain. I can barely breathe, and I'm breaking into a cold sweat. Please check me quickly, it feels like my chest is tearing."
    },
    {
      label: "🟠 ఒళ్లంతా నిప్పులా కాలిపోతోంది తీవ్రమైన తలనొప్పి (Priya - 34Y Female)",
      age: 34,
      gender: "Female",
      text: "అక్కా, మూడు రోజుల నుంచి ఒళ్లంతా నిప్పులా కాలిపోతోంది. తలనొప్పి ఎంత తీవ్రంగా ఉందంటే కళ్లు కూడా తెరవలేకపోతున్నాను. కాళ్లు చేతులపై ఎర్రటి మచ్చలు వచ్చాయి, నడవడానికి అస్సలు శక్తి లేదు.",
      phonetic: "Akka, moodu rojula nunchi ollantaa nippulaa kaalipothondi. Talanroppi entha teevramgaa undante kallu kooda teravalekapothunnaanu. Kaallu chetulapai errati machalu vachhaayi, nadavadaaniki assalu shakti ledu.",
      translation: "Sister, my body has been burning with high fever for 3 days. My headache is so blinding I can't even open my eyes. Red spots have appeared all over my arms and legs, and I have zero strength to stand."
    },
    {
      label: "🟡 కడుపులో విపరీతంగా నొప్పి వాంతులు (Aarav - 8Y Male Child)",
      age: 8,
      gender: "Male",
      text: "అక్కా, కడుపులో విపరీతంగా నొప్పిగా ఉంది. పొద్దున్నుంచి రెండుసార్లు వాంతులు అయ్యాయి, ఏమీ తినలేకపోతున్నాను, చాలా ఏడుపు వస్తోంది.",
      phonetic: "Akka, kadupulo vipareetamgaa noppiga undi. Poddununchi rendusarlu vaanthulu ayyaayi, emee tinalekapothunnaanu, chaala edupu vasthondi.",
      translation: "Sister, my tummy hurts very badly. I threw up twice since morning and cannot eat anything, it hurts a lot."
    },
    {
      label: "🟢 చదువుకున్న తర్వాత నుదిటిలో కొద్దిగా తలనొప్పి (Subhash - 24Y Male)",
      age: 24,
      gender: "Male",
      text: "నమస్కారం అక్కా, నిన్న రాత్రి పరీక్షల కోసం చదువుకున్న తర్వాత నుదిటిలో కొద్దిగా తలనొప్పిగా ఉంది. జ్వరం లేదా వాంతులు ఏమీ లేవు, కాస్త నీరసంగా ఉంది.",
      phonetic: "Namaskaram akka, ninna raatri pareekshala kosam chaduvukunna tarvata nuditilo koddigaa talanoppiga undi. Jwaram leda vaanthulu emee levu, kaasta neerasamgaa undi.",
      translation: "Good morning sister, I've had a mild throbbing headache across my forehead since yesterday after long study hours. No fever or vomiting, just feeling tired."
    },
    {
      label: "🔴 8 నెలల గర్భం తలనొప్పి మరియు కాళ్ల వాపు (Meena - 28Y Female Maternal)",
      age: 28,
      gender: "Female",
      text: "నర్సు అక్కా, నాకు 8 నెలల గర్భం. నిన్న సాయంత్రం నుంచి తల బద్దలయ్యేంత తీవ్రమైన నొప్పిగా ఉంది, కళ్లు మసకగా కనిపిస్తున్నాయి, రెండు కాళ్లూ బాగా వాచిపోయి చెప్పులు కూడా పట్టడం లేదు.",
      phonetic: "Nurse akka, naaku 8 nelala garbham. Ninna saayantram nunchi tala baddalayyentha teevramaina noppiga undi, kallu masakaga kanipisthunnaayi, rendu kaalloo baagaa vaachipoyi cheppulu kooda pattadam ledu.",
      translation: "Nurse didi, I am 8 months pregnant. Since yesterday evening I have a severe throbbing headache, blurred vision, and my feet are so swollen my slippers won't fit."
    }
  ]
};
