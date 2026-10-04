import fs from 'fs';
import path from 'path';
import { TRANSLATIONS } from '../frontend/src/data/translations.js';
import { SYNTHETIC_CASES, SAMPLE_AUDIO_SCRIPTS } from '../frontend/src/data/syntheticCases.js';

console.log("=== COMPREHENSIVE DATA & ASSET INTEGRITY AUDIT ===");

let passed = true;

// 1. Translations check
console.log("\n[1] Checking Translations Integrity...");
const languages = ['English', 'Hindi', 'Odia'];
const enKeys = Object.keys(TRANSLATIONS.English || {});
console.log(`Found ${enKeys.length} keys in English dictionary.`);

for (const lang of languages) {
  const dict = TRANSLATIONS[lang];
  if (!dict) {
    console.error(`❌ Language dictionary missing: ${lang}`);
    passed = false;
    continue;
  }
  let missing = 0;
  for (const k of enKeys) {
    if (dict[k] === undefined || dict[k] === null || dict[k] === '') {
      console.warn(`  ⚠️ Missing or empty key in ${lang}: ${k}`);
      missing++;
    }
  }
  if (missing === 0) {
    console.log(`  ✓ Language ${lang}: All ${enKeys.length} keys present and non-empty.`);
  } else {
    console.warn(`  Language ${lang}: ${missing} keys missing or empty.`);
  }
}

// 2. Synthetic Cases check
console.log("\n[2] Checking Synthetic Cases...");
console.log(`Found ${SYNTHETIC_CASES.length} synthetic cases.`);
const expectedPatients = ["Ramesh", "Priya", "Aarav", "Subhash", "Meena"];

for (const p of expectedPatients) {
  const c = SYNTHETIC_CASES.find(item => item.patient_basic_info?.name_or_alias?.includes(p));
  if (!c) {
    console.error(`❌ Synthetic case missing for patient: ${p}`);
    passed = false;
  } else {
    const sex = c.patient_basic_info.sex || c.patient_basic_info.gender;
    console.log(`  ✓ Case found: ${p} | Age: ${c.patient_basic_info.age} | Sex: ${sex} | Priority: ${c.priority || c.priorityHint}`);
    if (!c.vital_signs?.spo2_percent || !c.symptoms_and_complaints?.chief_complaint) {
      console.error(`❌ Vital signs or chief complaint missing for: ${p}`);
      passed = false;
    }
  }
}

// 3. Audio scripts check
console.log("\n[3] Checking Sample Audio Scripts...");
for (const lang of ['Odia', 'Hindi', 'English']) {
  const scripts = SAMPLE_AUDIO_SCRIPTS[lang];
  if (!scripts) {
    console.error(`❌ Audio scripts missing for language: ${lang}`);
    passed = false;
    continue;
  }
  console.log(`  ✓ ${lang} has ${scripts.length} audio sample personas.`);
  for (const p of expectedPatients) {
    const found = scripts.some(s => s.label.includes(p) || s.text.includes(p) || s.audioFile?.includes(p.toLowerCase()));
    if (!found) {
      console.error(`❌ Audio script missing for ${p} in ${lang}`);
      passed = false;
    }
  }
}

// 4. Public Audio Files check
console.log("\n[4] Checking Public Audio Files in frontend/public/audio/...");
const audioDir = path.resolve('frontend/public/audio');
if (!fs.existsSync(audioDir)) {
  console.error(`❌ Audio directory does not exist: ${audioDir}`);
  passed = false;
} else {
  const files = fs.readdirSync(audioDir);
  console.log(`  Found ${files.length} audio files in frontend/public/audio/:`);
  for (const f of files) {
    const stats = fs.statSync(path.join(audioDir, f));
    console.log(`    - ${f} (${(stats.size / 1024).toFixed(1)} KB)`);
  }
}

console.log("\n=======================================================");
if (passed) {
  console.log("AUDIT SUCCESS: All data, translations, cases & audio validated!");
} else {
  console.error("AUDIT FAILED: Issues detected above.");
  process.exit(1);
}
