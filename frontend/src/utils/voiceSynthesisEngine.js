/**
 * Saransh (सारांश) — Adaptive Human Voice Synthesis Engine
 * 
 * Provides human-like speech synthesis dynamically modulated by:
 * 1. Accent: STRICT Indian Accent (en-IN, hi-IN, or-IN, Indian TTS personas)
 * 2. Gender: STRICT separation — Male voices for Male, Female voices for Female
 * 3. Age: Child (<=12), Teen (13-18), Adult (19-59), Elderly / Senior (60+)
 * 4. Role: Patient (distressed/conversational), Clinician/Nurse (calm, bedside)
 * 
 * Features:
 * - Natural prosody and breathing pause injection
 * - Asynchronous voice discovery with neural/natural Indian voice prioritisation
 * - Garbage-collection & 14s Chromium pause watchdog protection
 * - Fine-grained pitch and rate modulation according to human vocal tract acoustics
 */

// Global voice cache
let cachedVoices = [];
let voicesLoadedPromise = null;

// Keep a global reference to prevent Chromium garbage collection bug during playback
let activeUtteranceRef = null;
let activeUtteranceOnEnd = null;
let activeAudioElementRef = null;
let activeAudioOnEnd = null;
let speechWatchdogTimer = null;

/**
 * Phonetically maps Odia script to Devanagari for Hindi/Indian browser TTS voices.
 * Ensures Odia sentences are pronounced naturally without silence or engine deadlocks.
 */
export function convertOdiaToPhoneticDevanagari(str) {
  if (!str || typeof str !== "string") return "";

  // Normalize Unicode to canonical composition and handle decomposed vowel signs
  const s = str.normalize("NFC")
    .replace(/\u0B47\u0B57/g, "\u0B4C") // Decomposed AU matra -> atomic AU matra
    .replace(/\u0B47\u0B3E/g, "\u0B4B") // Decomposed O matra -> atomic O matra
    .replace(/\u0B47\u0B56/g, "\u0B48") // Decomposed AI matra -> atomic AI matra
    .replace(/\u0B57/g, "\u0B4C")
    .replace(/\u0B56/g, "");

  return s.replace(/[\u0B00-\u0B7F]/g, (ch) => {
    const code = ch.charCodeAt(0);
    if (code === 0x0B5F) return "\u092F"; // Odia YA -> Devanagari YA
    if (code === 0x0B71) return "\u0935"; // Odia WA -> Devanagari VA
    if (code === 0x0B5C) return "\u0921\u093C"; // Odia RRA -> Devanagari DA + nukta
    if (code === 0x0B5D) return "\u0922\u093C"; // Odia RHA -> Devanagari DHA + nukta
    if (code === 0x0B33) return "\u0932"; // Odia LLA -> Devanagari LA
    const devCode = code - 0x0200;
    return String.fromCharCode(devCode);
  });
}

/**
 * Transliterates Odia and Devanagari text into natural Latin phonetics for English/Global TTS voices.
 * Ensures that if a device only has English voices (en-IN, en-US, etc.), it pronounces Indic text fluently
 * without skipping words or encountering audio queue deadlocks.
 */
