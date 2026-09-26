import React, { useState, useEffect } from "react";
import {
  Mic,
  MicOff,
  Upload,
  Camera,
  Heart,
  Activity,
  AlertTriangle,
  ShieldAlert,
  Sparkles,
  FileText,
  User,
  Volume2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Radio,
  FileCheck,
  Languages,
  Check,
  Thermometer,
  Gauge,
  Droplet,
  RotateCcw,
  Send,
  Building2,
  Plus
} from "lucide-react";
import {
  SYNTHETIC_CASES,
  SAMPLE_REPORTS,
  SAMPLE_AUDIO_SCRIPTS
} from "../data/syntheticCases";
import { TRANSLATIONS } from "../data/translations";
import { evaluateLocalDeterministicTriage } from "../utils/localTriageRules";
import TriageResultCard from "./TriageResultCard";

export default function IntakeStation({
  selectedFacility,
  selectedLanguage,
  onAnalyze,
  isAnalyzing,
  triageResult,
  onSubmitFollowupAnswers,
  onGoToDoctorQueue
}) {
  const t = TRANSLATIONS[selectedLanguage] || TRANSLATIONS.English;

  // Wizard Step: 1 = Registration, 2 = Symptoms & Vitals, 3 = Triage Note & Handover
  const [wizardStep, setWizardStep] = useState(1);

  // Form State
  const [patientInfo, setPatientInfo] = useState({
    patient_id: "PHC-1024",
    token_number: "T-024",
    name_or_alias: "Ramesh K. (Synthetic)",
    age: 62,
    sex: "Male",
    location_state: "Odisha - Khordha",
    facility_type: selectedFacility || "PHC_OPD",
    language_preference: selectedLanguage || "English",
    consent_given: true,
    unconscious_bypass: false,
    emergency_contact: "+91-9876543210",
    abha_id: "91-4821-9923-0192"
  });

  const [abhaScanned, setAbhaScanned] = useState(true);
  const [isScanningAbha, setIsScanningAbha] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeBodyRegion, setActiveBodyRegion] = useState("chestCardiac");

  // 6 Interactive Anatomical Zones
  const BODY_REGIONS = [
    {
      id: "headNeck",
      icon: "🧠",
      label: t.headNeck || "Head & Neck",
      symptoms: ["Headache", "Dizziness", "Blurred Vision"]
    },
    {
      id: "chestCardiac",
      icon: "🫀",
      label: t.chestCardiac || "Chest & Cardiac",
      symptoms: ["Chest Pain", "Palpitations", "Sweating"]
    },
    {
      id: "lungsBreathing",
      icon: "🫁",
      label: t.lungsBreathing || "Lungs & Breathing",
      symptoms: ["Difficulty Breathing", "Cough"]
    },
    {
      id: "abdomenPelvis",
      icon: "🤰",
      label: t.abdomenPelvis || "Abdomen & Pelvis",
      symptoms: ["Severe Abdominal Pain", "Nausea", "Vomiting"]
    },
    {
      id: "limbsJoints",
      icon: "🦵",
      label: t.limbsJoints || "Limbs & Joints",
      symptoms: ["Ankle Swelling", "Edema", "Weakness / Fatigue"]
    },
    {
      id: "skinSurface",
      icon: "🩹",
      label: t.skinSurface || "Skin & Surface",
      symptoms: ["Skin Rash", "Wound / Trauma", "Burns"]
    }
  ];

  // 1-Click ABHA / ABDM Mock Scan Handler with Holographic Laser Scan
  const handleMockScanAbha = () => {
    setIsScanningAbha(true);
    setTimeout(() => {
      setPatientInfo((prev) => ({
        ...prev,
        abha_id: "91-4821-9923-0192",
        name_or_alias: "Ramesh Kumar (ABHA Verified)",
        age: 62,
        sex: "Male",
        location_state: "Odisha - Khordha",
        consent_given: true
      }));

      setMedicalHistory({
        existing_conditions: [
          "Essential Hypertension (ICD-10 I10)",
          "Type 2 Diabetes"
        ],
        current_medications: [
          "Amlodipine 5mg OD (Irregular)",
          "Metformin 500mg BD"
        ],
        known_allergies: [
          "Penicillin (Severe Urticaria / Anaphylaxis Risk)"
        ]
      });

      setAbhaScanned(true);
      setIsScanningAbha(false);
    }, 750);
  };

  // Click handler for 2D Anatomical Body Map Zone
  const handleBodyRegionClick = (region) => {
    setActiveBodyRegion(region.id);
    const regionSyms = region.symptoms;
    const allSelected = regionSyms.every((s) => symptoms.selected_symptoms.includes(s));

    setSymptoms((prev) => {
      let updated;
      if (allSelected) {
        // Deselect this region's symptoms
        updated = prev.selected_symptoms.filter((s) => !regionSyms.includes(s));
      } else {
        // Auto-select all symptoms for this anatomical region
        const toAdd = regionSyms.filter((s) => !prev.selected_symptoms.includes(s));
        updated = [...prev.selected_symptoms, ...toAdd];
      }
      return {
        ...prev,
        selected_symptoms: updated,
        chief_complaint: updated.join(", ") || prev.chief_complaint
      };
    });
  };

  const [symptoms, setSymptoms] = useState({
    chief_complaint: "Doctor, for the past 2 hours my chest feels crushed under heavy stone with unbearable stabbing pain. I can barely breathe, and I'm breaking into a cold sweat. Please check me quickly, it feels like my chest is tearing.",
    selected_symptoms: ["Chest Pain", "Difficulty Breathing", "Sweating"],
    duration: "2 hours",
    onset_trend: "Worsening rapidly",
    severity_self_reported: "Severe (8/10)",
    associated_symptoms: ["Dizziness", "Left arm heaviness"],
    previous_similar_episodes: "",
    verbatim_local_statement: "ଡାକ୍ତର ବାବୁ, ୨ ଘଣ୍ଟା ହେଲା ଛାତିଟା ପଥର ଭଳି ଭାରି ଲାଗୁଛି ଆଉ ବହୁତ ଜୋରରେ କଣେଇକି ଦରଦ ହେଉଛି। ନିଶ୍ୱାସ ଆଦୌ ନେଇପାରୁନି, ଦେହ ସାରା ଝାଳରେ ଥଣ୍ଡା ପଡ଼ିଗଲାଣି। ଟିକେ ଶୀଘ୍ର ଦେଖନ୍ତୁ ବାବୁ, ଛାତି ଫାଟିଯିବା ଭଳି ଲାଗୁଛି।",
    phonetic_transliteration: "Doctor babu, 2 ghanta hela chhatita pathara bhali bhari laguchhi au bahut jor re kaneiki darada heuchhi. Nishwas aadou neiparuni, deha sara jhalare thanda padigalani. Tike shighra dekhantu babu, chhati fatijiba bhali laguchhi.",
    translated_english_statement: "Doctor, for the past 2 hours my chest feels crushed under heavy stone with unbearable stabbing pain. I can barely breathe, and I'm breaking into a cold sweat. Please check me quickly, it feels like my chest is tearing."
  });

  const [vitals, setVitals] = useState({
    temperature_f: 99.8,
    spo2_percent: 89,
    heart_rate_bpm: 112,
    bp_systolic: 158,
    bp_diastolic: 96,
    respiratory_rate_min: 26,
    blood_glucose_mg_dl: 142,
    weight_kg: 68
  });

  const [medicalHistory, setMedicalHistory] = useState({
    existing_conditions: ["Hypertension (5 years)", "Type 2 Diabetes"],
    current_medications: ["Amlodipine 5mg irregular", "Metformin 500mg"],
    known_allergies: ["Sulfa drugs"]
  });

  const [redFlags, setRedFlags] = useState({
    severe_chest_pain: true,
    severe_breathing_difficulty: true,
    very_low_oxygen_spo2: true,
    loss_of_consciousness: false,
    severe_bleeding: false,
    seizure: false,
    sudden_weakness_paralysis: false,
    severe_allergic_reaction: false
  });

  const [selectedReportId, setSelectedReportId] = useState("ECG_LVH");
  const [uploadedReports, setUploadedReports] = useState([]);
  const [visualCategory, setVisualCategory] = useState("Swelling_Edema");
  const [visualCaption, setVisualCaption] = useState("Mild bilateral ankle swelling noticed for 3 days");

  const [isListening, setIsListening] = useState(false);
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState(false);
  const [isStatementVerified, setIsStatementVerified] = useState(true);

  // Recording timer for animated audio waveform
  useEffect(() => {
    let timer = null;
    if (isListening || isPlayingAudio) {
      timer = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isListening, isPlayingAudio]);

  const formatTimerString = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}s`;
  };

  // Sync facility and language props
  useEffect(() => {
    setPatientInfo((prev) => ({
      ...prev,
      facility_type: selectedFacility,
      language_preference: selectedLanguage
    }));
  }, [selectedFacility, selectedLanguage]);

  // When triage result is available, auto transition to step 3
  useEffect(() => {
    if (triageResult) {
      setWizardStep(3);
    }
  }, [triageResult]);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      setSpeechRecognitionSupported(true);
    }
  }, []);

  // Compute live client-side deterministic priority for instant visual feedback
  const localEval = evaluateLocalDeterministicTriage(vitals, redFlags, patientInfo);

  // Speech Synthesis helper for native dialect playback
  const handlePlaySpeech = (text, langPreference) => {
    if (!("speechSynthesis" in window)) {
      alert("Speech synthesis is not supported in this browser.");
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (langPreference === "Hindi") {
        utterance.lang = "hi-IN";
      } else if (langPreference === "Odia") {
        utterance.lang = "or-IN";
      } else {
        utterance.lang = "en-IN";
      }
      utterance.rate = 0.88;
      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("TTS playback error:", e);
      setIsPlayingAudio(false);
    }
  };

  // Load a 1-click synthetic preset
  const handleLoadPreset = (preset) => {
    setPatientInfo({
      ...preset.patient_basic_info,
      facility_type: selectedFacility || preset.patient_basic_info.facility_type,
      abha_id: preset.patient_basic_info.abha_id || (preset.id === "RAMESH_CARDIAC_RED" ? "91-4821-9923-0192" : "")
    });
    setAbhaScanned(preset.id === "RAMESH_CARDIAC_RED" || Boolean(preset.patient_basic_info.abha_id));
    setSymptoms({
      ...preset.symptoms_and_complaints,
      phonetic_transliteration: preset.symptoms_and_complaints.phonetic_transliteration || ""
    });
    setVitals(preset.vital_signs);
    setMedicalHistory({
      existing_conditions: preset.medical_history.existing_conditions || [],
      current_medications: preset.medical_history.current_medications || [],
      known_allergies: preset.medical_history.known_allergies || []
    });
    setRedFlags(preset.red_flag_checklist);
    setUploadedReports(preset.uploaded_reports || []);
    if (preset.visual_inputs && preset.visual_inputs.length > 0) {
      setVisualCategory(preset.visual_inputs[0].image_category);
      setVisualCaption(preset.visual_inputs[0].user_caption);
    } else {
      setVisualCategory("None");
      setVisualCaption("");
    }
  };

  // Sample report selection handler
  const handleSelectSampleReport = (reportId) => {
    setSelectedReportId(reportId);
    const found = SAMPLE_REPORTS.find((r) => r.id === reportId);
    if (found) {
      setUploadedReports([
        {
          report_type: found.report_type,
          file_name: `${found.id.toLowerCase()}.jpg`,
          ocr_extracted_text: found.text,
          key_findings: found.findings
        }
      ]);
    }
  };

  // Sample audio injection handler
  const handleInjectSampleVoice = (sample) => {
    setSymptoms((prev) => ({
      ...prev,
      verbatim_local_statement: sample.text,
      phonetic_transliteration: sample.phonetic || "",
      translated_english_statement: sample.translation,
      chief_complaint: sample.translation
    }));
    setIsStatementVerified(true);
    setIsPlayingAudio(true);
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 4500);
  };

  // Re-record action handler
  const handleRecordAgain = () => {
    setSymptoms((prev) => ({
      ...prev,
      verbatim_local_statement: "",
      phonetic_transliteration: "",
      translated_english_statement: ""
    }));
    setIsStatementVerified(false);
    if (!isListening) {
      handleToggleSpeech();
    }
  };

  // Real-time microphone listening via Web Speech API
  const handleToggleSpeech = () => {
    if (!speechRecognitionSupported) {
      alert("Web Speech API is not supported in this browser. Please use the 1-click Vernacular Voice buttons below.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      let langCode = "en-IN";
      if (patientInfo.language_preference === "Hindi") langCode = "hi-IN";
      if (patientInfo.language_preference === "Odia") langCode = "or-IN";

      recognition.lang = langCode;
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSymptoms((prev) => ({
          ...prev,
          verbatim_local_statement: transcript,
          translated_english_statement: `[Voice Captured] ${transcript}`
        }));
        setIsStatementVerified(false);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const handleRedFlagToggle = (key) => {
    setRedFlags((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSymptomToggle = (symptomName) => {
    setSymptoms((prev) => {
      const exists = prev.selected_symptoms.includes(symptomName);
      const updated = exists
        ? prev.selected_symptoms.filter((s) => s !== symptomName)
        : [...prev.selected_symptoms, symptomName];
      return {
        ...prev,
        selected_symptoms: updated,
        chief_complaint: updated.join(", ") || prev.chief_complaint
      };
    });
  };

  // Navigation handlers
  const handleContinueToStep2 = () => {
    if (!patientInfo.consent_given && !patientInfo.unconscious_bypass) {
      alert("Please confirm Informed Consent (or toggle Emergency Unconscious Override) to proceed.");
      return;
    }
    setWizardStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRunAnalysis = (e) => {
    if (e) e.preventDefault();

    if (!patientInfo.consent_given && !patientInfo.unconscious_bypass) {
      alert("Informed Consent is required before proceeding with triage.");
      return;
    }

    const payload = {
      patient_basic_info: patientInfo,
      symptoms_and_complaints: symptoms,
      vital_signs: vitals,
      medical_history: {
        ...medicalHistory,
        previous_surgeries: [],
        previous_hospitalizations: [],
        family_history: ""
      },
      uploaded_reports: uploadedReports,
      visual_inputs: visualCategory !== "None" ? [
        {
          image_category: visualCategory,
          user_caption: visualCaption,
          ai_supporting_observation: `Supporting visual context for ${visualCategory}`
        }
      ] : [],
      red_flag_checklist: redFlags
    };

    onAnalyze(payload);
  };

  const handleResetForm = () => {
    const randomId = Math.floor(1000 + Math.random() * 9000);
    const randomToken = Math.floor(20 + Math.random() * 80);
    setPatientInfo({
      patient_id: `PHC-${randomId}`,
      token_number: `T-0${randomToken}`,
      name_or_alias: "",
      age: 32,
      sex: "Female",
      location_state: "Odisha - Khordha",
      facility_type: selectedFacility || "PHC_OPD",
      language_preference: selectedLanguage || "English",
      consent_given: true,
      unconscious_bypass: false,
      emergency_contact: "+91-",
      abha_id: ""
    });
    setAbhaScanned(false);
    setSymptoms({
      chief_complaint: "",
      selected_symptoms: [],
      duration: "",
      onset_trend: "Gradual",
      severity_self_reported: "Moderate (5/10)",
      associated_symptoms: [],
      previous_similar_episodes: "",
      verbatim_local_statement: "",
      phonetic_transliteration: "",
      translated_english_statement: ""
    });
    setVitals({
      temperature_f: 98.6,
      spo2_percent: 98,
      heart_rate_bpm: 78,
      bp_systolic: 120,
      bp_diastolic: 80,
      respiratory_rate_min: 18,
      blood_glucose_mg_dl: 110,
      weight_kg: 60
    });
    setRedFlags({
      severe_chest_pain: false,
      severe_breathing_difficulty: false,
      very_low_oxygen_spo2: false,
      loss_of_consciousness: false,
      severe_bleeding: false,
      seizure: false,
      sudden_weakness_paralysis: false,
      severe_allergic_reaction: false
    });
    setUploadedReports([]);
    setWizardStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      {/* 3-STEP SEQUENTIAL WIZARD PROGRESS BAR */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {/* Step 1 Pill */}
          <button
            type="button"
            onClick={() => setWizardStep(1)}
            className={`flex items-center space-x-2 text-xs font-bold transition cursor-pointer ${
              wizardStep === 1
                ? "text-teal-700"
                : wizardStep > 1
                ? "text-slate-700 hover:text-teal-600"
                : "text-slate-400"
            }`}
          >
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition ${
                wizardStep === 1
                  ? "bg-teal-600 text-white shadow-md shadow-teal-700/25"
                  : wizardStep > 1
                  ? "bg-teal-100 text-teal-800"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {wizardStep > 1 ? <Check className="w-4 h-4" /> : "1"}
            </span>
            <span className="hidden sm:inline">{t.wizardStep1 || "1. Patient Registration & Consent"}</span>
            <span className="sm:hidden">Step 1</span>
          </button>

          <div
            className={`flex-1 h-0.5 mx-3 sm:mx-6 transition-colors ${
              wizardStep >= 2 ? "bg-teal-500" : "bg-slate-200"
            }`}
          ></div>

          {/* Step 2 Pill */}
          <button
            type="button"
            onClick={() => {
              if (patientInfo.consent_given || patientInfo.unconscious_bypass) setWizardStep(2);
            }}
            className={`flex items-center space-x-2 text-xs font-bold transition cursor-pointer ${
              wizardStep === 2
                ? "text-teal-700"
                : wizardStep > 2
                ? "text-slate-700 hover:text-teal-600"
                : "text-slate-400"
            }`}
          >
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition ${
                wizardStep === 2
                  ? "bg-teal-600 text-white shadow-md shadow-teal-700/25"
                  : wizardStep > 2
                  ? "bg-teal-100 text-teal-800"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {wizardStep > 2 ? <Check className="w-4 h-4" /> : "2"}
            </span>
            <span className="hidden sm:inline">{t.wizardStep2 || "2. Multimodal Symptoms, Vitals & Reports"}</span>
            <span className="sm:hidden">Step 2</span>
          </button>

          <div
            className={`flex-1 h-0.5 mx-3 sm:mx-6 transition-colors ${
              wizardStep >= 3 ? "bg-teal-500" : "bg-slate-200"
            }`}
          ></div>

          {/* Step 3 Pill */}
          <button
            type="button"
            onClick={() => {
              if (triageResult) setWizardStep(3);
            }}
            className={`flex items-center space-x-2 text-xs font-bold transition cursor-pointer ${
              wizardStep === 3
                ? "text-teal-700"
                : triageResult
                ? "text-slate-700 hover:text-teal-600"
                : "text-slate-400 cursor-not-allowed"
            }`}
          >
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition ${
                wizardStep === 3
                  ? "bg-teal-600 text-white shadow-md shadow-teal-700/25"
                  : triageResult
                  ? "bg-teal-100 text-teal-800"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              3
            </span>
            <span className="hidden sm:inline">{t.wizardStep3 || "3. Structured Triage Note & Handover"}</span>
            <span className="sm:hidden">Step 3</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STEP 1: PATIENT REGISTRATION & INFORMED CONSENT GATE */}
      {/* ========================================================================= */}
      {wizardStep === 1 && (
        <div className="space-y-6 animate-fadeIn">
          {/* ========================================================================= */}
          {/* 1. HOLOGRAPHIC ABHA DIGITAL HEALTH CARD (NHA / ABDM STYLE) */}
          {/* ========================================================================= */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white group transition-all duration-300 hover:shadow-2xl">
            {/* Holographic iridescent light sheen overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/10 via-amber-400/5 to-sky-400/10 pointer-events-none"></div>

            {/* Laser Scan line when isScanningAbha is true */}
            {isScanningAbha && (
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_20px_#34d399] animate-laserScan z-30 pointer-events-none"></div>
            )}

            {/* Top Tricolor Accent Bar (Saffron #FF9933, White #FFFFFF, Green #138808) */}
            <div className="h-2 w-full grid grid-cols-3">
              <div className="bg-[#FF9933] h-full"></div>
              <div className="bg-white h-full"></div>
              <div className="bg-[#138808] h-full"></div>
            </div>

            {/* National Health Authority • ABDM Sub-bar */}
            <div className="bg-black/50 backdrop-blur-md px-5 py-2 flex flex-wrap items-center justify-between border-b border-white/10 text-xs">
              <div className="flex items-center space-x-2">
                <span className="text-base leading-none">🏛️</span>
                <span className="font-extrabold tracking-widest text-[11px] text-amber-200">
                  {t.nationalHealthAuthority || "NATIONAL HEALTH AUTHORITY • ABDM VERIFIED"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center space-x-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded-full text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>ABDM LIVE SANDBOX</span>
                </span>
              </div>
            </div>

            {/* Main Card Body */}
            <div className="p-6 relative z-10 space-y-5">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                {/* Left side: Chip & Contactless & Avatar */}
                <div className="flex items-center space-x-4">
                  {/* Photorealistic Gold Microchip Graphic */}
                  <div className="relative shrink-0">
                    <div className="w-13 h-10 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border border-amber-700/80 shadow-inner flex flex-col justify-between p-1">
                      <div className="w-full h-[1px] bg-amber-900/40"></div>
                      <div className="flex justify-between items-center h-full px-1">
                        <div className="w-2.5 h-full border-r border-amber-900/40"></div>
                        <div className="w-3.5 h-3.5 rounded-full border border-amber-900/40"></div>
                        <div className="w-2.5 h-full border-l border-amber-900/40"></div>
                      </div>
                      <div className="w-full h-[1px] bg-amber-900/40"></div>
                    </div>
                    {/* Contactless waves graphic */}
                    <div className="absolute -top-1 -right-2 text-[10px] font-mono text-amber-300/80 font-bold select-none">
                      )))
                    </div>
                  </div>

                  {/* Verified Checkmark Avatar */}
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/25 flex items-center justify-center text-teal-200 shadow-inner">
                      <User className="w-7 h-7" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 border-2 border-slate-900 shadow-sm" title="ABDM Verified Citizen">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  </div>

                  {/* Citizen Basic Info */}
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                        {patientInfo.name_or_alias || "Ramesh Kumar (ABHA Verified)"}
                      </h3>
                      <span className="text-[10px] bg-teal-500/20 text-teal-300 border border-teal-400/40 px-2 py-0.5 rounded-md font-bold">
                        CITIZEN
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {patientInfo.age} Yrs • {patientInfo.sex} • {patientInfo.location_state || "Odisha - Khordha"}
                    </p>
                  </div>
                </div>

                {/* Right side: Action Button */}
                <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <button
                    type="button"
                    onClick={handleMockScanAbha}
                    disabled={isScanningAbha}
                    className="bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-300 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-black text-xs px-5 py-3 rounded-xl transition shadow-lg shadow-teal-500/25 flex items-center justify-center space-x-2 shrink-0 cursor-pointer active:scale-95 disabled:opacity-75"
                  >
                    <span className="text-sm">{isScanningAbha ? "⚡" : "🪪"}</span>
                    <span>
                      {isScanningAbha
                        ? (t.abhaCardScanning || "Scanning ABHA Card...")
                        : (t.mockScanAbhaBtn || "[ 🪪 Mock Scan ABHA Card ]")}
                    </span>
                  </button>
                </div>
              </div>

              {/* Formatted ABHA Number Pill & Digital Health ID Bar */}
              <div className="bg-black/35 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <span className="text-[11px] text-teal-300 font-bold uppercase tracking-wider">
                    {t.abhaIdLabel || "ABHA ID (NHA Health Account)"}:
                  </span>
                  <div className="bg-teal-950/80 border border-teal-400/50 px-3.5 py-1.5 rounded-xl font-mono text-xs sm:text-sm font-black text-teal-200 tracking-wider shadow-inner flex items-center space-x-2">
                    <span className="text-emerald-400">ABHA:</span>
                    <span className="text-white tracking-widest">{patientInfo.abha_id || "91-4821-9923-0192"}</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  </div>
                </div>

                {/* Mock QR Matrix Graphic */}
                <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-mono">
                  <div className="w-7 h-7 bg-white p-0.5 rounded flex items-center justify-center shadow-xs">
                    <div className="w-full h-full bg-slate-950 rounded-[2px] flex items-center justify-center">
                      <span className="text-[7px] text-teal-300 font-bold">QR</span>
                    </div>
                  </div>
                  <span className="hidden sm:inline">NHA SCAN-READY</span>
                </div>
              </div>

              {/* Synced Medical History Pills */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-teal-200/90 font-bold uppercase tracking-wider flex items-center space-x-1.5">
                    <span>⚡</span>
                    <span>ABDM Synced Medical History & Clinical Alerts:</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Auto-synchronized via Consent Protocol</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="bg-teal-500/20 text-teal-200 border border-teal-400/40 font-semibold px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                    <span>Essential Hypertension (ICD-10 I10)</span>
                  </span>

                  <span className="bg-sky-500/20 text-sky-200 border border-sky-400/40 font-semibold px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                    <span>Type 2 Diabetes</span>
                  </span>

                  <span className="bg-rose-500/25 text-rose-200 border border-rose-400/60 font-black px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 ring-1 ring-rose-500/40 shadow-xs animate-pulse">
                    <span>🚨</span>
                    <span>Penicillin Allergy Alert</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 1-Click Demo Quick Fill Profiles */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>{t.quickFillTitle || "1-Click Demo Quick Fill Profiles:"}</span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                Standardized clinical profiles across facility scenarios
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Ramesh (Odia RED) */}
              <button
                type="button"
                onClick={() => handleLoadPreset(SYNTHETIC_CASES[0])}
                className="text-left p-3.5 rounded-xl border border-rose-200 bg-rose-50/60 hover:border-rose-400 hover:bg-rose-100/60 transition shadow-xs flex flex-col justify-between space-y-2 group cursor-pointer"
              >
                <div>
                  <div className="font-bold text-xs text-rose-950 flex items-center justify-between">
                    <span>⚡ Ramesh 62M</span>
                    <span className="bg-rose-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                      🔴 RED
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1">
                    {t.quickFillRameshSub || "Odia Chest Pain & Hypoxia (SpO2 89%)"}
                  </div>
                </div>
                <div className="text-[10px] text-teal-700 font-bold pt-1 border-t border-rose-200/60 flex items-center justify-between">
                  <span>{t.quickFillBtn || "Click to Quick Fill"}</span>
                  <span>➔</span>
                </div>
              </button>

              {/* Priya (Hindi YELLOW) */}
              <button
                type="button"
                onClick={() => handleLoadPreset(SYNTHETIC_CASES[1])}
                className="text-left p-3.5 rounded-xl border border-amber-200 bg-amber-50/60 hover:border-amber-400 hover:bg-amber-100/60 transition shadow-xs flex flex-col justify-between space-y-2 group cursor-pointer"
              >
                <div>
                  <div className="font-bold text-xs text-amber-950 flex items-center justify-between">
                    <span>⚡ Priya 34F</span>
                    <span className="bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                      🟠 YELLOW
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1">
                    {t.quickFillPriyaSub || "Hindi High Fever (102.8°F) & Low Platelets"}
                  </div>
                </div>
                <div className="text-[10px] text-teal-700 font-bold pt-1 border-t border-amber-200/60 flex items-center justify-between">
                  <span>{t.quickFillBtn || "Click to Quick Fill"}</span>
                  <span>➔</span>
                </div>
              </button>

              {/* Subhash (Eng GREEN) */}
              <button
                type="button"
                onClick={() => handleLoadPreset(SYNTHETIC_CASES[2])}
                className="text-left p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:border-emerald-400 hover:bg-emerald-100/60 transition shadow-xs flex flex-col justify-between space-y-2 group cursor-pointer"
              >
                <div>
                  <div className="font-bold text-xs text-emerald-950 flex items-center justify-between">
                    <span>⚡ Subhash 24M</span>
                    <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                      🟢 GREEN
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1">
                    {t.quickFillSubhashSub || "English Tension Headache & Screen Fatigue"}
                  </div>
                </div>
                <div className="text-[10px] text-teal-700 font-bold pt-1 border-t border-emerald-200/60 flex items-center justify-between">
                  <span>{t.quickFillBtn || "Click to Quick Fill"}</span>
                  <span>➔</span>
                </div>
              </button>

              {/* Meena (Odia Maternal RED) */}
              <button
                type="button"
                onClick={() => handleLoadPreset(SYNTHETIC_CASES[3])}
                className="text-left p-3.5 rounded-xl border border-rose-200 bg-rose-50/60 hover:border-rose-400 hover:bg-rose-100/60 transition shadow-xs flex flex-col justify-between space-y-2 group cursor-pointer"
              >
                <div>
                  <div className="font-bold text-xs text-rose-950 flex items-center justify-between">
                    <span>⚡ Meena 28F</span>
                    <span className="bg-rose-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                      🔴 RED
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1">
                    {t.quickFillMeenaSub || "Maternal Pre-eclampsia (BP 168/110)"}
                  </div>
                </div>
                <div className="text-[10px] text-teal-700 font-bold pt-1 border-t border-rose-200/60 flex items-center justify-between">
                  <span>{t.quickFillBtn || "Click to Quick Fill"}</span>
                  <span>➔</span>
                </div>
              </button>
            </div>
          </div>

          {/* Minimal Patient Registration Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    {t.step1Title}
                  </h3>
                  <p className="text-xs text-slate-500">{t.step1Subtitle}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2.5">
                <span className="text-xs bg-teal-50 text-teal-800 px-3 py-1 rounded-xl border border-teal-200 font-mono font-bold shadow-xs">
                  {t.tokenLabel}: {patientInfo.token_number}
                </span>
                <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-xl font-mono">
                  {t.patientIdLabel}: {patientInfo.patient_id}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="text-slate-600 font-semibold block mb-1.5 flex items-center justify-between">
                  <span>{t.abhaIdLabel || "ABHA ID (ABDM)"}</span>
                  {abhaScanned && (
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold border border-emerald-200">
                      ✓ ABDM
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  value={patientInfo.abha_id || ""}
                  onChange={(e) => setPatientInfo({ ...patientInfo, abha_id: e.target.value })}
                  placeholder="e.g. 91-4821-9923-0192"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 font-mono font-medium"
                />
              </div>

              <div>
                <label className="text-slate-600 font-semibold block mb-1.5">{t.nameLabel}</label>
                <input
                  type="text"
                  value={patientInfo.name_or_alias}
                  onChange={(e) => setPatientInfo({ ...patientInfo, name_or_alias: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 font-medium"
                />
              </div>

              <div>
                <label className="text-slate-600 font-semibold block mb-1.5">{t.ageLabel}</label>
                <input
                  type="number"
                  value={patientInfo.age}
                  onChange={(e) => setPatientInfo({ ...patientInfo, age: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 font-medium"
                />
              </div>

              <div>
                <label className="text-slate-600 font-semibold block mb-1.5">{t.sexLabel}</label>
                <div className="grid grid-cols-3 gap-2">
                  {["Male", "Female", "Other"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setPatientInfo({ ...patientInfo, sex: s })}
                      className={`py-2.5 rounded-xl border font-bold text-xs transition cursor-pointer ${
                        patientInfo.sex === s
                          ? "bg-teal-600 text-white border-teal-600 shadow-xs"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {s === "Male" ? t.male : s === "Female" ? t.female : t.other}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-600 font-semibold block mb-1.5">{t.langPrefLabel}</label>
                <select
                  value={patientInfo.language_preference}
                  onChange={(e) => setPatientInfo({ ...patientInfo, language_preference: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 font-medium cursor-pointer"
                >
                  <option value="Odia">Odia (ଓଡ଼ିଆ)</option>
                  <option value="Hindi">Hindi (हिन्दी)</option>
                  <option value="English">English</option>
                </select>
              </div>

              <div>
                <label className="text-slate-600 font-semibold block mb-1.5">{t.locationLabel}</label>
                <input
                  type="text"
                  value={patientInfo.location_state}
                  onChange={(e) => setPatientInfo({ ...patientInfo, location_state: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 font-medium"
                />
              </div>

              <div>
                <label className="text-slate-600 font-semibold block mb-1.5">{t.emergencyContactLabel}</label>
                <input
                  type="text"
                  value={patientInfo.emergency_contact}
                  onChange={(e) => setPatientInfo({ ...patientInfo, emergency_contact: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 font-mono"
                />
              </div>
            </div>

            {/* Informed Consent & Emergency Bypass */}
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <label className="flex items-start space-x-2.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={patientInfo.consent_given}
                  onChange={(e) => setPatientInfo({ ...patientInfo, consent_given: e.target.checked })}
                  className="mt-0.5 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                />
                <span>
                  <strong className="text-slate-900 font-bold block">Informed Consent Confirmed:</strong>
                  {t.consentText}
                </span>
              </label>

              <label className="flex items-center space-x-2 text-xs font-bold text-rose-700 shrink-0 cursor-pointer bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
                <input
                  type="checkbox"
                  checked={patientInfo.unconscious_bypass}
                  onChange={(e) => setPatientInfo({ ...patientInfo, unconscious_bypass: e.target.checked })}
                  className="rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                />
                <span>{t.unconsciousBypass}</span>
              </label>
            </div>
          </div>

          {/* Step 1 Continue Action */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleContinueToStep2}
              className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold px-8 py-3.5 rounded-2xl transition shadow-md shadow-teal-700/25 flex items-center space-x-2 text-sm cursor-pointer"
            >
              <span>{t.continueToStep2 || "Continue to Symptoms & Vitals ➔"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: MULTIMODAL SYMPTOMS, VITALS & REPORTS (2-COLUMN DESKTOP LAYOUT) */}
      {/* ========================================================================= */}
      {wizardStep === 2 && (
        <form onSubmit={handleRunAnalysis} className="space-y-6 animate-fadeIn">
          {/* Clean 2-Column Desktop Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ------------------------------------------------------------- */}
            {/* LEFT COLUMN: Voice, Transcription, Symptoms & Red-Flags */}
            {/* ------------------------------------------------------------- */}
            <div className="space-y-6">
              {/* Quadrant 1: Multilingual Voice & Speech Intake */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
                      <Mic className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">
                        {t.quadrant1Title}
                      </h3>
                      <p className="text-xs text-slate-500">{t.quadrant1Subtitle}</p>
                    </div>
                  </div>

                  {/* Speech Recording Button */}
                  <button
                    type="button"
                    onClick={handleToggleSpeech}
                    className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer ${
                      isListening
                        ? "bg-rose-600 text-white animate-pulse"
                        : "bg-teal-600 text-white hover:bg-teal-700"
                    }`}
                  >
                    {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    <span>{isListening ? (t.voiceRecordingPrompt || t.listening) : t.speakBtn}</span>
                  </button>
                </div>

                {/* 3. ANIMATED AUDIO WAVEFORM VISUALIZER (Voice Intake in Step 2) */}
                {(isListening || isPlayingAudio) && (
                  <div className="bg-slate-900 border border-teal-500/50 rounded-2xl p-4 text-white shadow-lg flex items-center justify-between gap-4 animate-fadeIn">
                    <div className="flex items-center space-x-3">
                      <div className="relative flex h-3.5 w-3.5 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500"></span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-sm font-black text-teal-300 tracking-wider">
                            {formatTimerString(recordingSeconds)}
                          </span>
                          <span className="text-slate-500 text-xs">•</span>
                          <span className="text-xs font-bold text-white">
                            {isListening
                              ? `Listening in ${patientInfo.language_preference} (${
                                  patientInfo.language_preference === "Odia"
                                    ? "ଓଡ଼ିଆ"
                                    : patientInfo.language_preference === "Hindi"
                                    ? "हिन्दी"
                                    : "English"
                                })...`
                              : `Audio Playback (${patientInfo.language_preference})...`}
                          </span>
                        </div>
                        <p className="text-[11px] text-teal-200/70 mt-0.5">
                          {isListening
                            ? "Voice input active • Speak chief complaint clearly"
                            : "Colloquial vernacular speech simulation"}
                        </p>
                      </div>
                    </div>

                    {/* 7 Vertical Frequency Bars of Varying Heights */}
                    <div className="flex items-center space-x-1.5 h-8 px-2 bg-black/40 rounded-xl border border-teal-500/30 shrink-0">
                      <span className="w-1.5 bg-teal-400 rounded-full wave-bar-1" style={{ height: "14px" }}></span>
                      <span className="w-1.5 bg-emerald-400 rounded-full wave-bar-2" style={{ height: "22px" }}></span>
                      <span className="w-1.5 bg-teal-300 rounded-full wave-bar-3" style={{ height: "28px" }}></span>
                      <span className="w-1.5 bg-emerald-300 rounded-full wave-bar-4" style={{ height: "18px" }}></span>
                      <span className="w-1.5 bg-teal-400 rounded-full wave-bar-5" style={{ height: "26px" }}></span>
                      <span className="w-1.5 bg-emerald-400 rounded-full wave-bar-6" style={{ height: "16px" }}></span>
                      <span className="w-1.5 bg-teal-300 rounded-full wave-bar-7" style={{ height: "20px" }}></span>
                    </div>
                  </div>
                )}

                {/* Sample Vernacular Utterance Chips (Language-Specific) */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-600 block">
                    {t.sampleVoiceLabel}
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {(SAMPLE_AUDIO_SCRIPTS[patientInfo.language_preference] || SAMPLE_AUDIO_SCRIPTS.Odia || []).map((sample, idx) => (
                      <button
                        key={sample.label || idx}
                        type="button"
                        onClick={() => handleInjectSampleVoice(sample)}
                        className="text-left p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-teal-50 hover:border-teal-300 transition text-xs flex items-center justify-between group cursor-pointer"
                      >
                        <div className="truncate mr-2">
                          <span className="font-bold text-slate-900 group-hover:text-teal-900 block truncate">
                            {sample.label}
                          </span>
                          <span className="text-[11px] text-slate-500 block truncate">
                            {sample.text}
                          </span>
                        </div>
                        <span className="text-[10px] bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md font-medium shrink-0">
                          Inject
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dual-Layer Speech Bubble */}
                <div className="space-y-3 pt-1">
                  {/* Top Layer: Native Vernacular Statement + Audio Playback */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700 flex items-center space-x-1.5">
                        <Radio className="w-3.5 h-3.5 text-teal-600" />
                        <span>{t.originalStatementLabel} ({patientInfo.language_preference})</span>
                      </span>

                      <button
                        type="button"
                        onClick={() => handlePlaySpeech(symptoms.verbatim_local_statement, patientInfo.language_preference)}
                        className="flex items-center space-x-1 bg-white hover:bg-teal-50 text-teal-700 border border-slate-200 px-2.5 py-1 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-teal-600" />
                        <span>{t.playAudioBtn}</span>
                      </button>
                    </div>

                    <textarea
                      rows={2}
                      value={symptoms.verbatim_local_statement}
                      onChange={(e) => {
                        setSymptoms({ ...symptoms, verbatim_local_statement: e.target.value });
                        setIsStatementVerified(false);
                      }}
                      placeholder="Captured spoken statement in patient's native dialect..."
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />

                    {/* Phonetic Transliteration */}
                    <div className="pt-0.5">
                      <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block mb-1">
                        {t.phoneticTransliteration}:
                      </span>
                      <input
                        type="text"
                        value={symptoms.phonetic_transliteration || ""}
                        onChange={(e) => setSymptoms({ ...symptoms, phonetic_transliteration: e.target.value })}
                        placeholder="English phonetic romanization..."
                        className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 font-mono italic focus:outline-none"
                      />
                    </div>

                    {/* Spoken Nuance Verification & Record Again Action Buttons */}
                    <div className="pt-2 border-t border-slate-200/90 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => setIsStatementVerified(true)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-xs ${
                            isStatementVerified
                              ? "bg-emerald-600 text-white shadow-emerald-600/20 ring-2 ring-emerald-500/30"
                              : "bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-50"
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>
                            {patientInfo.language_preference === "Odia"
                              ? "ହଁ, ଠିକ୍ ଅଛି"
                              : patientInfo.language_preference === "Hindi"
                              ? "हाँ, बिल्कुल सही"
                              : "Looks Accurate"}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={handleRecordAgain}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 flex items-center space-x-1.5 cursor-pointer shadow-xs"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                          <span>
                            {patientInfo.language_preference === "Odia"
                              ? "ପୁଣି କୁହନ୍ତୁ"
                              : patientInfo.language_preference === "Hindi"
                              ? "दोबारा बोलें"
                              : "Record Again"}
                          </span>
                        </button>
                      </div>

                      {isStatementVerified && (
                        <span className="text-[11px] font-bold text-emerald-700 flex items-center space-x-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>
                            {patientInfo.language_preference === "Odia"
                              ? "ବକ୍ତବ୍ୟ ଯାଞ୍ଚ ହୋଇଛି"
                              : patientInfo.language_preference === "Hindi"
                              ? "बयान सत्यापित है"
                              : "Verified Accurate"}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom Layer: Clinical English Translation & Chief Complaint */}
                  <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4 space-y-2 shadow-xs">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-950 flex items-center space-x-1.5">
                        <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{t.englishTranslationLabel}</span>
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{t.aiVerifiedTranslation}</span>
                      </span>
                    </div>

                    <textarea
                      rows={2}
                      value={symptoms.chief_complaint}
                      onChange={(e) => setSymptoms({ ...symptoms, chief_complaint: e.target.value })}
                      placeholder="Clinical English translation for medical officer queue note..."
                      className="w-full bg-white border border-emerald-300 rounded-xl p-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Quadrant 2: Symptoms & Emergency Red-Flags */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">
                        {t.quadrant2Title}
                      </h3>
                      <p className="text-xs text-slate-500">{t.quadrant2Subtitle}</p>
                    </div>
                  </div>
                </div>

                {/* 2. INTERACTIVE 2D ANATOMICAL BODY MAP */}
                <div className="space-y-3 bg-slate-50/80 border border-slate-200 rounded-2xl p-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-base">🗺️</span>
                      <div>
                        <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                          {t.bodyMapTitle || "Interactive 2D Anatomical Body Map"}
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          {t.bodyMapSubtitle || "Click any anatomical zone to highlight and auto-select clinical symptoms"}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded-full">
                      6 Anatomical Zones
                    </span>
                  </div>

                  {/* 6 Clickable Anatomical Zones Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {BODY_REGIONS.map((region) => {
                      const isRegionActive = region.symptoms.some((s) =>
                        symptoms.selected_symptoms.includes(s)
                      );
                      const activeCount = region.symptoms.filter((s) =>
                        symptoms.selected_symptoms.includes(s)
                      ).length;

                      return (
                        <button
                          key={region.id}
                          type="button"
                          onClick={() => handleBodyRegionClick(region)}
                          className={`p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-1.5 ${
                            isRegionActive
                              ? "bg-emerald-50/90 border-emerald-400 text-emerald-950 ring-2 ring-emerald-500 shadow-md shadow-emerald-500/20"
                              : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/80 shadow-xs"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-lg">{region.icon}</span>
                            <span
                              className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${
                                isRegionActive
                                  ? "bg-emerald-600 text-white"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {activeCount > 0 ? `${activeCount} Active` : "Select"}
                            </span>
                          </div>
                          <div>
                            <span className="font-black text-xs block leading-tight">
                              {region.label}
                            </span>
                            <span className="text-[10px] text-slate-500 truncate block mt-0.5">
                              {region.symptoms.join(", ")}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Granular Symptom Tag Pills */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600 block">
                      {t.selectSymptomsLabel || "Select Active Symptoms:"}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {symptoms.selected_symptoms.length} selected
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "Chest Pain",
                      "Difficulty Breathing",
                      "High Fever",
                      "Sweating",
                      "Palpitations",
                      "Headache",
                      "Dizziness",
                      "Blurred Vision",
                      "Cough",
                      "Severe Abdominal Pain",
                      "Nausea",
                      "Vomiting",
                      "Ankle Swelling",
                      "Edema",
                      "Weakness / Fatigue",
                      "Skin Rash",
                      "Wound / Trauma",
                      "Burns"
                    ].map((sym) => {
                      const isSelected = symptoms.selected_symptoms.includes(sym);
                      return (
                        <button
                          key={sym}
                          type="button"
                          onClick={() => handleSymptomToggle(sym)}
                          className={`text-xs px-3 py-1.5 rounded-xl border transition cursor-pointer font-medium ${
                            isSelected
                              ? "bg-teal-600 text-white border-teal-600 shadow-xs"
                              : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {sym}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Duration & Onset Inputs */}
                <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                  <div>
                    <label className="text-slate-600 font-semibold block mb-1">{t.durationLabel}</label>
                    <input
                      type="text"
                      value={symptoms.duration}
                      onChange={(e) => setSymptoms({ ...symptoms, duration: e.target.value })}
                      placeholder="e.g. 2 hours / 3 days"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 font-semibold block mb-1">{t.onsetTrendLabel}</label>
                    <input
                      type="text"
                      value={symptoms.onset_trend}
                      onChange={(e) => setSymptoms({ ...symptoms, onset_trend: e.target.value })}
                      placeholder="e.g. Worsening rapidly"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                </div>

                {/* Emergency Red-Flag Overrides Checklist */}
                <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-4 space-y-2.5 shadow-xs">
                  <div className="flex items-center space-x-2 text-xs font-bold text-rose-900">
                    <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{t.redFlagsTitle}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-rose-950 font-medium">
                    {[
                      { key: "severe_chest_pain", label: "Severe Retrosternal Chest Pain" },
                      { key: "severe_breathing_difficulty", label: "Severe Dyspnea / Stridor" },
                      { key: "very_low_oxygen_spo2", label: "SpO₂ < 90% (Hypoxia Emergency)" },
                      { key: "loss_of_consciousness", label: "Altered Sensorium / Syncope" },
                      { key: "severe_bleeding", label: "Active Uncontrolled Hemorrhage" },
                      { key: "seizure", label: "Active / Recent Seizure Episode" },
                      { key: "sudden_weakness_paralysis", label: "Sudden Focal Neuro Deficit / FAST" },
                      { key: "severe_allergic_reaction", label: "Anaphylaxis / Airway Edema" }
                    ].map((flag) => (
                      <label
                        key={flag.key}
                        className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-rose-100/50 cursor-pointer transition"
                      >
                        <input
                          type="checkbox"
                          checked={redFlags[flag.key]}
                          onChange={() => handleRedFlagToggle(flag.key)}
                          className="rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                        />
                        <span className="truncate">{flag.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Longitudinal Medical History & Allergies (ABHA Linked) */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5 shadow-xs">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 flex items-center space-x-1.5">
                      <span>🪪</span>
                      <span>Longitudinal Medical History & Drug Allergies</span>
                    </span>
                    {patientInfo.abha_id && (
                      <span className="text-[10px] text-teal-800 bg-teal-100 border border-teal-300 font-bold px-2 py-0.5 rounded-full">
                        ABHA Synced
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-slate-500 font-semibold text-[11px]">Conditions:</span>
                      {medicalHistory.existing_conditions.length > 0 ? (
                        medicalHistory.existing_conditions.map((c, i) => (
                          <span key={i} className="bg-white border border-slate-200 text-slate-800 px-2 py-0.5 rounded-md font-medium text-[11px]">
                            {c}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">None recorded</span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-rose-700 font-bold text-[11px]">Critical Allergies:</span>
                      {medicalHistory.known_allergies.length > 0 ? (
                        medicalHistory.known_allergies.map((a, i) => (
                          <span key={i} className="bg-rose-50 border border-rose-200 text-rose-800 px-2 py-0.5 rounded-md font-bold text-[11px]">
                            ⚠️ {a}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">No known drug allergies</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* RIGHT COLUMN: Vitals Bento Grid, Diagnostic OCR & Visuals */}
            {/* ------------------------------------------------------------- */}
            <div className="space-y-6">
              {/* Quadrant 3: Vital Signs Bento Grid */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
                      <Heart className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">
                        {t.quadrant3Title}
                      </h3>
                      <p className="text-xs text-slate-500">{t.quadrant3Subtitle}</p>
                    </div>
                  </div>

                  <span
                    className={`text-xs px-3 py-1 rounded-full font-bold shadow-xs ${
                      localEval.priority === "RED"
                        ? "bg-rose-600 text-white"
                        : localEval.priority === "YELLOW"
                        ? "bg-amber-500 text-white"
                        : "bg-emerald-600 text-white"
                    }`}
                  >
                    {t.ruleUrgency}: {localEval.priority}
                  </span>
                </div>

                {/* Vitals Grid with Live Threshold Color Shifts */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {/* SpO2 */}
                  <div
                    className={`p-4 rounded-2xl border transition-all shadow-xs ${
                      vitals.spo2_percent < 90
                        ? "bg-rose-50 border-rose-300 text-rose-900"
                        : vitals.spo2_percent < 95
                        ? "bg-amber-50 border-amber-300 text-amber-900"
                        : "bg-emerald-50 border-emerald-300 text-emerald-900"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                        {t.spo2Label}
                      </span>
                      <span className="text-[10px] bg-white px-2 py-0.5 rounded-full font-semibold border border-slate-200">
                        %
                      </span>
                    </div>
                    <input
                      type="number"
                      value={vitals.spo2_percent}
                      onChange={(e) => setVitals({ ...vitals, spo2_percent: Number(e.target.value) })}
                      className="w-full bg-transparent text-3xl font-extrabold focus:outline-none tracking-tight"
                    />
                    <span className="text-[10px] font-semibold block mt-1">
                      {vitals.spo2_percent < 90 ? `🔴 ${t.criticalHypoxia || "Critical Hypoxia (<90)"}` : (t.normalOxygen || "Normal Oxygen")}
                    </span>
                  </div>

                  {/* Heart Rate */}
                  <div
                    className={`p-4 rounded-2xl border transition-all shadow-xs ${
                      vitals.heart_rate_bpm > 130 || vitals.heart_rate_bpm < 45
                        ? "bg-rose-50 border-rose-300 text-rose-900"
                        : vitals.heart_rate_bpm > 100
                        ? "bg-amber-50 border-amber-300 text-amber-900"
                        : "bg-emerald-50 border-emerald-300 text-emerald-900"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                        {t.hrLabel}
                      </span>
                      <span className="text-[10px] bg-white px-2 py-0.5 rounded-full font-semibold border border-slate-200">
                        bpm
                      </span>
                    </div>
                    <input
                      type="number"
                      value={vitals.heart_rate_bpm}
                      onChange={(e) => setVitals({ ...vitals, heart_rate_bpm: Number(e.target.value) })}
                      className="w-full bg-transparent text-3xl font-extrabold focus:outline-none tracking-tight"
                    />
                    <span className="text-[10px] font-semibold block mt-1">
                      {vitals.heart_rate_bpm > 100 ? (t.tachycardia || "Tachycardia") : (t.normalHeartRate || "Normal Rate")}
                    </span>
                  </div>

                  {/* Blood Pressure Systolic */}
                  <div
                    className={`p-4 rounded-2xl border transition-all shadow-xs ${
                      vitals.bp_systolic >= 180 || vitals.bp_systolic < 85
                        ? "bg-rose-50 border-rose-300 text-rose-900"
                        : vitals.bp_systolic >= 140
                        ? "bg-amber-50 border-amber-300 text-amber-900"
                        : "bg-emerald-50 border-emerald-300 text-emerald-900"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                        {t.bpSystolicLabel || "BP Systolic"}
                      </span>
                      <span className="text-[10px] bg-white px-2 py-0.5 rounded-full font-semibold border border-slate-200">
                        mmHg
                      </span>
                    </div>
                    <input
                      type="number"
                      value={vitals.bp_systolic}
                      onChange={(e) => setVitals({ ...vitals, bp_systolic: Number(e.target.value) })}
                      className="w-full bg-transparent text-3xl font-extrabold focus:outline-none tracking-tight"
                    />
                    <span className="text-[10px] font-semibold block mt-1">
                      {vitals.bp_systolic >= 180 ? `🔴 ${t.bpCrisis || "Crisis (>=180)"}` : vitals.bp_systolic < 85 ? `🔴 ${t.bpShock || "Shock (<85)"}` : (t.normalBP || "Normal Range")}
                    </span>
                  </div>

                  {/* Blood Pressure Diastolic */}
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 text-slate-800 shadow-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                        {t.bpDiastolicLabel || "BP Diastolic"}
                      </span>
                      <span className="text-[10px] bg-white px-2 py-0.5 rounded-full font-semibold border border-slate-200">
                        mmHg
                      </span>
                    </div>
                    <input
                      type="number"
                      value={vitals.bp_diastolic}
                      onChange={(e) => setVitals({ ...vitals, bp_diastolic: Number(e.target.value) })}
                      className="w-full bg-transparent text-3xl font-extrabold focus:outline-none tracking-tight"
                    />
                    <span className="text-[10px] font-semibold block mt-1">
                      {t.diastolicUnit || "Diastolic mmHg"}
                    </span>
                  </div>

                  {/* Temperature */}
                  <div
                    className={`p-4 rounded-2xl border transition-all shadow-xs ${
                      vitals.temperature_f >= 101.5
                        ? "bg-amber-50 border-amber-300 text-amber-900"
                        : "bg-emerald-50 border-emerald-300 text-emerald-900"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                        {t.tempLabel}
                      </span>
                      <span className="text-[10px] bg-white px-2 py-0.5 rounded-full font-semibold border border-slate-200">
                        °F
                      </span>
                    </div>
                    <input
                      type="number"
                      step="0.1"
                      value={vitals.temperature_f}
                      onChange={(e) => setVitals({ ...vitals, temperature_f: Number(e.target.value) })}
                      className="w-full bg-transparent text-3xl font-extrabold focus:outline-none tracking-tight"
                    />
                    <span className="text-[10px] font-semibold block mt-1">
                      {vitals.temperature_f >= 101.5 ? `🟠 ${t.highFever || "High Grade Fever"}` : (t.afebrile || "Afebrile")}
                    </span>
                  </div>

                  {/* Respiratory Rate */}
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 text-slate-800 shadow-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                        {t.rrLabel}
                      </span>
                      <span className="text-[10px] bg-white px-2 py-0.5 rounded-full font-semibold border border-slate-200">
                        /min
                      </span>
                    </div>
                    <input
                      type="number"
                      value={vitals.respiratory_rate_min}
                      onChange={(e) => setVitals({ ...vitals, respiratory_rate_min: Number(e.target.value) })}
                      className="w-full bg-transparent text-3xl font-extrabold focus:outline-none tracking-tight"
                    />
                    <span className="text-[10px] font-semibold block mt-1">
                      {vitals.respiratory_rate_min >= 24 ? (t.tachypnea || "Tachypnea") : (t.normalEupnea || "Normal Eupnea")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quadrant 4: Reports OCR & Supporting Visual Context */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">
                        {t.quadrant4Title}
                      </h3>
                      <p className="text-xs text-slate-500">{t.quadrant4Subtitle}</p>
                    </div>
                  </div>
                </div>

                {/* Preset Report Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-600 font-semibold block">
                    {t.attachReportLabel}
                  </label>
                  <select
                    value={selectedReportId}
                    onChange={(e) => handleSelectSampleReport(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-medium cursor-pointer"
                  >
                    <option value="">{t.noReport}</option>
                    {SAMPLE_REPORTS.map((rep) => (
                      <option key={rep.id} value={rep.id}>
                        {rep.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* OCR Extracted Text Preview */}
                {uploadedReports.length > 0 && (
                  <div className="bg-purple-50/50 border border-purple-200 rounded-xl p-3.5 space-y-1 shadow-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-purple-900">{t.extractedFindings}</span>
                      <span className="text-slate-500 font-mono">{uploadedReports[0].file_name}</span>
                    </div>
                    <p className="text-slate-700 text-[11px] font-mono leading-relaxed">
                      {uploadedReports[0].ocr_extracted_text}
                    </p>
                  </div>
                )}

                {/* Supporting Visual Category & Caption */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-slate-700 font-semibold flex items-center space-x-1.5">
                      <Camera className="w-3.5 h-3.5 text-teal-600" />
                      <span>{t.visualObsLabel}</span>
                    </label>
                    <span className="text-[10px] text-slate-500">{t.nonDiagnostic}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <select
                      value={visualCategory}
                      onChange={(e) => setVisualCategory(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 cursor-pointer"
                    >
                      <option value="None">None</option>
                      <option value="Swelling_Edema">Swelling / Edema</option>
                      <option value="Skin_Rash">Skin Rash / Lesion</option>
                      <option value="Wound_Trauma">Wound / Soft Tissue Trauma</option>
                      <option value="Eye_Redness">Eye Redness / Conjunctival</option>
                    </select>

                    <input
                      type="text"
                      value={visualCaption}
                      onChange={(e) => setVisualCaption(e.target.value)}
                      placeholder="Nurse observation note..."
                      className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer for Step 2 */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-white border border-slate-200/90 rounded-2xl shadow-card">
            <button
              type="button"
              onClick={() => {
                setWizardStep(1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.backToStep1 || "⬅ Back to Registration"}</span>
            </button>

            <button
              type="submit"
              disabled={isAnalyzing}
              className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white font-extrabold px-8 py-4 rounded-xl transition shadow-lg shadow-teal-700/25 flex items-center justify-center space-x-2.5 text-sm disabled:opacity-50 cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{t.analyzingBtn}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-teal-100" />
                  <span>{t.runAiTriageCta || "🧠 Run AI Triage Analysis ➔"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: STRUCTURED TRIAGE NOTE & HANDOVER TO DOCTOR QUEUE */}
      {/* ========================================================================= */}
      {wizardStep === 3 && (
        <div className="space-y-6 animate-fadeIn">
          {triageResult ? (
            <>
              {/* Triage Result Card Display */}
              <TriageResultCard
                triageRecord={triageResult}
                onSubmitFollowupAnswers={onSubmitFollowupAnswers}
                onGoToDoctorQueue={onGoToDoctorQueue}
                selectedLanguage={selectedLanguage}
              />

              {/* Handover & Action Footer */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white border border-slate-200/90 rounded-2xl shadow-card">
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setWizardStep(2);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{t.backToStep2 || "⬅ Edit Symptoms & Vitals"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-teal-600" />
                    <span>{t.registerNextPatient || "➕ Register Next Patient"}</span>
                  </button>
                </div>

                {/* Big Handover Button to Doctor Queue */}
                <button
                  type="button"
                  onClick={onGoToDoctorQueue}
                  className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white font-extrabold px-8 py-4 rounded-xl transition shadow-lg shadow-teal-700/25 flex items-center justify-center space-x-2.5 text-sm cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{t.addToDoctorQueue || "📨 Add Patient to Doctor Queue"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 mx-auto flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">
                No Triage Result Generated Yet
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Please enter symptoms and vitals in Step 2 and run the AI Triage Analysis to generate the clinical note.
              </p>
              <button
                type="button"
                onClick={() => setWizardStep(2)}
                className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
              >
                Go to Step 2: Symptoms & Vitals
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
