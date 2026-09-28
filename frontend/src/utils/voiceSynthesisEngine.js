/**
 * Saransh (सारांश) — Adaptive Human Voice Synthesis Engine
 * 
 * Provides human-like speech synthesis dynamically modulated by:
 * 1. Gender: Male, Female, Other
 * 2. Age: Child (<=12), Teen (13-18), Adult (19-59), Elderly / Senior (60+)
 * 3. Role: Patient (distressed/conversational), Clinician/Nurse (calm, empathetic bedside)
 * 4. Language / Regional Dialect: Odia, Hindi, Indian English
 * 
 * Features:
 * - Natural prosody and breathing pause injection
 * - Asynchronous voice discovery with neural/natural voice prioritisation
 * - Garbage-collection protection for long speech playback
 * - Fine-grained pitch and rate modulation according to human vocal tract acoustics
 */

// Global voice cache
let cachedVoices = [];
let voicesLoadedPromise = null;

// Keep a global reference to prevent Chromium garbage collection bug during playback
let activeUtteranceRef = null;

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
 * @param {string} params.gender 'Male', 'Female', or 'Other'
 * @param {string} params.role 'patient' | 'nurse' | 'doctor'
 * @param {string} params.language 'Odia' | 'Hindi' | 'English'
 * @returns {object} { pitch, rate, volume, personaLabel, personaIcon, ageGroup }
 */
export function getVocalAcoustics({
  age = 35,
  gender = "Male",
  role = "patient",
  language = "English"
} = {}) {
  const numericAge = Math.max(0, Math.abs(Number(age) || 30));
  const normGender = String(gender).toLowerCase();
  const isFemale = normGender === "female" || normGender === "f";
  const isMale = normGender === "male" || normGender === "m";

  // 1. Clinician / Healthcare Worker Roles
  if (role === "nurse" || role === "clinician_bedside") {
    return {
      pitch: 1.05,
      rate: 0.86, // Calm, reassuring, steady for anxious patients
      volume: 1.0,
      personaLabel: `Empathetic Nurse Bedside Voice (${language})`,
      personaIcon: "🩺",
      ageGroup: "nurse",
      isFemalePreferred: true
    };
  }

  if (role === "doctor" || role === "medical_officer") {
    return {
      pitch: isFemale ? 1.02 : 0.88,
      rate: 0.88, // Clear, authoritative medical handover tone
      volume: 1.0,
      personaLabel: `Medical Officer Handover (${isFemale ? "Female" : "Male"})`,
      personaIcon: "👨‍⚕️",
      ageGroup: "doctor",
      isFemalePreferred: isFemale
    };
  }

  // 2. Patient Voice by Age Group & Gender
  if (numericAge <= 12) {
    // Child / Pediatric
    return {
      pitch: 1.45, // High childlike formant
      rate: 0.96,  // Expressive, slightly quicker
      volume: 1.0,
      personaLabel: `Pediatric Child Voice (${numericAge}y • ${isFemale ? "Girl" : "Boy"})`,
      personaIcon: isFemale ? "👧" : "👦",
      ageGroup: "child",
      isFemalePreferred: isFemale
    };
  }

  if (numericAge <= 18) {
    // Teenager
    return {
      pitch: isFemale ? 1.20 : 1.04,
      rate: 0.94,
      volume: 1.0,
      personaLabel: `Adolescent Youth Voice (${numericAge}y • ${isFemale ? "Female" : "Male"})`,
      personaIcon: isFemale ? "👩" : "🧑",
      ageGroup: "teen",
      isFemalePreferred: isFemale
    };
  }

  if (numericAge >= 60) {
    // Elderly / Senior Citizen (e.g. Ramesh K. 62y)
    return {
      pitch: isFemale ? 0.98 : 0.80, // Deeper, mature timbre with gentle vocal gravity
      rate: 0.80,                    // Slower, measured cadence reflecting elderly breathing
      volume: 1.0,
      personaLabel: `Elderly Senior Voice (${numericAge}y • ${isFemale ? "Elder Mother" : "Elder Father"})`,
      personaIcon: isFemale ? "👵" : "👴",
      ageGroup: "senior",
      isFemalePreferred: isFemale
    };
  }

  // Adult (19 - 59)
  return {
    pitch: isFemale ? 1.10 : 0.90, // Natural female vs male adult formant
    rate: 0.88,                    // Conversational OPD cadence
    volume: 1.0,
    personaLabel: `Adult Patient Voice (${numericAge}y • ${isFemale ? "Female" : "Male"})`,
    personaIcon: isFemale ? "👩" : "👨",
    ageGroup: "adult",
    isFemalePreferred: isFemale
  };
}

/**
 * Searches and selects the highest-fidelity natural voice matching language and gender.
 * 
 * @param {SpeechSynthesisVoice[]} voices
 * @param {object} criteria
 * @param {string} criteria.language 'Odia' | 'Hindi' | 'English'
 * @param {boolean} criteria.isFemalePreferred
 * @returns {SpeechSynthesisVoice|null}
 */