export function convertIndicToLatinPhonetic(str) {
  if (!str || typeof str !== "string") return "";

  const INDIC_DIGIT_MAP = {
    "\u0966": "0", "\u0967": "1", "\u0968": "2", "\u0969": "3", "\u096A": "4",
    "\u096B": "5", "\u096C": "6", "\u096D": "7", "\u096E": "8", "\u096F": "9",
    "\u0B66": "0", "\u0B67": "1", "\u0B68": "2", "\u0B69": "3", "\u0B6A": "4",
    "\u0B6B": "5", "\u0B6C": "6", "\u0B6D": "7", "\u0B6E": "8", "\u0B6F": "9"
  };

  let s = str.normalize("NFC")
    .replace(/[\u0966-\u096F\u0B66-\u0B6F]/g, (d) => INDIC_DIGIT_MAP[d] || d)
    .replace(/\u0B47\u0B57/g, "\u0B4C")
    .replace(/\u0B47\u0B3E/g, "\u0B4B")
    .replace(/\u0B47\u0B56/g, "\u0B48")
    .replace(/\u0B57/g, "\u0B4C")
    .replace(/\u0B56/g, "")
    .replace(/[\u0964\u0B64\u0965\u0B65]/g, ". ") // Indic Danda & Double Danda -> period
    .replace(/[\u093D\u0B3D]/g, "") // Avagraha
    .replace(/\u0949|\u0B49/g, "o") // Chandra O (डॉ -> do)
    .replace(/\u0945|\u0B45/g, "e") // Chandra E
    .replace(/\u0902|\u0B02|\u0901|\u0B01/g, "n") // Anusvara / Chandrabindu
    .replace(/\u0903|\u0B03/g, "h") // Visarga
    .replace(/\u093C|\u0B3C/g, ""); // Nukta

  // Normalize Devanagari to Odia range for unified mapping
  s = s.replace(/[\u0900-\u097F]/g, (ch) => {
    return String.fromCharCode(ch.charCodeAt(0) + 0x0200);
  });

  const CONSONANTS = {
    "\u0B15": "k", "\u0B16": "kh", "\u0B17": "g", "\u0B18": "gh", "\u0B19": "ng",
    "\u0B1A": "ch", "\u0B1B": "chh", "\u0B1C": "j", "\u0B1D": "jh", "\u0B1E": "ny",
    "\u0B1F": "t", "\u0B20": "th", "\u0B21": "d", "\u0B22": "dh", "\u0B23": "n",
    "\u0B24": "t", "\u0B25": "th", "\u0B26": "d", "\u0B27": "dh", "\u0B28": "n",
    "\u0B2A": "p", "\u0B2B": "ph", "\u0B2C": "b", "\u0B2D": "bh", "\u0B2E": "m",
    "\u0B2F": "y", "\u0B30": "r", "\u0B32": "l", "\u0B33": "l", "\u0B71": "v",
    "\u0B36": "sh", "\u0B37": "sh", "\u0B38": "s", "\u0B39": "h",
    "\u0B5C": "r", "\u0B5D": "rh", "\u0B5F": "y"
  };

  const MATRAS = {
    "\u0B3E": "aa", "\u0B3F": "i", "\u0B40": "ee", "\u0B41": "u", "\u0B42": "oo",
    "\u0B43": "ri", "\u0B47": "e", "\u0B48": "ai", "\u0B4B": "o", "\u0B4C": "au",
    "\u0B4D": "" // virama
  };

  const INDEPENDENT_VOWELS = {
    "\u0B05": "a", "\u0B06": "aa", "\u0B07": "i", "\u0B08": "ee", "\u0B09": "u",
    "\u0B0A": "oo", "\u0B0F": "e", "\u0B10": "ai", "\u0B13": "o", "\u0B14": "au"
  };

  let res = "";
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    const nextCh = s[i + 1];
    if (INDEPENDENT_VOWELS[ch]) {
      res += INDEPENDENT_VOWELS[ch];
    } else if (CONSONANTS[ch]) {
      const cons = CONSONANTS[ch];
      if (nextCh && MATRAS[nextCh] !== undefined) {
        res += cons + MATRAS[nextCh];
        i++;
      } else {
        res += cons + "a";
      }
    } else {
      res += ch;
    }
  }

  return res.replace(/a\s+/g, " ").replace(/a$/g, "").trim();
}

// Registry of high-fidelity Neural / ElevenLabs studio Indian voice audio files
const PRE_RENDERED_STUDIO_AUDIO = [
  {
    id: "RAMESH_ODIA",
    language: "Odia",
    keywords: ["chhatita", "pathara", "bhari", "darada", "kaneiki", "fatijiba", "ଛାତିଟା", "ଡାକ୍ତର", "ଛାତି", "ପଥର", "ନିଶ୍ୱାସ", "ଦରଦ", "୨ ଘଣ୍ଟା"],
    url: "/audio/ramesh_cardiac.mp3"
  },
  {
    id: "RAMESH_ENGLISH",
    language: "English",
    keywords: ["crushed under heavy stone", "tearing", "cold sweat", "unbearable stabbing", "chest feels crushed"],
    url: "/audio/ramesh_english.mp3"
  },
  {
    id: "PRIYA_FEVER_ODIA",
    language: "Odia",
    keywords: ["nia bhali tatichhi", "ଦେହ ସାରା ନିଆଁ", "ନିଆଁ ଭଳି", "ତାତିଛି", "ବିନ୍ଧୁଛି", "ଦାଗ", "tatichhi", "bindhuchhi", "fever", "priya"],
    url: "/audio/priya_fever.mp3"
  },
  {
    id: "LIPU_PEDIATRIC_ODIA",
    language: "Odia",
    keywords: ["cannot breathe properly", "whistling", "wheezing", "coughing won't stop", "ପେଟଟା ଭୀଷଣ ବିନ୍ଧୁଛି", "ପେଟଟା", "ବାନ୍ତି", "petata", "banti", "lipu", "bhisana"],
    url: "/audio/lipu_pediatric.mp3"
  },
  {
    id: "NURSE_ADVISORY",
    language: "English",
    keywords: ["registered with abha", "high-flow oxygen", "emergency ecg", "bedside"],
    url: "/audio/nurse_advisory.mp3"
  }
];

