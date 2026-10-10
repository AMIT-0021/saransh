/**
 * Indic Medical Speech Normalizer & Colloquial Idiom Extractor
 * Saransh (सारांश) — Healthcare Innovation Engine
 * 
 * Accurately translates regional colloquial idioms (Odia, Hindi, Indian English)
 * into standardized SNOMED-CT / ICD-10 aligned clinical terminology.
 */

// Comprehensive Indic Vernacular Medical Idiom Dictionary
export const INDIC_MEDICAL_IDIOMS = {
  Odia: [
    {
      idiom: "ଛାତି ଫାଟିଯିବା",
      phonetic: "chhati fatijiba",
      clinicalTerm: "Severe Retrosternal Stabbing Chest Pain",
      category: "Cardiac / Emergency",
      severity: "CRITICAL",
      icon: "🫀",
      mappedSymptom: "Chest Pain"
    },
    {
      idiom: "ଛାତିରେ କଣେଇକି ଦରଦ",
      phonetic: "chhatire kaneiki darada",
      clinicalTerm: "Severe Retrosternal Stabbing Chest Pain",
      category: "Cardiac / Emergency",
      severity: "CRITICAL",
      icon: "🫀",
      mappedSymptom: "Chest Pain"
    },
    {
      idiom: "ପଥର ଭଳି ଭାରି",
      phonetic: "pathara bhali bhari",
      clinicalTerm: "Crushing Sub-Sternal Chest Heaviness",
      category: "Cardiac / Angina",
      severity: "CRITICAL",
      icon: "🪨",
      mappedSymptom: "Chest Pain"
    },
    {
      idiom: "ନିଶ୍ୱାସ ଆଦୌ ନେଇପାରୁନି",
      phonetic: "nishwas aadou neiparuni",
      clinicalTerm: "Severe Acute Dyspnea / Respiratory Distress",
      category: "Pulmonary / Critical",
      severity: "CRITICAL",
      icon: "🫁",
      mappedSymptom: "Difficulty Breathing"
    },
    {
      idiom: "ସାନ୍ସ ନେଇ ହେଉନି",
      phonetic: "saans nei heuni",
      clinicalTerm: "Severe Acute Dyspnea",
      category: "Pulmonary / Critical",
      severity: "CRITICAL",
      icon: "🫁",
      mappedSymptom: "Difficulty Breathing"
    },
    {
      idiom: "ଦମ ଘୁଟୁଛି",
      phonetic: "dam ghutuchhi",
      clinicalTerm: "Severe Air Hunger / Asphyxiation Sensation",
      category: "Pulmonary / Critical",
      severity: "CRITICAL",
      icon: "🫁",
      mappedSymptom: "Difficulty Breathing"
    },
    {
      idiom: "ଝାଳରେ ଦେହ ଥଣ୍ଡା ପଡ଼ିଯିବା",
      phonetic: "jhalare deha thanda padijiba",
      clinicalTerm: "Cold Diaphoresis / Shock Sign",
      category: "Hemodynamic / Shock",
      severity: "CRITICAL",
      icon: "💦",
      mappedSymptom: "Sweating"
    },
    {
      idiom: "ଝାଳରେ ଥଣ୍ଡା ପଡ଼ିଗଲାଣି",
      phonetic: "jhalare thanda padigalani",
      clinicalTerm: "Cold Diaphoresis / Shock Sign",
      category: "Hemodynamic / Shock",
      severity: "CRITICAL",
      icon: "💦",
      mappedSymptom: "Sweating"
    },
    {
      idiom: "କାଲି ସଞ୍ଜରୁ",
      phonetic: "kali sanjaru",
      clinicalTerm: "Onset ~14 hours ago (Yesterday Evening)",
      category: "Chronological Timeline",
      severity: "INFO",
      icon: "⏳",
      inferredTimeline: "Onset ~14 hours ago (Yesterday evening)"
    },
    {
      idiom: "ଗତକାଲି ସଞ୍ଜରୁ",
      phonetic: "gatakali sanjaru",
      clinicalTerm: "Onset ~14 hours ago (Yesterday Evening)",
      category: "Chronological Timeline",
      severity: "INFO",
      icon: "⏳",
      inferredTimeline: "Onset ~14 hours ago (Yesterday evening)"
    },
    {
      idiom: "୨ ଘଣ୍ଟା ହେଲା",
      phonetic: "2 ghanta hela",
      clinicalTerm: "Acute Onset (2 hours ago)",
      category: "Chronological Timeline",
      severity: "INFO",
      icon: "⏱️",
      inferredTimeline: "Acute onset 2 hours ago"
    },
    {
      idiom: "୩ ଦିନ ହେଲା",
      phonetic: "3 dina hela",
      clinicalTerm: "Sub-acute Duration (3 days)",
      category: "Chronological Timeline",
      severity: "INFO",
      icon: "📅",
      inferredTimeline: "Duration: 3 days"
    },
    {
      idiom: "ଆଖିକୁ ଝାପ୍ସା ଦିଶୁଛି",
      phonetic: "aakhiku jhabsa disuchhi",
      clinicalTerm: "Acute Visual Blurring / Scotoma",
      category: "Neuro / Obstetric Red Flag",
      severity: "HIGH",
      icon: "👁️",
      mappedSymptom: "Blurred Vision"
    },
    {
      idiom: "ଚପଲ ପଶୁନି",
      phonetic: "chapala pasuni",
      clinicalTerm: "Severe Dependent Pedal Edema",
      category: "Vascular / Pre-eclampsia",
      severity: "HIGH",
      icon: "🦶",
      mappedSymptom: "Swelling / Edema"
    },
    {
      idiom: "ମୁଣ୍ଡଟା କାଠ ଭଳିଆ ଖୁବ୍ ବିନ୍ଧୁଛି",
      phonetic: "mundata katha bhalia khub bindhuchhi",
      clinicalTerm: "Severe Throbbing Frontal Cephalea",
      category: "Neurological",
      severity: "HIGH",
      icon: "🧠",
      mappedSymptom: "Headache"
    },
    {
      idiom: "ମୁଣ୍ଡ ବୁଲେଇବା",
      phonetic: "munda buleiba",
      clinicalTerm: "Vertigo / Presyncope / Dizziness",
      category: "Neurological",
      severity: "MEDIUM",
      icon: "💫",
      mappedSymptom: "Dizziness"
    }
  ],

  Hindi: [
    {
      idiom: "सीने में भारी पत्थर",
      phonetic: "seene mein bhari patthar",
      clinicalTerm: "Severe Retrosternal Chest Heaviness",
      category: "Cardiac / Angina",
      severity: "CRITICAL",
      icon: "🪨",
      mappedSymptom: "Chest Pain"
    },
    {
      idiom: "सीना भारी पत्थर जैसा",
      phonetic: "seena bhari patthar jaisa",
      clinicalTerm: "Severe Retrosternal Chest Heaviness",
      category: "Cardiac / Angina",
      severity: "CRITICAL",
      icon: "🪨",
      mappedSymptom: "Chest Pain"
    },
    {
      idiom: "सीना फट जाएगा",
      phonetic: "seena fat jaayega",
      clinicalTerm: "Tearing Retrosternal Chest Pain",
      category: "Cardiac / Aortic / Emergency",
      severity: "CRITICAL",
      icon: "🚨",
      mappedSymptom: "Chest Pain"
    },
    {
      idiom: "छाती में तेज चुभन",
      phonetic: "chhati mein tez chubhan",
      clinicalTerm: "Acute Stabbing Pleuritic / Precordial Pain",
      category: "Cardiac / Pulmonary",
      severity: "CRITICAL",
      icon: "🫀",
      mappedSymptom: "Chest Pain"
    },
    {
      idiom: "तेज चुभन महसूस हो रही है",
      phonetic: "tez chubhan mahsoos ho rahi hai",
      clinicalTerm: "Acute Precordial Stabbing Sensation",
      category: "Cardiac / Pulmonary",
      severity: "CRITICAL",
      icon: "🫀",
      mappedSymptom: "Chest Pain"
    },
    {
      idiom: "पसीने से ठंडा",
      phonetic: "paseene se thanda",
      clinicalTerm: "Cold Diaphoresis / Shock Sign",
      category: "Hemodynamic / Shock",
      severity: "CRITICAL",
      icon: "💦",
      mappedSymptom: "Sweating"
    },
    {
      idiom: "सांस बिल्कुल नहीं आ रही",
      phonetic: "saans bilkul nahi aa rahi",
      clinicalTerm: "Severe Acute Dyspnea / Air Hunger",
      category: "Pulmonary / Critical",
      severity: "CRITICAL",
      icon: "🫁",
      mappedSymptom: "Difficulty Breathing"
    },
    {
      idiom: "छाती फटने जैसा दर्द",
      phonetic: "chhati fatne jaisa dard",
      clinicalTerm: "Tearing Retrosternal Chest Pain",
      category: "Cardiac / Aortic / Emergency",
      severity: "CRITICAL",
      icon: "🚨",
      mappedSymptom: "Chest Pain"
    },
    {
      idiom: "सांस बहुत फूल रही है",
      phonetic: "saans bahut phool rahi hai",
      clinicalTerm: "Acute Dyspnea / Respiratory Distress",
      category: "Pulmonary / Critical",
      severity: "CRITICAL",
      icon: "🫁",
      mappedSymptom: "Difficulty Breathing"
    },
    {
      idiom: "सांस नहीं ले पा रहे",
      phonetic: "saans nahi le pa rahe",
      clinicalTerm: "Severe Acute Dyspnea",
      category: "Pulmonary / Critical",
      severity: "CRITICAL",
      icon: "🫁",
      mappedSymptom: "Difficulty Breathing"
    },
    {
      idiom: "दम इतना घुट रहा है",
      phonetic: "dam itna ghut raha hai",
      clinicalTerm: "Acute Asphyxiation Sensation / Severe Hypoxemia",
      category: "Pulmonary / Critical",
      severity: "CRITICAL",
      icon: "🫁",
      mappedSymptom: "Difficulty Breathing"
    },
    {
      idiom: "बदन भट्टी की तरह तप रहा है",
      phonetic: "badan bhatti ki tarah tap raha hai",
      clinicalTerm: "High Grade Febrile Illness (Pyrexia)",
      category: "Infectious / Pyrexia",
      severity: "HIGH",
      icon: "🔥",
      mappedSymptom: "High Fever"
    },
    {
      idiom: "पूरा बदन भट्टी",
      phonetic: "pura badan bhatti",
      clinicalTerm: "High Grade Febrile Illness",
      category: "Infectious / Pyrexia",
      severity: "HIGH",
      icon: "🔥",
      mappedSymptom: "High Fever"
    },
    {
      idiom: "लाल चकत्ते निकल आए हैं",
      phonetic: "laal chakatte nikal aaye hain",
      clinicalTerm: "Petechial Rash / Dengue Thrombocytopenia Alert",
      category: "Hematological / Infectious",
      severity: "HIGH",
      icon: "🔴",
      mappedSymptom: "Skin Rash"
    },
    {
      idiom: "लाल चकत्ते",
      phonetic: "laal chakatte",
      clinicalTerm: "Petechial Skin Rash / Purpura",
      category: "Hematological / Infectious",
      severity: "HIGH",
      icon: "🔴",
      mappedSymptom: "Skin Rash"
    },
    {
      idiom: "कल शाम से",
      phonetic: "kal shaam se",
      clinicalTerm: "Onset ~14 hours ago (Yesterday Evening)",
      category: "Chronological Timeline",
      severity: "INFO",
      icon: "⏳",
      inferredTimeline: "Onset ~14 hours ago (Yesterday evening)"
    },
    {
      idiom: "२ घंटे से",
      phonetic: "2 ghante se",
      clinicalTerm: "Acute Onset (2 hours ago)",
      category: "Chronological Timeline",
      severity: "INFO",
      icon: "⏱️",
      inferredTimeline: "Acute onset 2 hours ago"
    },
    {
      idiom: "३ दिन से",
      phonetic: "3 din se",
      clinicalTerm: "Sub-acute Duration (3 days)",
      category: "Chronological Timeline",
      severity: "INFO",
      icon: "📅",
      inferredTimeline: "Duration: 3 days"
    },
    {
      idiom: "रात से दम",
      phonetic: "raat se dam",
      clinicalTerm: "Nocturnal Escalation (~8-12 hours)",
      category: "Chronological Timeline",
      severity: "INFO",
      icon: "🌙",
      inferredTimeline: "Escalated since last night (~8-12 hours)"
    },
    {
      idiom: "सिर में भयानक दर्द",
      phonetic: "sir mein bhayanak dard",
      clinicalTerm: "Severe Blinding Cephalea",
      category: "Neurological",
      severity: "HIGH",
      icon: "🧠",
      mappedSymptom: "Headache"
    },
    {
      idiom: "आंखें भी नहीं खुल रही हैं",
      phonetic: "aankhein bhi nahi khul rahi hain",
      clinicalTerm: "Photophobia / Blinding Cephalea",
      category: "Neurological",
      severity: "HIGH",
      icon: "👁️",
      mappedSymptom: "Headache"
    },
    {
      idiom: "चलने की बिल्कुल ताक़त नहीं",
      phonetic: "chalne ki bilkul taaqat nahi",
      clinicalTerm: "Severe Generalized Asthenia / Prostration",
      category: "Constitutional",
      severity: "MEDIUM",
      icon: "🔋",
      mappedSymptom: "Body Ache"
    },
    {
      idiom: "सीटी जैसी आवाज",
      phonetic: "seeti jaisi aawaz",
      clinicalTerm: "Expiratory Wheeze / Bronchospasm",
      category: "Pulmonary / Toxicology",
      severity: "HIGH",
      icon: "🌬️",
      mappedSymptom: "Difficulty Breathing"
    }
  ],

  English: [
    {
      idiom: "crushed under heavy stone",
      clinicalTerm: "Severe Retrosternal Crushing Chest Heaviness",
      category: "Cardiac / Angina",
      severity: "CRITICAL",
      icon: "🪨",
      mappedSymptom: "Chest Pain"
    },
    {
      idiom: "breaking into a cold sweat",
      clinicalTerm: "Cold Diaphoresis / Shock Sign",
      category: "Hemodynamic / Shock",
      severity: "CRITICAL",
      icon: "💦",
      mappedSymptom: "Sweating"
    },
    {
      idiom: "can barely breathe",
      clinicalTerm: "Severe Acute Dyspnea / Air Hunger",
      category: "Pulmonary / Critical",
      severity: "CRITICAL",
      icon: "🫁",
      mappedSymptom: "Difficulty Breathing"
    },
    {
      idiom: "burning with high fever",
      clinicalTerm: "High Grade Febrile Illness (Pyrexia)",
      category: "Infectious / Pyrexia",
      severity: "HIGH",
      icon: "🔥",
      mappedSymptom: "High Fever"
    },
    {
      idiom: "blinding headache",
      clinicalTerm: "Severe Incapacitating Cephalea",
      category: "Neurological",
      severity: "HIGH",
      icon: "🧠",
      mappedSymptom: "Headache"
    },
    {
      idiom: "red spots",
      clinicalTerm: "Petechial Rash / Thrombocytopenia Alert",
      category: "Hematological / Infectious",
      severity: "HIGH",
      icon: "🔴",
      mappedSymptom: "Skin Rash"
    }
  ]
};

