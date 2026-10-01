import { 
  getVocalAcoustics, 
  findBestMatchingVoice, 
  convertOdiaToPhoneticDevanagari, 
  convertIndicToLatinPhonetic,
  humanizeSpeechText 
} from '../frontend/src/utils/voiceSynthesisEngine.js';
import { SAMPLE_AUDIO_SCRIPTS } from '../frontend/src/data/syntheticCases.js';

console.log("=== COMPREHENSIVE VOICE AUDIT ACROSS ALL LANGUAGES ===");

const MOCK_SYSTEM_VOICES = [
  // Realistic multi-platform voice sets
  // Case A: Windows / Edge Indian Pack installed
  { name: "Microsoft Ravi - English (India)", lang: "en-IN" },
  { name: "Microsoft Heera - English (India)", lang: "en-IN" },
  { name: "Microsoft Madhur Online (Natural) - Hindi (India)", lang: "hi-IN" },
  { name: "Microsoft Swara Online (Natural) - Hindi (India)", lang: "hi-IN" },
  // Case B: Android / Google Chrome voices
  { name: "Google हिन्दी", lang: "hi-IN" },
  { name: "Google Indian English Female", lang: "en-IN" },
  // Case C: iOS / Mac Siri Indian voices
  { name: "Rishi (Enhanced)", lang: "en-IN" },
  // Case D: Standard English-only desktop system (no Indic pack installed)
  { name: "Microsoft David - English (United States)", lang: "en-US" },
  { name: "Microsoft Zira - English (United States)", lang: "en-US" }
];

let totalTests = 0;
let passedTests = 0;

for (const [lang, samples] of Object.entries(SAMPLE_AUDIO_SCRIPTS)) {
  console.log(`\n--- Testing Language: ${lang} (${samples.length} clinical personas) ---`);
  
  for (const sample of samples) {
    totalTests++;
    console.log(`\n[Persona] ${sample.label}`);
    console.log(`  Demographics: ${sample.age}y ${sample.gender}`);
    
    // 1. Test Acoustics
    const acoustics = getVocalAcoustics({
      age: sample.age,
      gender: sample.gender,
      role: "patient",
      language: lang
    });
    
    if (!acoustics || !acoustics.rate || !acoustics.pitch) {
      console.error(`  FAIL: Invalid acoustics for ${sample.label}`);
      continue;
    }
    console.log(`  Acoustics: Pitch=${acoustics.pitch}, Rate=${acoustics.rate}, Volume=${acoustics.volume}, FemalePref=${acoustics.isFemalePreferred}`);
    
    // 2. Test Voice Matching across Voice Sets
    // Subset 1: Full Indian voices available
    const bestVoiceFull = findBestMatchingVoice(MOCK_SYSTEM_VOICES, {
      language: lang,
      isFemalePreferred: acoustics.isFemalePreferred
    });
    console.log(`  Best Voice (Full Pack): ${bestVoiceFull ? bestVoiceFull.name : "None"}`);
    
    // Subset 2: English-only system (e.g. standard US/Global Windows/Mac)
    const englishOnlyVoices = MOCK_SYSTEM_VOICES.filter(v => v.lang.startsWith("en-US"));
    const bestVoiceEnglishOnly = findBestMatchingVoice(englishOnlyVoices, {
      language: lang,
      isFemalePreferred: acoustics.isFemalePreferred
    });
    console.log(`  Best Voice (English Only system): ${bestVoiceEnglishOnly ? bestVoiceEnglishOnly.name : "None"}`);
    
    // 3. Test Humanization
    const humanized = humanizeSpeechText(sample.text, { age: sample.age, role: "patient" });
    if (!humanized || humanized.length === 0) {
      console.error(`  FAIL: Humanized text empty`);
      continue;
    }
    
    // 4. Test Script Adaptations
    if (lang === "Odia") {
      const deva = convertOdiaToPhoneticDevanagari(sample.text);
      const latin = convertIndicToLatinPhonetic(sample.text);
      if (!deva || !latin) {
        console.error(`  FAIL: Odia conversions returned empty`);
        continue;
      }
      console.log(`  Devanagari preview: "${deva.slice(0, 50)}..."`);
      console.log(`  Latin preview: "${latin.slice(0, 50)}..."`);
    } else if (lang === "Hindi") {
      const latin = convertIndicToLatinPhonetic(sample.text);
      if (!latin) {
        console.error(`  FAIL: Hindi Latin conversion returned empty`);
        continue;
      }
      console.log(`  Latin preview: "${latin.slice(0, 50)}..."`);
    } else {
      console.log(`  English preview: "${sample.text.slice(0, 50)}..."`);
    }

    passedTests++;
    console.log(`  PASS: All voice pipeline stages validated.`);
  }
}

console.log(`\n========================================`);
console.log(`AUDIT RESULT: ${passedTests}/${totalTests} personas passed all language & voice validations.`);
console.log(`========================================`);