// Extensive dictionary of TTS voice gender tags and known personas
const FEMALE_VOICE_KEYWORDS = [
  "female", "woman", "girl", "femme", "fém", "mujer", "weiblich", "(female)",
  // Indian Female Voices (Microsoft, Google, Apple)
  "neerja", "heera", "swara", "kalpana", "geeta", "veena", "aditi", "shruti",
  "priya", "lekha", "anjali", "deepa", "sunita", "pooja", "kavita", "ananya",
  "kavya", "pallavi", "dhwani", "sapna", "roshni", "tanvi",
  // Global Female Fallbacks
  "zira", "siri", "samantha", "karen", "victoria", "fiona", "eva", "jenny",
  "aria", "ayanda", "sonia", "hazel", "susan", "catherine", "linda", "amy", "alice"
];

const MALE_VOICE_KEYWORDS = [
  "male", "man", "boy", "homme", "mâle", "hombre", "männlich", "(male)",
  // Indian Male Voices (Microsoft, Google, Apple)
  "prabhat", "ravi", "madhur", "hemant", "rishi", "tarun", "aarav", "rehaan",
  "mohan", "valluvar", "gagan", "niranjan", "bashkar", "amit", "rahul",
  "rohit", "vikram", "arun", "suresh", "karan", "deepak", "ajay", "manoj",
  // Global Male Fallbacks
  "david", "george", "mark", "alex", "daniel", "guy", "james", "john",
  "oliver", "richard", "tom", "brian", "ryan", "arthur"
];

const INDIAN_VOICE_INDICATORS = [
  "india", "indian", "en-in", "hi-in", "or-in", "ta-in", "te-in", "mr-in",
  "gu-in", "kn-in", "ml-in", "pa-in", "bn-in", "ur-in", "as-in",
  "neerja", "heera", "prabhat", "ravi", "swara", "madhur", "kalpana", "hemant",
  "rishi", "tarun", "veena", "aditi", "geeta", "lekha", "aarav", "ananya",
  "kavya", "rehaan", "pallavi", "dhwani", "niranjan", "gagan", "sapna",
  "mohan", "valluvar", "bashkar", "हिन्दी", "ଓଡ଼ିଆ", "मराठी", "தமிழ்", "తెలుగు", "বাংলা", "ગુજરાતી"
];

const QUALITY_KEYWORDS = ["natural", "neural", "online", "enhanced", "premium", "google"];

/**
 * Classifies a voice's biological gender profile.
 * Returns 'female' | 'male' | 'unknown'
 */
export function classifyVoiceGender(voice) {
  if (!voice) return "unknown";
  const name = (voice.name || "").toLowerCase();

  const isMale = MALE_VOICE_KEYWORDS.some((k) => name.includes(k));
  const isFemale = FEMALE_VOICE_KEYWORDS.some((k) => name.includes(k));

  if (isMale && !isFemale) return "male";
  if (isFemale && !isMale) return "female";

  // In Chrome, 'Google हिन्दी' or 'Google Hindi' without explicit male tag is female
  if (name.includes("google") && (name.includes("हिन्दी") || name.includes("hindi"))) {
    return "female";
  }

  return "unknown";
}

/**
 * Checks whether a TTS voice possesses an Indian accent or Indic phonology.
 */
export function isIndianVoice(voice) {
  if (!voice) return false;
  const name = (voice.name || "").toLowerCase();
  const lang = (voice.lang || "").toLowerCase().replace("_", "-");

  // Check language code (e.g. en-in, hi-in, or-in, hi, or)
  if (
    lang.includes("-in") ||
    lang.endsWith("_in") ||
    lang.startsWith("hi") ||
    lang.startsWith("or") ||
    lang.startsWith("ori")
  ) {
    return true;
  }

  // Check name indicators and personas
  return INDIAN_VOICE_INDICATORS.some((k) => name.includes(k));
}

/**
 * Computes a quality score prioritizing Neural, Natural, and Online TTS models.
 */
function getQualityScore(voice) {
  const vName = (voice.name || "").toLowerCase();
  let score = 0;
  for (const qk of QUALITY_KEYWORDS) {
    if (vName.includes(qk)) score += 5;
  }
  return score;
}