export function findBestMatchingVoice(voices, { language = "English", isFemalePreferred = false } = {}) {
  if (!voices || voices.length === 0) return null;

  const targetLangLower = language.toLowerCase();

  // Female indicator keywords in TTS voice names
  const femaleKeywords = [
    "female", "woman", "swara", "neerja", "heera", "zira", "kalpana", 
    "geeta", "siri", "samantha", "karen", "victoria", "fiona", "veena", 
    "leena", "aditi", "shruti", "priya"
  ];

  // Male indicator keywords in TTS voice names
  const maleKeywords = [
    "male", "man", "madhur", "prabhat", "ravi", "david", "george", 
    "mark", "alex", "daniel", "rishi", "tarun", "hemant"
  ];

  // Neural / High Quality keywords
  const qualityKeywords = ["natural", "neural", "online", "google", "enhanced", "premium"];

  const matchesGender = (voice, expectFemale) => {
    const vName = (voice.name || "").toLowerCase();
    if (expectFemale) {
      if (femaleKeywords.some((k) => vName.includes(k))) return true;
      if (maleKeywords.some((k) => vName.includes(k))) return false;
      return true; // Neutral fallback
    } else {
      if (maleKeywords.some((k) => vName.includes(k))) return true;
      if (femaleKeywords.some((k) => vName.includes(k))) return false;
      return true; // Neutral fallback
    }
  };

  const getQualityScore = (voice) => {
    const vName = (voice.name || "").toLowerCase();
    let score = 0;
    for (const qk of qualityKeywords) {
      if (vName.includes(qk)) score += 5;
    }
    return score;
  };

  // Language code priorities
  let targetLocalePrefixes = [];
  if (targetLangLower.includes("odia") || targetLangLower.includes("oriya")) {
    targetLocalePrefixes = ["or", "ori", "hi-in", "hi", "en-in"];
  } else if (targetLangLower.includes("hindi")) {
    targetLocalePrefixes = ["hi-in", "hi", "en-in"];
  } else {
    targetLocalePrefixes = ["en-in", "en-gb", "en-us", "en"];
  }

  // 1. Look for Exact Locale + Gender match + Highest Quality
  for (const locPrefix of targetLocalePrefixes) {
    const localeVoices = voices.filter((v) => {
      const vLang = (v.lang || "").toLowerCase().replace("_", "-");
      return vLang.startsWith(locPrefix);
    });

    if (localeVoices.length > 0) {
      // Filter by preferred gender
      const genderMatches = localeVoices.filter((v) => matchesGender(v, isFemalePreferred));
      const candidateList = genderMatches.length > 0 ? genderMatches : localeVoices;

      // Sort by neural / high quality markers
      candidateList.sort((a, b) => getQualityScore(b) - getQualityScore(a));
      return candidateList[0];
    }
  }

  // 2. Global fallback matching gender
  const globalGenderMatches = voices.filter((v) => matchesGender(v, isFemalePreferred));
  if (globalGenderMatches.length > 0) {
    globalGenderMatches.sort((a, b) => getQualityScore(b) - getQualityScore(a));
    return globalGenderMatches[0];
  }

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
 * 
 * @param {string} text The text to speak
 * @param {object} options
 * @param {number|string} options.age Patient / speaker age
 * @param {string} options.gender 'Male', 'Female', or 'Other'
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
    // 1. Stop any currently active speech
    window.speechSynthesis.cancel();

    // 2. Fetch available voices
    const voices = await initVoiceEngine();

    // 3. Compute age & gender acoustics
    const acoustics = getVocalAcoustics({ age, gender, role, language });

    // 4. Select best matching voice
    const matchedVoice = findBestMatchingVoice(voices, {
      language,
      isFemalePreferred: acoustics.isFemalePreferred
    });

    // 5. Humanize text with breath pauses
    const humanizedText = humanizeSpeechText(text, { age, role });

    // 6. Build SpeechSynthesisUtterance
    const utterance = new SpeechSynthesisUtterance(humanizedText);

    // Set BCP-47 locale tag
    const langLower = language.toLowerCase();
    if (langLower.includes("hindi")) {
      utterance.lang = "hi-IN";
    } else if (langLower.includes("odia") || langLower.includes("oriya")) {
      utterance.lang = matchedVoice?.lang || "or-IN";
    } else {
      utterance.lang = "en-IN";
    }

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.pitch = acoustics.pitch;
    utterance.rate = acoustics.rate;
    utterance.volume = acoustics.volume;

    // 7. Event listeners with Chromium GC bug safeguard
    activeUtteranceRef = utterance;

    utterance.onstart = () => {
      if (onStart) onStart({ acoustics, voice: matchedVoice });
    };

    utterance.onend = () => {
      activeUtteranceRef = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      activeUtteranceRef = null;
      console.warn("Human voice synthesis error:", e);
      if (onError) onError(e);
      if (onEnd) onEnd();
    };

    // 8. Speak
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
  activeUtteranceRef = null;
}
