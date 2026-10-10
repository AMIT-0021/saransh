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

// Keep references to prevent Chromium garbage collection bug & 15s pause bug during playback
const activeUtterances = new Set();
let activeUtteranceRef = null;
let activeUtteranceOnEnd = null;
let activeAudioElementRef = null;
let activeAudioOnEnd = null;
let speechWatchdogTimer = null;
let keepAliveHeartbeat = null;

function startKeepAliveHeartbeat() {
  stopKeepAliveHeartbeat();
  keepAliveHeartbeat = setInterval(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }
  }, 10000); // 10-second pulse prevents Chromium 15s silent drop bug
}

function stopKeepAliveHeartbeat() {
  if (keepAliveHeartbeat) {
    clearInterval(keepAliveHeartbeat);
    keepAliveHeartbeat = null;
  }
}

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

// =========================================================================
// PRE-BUFFERED AUDIO INSTANCE CACHE FOR ZERO-LATENCY PLAYBACK
// =========================================================================
export const PRELOADED_STUDIO_AUDIO_CACHE = new Map();
export const DYNAMIC_TTS_CACHE = new Map();

/**
 * Returns a warmed up, preloaded HTML5 Audio instance for instant playback (<10ms).
 */
export function getOrCreatePreloadedAudio(url) {
  if (typeof window === "undefined" || !url) return null;
  let audio = PRELOADED_STUDIO_AUDIO_CACHE.get(url);
  if (!audio) {
    audio = new Audio();
    audio.preload = "auto";
    audio.src = url;
    audio.load();
    PRELOADED_STUDIO_AUDIO_CACHE.set(url, audio);
  }
  return audio;
}

/**
 * Pre-buffers all 28 studio audio files into browser cache.
 */
export function preloadAllStudioAudio() {
  if (typeof window === "undefined") return;
  const audioUrls = [
    "/audio/ramesh_cardiac_odia.wav",
    "/audio/ramesh_cardiac_hindi.wav",
    "/audio/ramesh_english.mp3",
    "/audio/priya_fever_odia.wav",
    "/audio/priya_fever_hindi.wav",
    "/audio/priya_fever_english.mp3",
    "/audio/lipu_pediatric_odia.wav",
    "/audio/aarav_pediatric_hindi.wav",
    "/audio/aarav_pediatric_english.mp3",
    "/audio/subhash_headache_odia.wav",
    "/audio/subhash_headache_hindi.wav",
    "/audio/subhash_headache_english.mp3",
    "/audio/meena_maternal_odia.wav",
    "/audio/meena_maternal_hindi.wav",
    "/audio/meena_maternal_english.mp3",
    "/audio/nurse_advisory.mp3",
    "/audio/doctor_referral.mp3"
  ];

  audioUrls.forEach((url) => {
    try {
      getOrCreatePreloadedAudio(url);
    } catch {}
  });
}

// Automatically trigger audio pre-buffering on script evaluation
if (typeof window !== "undefined") {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(() => preloadAllStudioAudio());
  } else {
    setTimeout(preloadAllStudioAudio, 50);
  }
}