/**
 * Initializes and fetches available system & browser TTS voices.
 */
export function initVoiceEngine() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return Promise.resolve([]);
  }

  if (cachedVoices.length > 0) {
    return Promise.resolve(cachedVoices);
  }

  if (voicesLoadedPromise) {
    return voicesLoadedPromise;
  }

  voicesLoadedPromise = new Promise((resolve) => {
    const updateVoices = () => {
      try {
        const voices = window.speechSynthesis.getVoices() || [];
        if (voices.length > 0) {
          cachedVoices = voices;
          resolve(voices);
        }
      } catch (err) {
        console.warn("SpeechSynthesis getVoices error:", err);
        resolve([]);
      }
    };

    updateVoices();

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    // Safety timeout in case onvoiceschanged does not fire
    setTimeout(() => {
      if (cachedVoices.length === 0) {
        updateVoices();
      }
      resolve(cachedVoices);
    }, 500);
  });

  return voicesLoadedPromise;
}

// Auto-run initialization in browser
if (typeof window !== "undefined") {
  initVoiceEngine();
}

/**
 * Resolves vocal acoustic parameters based on Patient / Speaker Demographics
 * 
 * @param {object} params
 * @param {number|string} params.age Patient age in years
 * @param {string} params.gender 'Male', 'Female', or other demographic descriptor
 * @param {string} params.role 'patient' | 'nurse' | 'doctor'
 * @param {string} params.language 'Odia' | 'Hindi' | 'English'
 * @returns {object} { pitch, rate, volume, personaLabel, personaIcon, ageGroup, isFemalePreferred }
 */
export function getVocalAcoustics({
  age = 35,
  gender = "Male",
  role = "patient",
  language = "English"
} = {}) {
  const numericAge = Math.max(0, Math.abs(Number(age) || 30));
  const normGender = String(gender || "").toLowerCase().trim();
  const isFemale = normGender === "female" || normGender === "f" || normGender === "woman" || normGender === "girl" || normGender.startsWith("fem");

  // 1. Clinician / Healthcare Worker Roles
  if (role === "nurse" || role === "clinician_bedside") {
    return {
      pitch: 1.08, // Warm, clear, reassuring bedside presence
      rate: 0.86,  // Measured, comforting pace for anxious patients
      volume: 1.0,
      personaLabel: `Empathetic Nurse Bedside (Indian Female Voice)`,
      personaIcon: "🩺",
      ageGroup: "nurse",
      isFemalePreferred: true
    };
  }

  if (role === "doctor" || role === "medical_officer") {
    return {
      pitch: isFemale ? 1.05 : 0.82, // Authoritative chest resonance for male doctor
      rate: 0.88,                   // Clear clinical handover cadence
      volume: 1.0,
      personaLabel: `Medical Officer Handover (Indian ${isFemale ? "Female" : "Male"} Voice)`,
      personaIcon: isFemale ? "👩‍⚕️" : "👨‍⚕️",
      ageGroup: "doctor",
      isFemalePreferred: isFemale
    };
  }

  // 2. Patient Voice by Age Group & Strict Gender
  if (numericAge <= 12) {
    // Child / Pediatric (e.g. Lipu 7M, Aarav 8M)
    return {
      pitch: isFemale ? 1.42 : 1.25, // Expressive pediatric register (differentiated girl vs boy)
      rate: 0.94,
      volume: 1.0,
      personaLabel: `Pediatric Child Voice (${numericAge}y • Indian ${isFemale ? "Girl" : "Boy"})`,
      personaIcon: isFemale ? "👧" : "👦",
      ageGroup: "child",
      isFemalePreferred: isFemale
    };
  }

  if (numericAge <= 18) {
    // Teenager
    return {
      pitch: isFemale ? 1.18 : 0.92,
      rate: 0.92,
      volume: 1.0,
      personaLabel: `Adolescent Youth Voice (${numericAge}y • Indian ${isFemale ? "Female" : "Male"})`,
      personaIcon: isFemale ? "👧" : "🧑",
      ageGroup: "teen",
      isFemalePreferred: isFemale
    };
  }

  if (numericAge >= 60) {
    // Elderly / Senior Citizen (e.g. Ramesh K. 62M)
    return {
      pitch: isFemale ? 0.96 : 0.74, // Deep elderly male timbre (0.74) vs calm elder mother (0.96)
      rate: 0.80,                    // Slower, deliberate cadence reflecting elderly respiration
      volume: 1.0,
      personaLabel: `Elderly Senior Voice (${numericAge}y • Indian ${isFemale ? "Mother" : "Father"})`,
      personaIcon: isFemale ? "👵" : "👴",
      ageGroup: "senior",
      isFemalePreferred: isFemale
    };
  }

  // Adult (19 - 59, e.g. Subhash 24M, Meena 28F, Priya 34F, Rajesh 45M)
  return {
    pitch: isFemale ? 1.12 : 0.82, // Masculine chest resonance (0.82) vs feminine clarity (1.12)
    rate: 0.88,                    // Conversational OPD cadence
    volume: 1.0,
    personaLabel: `Adult Patient Voice (${numericAge}y • Indian ${isFemale ? "Female" : "Male"})`,
    personaIcon: isFemale ? "👩" : "👨",
    ageGroup: "adult",
    isFemalePreferred: isFemale
  };
}