/**
 * Normalizes vernacular text and extracts structured medical idioms.
 *
 * @param {string} text - The raw captured speech transcript.
 * @param {string} language - "Odia" | "Hindi" | "English"
 * @returns {object} Normalization result with detected idioms, timeline, and clinical suggestions.
 */
export function normalizeIndicSpeech(text, language = "English") {
  if (!text || typeof text !== "string" || !text.trim()) {
    return {
      rawText: "",
      detectedIdioms: [],
      inferredTimeline: null,
      suggestedSymptoms: [],
      clinicalSummary: ""
    };
  }

  const cleanText = text.trim();
  const lowerText = cleanText.toLowerCase();

  // Search across preferred language first, then all available
  const langKey = language === "Odia" ? "Odia" : language === "Hindi" ? "Hindi" : "English";
  const idiomList = [
    ...(INDIC_MEDICAL_IDIOMS[langKey] || []),
    ...(langKey !== "Odia" ? INDIC_MEDICAL_IDIOMS.Odia : []),
    ...(langKey !== "Hindi" ? INDIC_MEDICAL_IDIOMS.Hindi : []),
    ...(langKey !== "English" ? INDIC_MEDICAL_IDIOMS.English : [])
  ];

  const detectedIdioms = [];
  const suggestedSymptoms = new Set();
  const normDigits = (s) => (s || "").replace(/[०୦]/g, "0").replace(/[१୧]/g, "1").replace(/[२୨]/g, "2").replace(/[३୩]/g, "3").replace(/[४୪]/g, "4").replace(/[५୫]/g, "5").replace(/[६୬]/g, "6").replace(/[७୭]/g, "7").replace(/[८୮]/g, "8").replace(/[९୯]/g, "9");
  const cleanNorm = normDigits(cleanText);
  let inferredTimeline = null;

  for (const item of idiomList) {
    const itemNorm = normDigits(item.idiom);
    const directMatch = cleanText.includes(item.idiom) || cleanNorm.includes(itemNorm);
    const phoneticMatch = item.phonetic ? lowerText.includes(item.phonetic.toLowerCase()) : false;

    if (directMatch || phoneticMatch) {
      if (!detectedIdioms.some((d) => d.clinicalTerm === item.clinicalTerm)) {
        detectedIdioms.push(item);
        if (item.mappedSymptom) {
          suggestedSymptoms.add(item.mappedSymptom);
        }
        if (item.inferredTimeline && !inferredTimeline) {
          inferredTimeline = item.inferredTimeline;
        }
      }
    }
  }

  // Synthesize clinical summary
  const clinicalTerms = detectedIdioms
    .filter((d) => d.category !== "Chronological Timeline")
    .map((d) => d.clinicalTerm);

  const clinicalSummary = clinicalTerms.length > 0
    ? clinicalTerms.join(" • ")
    : cleanText;

  return {
    rawText: cleanText,
    detectedIdioms,
    inferredTimeline,
    suggestedSymptoms: Array.from(suggestedSymptoms),
    clinicalSummary
  };
}