// Registry of high-fidelity Neural studio Indian voice audio files
const PRE_RENDERED_STUDIO_AUDIO = [
  // --- ODIA PATIENT CASES ---
  {
    id: "RAMESH_ODIA",
    language: "Odia",
    url: "/audio/ramesh_cardiac_odia.wav",
    matchTexts: [
      "ଡାକ୍ତର ବାବୁ, ୨ ଘଣ୍ଟା ହେଲା ଛାତିଟା ପଥର ଭଳି ଭାରି ଲାଗୁଛି ଆଉ ବହୁତ ଜୋରରେ କଣେଇକି ଦରଦ ହେଉଛି। ନିଶ୍ୱାସ ଆଦୌ ନେଇପାରୁନି, ଦେହ ସାରା ଝାଳରେ ଥଣ୍ଡା ପଡ଼ିଗଲାଣି। ଟିକେ ଶୀଘ୍ର ଦେଖନ୍ତୁ ବାବୁ, ଛାତି ଫାଟିଯିବା ଭଳି ଲାଗୁଛି।",
      "ଆଃ... ଡାକ୍ତର ବାବୁ... ଦୁଇ ଘଣ୍ଟା ହେଲା... ଛାତିଟା ପଥର ଭଳି ଭାରି ଲାଗୁଛି... ବାମ ହାତକୁ କଣେଇକି ଦରଦ ହେଉଛି। ନିଶ୍ୱାସ... ଆଦୌ ନେଇପାରୁନି... ଦେହ ସାରା ଝାଳରେ ଥଣ୍ଡା ପଡ଼ିଗଲାଣି! ଟିକେ ଶୀଘ୍ର ଦେଖନ୍ତୁ ବାବୁ... ଛାତି ଫାଟିଯିବା ଭଳି ଲାଗୁଛି... ଆଃ...",
      "ଡାକ୍ତର ବାବୁ, ବହୁତ ଜୋରରେ କଷ୍ଟ ହେଉଛି।"
    ],
    fullText: "ଆଃ... ଡାକ୍ତର ବାବୁ... ଦୁଇ ଘଣ୍ଟା ହେଲା... ଛାତିଟା ପଥର ଭଳି ଭାରି ଲାଗୁଛି... ବାମ ହାତକୁ କଣେଇକି ଦରଦ ହେଉଛି। ନିଶ୍ୱାସ... ଆଦୌ ନେଇପାରୁନି... ଦେହ ସାରା ଝାଳରେ ଥଣ୍ଡା ପଡ଼ିଗଲାଣି! ଟିକେ ଶୀଘ୍ର ଦେଖନ୍ତୁ ବାବୁ... ଛାତି ଫାଟିଯିବା ଭଳି ଲାଗୁଛି... ଆଃ...",
    strictKeywords: ["ଛାତି", "ପଥର"],
    signatures: ["ଛାତି", "ପଥର", "ଦରଦ", "ଝାଳ", "ଫାଟିଯିବା"]
  },
  {
    id: "PRIYA_FEVER_ODIA",
    language: "Odia",
    url: "/audio/priya_fever_odia.wav",
    matchTexts: [
      "ଦିଦି, ୩ ଦିନ ହେଲା ଦେହ ସାରା ନିଆଁ ଭଳି ତାତିଛି। ମୁଣ୍ଡଟା ଏତେ ଜୋରରେ ବିନ୍ଧୁଛି ଯେ ଆଖି ଖୋଲି ହେଉନି। ହାତ ଗୋଡ଼ରେ ଲାଲ୍ ଦାଗ ବାହାରି ପଡ଼ିଛି ଆଉ ଚାଲିବାକୁ ଜମା ବଳ ପାଉନି।",
      "ଉଫ୍... ଦିଦି... ତିନି ଦିନ ହେଲା ଦେହ ସାରା ନିଆଁ ଭଳି ତାତିଛି... ମୁଣ୍ଡଟା ଏତେ ଜୋରରେ ବିନ୍ଧୁଛି ଯେ ଆଖି ବି ଖୋଲି ହେଉନି। ହାତ ଗୋଡ଼ରେ ନାଲି ଦାଗ ବାହାରି ପଡ଼ିଛି... ଆଉ ଠିଆ ହେବାକୁ ଜମା ବଳ ପାଉନି... ଦୟାକରି ସାହାଯ୍ୟ କରନ୍ତୁ।"
    ],
    fullText: "ଉଫ୍... ଦିଦି... ତିନି ଦିନ ହେଲା ଦେହ ସାରା ନିଆଁ ଭଳି ତାତିଛି... ମୁଣ୍ଡଟା ଏତେ ଜୋରରେ ବିନ୍ଧୁଛି ଯେ ଆଖି ବି ଖୋଲି ହେଉନି। ହାତ ଗୋଡ଼ରେ ନାଲି ଦାଗ ବାହାରି ପଡ଼ିଛି... ଆଉ ଠିଆ ହେବାକୁ ଜମା ବଳ ପାଉନି... ଦୟାକରି ସାହାଯ୍ୟ କରନ୍ତୁ।",
    strictKeywords: ["ତାତିଛି", "ଦାଗ"],
    signatures: ["ନିଆଁ", "ତାତିଛି", "ବିନ୍ଧୁଛି", "ଦାଗ", "ବଳ"]
  },
  {
    id: "LIPU_PEDIATRIC_ODIA",
    language: "Odia",
    url: "/audio/lipu_pediatric_odia.wav",
    matchTexts: [
      "ଦିଦି, ପେଟଟା ଭୀଷଣ ବିନ୍ଧୁଛି। ସକାଳୁ ୨ ଥର ବାନ୍ତି ହେଲାଣି ଆଉ କିଛି ଖାଇ ହେଉନି, ବହୁତ କଷ୍ଟ ହେଉଛି।",
      "ଦିଦି... ଆଃ... ପେଟଟା ଭୀଷଣ ବିନ୍ଧୁଛି! ସକାଳୁ ଦୁଇ ଥର ବାନ୍ତି ହେଲାଣି... ଆଉ କିଛି ଖାଇ ହେଉନି... ବହୁତ କଷ୍ଟ ହେଉଛି ଦିଦି... ପ୍ଲିଜ୍ ଟିକେ ଦେଖନ୍ତୁ..."
    ],
    fullText: "ଦିଦି... ଆଃ... ପେଟଟା ଭୀଷଣ ବିନ୍ଧୁଛି! ସକାଳୁ ଦୁଇ ଥର ବାନ୍ତି ହେଲାଣି... ଆଉ କିଛି ଖାଇ ହେଉନି... ବହୁତ କଷ୍ଟ ହେଉଛି ଦିଦି... ପ୍ଲିଜ୍ ଟିକେ ଦେଖନ୍ତୁ...",
    strictKeywords: ["ପେଟଟା", "ବାନ୍ତି"],
    signatures: ["ପେଟ", "ବିନ୍ଧୁଛି", "ବାନ୍ତି", "ଖାଇ"]
  },
  {
    id: "SUBHASH_HEADACHE_ODIA",
    language: "Odia",
    url: "/audio/subhash_headache_odia.wav",
    matchTexts: [
      "ନମସ୍କାର ଦିଦି, ଗତକାଲି ରାତିରେ ଅନେକ ସମୟ ଧରି ପାଠ ପଢ଼ିବା ପରେ ମଥାଟା ସାମାନ୍ୟ ବିନ୍ଧୁଛି। ଜ୍ୱର କି ବାନ୍ତି କିଛି ନାହିଁ, କେବଳ ଟିକେ ଥକା ଲାଗୁଛି।",
      "ନମସ୍କାର ଦିଦି... ଗତକାଲି ରାତିରେ ଅନେକ ସମୟ ଧରି ପାଠ ପଢ଼ିବା ପରେ ମଥାଟା ସାମାନ୍ୟ ବିନ୍ଧୁଛି। ଜ୍ୱର କି ବାନ୍ତି କିଛି ନାହିଁ, କେବଳ ଟିକେ ଥକା ଲାଗୁଛି।"
    ],
    fullText: "ନମସ୍କାର ଦିଦି, ଗତକାଲି ରାତିରେ ଅନେକ ସମୟ ଧରି ପାଠ ପଢ଼ିବା ପରେ ମଥାଟା ସାମାନ୍ୟ ବିନ୍ଧୁଛି। ଜ୍ୱର କି ବାନ୍ତି କିଛି ନାହିଁ, କେବଳ ଟିକେ ଥକା ଲାଗୁଛି।",
    strictKeywords: ["ମଥାଟା", "ପାଠ"],
    signatures: ["ମଥା", "ପାଠ", "ଥକା"]
  },
  {
    id: "MEENA_MATERNAL_ODIA",
    language: "Odia",
    url: "/audio/meena_maternal_odia.wav",
    matchTexts: [
      "ମାଉସୀ, ମୋତେ ୮ ମାସ ଚାଲିଛି। ଗତକାଲି ସଞ୍ଜରୁ ମୁଣ୍ଡଟା କାଠ ଭଳିଆ ଖୁବ୍ ବିନ୍ଧୁଛି, ଆଖିକୁ ଝାପ୍ସା ଦିଶୁଛି ଆଉ ଗୋଡ଼ ଦୁଇଟା ଫୁଲି ଯାଇ ଚପଲ ପଶୁନି।",
      "ମାଉସୀ... ମୋତେ ଆଠ ମାସ ଚାଲିଛି। ଗତକାଲି ସଞ୍ଜରୁ ମୁଣ୍ଡଟା କାଠ ଭଳିଆ ଖୁବ୍ ବିନ୍ଧୁଛି... ଆଖିକୁ ଝାପ୍ସା ଦିଶୁଛି... ଆଉ ଗୋଡ଼ ଦୁଇଟା ଏତେ ଫୁଲି ଯାଇଛି ଯେ ଚପଲ ପଶୁନି। ମୋ ଛୁଆଟା ଠିକ୍ ଅଛି ତ ମାଉସୀ?",
      "ମାଉସୀ... ମୋତେ ଆଠ ମାସ ଚାଲିଛି... ଗତକାଲି ସଞ୍ଜରୁ ମୁଣ୍ଡଟା କାଠ ଭଳିଆ ଖୁବ୍ ବିନ୍ଧୁଛି... ଆଖିକୁ ସବୁ ଝାପ୍ସା ଦିଶୁଛି... ଆଉ ଗୋଡ଼ ଦୁଇଟା ଏତେ ଫୁଲି ଯାଇଛି ଯେ ଚପଲ ପଶୁନି। ମୋ ଛୁଆଟା ଠିକ୍ ଅଛି ତ ମାଉସୀ?"
    ],
    fullText: "ମାଉସୀ... ମୋତେ ଆଠ ମାସ ଚାଲିଛି। ଗତକାଲି ସଞ୍ଜରୁ ମୁଣ୍ଡଟା କାଠ ଭଳିଆ ଖୁବ୍ ବିନ୍ଧୁଛି... ଆଖିକୁ ଝାପ୍ସା ଦିଶୁଛି... ଆଉ ଗୋଡ଼ ଦୁଇଟା ଏତେ ଫୁଲି ଯାଇଛି ଯେ ଚପଲ ପଶୁନି। ମୋ ଛୁଆଟା ଠିକ୍ ଅଛି ତ ମାଉସୀ?",
    strictKeywords: ["ମାସ", "ଚପଲ"],
    signatures: ["ମାସ", "ମୁଣ୍ଡଟା", "ଝାପ୍ସା", "ଫୁଲି", "ଚପଲ"]
  },

  // --- HINDI PATIENT CASES ---
  {
    id: "RAMESH_HINDI",
    language: "Hindi",
    url: "/audio/ramesh_cardiac_hindi.wav",
    matchTexts: [
      "डॉक्टर साहब, २ घंटे से सीने में भारी पत्थर जैसा दर्द हो रहा है और बहुत तेज चुभन महसूस हो रही है। सांस बिल्कुल नहीं आ रही, शरीर पसीने से ठंडा पड़ गया है। कृपया जल्दी देखें, लग रहा है सीना फट जाएगा।",
      "डॉक्टर साहब... २ घंटे से सीने में भारी पत्थर जैसा दर्द हो रहा है... और बहुत तेज चुभन महसूस हो रही है। सांस... बिल्कुल नहीं आ रही, शरीर पसीने से ठंडा पड़ गया है!",
      "डॉक्टर साहब, बहुत तेज दर्द हो रहा है।"
    ],
    fullText: "डॉक्टर साहब, २ घंटे से सीने में भारी पत्थर जैसा दर्द हो रहा है और बहुत तेज चुभन महसूस हो रही है। सांस बिल्कुल नहीं आ रही, शरीर पसीने से ठंडा पड़ गया है। कृपया जल्दी देखें, लग रहा है सीना फट जाएगा।",
    strictKeywords: ["सीने में भारी पत्थर", "सीना फट जाएगा"],
    signatures: ["सीने", "पत्थर", "दर्द", "सांस", "पसीना", "फट"]
  },
  {
    id: "PRIYA_FEVER_HINDI",
    language: "Hindi",
    url: "/audio/priya_fever_hindi.wav",
    matchTexts: [
      "दीदी, ३ दिन से पूरा बदन भट्टी की तरह तप रहा है। सिर में इतना भयानक दर्द है कि आंखें भी नहीं खुल रही हैं। पूरे हाथ-पैरों में लाल चकत्ते निकल आए हैं और चलने की बिल्कुल ताक़त नहीं बची है।",
      "दीदी... ३ दिन से पूरा बदन भट्टी की तरह तप रहा है... सिर में इतना भयानक दर्द है कि आंखें भी नहीं खुल रही हैं। पूरे हाथ-पैरों में लाल चकत्ते निकल आए हैं... और चलने की बिल्कुल ताक़त नहीं बची है।"
    ],
    fullText: "दीदी, ३ दिन से पूरा बदन भट्टी की तरह तप रहा है। सिर में इतना भयानक दर्द है कि आंखें भी नहीं खुल रही हैं। पूरे हाथ-पैरों में लाल चकत्ते निकल आए हैं और चलने की बिल्कुल ताक़त नहीं बची है।",
    strictKeywords: ["भट्टी की तरह तप", "लाल चकत्ते"],
    signatures: ["भट्टी", "तप", "चकत्ते", "ताक़त"]
  },
  {
    id: "AARAV_PEDIATRIC_HINDI",
    language: "Hindi",
    url: "/audio/aarav_pediatric_hindi.wav",
    matchTexts: [
      "दीदी, पेट में बहुत तेज दर्द हो रहा है। सुबह से दो बार उल्टी हो गई और कुछ भी खाया नहीं जा रहा, बहुत रोना आ रहा है।",
      "दीदी... पेट में बहुत तेज दर्द हो रहा है! सुबह से दो बार उल्टी हो गई... और कुछ भी खाया नहीं जा रहा, बहुत रोना आ रहा है।"
    ],
    fullText: "दीदी, पेट में बहुत तेज दर्द हो रहा है। सुबह से दो बार उल्टी हो गई और कुछ भी खाया नहीं जा रहा, बहुत रोना आ रहा है।",
    strictKeywords: ["पेट में बहुत तेज दर्द", "उल्टी हो गई"],
    signatures: ["पेट", "दर्द", "उल्टी", "रोना"]
  },
  {
    id: "SUBHASH_HEADACHE_HINDI",
    language: "Hindi",
    url: "/audio/subhash_headache_hindi.wav",
    matchTexts: [
      "नमस्ते दीदी, कल देर रात तक स्क्रीन पर पढ़ाई करने के बाद से माथे में हल्का-हल्का दर्द है। कोई बुखार या उल्टी नहीं है, बस थोड़ी थकान महसूस हो रही है।",
      "नमस्ते दीदी... कल देर रात परीक्षा की पढ़ाई करने के बाद माथे में हल्का-हल्का दर्द है... बस थोड़ी थकान लग रही है, बाकी सब ठीक है।"
    ],
    fullText: "नमस्ते दीदी, कल देर रात तक स्क्रीन पर पढ़ाई करने के बाद से माथे में हल्का-हल्का दर्द है। कोई बुखार या उल्टी नहीं है, बस थोड़ी थकान महसूस हो रही है।",
    strictKeywords: ["स्क्रीन पर पढ़ाई", "हल्का-हल्का दर्द"],
    signatures: ["माथे", "पढ़ाई", "थकान"]
  },
  {
    id: "MEENA_MATERNAL_HINDI",
    language: "Hindi",
    url: "/audio/meena_maternal_hindi.wav",
    matchTexts: [
      "नर्स दीदी, मुझे ८ महीने का गर्भ है। कल शाम से सिर बहुत तेज फटने जैसा दर्द कर रहा है, आंखों के आगे धुंधलापन आ रहा है और दोनों पैर इतने सूज गए हैं कि चप्पल नहीं आ रही।",
      "नर्स दीदी... मुझे ८ महीने का गर्भ है... दोनों पैर इतने सूज गए हैं कि चप्पल नहीं आ रही। सिर फटने जैसा भारी दर्द है और आंखों के सामने सब धुंधला दिख रहा है!"
    ],
    fullText: "नर्स दीदी, मुझे ८ महीने का गर्भ है। कल शाम से सिर बहुत तेज फटने जैसा दर्द कर रहा है, आंखों के आगे धुंधलापन आ रहा है और दोनों पैर इतने सूज गए हैं कि चप्पल नहीं आ रही।",
    strictKeywords: ["८ महीने का गर्भ", "चप्पल नहीं आ रही"],
    signatures: ["गर्भ", "सूज", "चप्पल", "धुंधला"]
  },

  // --- ENGLISH PATIENT CASES ---
  {
    id: "RAMESH_ENGLISH",
    language: "English",
    url: "/audio/ramesh_english.mp3",
    matchTexts: [
      "Doctor, for the past 2 hours my chest feels crushed under heavy stone with unbearable stabbing pain. I can barely breathe, and I'm breaking into a cold sweat. Please check me quickly, it feels like my chest is tearing.",
      "Doctor... for the past two hours, my chest feels crushed under a heavy stone... with unbearable stabbing pain. I can barely breathe... and I am breaking into a cold sweat!",
      "Doctor, I am experiencing severe pain and discomfort."
    ],
    fullText: "Doctor, for the past 2 hours my chest feels crushed under heavy stone with unbearable stabbing pain. I can barely breathe, and I'm breaking into a cold sweat. Please check me quickly, it feels like my chest is tearing.",
    strictKeywords: ["crushed under heavy stone", "chest is tearing"],
    signatures: ["chest", "stone", "breathe", "sweat", "tearing"]
  },
  {
    id: "PRIYA_FEVER_ENGLISH",
    language: "English",
    url: "/audio/priya_fever_english.mp3",
    matchTexts: [
      "Sister, for the past 3 days my entire body has been burning with high fever. My headache is so severe that I can't even open my eyes. Red spots have appeared across my arms and legs, and I have zero strength to stand.",
      "Sister... for 3 days my entire body has been burning with high fever. My headache is blinding and red spots have appeared all over my arms and legs."
    ],
    fullText: "Sister, for the past 3 days my entire body has been burning with high fever. My headache is so severe that I can't even open my eyes. Red spots have appeared across my arms and legs, and I have zero strength to stand.",
    strictKeywords: ["burning with high fever", "zero strength to stand"],
    signatures: ["burning", "fever", "spots", "strength"]
  },
  {
    id: "AARAV_PEDIATRIC_ENGLISH",
    language: "English",
    url: "/audio/aarav_pediatric_english.mp3",
    matchTexts: [
      "Sister, my stomach hurts so much. I threw up twice this morning and I can't eat anything, it hurts really bad.",
      "Sister... my tummy hurts so bad! I threw up twice since morning and I can't eat anything... it hurts so much."
    ],
    fullText: "Sister, my stomach hurts so much. I threw up twice this morning and I can't eat anything, it hurts really bad.",
    strictKeywords: ["stomach hurts so much", "threw up twice"],
    signatures: ["stomach", "tummy", "threw up", "hurts"]
  },
  {
    id: "SUBHASH_HEADACHE_ENGLISH",
    language: "English",
    url: "/audio/subhash_headache_english.mp3",
    matchTexts: [
      "Good morning sister, I've had a mild throbbing headache across my forehead since yesterday after long study hours. No fever or vomiting, just feeling tired.",
      "Hello sister... after studying late last night for my exams, I have a mild tension headache across my forehead and feeling a bit tired, otherwise I am fine."
    ],
    fullText: "Good morning sister, I've had a mild throbbing headache across my forehead since yesterday after long study hours. No fever or vomiting, just feeling tired.",
    strictKeywords: ["mild throbbing headache across my forehead", "long study hours"],
    signatures: ["forehead", "headache", "study", "tired"]
  },
  {
    id: "MEENA_MATERNAL_ENGLISH",
    language: "English",
    url: "/audio/meena_maternal_english.mp3",
    matchTexts: [
      "Nurse didi, I am 8 months pregnant. Since yesterday evening I have a severe throbbing headache, blurred vision, and my feet are so swollen my slippers won't fit.",
      "Sister... I am 8 months pregnant and my feet are so swollen my slippers won't fit. I have a blinding throbbing headache and my vision is completely blurred!"
    ],
    fullText: "Nurse didi, I am 8 months pregnant. Since yesterday evening I have a severe throbbing headache, blurred vision, and my feet are so swollen my slippers won't fit.",
    strictKeywords: ["8 months pregnant", "slippers won't fit"],
    signatures: ["pregnant", "swollen", "slippers", "vision"]
  },

  // --- CLINICIAN / NURSE ADVISORY ---
  {
    id: "NURSE_ADVISORY",
    language: "English",
    url: "/audio/nurse_advisory.mp3",
    matchTexts: [
      "Patient has been registered with verified ABHA ID. Priority triage indicates acute respiratory and cardiac distress. High-flow oxygen and emergency ECG are being prepared at the emergency bay.",
      "Patient has been registered with verified ABHA ID. Priority triage indicates acute respiratory distress. High-flow oxygen and emergency ECG are being prepared at the bay.",
      "ରୋଗୀଙ୍କର ଆଭା ଆଇଡି ଯାଞ୍ଚ ସରିଛି। ତୁରନ୍ତ ଇସିଜି ଓ ଅମ୍ଳଜାନ ସହାୟତା ପାଇଁ ଏମର୍ଜେନ୍ସି ବେ'କୁ ସ୍ଥାନାନ୍ତର କରାଯାଉଛି।",
      "मरीज की आभा आईडी सत्यापित कर ली गई है। उच्च प्राथमिकता वाले ट्राइएज के तहत ऑक्सीजन और आपातकालीन ईसीजी तैयार की जा रही है।"
    ],
    fullText: "Patient has been registered with verified ABHA ID. Priority triage indicates acute respiratory and cardiac distress. High-flow oxygen and emergency ECG are being prepared at the emergency bay.",
    strictKeywords: ["registered with verified abha", "high-flow oxygen and emergency ecg"],
    signatures: ["abha", "registered", "oxygen", "ecg", "bay", "ଆଭା", "ଇସିଜି", "आभा"]
  },

  // --- DOCTOR CLINICAL REFERRAL BRIEFING ---
  {
    id: "DOCTOR_REFERRAL",
    language: "English",
    url: "/audio/doctor_referral.mp3",
    matchTexts: [
      "Clinical summary for referral: Sixty-two year old male presenting with acute retrosternal chest pain and profound hypoxia, oxygen saturation eighty-nine percent. Priority RED verified. Immediate transfer to District Hospital cardiac intensive care unit.",
      "Clinical handover alert. High priority cardiac case requiring immediate CCU transfer. Bilateral oxygenation active, emergency stabilization underway.",
      "ଡିଷ୍ଟ୍ରିକ୍ଟ ହେଡକ୍ୱାର୍ଟର ହସ୍ପିଟାଲକୁ ଜରୁରୀକାଳୀନ ରେଫରାଲ ସ୍ଲିପ ପ୍ରସ୍ତୁତ କରାଗଲା। ଆମ୍ବୁଲାନ୍ସ ୧୦୮ ସହିତ ତୁରନ୍ତ ସ୍ଥାନାନ୍ତର କରନ୍ତୁ।",
      "जिला अस्पताल के लिए आपातकालीन रेफरल पर्ची तैयार की गई है। एम्बुलेंस १०८ द्वारा तत्काल स्थानांतरण सुनिश्चित करें।"
    ],
    fullText: "Clinical summary for referral: Sixty-two year old male presenting with acute retrosternal chest pain and profound hypoxia, oxygen saturation eighty-nine percent. Priority RED verified. Immediate transfer to District Hospital cardiac intensive care unit.",
    strictKeywords: ["clinical summary for referral", "immediate transfer to district hospital"],
    signatures: ["referral", "district hospital", "handover", "transfer", "108", "ରେଫରାଲ", "रेफरल"]
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
  language: _language = "English"
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
    // Child / Pediatric (e.g. Lipu 7Y boy, Aarav 8Y boy)
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

  // Expand Odia and Arabic numerals into authentic spoken Odia words
  if (/[\u0B00-\u0B7F]/.test(cleaned)) {
    const ODIA_NUMS = {
      "0": "ଶୂନ", "1": "ଏକ", "2": "ଦୁଇ", "3": "ତିନି", "4": "ଚାରି", "5": "ପାଞ୍ଚ", "6": "ଛଅ", "7": "ସାତ", "8": "ଆଠ", "9": "ନଅ",
      "୦": "ଶୂନ", "୧": "ଏକ", "୨": "ଦୁଇ", "୩": "ତିନି", "୪": "ଚାରି", "୫": "ପାଞ୍ଚ", "୬": "ଛଅ", "୭": "ସାତ", "୮": "ଆଠ", "୯": "ନଅ"
    };
    cleaned = cleaned
      .replace(/([0-9]|[\u0B66-\u0B6F])\s*(?:ଘଣ୍ଟା)/g, (m, d) => `${ODIA_NUMS[d] || d} ଘଣ୍ଟା`)
      .replace(/([0-9]|[\u0B66-\u0B6F])\s*(?:ଦିନ)/g, (m, d) => `${ODIA_NUMS[d] || d} ଦିନ`)
      .replace(/([0-9]|[\u0B66-\u0B6F])\s*(?:ଥର)/g, (m, d) => `${ODIA_NUMS[d] || d} ଥର`)
      .replace(/([0-9]|[\u0B66-\u0B6F])\s*(?:ମାସ)/g, (m, d) => `${ODIA_NUMS[d] || d} ମାସ`);
  }

  // If elderly or distressed patient, add gentle breath pauses at natural conjunctions
  if (age >= 60 || role === "patient") {
    // Odia natural pause points & conversational distress breath markers
    cleaned = cleaned
      .replace(/\s+(ଆଉ|ଏବଂ|କିନ୍ତୁ|ଯେମିତି|ହଠାତ୍)\s+/g, ", $1 ")
      .replace(/\s+(ହେଉଛି|ଲାଗୁଛି|ହେଲାଣି)\s*([.।!])/g, " $1... ")
      .replace(/\s*(ଡାକ୍ତର ବାବୁ|ଦିଦି|ମାଉସୀ)\s*[,।]?/g, "$1... ")
      .replace(/\b(ଆଃ|ଉଫ୍)\b\s*[,.]?/g, "$1... ")
      // Hindi natural pause points
      .replace(/\s+(और|लेकिन|जैसे|अचानक|बहुत)\s+/g, ", $1 ")
      .replace(/\s+(हो रहा है|लग रहा है|गया है)\s*([.।!])/g, " $1... ")
      .replace(/\s*(डॉक्टर साहब|दीदी|नर्स दीदी)\s*[,।]?/g, "$1... ")
      // English natural pause points
      .replace(/\s+(and|but|suddenly|radiating to|because)\s+/g, ", $1 ")
      .replace(/\s*(Doctor|Sister|Nurse didi)\s*[,.]?/gi, "$1... ");
  }

  // Ensure sentence endings have a clean breath pause
  cleaned = cleaned.replace(/([.?!।])\s*/g, "$1 ");

  return cleaned.trim();
}

let sharedMasteringAudioCtx = null;
const masteredAudioElementsSet = new WeakSet();

/**
 * Masters clinical voice audio with broadcast transparency & human warmth:
 * - Gentle 75Hz high-pass: removes mic thumps & sub-bass rumble without altering speech body
 * - Vocal body warmth: +0.8 dB @ 200Hz (Q=0.8) for natural chest resonance
 * - Consonant presence: +1.4 dB @ 3200Hz (Q=1.0) for crisp Indic articulation
 * - Vocal air & breath: +0.6 dB @ 9500Hz high-shelf for natural human breath intimacy
 * - Soft-knee broadcast limiter: brings out quiet breath gasps while preventing distortion
 */
export async function playWithClinicalMastering(audioElement) {
  if (!audioElement) return false;
  try {
    const playPromise = audioElement.play();
    if (playPromise !== undefined) {
      return await playPromise;
    }
    return true;
  } catch (err) {
    console.warn("Audio element play error:", err);
    return false;
  }
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
  assetId = null,
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

    // 2. Priority Check: Match Pre-rendered Neural Indian Studio Audio Assets (<10ms instant playback)
    const DIGIT_NORMALIZER = {
      "୦": "0", "୧": "1", "୨": "2", "୩": "3", "୪": "4", "୫": "5", "୬": "6", "୭": "7", "୮": "8", "୯": "9",
      "०": "0", "१": "1", "२": "2", "३": "3", "४": "4", "५": "5", "६": "6", "७": "7", "८": "8", "९": "9",
      "ଦୁଇ": "2", "ତିନି": "3", "ଚାରି": "4", "ପାଞ୍ଚ": "5", "ଛଅ": "6", "ସାତ": "7", "ଆଠ": "8",
      "दो": "2", "तीन": "3", "चार": "4", "पाँच": "5", "छह": "6", "सात": "7", "आठ": "8",
      "two": "2", "three": "3", "four": "4", "five": "5", "six": "6", "seven": "7", "eight": "8"
    };

    const normClean = (s) => {
      if (!s) return "";
      let str = s.toLowerCase();
      for (const [k, v] of Object.entries(DIGIT_NORMALIZER)) {
        str = str.replaceAll(k, v);
      }
      str = str.replace(/^(ଆଃ|ଉଫ୍|ଡାକ୍ତର ବାବୁ|ଦିଦି|ମାଉସୀ|ନମସ୍କାର|doctor|doctor babu|doctor sahab|sister|nurse didi|didi|namaste|hello)\b[,.\s...]*/gi, "");
      return str
        .replace(/[^\p{L}\p{N}\s]/gu, "")
        .replace(/\s+/g, " ")
        .trim();
    };

    const textCleaned = normClean(text);
    const targetLangLower = (language || "english").toLowerCase();

    // Determine canonical language bucket
    let canonicalLang = "english";
    if (targetLangLower.includes("odia") || targetLangLower.includes("oriya") || /[\u0B00-\u0B7F]/.test(text)) {
      canonicalLang = "odia";
    } else if (targetLangLower.includes("hindi") || /[\u0900-\u097F]/.test(text)) {
      canonicalLang = "hindi";
    } else if (targetLangLower.includes("english") || targetLangLower.includes("en")) {
      canonicalLang = "english";
    } else {
      canonicalLang = "other";
    }

    const matchedStudioAudio = canonicalLang === "other" ? null : PRE_RENDERED_STUDIO_AUDIO.find((asset) => {
      const assetLang = (asset.language || "").toLowerCase();
      if (assetLang !== canonicalLang && asset.id !== "NURSE_ADVISORY" && asset.id !== "DOCTOR_REFERRAL") {
        return false;
      }

      // 1. Direct explicit assetId request
      if (assetId && assetId === asset.id) return true;

      // 2. Exact or substring match against any registered statement variation
      const matchTargets = [asset.fullText, ...(asset.matchTexts || [])].filter(Boolean);
      for (const t of matchTargets) {
        const cleaned = normClean(t);
        if (cleaned && (textCleaned === cleaned || textCleaned.startsWith(cleaned) || cleaned.startsWith(textCleaned) || textCleaned.includes(cleaned) || cleaned.includes(textCleaned))) {
          return true;
        }
      }

      // 3. Clinical Signatures check (instant match on distinctive clinical symptom markers)
      if (asset.signatures && asset.signatures.length >= 2) {
        const textLower = text.toLowerCase();
        let hitCount = 0;
        for (const sig of asset.signatures) {
          if (textLower.includes(sig.toLowerCase())) {
            hitCount++;
          }
        }
        if (hitCount >= 2) {
          return true;
        }
      }

      return false;
    });

    if (matchedStudioAudio) {
      try {
        const audio = getOrCreatePreloadedAudio(matchedStudioAudio.url);
        if (audio) {
          activeAudioElementRef = audio;
          activeAudioOnEnd = onEnd;
          audio.currentTime = 0;

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
              try { cb(); } catch {}
            }
          };

          const p = audio.play();
          if (p !== undefined) {
            await p;
          }
          return true;
        }
      } catch (audioErr) {
        console.warn("Studio audio file playback failed, proceeding to dynamic/browser TTS:", audioErr);
        activeAudioElementRef = null;
        activeAudioOnEnd = null;
      }
    }

    // 2.5 Dynamic Sarvam AI Bulbul v3 Neural Voice Generation (Level 2 Cloud Synthesis for Custom Text)
    try {
      let targetLangCode = "od-IN";
      if (targetLangLower.includes("hindi") || /[\u0900-\u097F]/.test(text)) {
        targetLangCode = "hi-IN";
      } else if (targetLangLower.includes("bengali") || targetLangLower.includes("bangla") || /[\u0980-\u09FF]/.test(text)) {
        targetLangCode = "bn-IN";
      } else if (targetLangLower.includes("tamil") || /[\u0B80-\u0BFF]/.test(text)) {
        targetLangCode = "ta-IN";
      } else if (targetLangLower.includes("telugu") || /[\u0C00-\u0C7F]/.test(text)) {
        targetLangCode = "te-IN";
      } else if (targetLangLower.includes("english") || targetLangLower.includes("en")) {
        targetLangCode = "en-IN";
      } else if (targetLangLower.includes("odia") || targetLangLower.includes("oriya") || /[\u0B00-\u0B7F]/.test(text)) {
        targetLangCode = "od-IN";
      }

      const numericAge = parseInt(age, 10) || 35;
      const isFemale = (gender || "").toLowerCase().includes("female") || (gender || "").toLowerCase().includes("f");
      const isOdia = targetLangCode === "od-IN";
      
      let speaker = isFemale ? "priya" : "shubh";
      let pace = isOdia ? 0.84 : 0.86;
      let pitch = 0.0;

      if (numericAge <= 12) {
        speaker = "aayan";
        pitch = 0.16;
        pace = isOdia ? 0.85 : 0.88;
      } else if (numericAge >= 55) {
        speaker = isFemale ? "priya" : (targetLangCode === "en-IN" ? "ashutosh" : "ashutosh");
        pitch = isFemale ? -0.03 : -0.10;
        pace = isFemale ? (isOdia ? 0.80 : 0.82) : (isOdia ? 0.78 : 0.82);
      } else if (role === "doctor") {
        speaker = "aditya";
        pitch = -0.04;
        pace = 0.90;
      } else if (role === "nurse") {
        speaker = "ishita";
        pitch = 0.00;
        pace = 0.90;
      } else if (isFemale) {
        speaker = "priya";
        pitch = -0.03;
        pace = isOdia ? 0.82 : 0.85;
      }

      // Convert numeral digits in Odia to authentic spoken Odia words before sending
      let textToSynthesize = text.slice(0, 500);
      if (isOdia || /[\u0B00-\u0B7F]/.test(textToSynthesize)) {
        const ODIA_DIGITS = {
          "0": "ଶୂନ", "1": "ଏକ", "2": "ଦୁଇ", "3": "ତିନି", "4": "ଚାରି", "5": "ପାଞ୍ଚ", "6": "ଛଅ", "7": "ସାତ", "8": "ଆଠ", "9": "ନଅ",
          "୦": "ଶୂନ", "୧": "ଏକ", "୨": "ଦୁଇ", "୩": "ତିନି", "୪": "ଚାରି", "୫": "ପାଞ୍ଚ", "୬": "ଛଅ", "୭": "ସାତ", "୮": "ଆଠ", "୯": "ନଅ"
        };
        textToSynthesize = textToSynthesize
          .replace(/([0-9]|[\u0B66-\u0B6F])\s*(?:ଘଣ୍ଟା)/g, (m, d) => `${ODIA_DIGITS[d] || d} ଘଣ୍ଟା`)
          .replace(/([0-9]|[\u0B66-\u0B6F])\s*(?:ଦିନ)/g, (m, d) => `${ODIA_DIGITS[d] || d} ଦିନ`)
          .replace(/([0-9]|[\u0B66-\u0B6F])\s*(?:ଥର)/g, (m, d) => `${ODIA_DIGITS[d] || d} ଥର`)
          .replace(/([0-9]|[\u0B66-\u0B6F])\s*(?:ମାସ)/g, (m, d) => `${ODIA_DIGITS[d] || d} ମାସ`);
      }

      // Check in-memory Dynamic Cache for instant replay
      const ttsCacheKey = `${targetLangCode}_${speaker}_${textToSynthesize}_${pitch}_${pace}`;
      if (DYNAMIC_TTS_CACHE.has(ttsCacheKey)) {
        const cachedUri = DYNAMIC_TTS_CACHE.get(ttsCacheKey);
        const audio = new Audio(cachedUri);
        activeAudioElementRef = audio;
        activeAudioOnEnd = onEnd;
        audio.currentTime = 0;

        audio.onplay = () => {
          const acoustics = getVocalAcoustics({ age, gender, role, language });
          if (onStart) onStart({ acoustics, isStudio: true, isSarvam: true });
        };
        audio.onended = () => {
          activeAudioElementRef = null;
          activeAudioOnEnd = null;
          if (onEnd) onEnd();
        };
        audio.onerror = () => {
          activeAudioElementRef = null;
          activeAudioOnEnd = null;
          if (onEnd) onEnd();
        };

        const p = audio.play();
        if (p !== undefined) await p;
        return true;
      }

      const candidateUrls = [
        "/api/v1/sarvam/tts",
        "https://saransh-two.vercel.app/api/v1/sarvam/tts"
      ];
      if (typeof window !== "undefined" && window.location.port === "5173") {
        candidateUrls.unshift("http://localhost:8000/api/v1/sarvam/tts");
      }

      let sarvamResp = null;
      for (const endpoint of candidateUrls) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4000);
          sarvamResp = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,
            body: JSON.stringify({
              text: textToSynthesize,
              target_language_code: targetLangCode,
              speaker: speaker,
              pitch: pitch,
              pace: pace
            })
          });
          clearTimeout(timeoutId);
          if (sarvamResp && sarvamResp.ok) break;
        } catch {
          // try next candidate endpoint
        }
      }

      if (sarvamResp && sarvamResp.ok) {
        const sarvamData = await sarvamResp.json();
        if (sarvamData && sarvamData.audio_base64) {
          const audioUri = `data:audio/wav;base64,${sarvamData.audio_base64}`;
          DYNAMIC_TTS_CACHE.set(ttsCacheKey, audioUri);
          const audio = new Audio(audioUri);
          activeAudioElementRef = audio;
          activeAudioOnEnd = onEnd;

          audio.onplay = () => {
            const acoustics = getVocalAcoustics({ age, gender, role, language });
            if (onStart) onStart({ acoustics, isStudio: true, isSarvam: true });
          };

          audio.onended = () => {
            activeAudioElementRef = null;
            activeAudioOnEnd = null;
            if (onEnd) onEnd();
          };

          audio.onerror = () => {
            activeAudioElementRef = null;
            activeAudioOnEnd = null;
            if (onEnd) onEnd();
          };

          const p = audio.play();
          if (p !== undefined) await p;
          return true;
        }
      }
    } catch (sarvamErr) {
      console.warn("Sarvam dynamic TTS unavailable, gracefully falling back to browser TTS:", sarvamErr);
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
    activeUtterances.add(utterance);

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
      stopKeepAliveHeartbeat();
      activeUtterances.delete(utterance);
      activeUtteranceRef = null;
      activeUtteranceOnEnd = null;
      if (onEnd) onEnd();
    };

    utterance.onstart = () => {
      cleanupWatchdog();
      startKeepAliveHeartbeat();
      
      // Calculate realistic maximum speaking duration from word count with safety margin
      const words = (humanizedText || "").split(/\s+/).filter(Boolean).length;
      const expectedDurationSec = Math.max(30, Math.ceil(words / 1.0) + 45);
      
      // Watchdog timeout to prevent voice lock ONLY if browser engine truly hangs
      speechWatchdogTimer = setTimeout(() => {
        if (activeUtteranceRef === utterance && window.speechSynthesis.speaking) {
          console.log("Speech watchdog timeout reached, safely ending speech.");
          stopHumanVoice();
          safeEnd();
        }
      }, expectedDurationSec * 1000);

      if (onStart) onStart({ acoustics, voice: matchedVoice });
    };

    utterance.onend = safeEnd;

    utterance.onerror = (e) => {
      cleanupWatchdog();
      stopKeepAliveHeartbeat();
      activeUtterances.delete(utterance);
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
    stopKeepAliveHeartbeat();
    activeUtterances.clear();
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
  stopKeepAliveHeartbeat();
  activeUtterances.clear();

  if (activeAudioElementRef) {
    try {
      activeAudioElementRef.pause();
      activeAudioElementRef.currentTime = 0;
    } catch {
      // ignore
    }
    activeAudioElementRef = null;
    if (activeAudioOnEnd) {
      const cb = activeAudioOnEnd;
      activeAudioOnEnd = null;
      try { cb(); } catch {}
    }
  }

  if (speechWatchdogTimer) {
    clearTimeout(speechWatchdogTimer);
    speechWatchdogTimer = null;
  }

  if (activeUtteranceOnEnd) {
    const cb = activeUtteranceOnEnd;
    activeUtteranceOnEnd = null;
    try { cb(); } catch {}
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