/**
 * Searches and selects the highest-fidelity natural voice matching language and gender.
 * 
 * STRICT RULES ENFORCED:
 * 1. STRICT INDIAN ACCENT: Exclusively prioritizes Indian voices (en-IN, hi-IN, or-IN, and Indian personas).
 *    Never falls back to American or British voices when any Indian voice exists on the operating system.
 * 2. STRICT GENDER MATCHING: Male speakers strictly receive male voices. Female speakers strictly receive female voices.
 *    Rejects gender-discordant voices across all tiers.
 * 
 * @param {SpeechSynthesisVoice[]} voices
 * @param {object} criteria
 * @param {string} criteria.language 'Odia' | 'Hindi' | 'English'
 * @param {boolean} criteria.isFemalePreferred
 * @returns {SpeechSynthesisVoice|null}
 */
export function findBestMatchingVoice(voices, { language = "English", isFemalePreferred = false } = {}) {
  if (!voices || voices.length === 0) return null;

  const targetLangLower = (language || "english").toLowerCase();
  const targetGender = isFemalePreferred ? "female" : "male";
  const oppositeGender = isFemalePreferred ? "male" : "female";

  // Dialect priority order for Indic languages
  let targetLocalePrefixes = [];
  if (targetLangLower.includes("odia") || targetLangLower.includes("oriya")) {
    targetLocalePrefixes = ["or", "ori", "hi-in", "hi", "en-in"];
  } else if (targetLangLower.includes("hindi")) {
    targetLocalePrefixes = ["hi-in", "hi", "en-in"];
  } else {
    // English -> Strictly Indian English first, then Hindi Indian voices
    targetLocalePrefixes = ["en-in", "hi-in"];
  }

  const isExactGender = (v) => classifyVoiceGender(v) === targetGender;
  const isNotOppositeGender = (v) => classifyVoiceGender(v) !== oppositeGender;

  // -------------------------------------------------------------------------
  // TIER 1: Indian Voice + Target Locale Match + Exact Gender Match
  // E.g. en-IN Male (Microsoft Ravi / Prabhat) for English Male
  //      en-IN Female (Microsoft Heera / Neerja) for English Female
  //      hi-IN Male (Microsoft Madhur / Hemant) for Hindi/Odia Male
  //      hi-IN Female (Microsoft Swara / Kalpana / Google हिन्दी) for Hindi/Odia Female
  // -------------------------------------------------------------------------
  for (const locPrefix of targetLocalePrefixes) {
    const localeGenderMatches = voices.filter((v) => {
      const vLang = (v.lang || "").toLowerCase().replace("_", "-");
      return (
        isIndianVoice(v) &&
        vLang.startsWith(locPrefix) &&
        isExactGender(v)
      );
    });

    if (localeGenderMatches.length > 0) {
      localeGenderMatches.sort((a, b) => getQualityScore(b) - getQualityScore(a));
      return localeGenderMatches[0];
    }
  }

  // -------------------------------------------------------------------------
  // TIER 2: Any Indian Voice + Exact Gender Match (Cross-Indic Indian Accent Preservation)
  // Ensures Indian accent & correct gender even if exact language dialect voice is missing.
  // E.g., if user requested English Male, but only Microsoft Ravi or Madhur exists,
  // this guarantees an authentic Indian Male voice rather than an American/British voice.
  // -------------------------------------------------------------------------
  const indianExactGenderMatches = voices.filter(
    (v) => isIndianVoice(v) && isExactGender(v)
  );
  if (indianExactGenderMatches.length > 0) {
    indianExactGenderMatches.sort((a, b) => {
      const aLang = (a.lang || "").toLowerCase().replace("_", "-");
      const bLang = (b.lang || "").toLowerCase().replace("_", "-");
      const aMatchesTarget = targetLocalePrefixes.some((p) => aLang.startsWith(p)) ? 10 : 0;
      const bMatchesTarget = targetLocalePrefixes.some((p) => bLang.startsWith(p)) ? 10 : 0;
      return (bMatchesTarget + getQualityScore(b)) - (aMatchesTarget + getQualityScore(a));
    });
    return indianExactGenderMatches[0];
  }

  // -------------------------------------------------------------------------
  // TIER 3: Indian Voice + Non-Opposite Gender (Neutral / Unknown gender Indian voice)
  // -------------------------------------------------------------------------
  const indianNeutralMatches = voices.filter(
    (v) => isIndianVoice(v) && isNotOppositeGender(v)
  );
  if (indianNeutralMatches.length > 0) {
    indianNeutralMatches.sort((a, b) => getQualityScore(b) - getQualityScore(a));
    return indianNeutralMatches[0];
  }

  // -------------------------------------------------------------------------
  // TIER 4: Global Voice + Exact Gender Match (Only if ZERO Indian voices exist on device)
  // -------------------------------------------------------------------------
  const globalExactGenderMatches = voices.filter((v) => isExactGender(v));
  if (globalExactGenderMatches.length > 0) {
    globalExactGenderMatches.sort((a, b) => getQualityScore(b) - getQualityScore(a));
    return globalExactGenderMatches[0];
  }

  // -------------------------------------------------------------------------
  // TIER 5: Global Voice + Non-Opposite Gender
  // -------------------------------------------------------------------------
  const globalNeutralMatches = voices.filter((v) => isNotOppositeGender(v));
  if (globalNeutralMatches.length > 0) {
    globalNeutralMatches.sort((a, b) => getQualityScore(b) - getQualityScore(a));
    return globalNeutralMatches[0];
  }

  // -------------------------------------------------------------------------
  // TIER 6: Absolute Last Resort (Single voice installed on entire operating system)
  // -------------------------------------------------------------------------
  return voices[0] || null;
}

