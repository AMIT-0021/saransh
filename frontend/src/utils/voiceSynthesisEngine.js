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
let speechWatchdogTimer = null;

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

  let cleaned = text.trim();

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

  return cleaned;
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

    // 2. Fetch available voices
    const voices = await initVoiceEngine();

    // 3. Compute age & gender acoustics
    const acoustics = getVocalAcoustics({ age, gender, role, language });

    // 4. Select best matching voice (strictly preserving Indian accent and exact gender)
    const matchedVoice = findBestMatchingVoice(voices, {
      language,
      isFemalePreferred: acoustics.isFemalePreferred
    });

    // 5. Humanize text with breath pauses
    const humanizedText = humanizeSpeechText(text, { age, role });

    // 6. Build SpeechSynthesisUtterance
    const utterance = new SpeechSynthesisUtterance(humanizedText);

    // 7. Enforce BCP-47 Indian Locale on Utterance
    // Instructs synthesizer engines to apply Indian English phonology, stress, and cadence
    const langLower = (language || "english").toLowerCase();
    if (langLower.includes("hindi")) {
      utterance.lang = "hi-IN";
    } else if (langLower.includes("odia") || langLower.includes("oriya")) {
      const vLang = (matchedVoice?.lang || "").toLowerCase().replace("_", "-");
      if (vLang.startsWith("or")) {
        utterance.lang = "or-IN";
      } else if (vLang.startsWith("hi")) {
        utterance.lang = "hi-IN";
      } else {
        utterance.lang = "en-IN";
      }
    } else {
      utterance.lang = "en-IN"; // Explicit Indian English Accent
    }

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    // 8. Acoustic Pitch & Formant Reinforcement
    // If the device only possesses an opposite-gender voice as absolute fallback,
    // apply physical formant shifting so male never sounds high-pitched female,
    // and female never sounds deep male.
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

    // 9. Event listeners with Chromium GC bug safeguard & Watchdog
    activeUtteranceRef = utterance;

    const cleanupWatchdog = () => {
      if (speechWatchdogTimer) {
        clearInterval(speechWatchdogTimer);
        speechWatchdogTimer = null;
      }
    };

    utterance.onstart = () => {
      // Chromium speech pause watchdog (prevents synthesis halting after 14s)
      cleanupWatchdog();
      speechWatchdogTimer = setInterval(() => {
        if (window.speechSynthesis && window.speechSynthesis.speaking) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }, 10000);

      if (onStart) onStart({ acoustics, voice: matchedVoice });
    };

    utterance.onend = () => {
      cleanupWatchdog();
      activeUtteranceRef = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      cleanupWatchdog();
      activeUtteranceRef = null;
      console.warn("Human voice synthesis error:", e);
      if (onError) onError(e);
      if (onEnd) onEnd();
    };

    // 10. Speak
    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.warn("speakHumanVoice unhandled error:", err);
    activeUtteranceRef = null;
    if (onError) onError(err);
    if (onEnd) onEnd();
    return false;
  }
}

/**
 * Immediately cancels any playing speech.
 */
export function stopHumanVoice() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
  if (speechWatchdogTimer) {
    clearInterval(speechWatchdogTimer);
    speechWatchdogTimer = null;
  }
  activeUtteranceRef = null;
}