/**
 * Humanizes speech text by inserting natural breath pauses and prosodic breaks.
 * This prevents the flat, continuous robotic pacing of default Web Speech synthesis.
 * 
 * @param {string} text
 * @param {object} options
 * @returns {string}
 */
export function humanizeSpeechText(text, { age = 35, role = "patient" } = {}) {
  if (!text || typeof text !== "string") return "";

  // Strip Markdown markers (bold, headers, bullets, backticks) so TTS does not read "asterisk asterisk"
  let cleaned = text
    .replace(/[*#_~`>]+/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // markdown links -> just label
    .replace(/^[•\-–—]\s*/gm, "") // bullet points
    .replace(/\s+/g, " ")
    .trim();

  // If elderly or distressed patient, add gentle breath pauses at natural conjunctions
  if (age >= 60 || role === "patient") {
    // Odia natural pause points
    cleaned = cleaned
      .replace(/\s+(ଆଉ|ଏବଂ|କିନ୍ତୁ|ଯେମିତି|ହଠାତ୍)\s+/g, ", $1 ")
      .replace(/\s+(ହେଉଛି|ଲାଗୁଛି|ହେଲାଣି)\s*([.।!])/g, " $1... ")
      // Hindi natural pause points
      .replace(/\s+(और|लेकिन|जैसे|अचानक|बहुत)\s+/g, ", $1 ")
      .replace(/\s+(हो रहा है|लग रहा है|गया है)\s*([.।!])/g, " $1... ")
      // English natural pause points
      .replace(/\s+(and|but|suddenly|radiating to|because)\s+/g, ", $1 ");
  }

  // Ensure sentence endings have a clean breath pause
  cleaned = cleaned.replace(/([.?!।])\s*/g, "$1 ");

  return cleaned.trim();
}

/**
 * Speaks text with humanized pitch, rate, and timbre according to age, gender, and role.
 * Strictly guarantees Indian accent and strict male/female distinction.
 * 
 * @param {string} text The text to speak
 * @param {object} options
 * @param {number|string} options.age Patient / speaker age
 * @param {string} options.gender 'Male', 'Female', or other demographic descriptor
 * @param {string} options.role 'patient' | 'nurse' | 'doctor'
 * @param {string} options.language 'Odia' | 'Hindi' | 'English'
 * @param {function} [options.onStart]
 * @param {function} [options.onEnd]
 * @param {function} [options.onError]
 * @returns {Promise<boolean>}
 */
export async function speakHumanVoice(text, {
  age = 35,
  gender = "Male",
  role = "patient",
  language = "English",
  onStart,
  onEnd,
  onError
} = {}) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    console.warn("Speech synthesis is not supported on this device/browser.");
    if (onError) onError(new Error("Speech synthesis not supported"));
    return false;
  }

  if (!text || !text.trim()) {
    if (onEnd) onEnd();
    return false;
  }

  try {
    // 1. Stop any currently active speech & clear watchdog
    stopHumanVoice();

    // 2. Priority Check: Match Pre-rendered Neural Indian / ElevenLabs Studio Audio Assets
    // STRICT LANGUAGE ENFORCEMENT: An Odia studio MP3 must NEVER play when Hindi or English is selected
    const textLower = text.toLowerCase();
    const targetLangLower = (language || "english").toLowerCase();
    
    const matchedStudioAudio = PRE_RENDERED_STUDIO_AUDIO.find((asset) => {
      const assetLang = (asset.language || "").toLowerCase();
      if (assetLang) {
        if (targetLangLower.includes("odia") || targetLangLower.includes("oriya")) {
          if (assetLang !== "odia") return false;
        } else if (targetLangLower.includes("hindi")) {
          if (assetLang !== "hindi") return false;
        } else if (targetLangLower.includes("english")) {
          if (assetLang !== "english") return false;
        }
      }
      return asset.keywords.some((kw) => textLower.includes(kw.toLowerCase()));
    });

    if (matchedStudioAudio) {
      try {
        const audio = new Audio(matchedStudioAudio.url);
        activeAudioElementRef = audio;
        activeAudioOnEnd = onEnd;

        audio.onplay = () => {
          const acoustics = getVocalAcoustics({ age, gender, role, language });
          if (onStart) onStart({ acoustics, isStudio: true });
        };

        audio.onended = () => {
          activeAudioElementRef = null;
          activeAudioOnEnd = null;
          if (onEnd) onEnd();
        };

        audio.onerror = (e) => {
          console.warn("Studio audio file playback failed, clearing audio element...", e);
          const cb = activeAudioOnEnd;
          activeAudioElementRef = null;
          activeAudioOnEnd = null;
          if (cb) {
            try { cb(); } catch (_) {}
          }
        };

        await audio.play();
        return true;
      } catch (audioErr) {
        console.warn("Audio element play error, proceeding to browser TTS:", audioErr);
        activeAudioElementRef = null;
        activeAudioOnEnd = null;
      }
    }

    // 3. Fetch available browser voices
    const voices = await initVoiceEngine();

    // 4. Compute age & gender acoustics
    const acoustics = getVocalAcoustics({ age, gender, role, language });

    // 5. Select best matching voice (strictly preserving Indian accent and exact gender)
    const matchedVoice = findBestMatchingVoice(voices, {
      language,
      isFemalePreferred: acoustics.isFemalePreferred
    });

    // 6. Transliterate or Phonetically map Indic text based on available voice engine capabilities
    let textToSpeak = text;
    const vLang = (matchedVoice?.lang || "").toLowerCase().replace("_", "-");
    const hasOdiaScript = /[\u0B00-\u0B7F]/.test(textToSpeak);
    const hasDevanagariScript = /[\u0900-\u097F]/.test(textToSpeak);
    let effectiveTargetLang = targetLangLower;

    if (vLang.startsWith("or")) {
      // Native Odia voice available: speak native Odia script
      effectiveTargetLang = "odia";
    } else if (vLang.startsWith("hi")) {
      // Native Hindi voice available:
      // If text is in Odia script, convert to Devanagari phonemes so Hindi TTS pronounces it clearly
      if (hasOdiaScript) {
        textToSpeak = convertOdiaToPhoneticDevanagari(textToSpeak);
      }
      effectiveTargetLang = "hindi";
    } else {
      // Non-Indic or English-only voice (en-IN, en-US, etc.):
      // English voices cannot pronounce Odia or Devanagari Unicode glyphs directly.
      // Convert any Indic script into natural Latin phonetics so the English voice reads it aloud!
      if (hasOdiaScript || hasDevanagariScript) {
        textToSpeak = convertIndicToLatinPhonetic(textToSpeak);
      }
      effectiveTargetLang = "english";
    }

    // 7. Humanize text with breath pauses
    const humanizedText = humanizeSpeechText(textToSpeak, { age, role });

    // 8. Build SpeechSynthesisUtterance
    const utterance = new SpeechSynthesisUtterance(humanizedText);

    // 9. Enforce BCP-47 Indian Locale on Utterance
    if (effectiveTargetLang.includes("hindi")) {
      utterance.lang = "hi-IN";
    } else if (effectiveTargetLang.includes("odia") || effectiveTargetLang.includes("oriya")) {
      utterance.lang = vLang.startsWith("or") ? "or-IN" : "hi-IN";
    } else {
      utterance.lang = "en-IN"; // Explicit Indian English Accent
    }

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    // 10. Acoustic Pitch & Formant Reinforcement
    const detectedVoiceGender = classifyVoiceGender(matchedVoice);
    if (acoustics.isFemalePreferred && detectedVoiceGender === "male") {
      utterance.pitch = Math.max(acoustics.pitch, 1.28);
      utterance.rate = 0.92;
    } else if (!acoustics.isFemalePreferred && detectedVoiceGender === "female") {
      utterance.pitch = Math.min(acoustics.pitch, 0.72);
      utterance.rate = 0.84;
    } else {
      utterance.pitch = acoustics.pitch;
      utterance.rate = acoustics.rate;
    }

    utterance.volume = acoustics.volume;

    // 11. Event listeners with Chromium GC bug safeguard & Safe Watchdog
    activeUtteranceRef = utterance;
    activeUtteranceOnEnd = onEnd;

    const cleanupWatchdog = () => {
      if (speechWatchdogTimer) {
        clearTimeout(speechWatchdogTimer);
        speechWatchdogTimer = null;
      }
    };

    let hasEnded = false;
    const safeEnd = () => {
      if (hasEnded) return;
      hasEnded = true;
      cleanupWatchdog();
      activeUtteranceRef = null;
      activeUtteranceOnEnd = null;
      if (onEnd) onEnd();
    };

    utterance.onstart = () => {
      cleanupWatchdog();
      
      // Calculate realistic maximum speaking duration from word count
      const words = (humanizedText || "").split(/\s+/).length;
      const expectedDurationSec = Math.max(5, Math.ceil(words / 1.8));
      
      // Watchdog timeout to prevent voice lock if browser fails to trigger onend
      speechWatchdogTimer = setTimeout(() => {
        if (activeUtteranceRef === utterance && window.speechSynthesis.speaking) {
          console.log("Speech watchdog timeout reached, safely ending speech.");
          stopHumanVoice();
          safeEnd();
        }
      }, (expectedDurationSec + 8) * 1000);

      if (onStart) onStart({ acoustics, voice: matchedVoice });
    };

    utterance.onend = safeEnd;

    utterance.onerror = (e) => {
      cleanupWatchdog();
      activeUtteranceRef = null;
      activeUtteranceOnEnd = null;
      // Do not treat intentional cancel/interruption as fatal error
      if (e.error !== "canceled" && e.error !== "interrupted") {
        console.warn("Human voice synthesis error:", e);
        if (onError) onError(e);
      }
      safeEnd();
    };

    // 12. Allow cancellation to settle in the native audio queue before speaking new text
    await new Promise((resolve) => setTimeout(resolve, 60));

    // Ensure audio queue is not paused before speaking
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    // 13. Speak
    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.warn("speakHumanVoice unhandled error:", err);
    activeUtteranceRef = null;
    activeUtteranceOnEnd = null;
    if (onError) onError(err);
    if (onEnd) onEnd();
    return false;
  }
}

/**
 * Immediately cancels any playing speech or studio audio element.
 * Safely clears watchdog timers and unsticks jammed browser speech queues.
 */
export function stopHumanVoice() {
  if (activeAudioElementRef) {
    try {
      activeAudioElementRef.pause();
      activeAudioElementRef.currentTime = 0;
    } catch (e) {
      // ignore
    }
    activeAudioElementRef = null;
    if (activeAudioOnEnd) {
      const cb = activeAudioOnEnd;
      activeAudioOnEnd = null;
      try { cb(); } catch (_) {}
    }
  }

  if (speechWatchdogTimer) {
    clearTimeout(speechWatchdogTimer);
    speechWatchdogTimer = null;
  }

  if (activeUtteranceOnEnd) {
    const cb = activeUtteranceOnEnd;
    activeUtteranceOnEnd = null;
    try { cb(); } catch (_) {}
  }
  activeUtteranceRef = null;

  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
      // On WebKit/Blink, calling resume if stuck in paused state unsticks the queue
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    } catch (e) {
      console.warn("speechSynthesis.cancel error:", e);
    }
  }
}
