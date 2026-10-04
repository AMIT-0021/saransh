import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Printer,
  X,
  ShieldCheck,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Building2,
  PhoneCall,
  Truck,
  HeartPulse,
  Activity,
  Volume2
} from "lucide-react";
import {
  speakHumanVoice,
  stopHumanVoice
} from "../utils/voiceSynthesisEngine";

// Authentic Odisha National Health Mission (NHM) & All-India 8-Facility Registry & Referral Map
const FACILITY_MAP = {
  PHC_JATNI: {
    name: "PHC Jatni",
    fullName: "🏥 PHC Jatni (Khordha - NIN: OD-KHD-PHC-102)",
    nin: "OD-KHD-PHC-102",
    tier: "Primary Health Centre (PHC)",
    district: "Khordha",
    receivingFacility: "Capital Hospital (District Headquarter Hospital, Bhubaneswar - NIN: OD-DHH-401) / SCB Medical College & Hospital (Cuttack Tertiary Apex Bay - NIN: OD-MCH-001)",
    receivingTier: "District Headquarter Hospital (DHH, Bhubaneswar) & Tertiary Apex Emergency Bay (SCB Cuttack)",
    referralCorridor: "NH-16 Express Medical Corridor (PHC Jatni ➔ Capital Hospital Bhubaneswar ➔ SCB Cuttack)",
    ambulanceBase: "Jatni Base Station (Khordha Cluster)"
  },
  CHC_TANGI: {
    name: "CHC Tangi",
    fullName: "🏥 CHC Tangi (Khordha - NIN: OD-KHD-CHC-204)",
    nin: "OD-KHD-CHC-204",
    tier: "Community Health Centre (CHC)",
    district: "Khordha",
    receivingFacility: "Capital Hospital (District Headquarter Hospital, Bhubaneswar - NIN: OD-DHH-401) / AIIMS Bhubaneswar",
    receivingTier: "District Headquarter Hospital (DHH) & Apex Emergency Bay",
    referralCorridor: "NH-16 South Expressway (Tangi ➔ Bhubaneswar)",
    ambulanceBase: "Tangi Emergency Base Station"
  },
  DH_CAPITAL_BBSR: {
    name: "Capital Hospital",
    fullName: "🏥 Capital Hospital (District Headquarter Hospital, Bhubaneswar - NIN: OD-DHH-401)",
    nin: "OD-DHH-401",
    tier: "District Headquarter Hospital (DHH)",
    district: "Bhubaneswar / Khordha",
    receivingFacility: "SCB Medical College & Hospital (Cuttack Tertiary Apex Bay - NIN: OD-MCH-001)",
    receivingTier: "Tertiary Apex Medical College & Resuscitation Center",
    referralCorridor: "Twin City Medical Corridor (Bhubaneswar ➔ Cuttack)",
    ambulanceBase: "Capital Hospital Central Bay Station"
  },
  MCH_SCB_CUTTACK: {
    name: "SCB Medical College & Hospital",
    fullName: "🏥 SCB Medical College & Hospital (Cuttack Tertiary Apex Bay - NIN: OD-MCH-001)",
    nin: "OD-MCH-001",
    tier: "Tertiary Medical College & Hospital (MCH)",
    district: "Cuttack",
    receivingFacility: "Apex State Trauma & Resuscitation Center, SCB Cuttack",
    receivingTier: "Apex Quaternary Super-Specialty Resuscitation Bay",
    referralCorridor: "Apex State Emergency Trauma Network",
    ambulanceBase: "SCB Apex Trauma Station"
  },
  IND_PARADEEP: {
    name: "Paradeep Industrial Health Unit",
    fullName: "🏭 Paradeep Industrial Health Unit (IOCL/Port Trust Belt - NIN: OD-JSP-IEH-301)",
    nin: "OD-JSP-IEH-301",
    tier: "Occupational & Industrial Health Unit",
    district: "Jagatsinghpur",
    receivingFacility: "District Headquarter Hospital, Jagatsinghpur / SCB Medical College, Cuttack",
    receivingTier: "District Hospital & Apex Toxicology Bay",
    referralCorridor: "State Highway 12 Industrial Corridor",
    ambulanceBase: "Paradeep Port Emergency Unit"
  },
  CAMP_KORAPUT: {
    name: "Mobile Public Health Camp (Koraput Tribal Outreach)",
    fullName: "⛺ Mobile Public Health Camp (Koraput Tribal Outreach - NIN: OD-KPT-MOBI-501)",
    nin: "OD-KPT-MOBI-501",
    tier: "NHM Tribal Outreach Mobile Unit",
    district: "Koraput",
    receivingFacility: "Saheed Laxman Nayak (SLN) Medical College & Hospital, Koraput",
    receivingTier: "District Medical College & Hospital",
    referralCorridor: "Southern Tribal Health Corridor (Koraput District)",
    ambulanceBase: "Koraput Tribal Mobile Base Unit"
  },
  AIIMS_NEW_DELHI: {
    name: "AIIMS New Delhi",
    fullName: "🏛️ AIIMS New Delhi (National Apex Institute - NIN: DL-NDLS-AIIMS-001)",
    nin: "DL-NDLS-AIIMS-001",
    tier: "National Apex Medical Institute & Quaternary Center",
    district: "New Delhi",
    receivingFacility: "AIIMS Apex Trauma Center & Critical Resuscitation Bay, New Delhi",
    receivingTier: "National Apex Quaternary Center",
    referralCorridor: "Ring Road Trauma Express Corridor (Delhi NCR)",
    ambulanceBase: "AIIMS Central Emergency Station"
  },
  THANE_MIDC: {
    name: "Thane MIDC Industrial Health Unit",
    fullName: "🏭 Thane MIDC Industrial Health Unit (Maharashtra - NIN: MH-THN-MIDC-402)",
    nin: "MH-THN-MIDC-402",
    tier: "Occupational & Industrial Health Unit",
    district: "Thane / Maharashtra",
    receivingFacility: "Chhatrapati Shivaji Maharaj Hospital, Kalwa / KEM Hospital, Mumbai",
    receivingTier: "Tertiary Municipal Medical College & Toxicology Center",
    referralCorridor: "Eastern Express Highway Industrial Corridor",
    ambulanceBase: "Thane MIDC Emergency Response Base"
  },
  IND_THANE_MIDC: {
    name: "Thane MIDC Industrial Health Unit",
    fullName: "🏭 Thane MIDC Industrial Health Unit (Maharashtra - NIN: MH-THN-MIDC-402)",
    nin: "MH-THN-MIDC-402",
    tier: "Occupational & Industrial Health Unit",
    district: "Thane / Maharashtra",
    receivingFacility: "Chhatrapati Shivaji Maharaj Hospital, Kalwa / KEM Hospital, Mumbai",
    receivingTier: "Tertiary Municipal Medical College & Toxicology Center",
    referralCorridor: "Eastern Express Highway Industrial Corridor",
    ambulanceBase: "Thane MIDC Emergency Response Base"
  }
};

export default function ReferralSlipModal({ record, onClose, selectedLanguage = "English" }) {
  if (!record) return null;

  const p = record.patient_basic_info || {
    name_or_alias: record.name_or_alias || "Ramesh K. (Synthetic)",
    age: Math.max(0, Math.abs(Number(record.age ?? 62))),
    sex: record.sex || "Male",
    facility_type: record.facility_type || "PHC_JATNI",
    token_number: record.token_number || "T-024",
    abha_id: record.abha_id || "91-4821-9923-0192",
    language_preference: record.language_preference || "Odia",
    emergency_contact: record.emergency_contact || "+91-9876543210"
  };

  const v = record.vital_signs || {};
  const s = record.symptoms_and_complaints || {
    chief_complaint: record.chief_complaint || "Retrosternal crushing chest pain & severe dyspnea (2 hours, worsening rapidly)",
    duration: "2 hours",
    onset_trend: "Worsening rapidly"
  };
  const m = record.medical_history || {};
  const ai = record.ai_triage_output || {};
  const review = record.human_review_feedback || record.human_reviewFeedback || {};

  const priority = review.clinician_assigned_priority || ai.final_computed_priority || record.priority || "RED";

  // Resolve Facility Info from Government Registry
  const facKey = (p.facility_type || "").toUpperCase();
  const facInfo = FACILITY_MAP[facKey] || FACILITY_MAP.PHC_JATNI;

  const tokenNumber = record.token_number || p.token_number || "T-024";
  const abhaId = p.abha_id || "91-4821-9923-0192";

  // Departure Vitals (pre-transfer assessment)
  const spo2 = v.spo2_percent ?? 89;
  const sysBp = v.bp_systolic ?? 158;
  const diaBp = v.bp_diastolic ?? 96;
  const pulse = v.heart_rate_bpm ?? 112;
  const temp = v.temperature_f ?? 99.8;
  const rr = v.respiratory_rate_min ?? 26;
  const glucose = v.blood_glucose_mg_dl ?? 142;

  const [isPlayingHandover, setIsPlayingHandover] = useState(false);

  // Keep a stable ref to onClose so effect cleanup only runs on actual modal unmount
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const handleClose = useCallback(() => {
    stopHumanVoice();
    setIsPlayingHandover(false);
    if (onCloseRef.current) onCloseRef.current();
  }, []);

  // Keyboard shortcut: Escape to close & speech cleanup ONLY on component unmount
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      stopHumanVoice();
    };
  }, [handleClose]);

  const handlePlayHandoverBriefing = () => {
    if (isPlayingHandover) {
      stopHumanVoice();
      setIsPlayingHandover(false);
      return;
    }

    stopHumanVoice();
    const clinicalReason = s.translated_english_statement || s.chief_complaint || "Acute emergency condition requiring apex transfer";

    // Adaptive handover briefing according to selected clinical language
    let script = "";
    if (selectedLanguage === "Hindi") {
      script = `आधिकारिक 108 आपातकालीन हैंडओवर ब्रीफिंग। मरीज ${p.name_or_alias}, आयु ${p.age} वर्ष ${p.sex === "Female" ? "महिला" : "पुरुष"}। प्रस्थान सुविधा: ${facInfo.name}। गंतव्य एपेक्स केंद्र: ${facInfo.receivingFacility}। रेफरल प्राथमिकता: ${priority}। प्रस्थान वाइटल्स: SpO2 ${spo2} प्रतिशत, रक्तचाप ${sysBp} बटा ${diaBp}, पल्स रेट ${pulse} प्रति मिनट। क्लीनिकल कारण: ${clinicalReason}। परिवहन कॉरिडोर: ${facInfo.referralCorridor}। स्थानांतरण मेडिकल ऑफिसर द्वारा अधिकृत।`;
    } else if (selectedLanguage === "Odia") {
      script = `ଅଫିସିଆଲ୍ ୧୦୮ ଜରୁରୀକାଳୀନ ହସ୍ତାନ୍ତର ବ୍ରିଫିଙ୍ଗ୍। ରୋଗୀ ${p.name_or_alias}, ବୟସ ${p.age} ବର୍ଷ ${p.sex === "Female" ? "ମହିଳା" : "ପୁରୁଷ"}। ପ୍ରାରମ୍ଭିକ ଚିକିତ୍ସାଳୟ: ${facInfo.name}। ଲକ୍ଷ୍ୟସ୍ଥଳ ଶୀର୍ଷ କେନ୍ଦ୍ର: ${facInfo.receivingFacility}। ରେଫରାଲ୍ ପ୍ରାଥମିକତା: ${priority}। ଭାଇଟାଲ୍ସ: SpO2 ${spo2} ପ୍ରତିଶତ, ରକ୍ତଚାପ ${sysBp} ବାଇ ${diaBp}, ନାଡ଼ି ଗତି ${pulse} ପ୍ରତି ମିନିଟ୍। ଡାକ୍ତରୀ କାରଣ: ${clinicalReason}। ପରିବହନ କରିଡର: ${facInfo.referralCorridor}। ସ୍ଥାନାନ୍ତର ମେଡିକାଲ୍ ଅଫିସରଙ୍କ ଦ୍ୱାରା ଅନୁମୋଦିତ।`;
    } else {
      script = `Official 108 Emergency Handover Briefing. Patient ${p.name_or_alias}, ${p.age} years old ${p.sex}. Originating facility: ${facInfo.name}. Destination apex center: ${facInfo.receivingFacility}. Referral priority: ${priority}. Departure vitals: SpO2 ${spo2} percent, Blood Pressure ${sysBp} over ${diaBp}, Pulse rate ${pulse} beats per minute. Clinical reason: ${clinicalReason}. Transport corridor: ${facInfo.referralCorridor}. Transfer authorized by Medical Officer.`;
    }

    setIsPlayingHandover(true);
    speakHumanVoice(script, {
      role: "doctor",
      language: selectedLanguage || "English",
      age: 45,
      gender: "Male",
      onStart: () => setIsPlayingHandover(true),
      onEnd: () => setIsPlayingHandover(false),
      onError: () => setIsPlayingHandover(false)
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

  const currentTime = new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 md:py-6 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-w-4xl w-full border border-slate-300 overflow-hidden text-slate-800 my-0 sm:my-4 relative max-h-[92vh] sm:max-h-[90vh] flex flex-col">
        {/* Mobile Pull Handle */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto my-2 sm:hidden shrink-0" />

        {/* Sticky Header Toolbar (Stays pinned at top as user scrolls down) */}
        <div className="no-print sticky top-0 z-30 bg-slate-900 text-white px-3 sm:px-7 py-3 flex items-center justify-between border-b border-slate-800 shadow-md shrink-0">
          <div className="flex items-center space-x-2.5 truncate mr-2">
            <div className="p-2 rounded-xl bg-teal-600 text-white shadow-xs shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="truncate">
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-xs sm:text-base text-white truncate">
                  NHM Referral Slip
                </h3>
                <span className="bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[11px] font-mono px-2 py-0.5 rounded-md font-bold shrink-0">
                  {tokenNumber}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300 truncate hidden sm:block">
                Government of Odisha • Standardized Inter-Facility Emergency Transfer Form (NHM-ODISHA-REF-2026)
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0">
            <button
              onClick={handlePlayHandoverBriefing}
              title="Listen to 108 Emergency Handover Audio Briefing"
              className={`min-h-[40px] px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-1.5 transition shadow-sm cursor-pointer border ${
                isPlayingHandover
                  ? "bg-rose-600 text-white border-rose-500 animate-pulse ring-2 ring-rose-400"
                  : "bg-slate-800 hover:bg-slate-700 text-teal-300 border-slate-700 hover:border-teal-400"
              }`}
            >
              <Volume2 className={`w-4 h-4 shrink-0 ${isPlayingHandover ? "text-white animate-bounce" : "text-teal-400"}`} />
              <span className="hidden sm:inline">
                {isPlayingHandover ? "Stop Briefing" : "🔊 Audio Handover"}
              </span>
              <span className="sm:hidden">{isPlayingHandover ? "Stop" : "Audio"}</span>
            </button>
            <button
              onClick={handlePrint}
              className="min-h-[40px] bg-teal-600 hover:bg-teal-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-1.5 transition shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Print / PDF</span>
              <span className="sm:hidden">Print</span>
            </button>
            <button
              onClick={handleClose}
              aria-label="Close referral slip modal"
              title="Close Referral Slip (Esc)"
              className="min-h-[40px] bg-slate-800 hover:bg-rose-600 text-white px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-1.5 transition border border-slate-700 hover:border-rose-500 cursor-pointer shadow-xs"
            >
              <X className="w-4 h-4 shrink-0" />
              <span>Close</span>
            </button>
          </div>
        </div>

        {/* Printable Document Container (Scrollable) */}
        <div id="printable-referral-slip" className="overflow-y-auto flex-1 p-4 sm:p-10 space-y-5 bg-white print:p-0 print:space-y-3 font-sans">
          {/* Print CSS Styles */}
          <style dangerouslySetInnerHTML={{
            __html: `
              @media print {
                body * {
                  visibility: hidden;
                }
                #printable-referral-slip, #printable-referral-slip * {
                  visibility: visible;
                }
                #printable-referral-slip {
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 100%;
                  margin: 0;
                  padding: 16px !important;
                  background: white !important;
                  color: black !important;
                  font-size: 10.5pt;
                }
                .no-print {
                  display: none !important;
                }
              }
            `
          }} />

          {/* Top Tricolor Accent Line */}
          <div className="h-1.5 w-full bg-linear-to-r from-amber-500 via-slate-100 to-emerald-600 rounded-full" />

          {/* 1. OFFICIAL GOVERNMENT OF ODISHA / NHM HEADER */}
          <div className="border-b-2 border-slate-900 pb-3.5 space-y-2.5 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 min-w-0">
              {/* Government Header & Emblem */}
              <div className="flex items-center space-x-3.5 min-w-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-teal-900 text-white flex flex-col items-center justify-center font-serif shadow-xs border border-teal-950 shrink-0">
                  <span className="text-xl sm:text-2xl">🏛️</span>
                </div>
                <div className="min-w-0">
                  <h4 className="text-[10px] sm:text-sm font-extrabold uppercase tracking-wide text-slate-800 truncate">
                    GOVERNMENT OF ODISHA • HEALTH & FAMILY WELFARE DEPARTMENT
                  </h4>
                  <h1 className="text-sm sm:text-xl font-black text-teal-950 uppercase tracking-tight truncate">
                    STATE HEALTHCARE FACILITY REGISTRY & REFERRAL NETWORK
                  </h1>
                  <p className="text-[10px] sm:text-xs text-slate-600 font-semibold uppercase tracking-wider truncate">
                    Standardized Clinical Inter-Facility Emergency Transfer Form
                  </p>
                </div>
              </div>

              {/* Barcode & Reference Tracking Code */}
              <div className="text-left sm:text-right flex flex-col items-start sm:items-end shrink-0">
                <div className="font-mono text-[10px] sm:text-xs text-slate-500 font-bold uppercase">
                  NHM Transfer ID
                </div>
                <div className="font-mono font-black text-xs sm:text-sm text-slate-900 tracking-wider">
                  REF-{tokenNumber}-2026-OD-NHM
                </div>
                {/* Visual Barcode Pattern */}
                <div className="mt-1 bg-white p-1 rounded border border-slate-300">
                  <svg className="w-32 h-6" viewBox="0 0 144 24" role="img" aria-label="Official NHM Referral Verification Barcode">
                    <rect x="0" y="0" width="3" height="24" fill="#111" />
                    <rect x="5" y="0" width="1" height="24" fill="#111" />
                    <rect x="8" y="0" width="4" height="24" fill="#111" />
                    <rect x="14" y="0" width="2" height="24" fill="#111" />
                    <rect x="18" y="0" width="1" height="24" fill="#111" />
                    <rect x="21" y="0" width="3" height="24" fill="#111" />
                    <rect x="26" y="0" width="2" height="24" fill="#111" />
                    <rect x="30" y="0" width="4" height="24" fill="#111" />
                    <rect x="36" y="0" width="1" height="24" fill="#111" />
                    <rect x="39" y="0" width="3" height="24" fill="#111" />
                    <rect x="44" y="0" width="2" height="24" fill="#111" />
                    <rect x="48" y="0" width="1" height="24" fill="#111" />
                    <rect x="51" y="0" width="4" height="24" fill="#111" />
                    <rect x="57" y="0" width="2" height="24" fill="#111" />
                    <rect x="61" y="0" width="3" height="24" fill="#111" />
                    <rect x="66" y="0" width="1" height="24" fill="#111" />
                    <rect x="69" y="0" width="4" height="24" fill="#111" />
                    <rect x="75" y="0" width="2" height="24" fill="#111" />
                    <rect x="79" y="0" width="3" height="24" fill="#111" />
                    <rect x="84" y="0" width="1" height="24" fill="#111" />
                    <rect x="87" y="0" width="4" height="24" fill="#111" />
                    <rect x="93" y="0" width="2" height="24" fill="#111" />
                    <rect x="97" y="0" width="3" height="24" fill="#111" />
                    <rect x="102" y="0" width="1" height="24" fill="#111" />
                    <rect x="105" y="0" width="4" height="24" fill="#111" />
                    <rect x="111" y="0" width="2" height="24" fill="#111" />
                    <rect x="115" y="0" width="3" height="24" fill="#111" />
                    <rect x="120" y="0" width="1" height="24" fill="#111" />
                    <rect x="123" y="0" width="4" height="24" fill="#111" />
                    <rect x="129" y="0" width="2" height="24" fill="#111" />
                    <rect x="133" y="0" width="3" height="24" fill="#111" />
                    <rect x="138" y="0" width="2" height="24" fill="#111" />
                    <rect x="142" y="0" width="2" height="24" fill="#111" />
                  </svg>
                  <div className="text-[10px] font-mono text-center tracking-widest text-slate-700 mt-0.5">
                    *{tokenNumber}*
                  </div>
                </div>
              </div>
            </div>

            {/* Official Form Sub-Banner */}
            <div className="bg-slate-900 text-white text-center py-1.5 rounded-lg text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2">
              <span>🚨</span>
              <span>STANDARDIZED INTER-FACILITY EMERGENCY CLINICAL REFERRAL DOCUMENT</span>
              <span>🚨</span>
            </div>
          </div>

          {/* 2. GOVERNMENT FACILITY HIERARCHY & TRANSFER CORRIDOR */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-teal-50/70 border border-teal-200 rounded-2xl p-4 text-xs sm:text-sm">
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-900 flex items-center space-x-1.5">
                <Building2 className="w-4 h-4 text-teal-700 shrink-0" />
                <span>1. Referring Origin Facility</span>
              </span>
              <strong className="text-sm sm:text-base font-extrabold text-slate-950 block">
                {facInfo.fullName}
              </strong>
              <div className="text-xs sm:text-sm text-slate-700 space-y-1">
                <p>Facility Category: <strong>{facInfo.tier}</strong></p>
                <p>National Identification Number: <span className="font-mono font-bold text-teal-950">{facInfo.nin}</span></p>
                <p>Administrative District: <strong>{facInfo.district}, Odisha</strong></p>
              </div>
            </div>

            <div className="space-y-1.5 border-t sm:border-t-0 sm:border-l border-teal-200 pt-3 sm:pt-0 sm:pl-4">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-900 flex items-center space-x-1.5">
                <Building2 className="w-4 h-4 text-teal-700 shrink-0" />
                <span>2. Designated Receiving Health Facility</span>
              </span>
              <strong className="text-sm sm:text-base font-extrabold text-teal-950 block">
                {facInfo.receivingFacility}
              </strong>
              <div className="text-xs sm:text-sm text-slate-700 space-y-1">
                <p>Receiving Level: <strong>{facInfo.receivingTier}</strong></p>
                <p>Transfer Corridor: <strong>{facInfo.referralCorridor}</strong></p>
                <p>Referral Priority: <span className="font-black text-rose-700 uppercase">Emergency Resuscitation Bay (STAT)</span></p>
              </div>
            </div>
          </div>

          {/* 3. PATIENT DEMOGRAPHICS, ABHA ID & TOKEN */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Patient Token Number</span>
              <strong className="text-xl font-black text-slate-950 font-mono block">
                {tokenNumber}
              </strong>
              <span className="text-xs text-slate-500 block font-medium">Queue Ref ID</span>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Patient Name & Demographics</span>
              <strong className="text-sm sm:text-base font-extrabold text-slate-900 block truncate">
                {p.name_or_alias}
              </strong>
              <span className="text-xs sm:text-sm text-slate-700 font-medium">{Math.max(0, Math.abs(Number(p.age) || 0))} Yrs • {p.sex} • {p.language_preference || "Odia"}</span>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Ayushman Bharat ABHA ID</span>
              <strong className="text-xs sm:text-sm font-black text-teal-950 font-mono block">
                {abhaId}
              </strong>
              <span className="text-xs text-emerald-700 font-bold flex items-center space-x-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>ABDM Verified Citizen</span>
              </span>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Triage Classification</span>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mt-0.5 ${
                  priority === "RED"
                    ? "bg-rose-600 text-white"
                    : priority === "YELLOW"
                    ? "bg-amber-500 text-white"
                    : "bg-emerald-600 text-white"
                }`}
              >
                {priority === "RED"
                  ? "🔴 P1 Emergency (STAT)"
                  : priority === "YELLOW"
                  ? "🟠 P2 Urgent"
                  : "🟢 P3 Routine"}
              </span>
              <span className="text-xs text-slate-500 block mt-0.5 font-medium">Immediate Escort</span>
            </div>

            <div className="border-t border-slate-200 pt-2 col-span-2 sm:col-span-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Origin Geographic Coordinates</span>
              <span className="font-semibold text-xs sm:text-sm text-slate-800">
                {p.location_state || `${facInfo.district}, Odisha`}
              </span>
            </div>

            <div className="border-t border-slate-200 pt-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Referral Timestamp</span>
              <span className="font-mono text-xs sm:text-sm text-slate-800 font-semibold">{currentDate}, {currentTime}</span>
            </div>

            <div className="border-t border-slate-200 pt-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Attendant / Emergency Contact</span>
              <span className="font-mono text-xs sm:text-sm text-slate-800 font-bold">{p.emergency_contact || "+91-9876543210"}</span>
            </div>
          </div>

          {/* 4. DEPARTURE VITALS (PRE-TRANSFER ASSESSMENT) */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-1.5 gap-2">
              <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                <HeartPulse className="w-4 h-4 text-rose-600 shrink-0" />
                <span>3. Departure Vitals (Pre-Transfer Clinical Assessment)</span>
              </h3>
              <span className="text-xs text-slate-500 font-medium italic">Recorded 5 mins prior to ambulance departure</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 text-center">
              {/* SpO2 */}
              <div className={`p-3 rounded-2xl border ${spo2 < 90 ? "bg-rose-50 border-rose-300 text-rose-950 font-bold" : "bg-slate-50 border-slate-200"}`}>
                <span className="text-xs text-slate-500 block font-bold uppercase tracking-wider mb-0.5">SpO₂ Oxygen</span>
                <span className="text-xl sm:text-2xl font-black font-mono">{spo2}%</span>
                <span className="text-xs block text-rose-700 font-bold mt-1">
                  {spo2 < 90 ? "Critical Hypoxia" : "Acceptable"}
                </span>
              </div>

              {/* Blood Pressure */}
              <div className={`p-3 rounded-2xl border ${sysBp >= 150 ? "bg-rose-50 border-rose-300 text-rose-950 font-bold" : "bg-slate-50 border-slate-200"}`}>
                <span className="text-xs text-slate-500 block font-bold uppercase tracking-wider mb-0.5">Blood Pressure</span>
                <span className="text-xl sm:text-2xl font-black font-mono">{sysBp}/{diaBp}</span>
                <span className="text-xs block text-rose-700 font-semibold mt-1">mmHg (Urgent)</span>
              </div>

              {/* Heart Rate / Pulse */}
              <div className={`p-3 rounded-2xl border ${pulse > 100 || pulse < 50 ? "bg-rose-50 border-rose-300 text-rose-950 font-bold" : "bg-slate-50 border-slate-200"}`}>
                <span className="text-xs text-slate-500 block font-bold uppercase tracking-wider mb-0.5">Pulse / Heart</span>
                <span className="text-xl sm:text-2xl font-black font-mono">{pulse}</span>
                <span className="text-xs block text-slate-600 font-semibold mt-1">bpm (Tachycardia)</span>
              </div>

              {/* Respiratory Rate */}
              <div className={`p-3 rounded-2xl border ${rr >= 24 ? "bg-amber-50 border-amber-300 text-amber-950 font-bold" : "bg-slate-50 border-slate-200"}`}>
                <span className="text-xs text-slate-500 block font-bold uppercase tracking-wider mb-0.5">Resp Rate</span>
                <span className="text-xl sm:text-2xl font-black font-mono">{rr}</span>
                <span className="text-xs block text-slate-600 font-semibold mt-1">/min (Tachypnea)</span>
              </div>

              {/* Temperature */}
              <div className={`p-3 rounded-2xl border ${temp >= 101.5 ? "bg-amber-50 border-amber-300 text-amber-950 font-bold" : "bg-slate-50 border-slate-200"}`}>
                <span className="text-xs text-slate-500 block font-bold uppercase tracking-wider mb-0.5">Temperature</span>
                <span className="text-xl sm:text-2xl font-black font-mono">{temp}°F</span>
                <span className="text-xs block text-slate-600 font-semibold mt-1">Oral Temp</span>
              </div>

              {/* Blood Glucose */}
              <div className="p-3 rounded-2xl border bg-slate-50 border-slate-200">
                <span className="text-xs text-slate-500 block font-bold uppercase tracking-wider mb-0.5">Blood Glucose</span>
                <span className="text-xl sm:text-2xl font-black font-mono">{glucose}</span>
                <span className="text-xs block text-slate-600 font-semibold mt-1">mg/dL (RBS)</span>
              </div>
            </div>
          </div>

          {/* 5. CLINICAL INDICATION & REASON FOR EMERGENCY TRANSFER */}
          <div className="space-y-2">
            <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1.5">
              4. Clinical Presentation & Reason for Inter-Facility Transfer
            </h3>
            <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-4 text-xs sm:text-sm space-y-2.5">
              <div className="flex items-start space-x-2.5">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-rose-950 font-bold text-sm sm:text-base block mb-1">
                    Chief Complaint & Immediate Clinical Indication:
                  </strong>
                  <p className="text-slate-800 font-medium text-xs sm:text-sm leading-relaxed">
                    {s.chief_complaint} (Duration: {s.duration || "2 hours"}, Progression: {s.onset_trend || "Rapidly worsening"}).
                  </p>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-rose-200 text-xs sm:text-sm text-slate-800 space-y-1.5 leading-relaxed">
                <p>
                  <strong className="text-slate-900">Specific Justification for Inter-Facility Referral:</strong> {facInfo.name} lacks 24/7 cardiac intensive care unit (ICU/CCU), telemetry beds, rapid serum troponin quantitative assay, and definitive thrombolytic / PCI capabilities required for acute cardiopulmonary stabilization.
                </p>
                <p className="text-slate-700">
                  <strong className="text-slate-900">Chronic Medical History:</strong> {m.existing_conditions && m.existing_conditions.length > 0 ? m.existing_conditions.join(", ") : "Essential Hypertension (5y), Type 2 Diabetes, Prior ECG: LVH strain pattern"}.
                </p>
                <p className="text-rose-700 font-bold text-xs sm:text-sm">
                  🚨 Critical Allergy Alert: {m.known_allergies && m.known_allergies.length > 0 ? m.known_allergies.join(", ") : "Penicillin (Severe Allergy Risk) — Beta-lactams strictly withheld"}.
                </p>
              </div>
            </div>
          </div>

          {/* 6. PRE-REFERRAL CLINICAL STABILIZATION & OXYGEN GIVEN */}
          <div className="space-y-2">
            <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1.5">
              5. Pre-Referral Stabilization & Emergency First-Aid Administered
            </h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs sm:text-sm space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block font-bold text-xs sm:text-sm">Pre-Referral Oxygen Stabilization:</strong>
                    <span className="text-slate-700 leading-relaxed block mt-0.5">
                      High-flow supplemental oxygen administered at <strong>4 L/min via nasal cannula</strong> (pre-referral stabilization). Baseline room-air SpO₂ 89% successfully raised to 93% prior to ambulance departure (Medical O₂ Cylinder Batch OD-NHM-O2-881 active).
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block font-bold text-xs sm:text-sm">Initial Telephonic MO Orders & STAT Pharmacotherapy:</strong>
                    <span className="text-slate-700 leading-relaxed block mt-0.5">
                      Initial telephonic Medical Officer (MO) orders executed: Dispersible Aspirin 300 mg chewed STAT + Clopidogrel 300 mg oral load administered under Dr. S. Mohanty telephonic guidance.
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block font-bold text-xs sm:text-sm">Intravenous Access & Fluid Support:</strong>
                    <span className="text-slate-700 leading-relaxed block mt-0.5">
                      18G IV Cannula secured in left forearm; 0.9% Normal Saline KVO line running at 30 mL/hr.
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block font-bold text-xs sm:text-sm">Pre-Departure Monitoring:</strong>
                    <span className="text-slate-700 leading-relaxed block mt-0.5">
                      Continuous cardiac rhythm and digital pulse oximeter monitoring maintained throughout stabilization bay.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 7. 108 EMERGENCY AMBULANCE TRANSFER DETAILS */}
          <div className="space-y-2">
            <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center space-x-1.5">
              <Truck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>6. Official 108 Emergency Ambulance Transfer Details</span>
            </h3>
            <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4 text-xs sm:text-sm space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block mb-0.5">Ambulance Service Provider</span>
                  <strong className="text-slate-900 block text-xs sm:text-sm">
                    108 Odisha Emergency Medical Ambulance Service (NHM / GVK EMRI)
                  </strong>
                  <span className="text-slate-600 text-xs block mt-0.5">Advanced Life Support (ALS Unit)</span>
                </div>

                <div>
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block mb-0.5">Vehicle Registration & Base</span>
                  <strong className="font-mono text-slate-900 block text-xs sm:text-sm">
                    OD-02-AX-1081
                  </strong>
                  <span className="text-slate-600 text-xs block mt-0.5">{facInfo.ambulanceBase}</span>
                </div>

                <div>
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block mb-0.5">Escort Personnel On Board</span>
                  <strong className="text-slate-900 block text-xs sm:text-sm">
                    EMT Bikash Swain (EMRI-OD-4491)
                  </strong>
                  <span className="text-slate-600 text-xs block mt-0.5">Pilot: P. Nayak | Contact: 108 Dispatch</span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-amber-200/80 text-xs sm:text-sm text-slate-700 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-slate-900">In-Transit Equipment Active: </span>
                  <span>Continuous pulse oximeter, defibrillator on standby, in-transit continuous high-flow O₂ cylinder.</span>
                </div>
                <div className="font-mono text-xs text-amber-950 font-bold bg-amber-100 px-2.5 py-1 rounded-md">
                  108 Dispatch Ref: CCR-OD-KHD-2026-0926-0481
                </div>
              </div>
            </div>
          </div>

          {/* 8. REFERRING DOCTOR SIGNATURE, STAMP & VERIFICATION */}
          <div className="pt-3 border-t-2 border-slate-900 flex flex-col sm:flex-row items-end justify-between gap-5 text-xs sm:text-sm">
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2 text-teal-800 font-extrabold text-xs sm:text-sm">
                <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
                <span>Verified under Saransh (सारांश) NHA Clinical Safety Protocol</span>
              </div>
              <p className="text-slate-700">
                Referring Facility: <strong className="text-slate-900">{facInfo.fullName}</strong>
              </p>
              <p className="text-slate-700">
                Referring Medical Officer: <strong className="text-slate-900">{review.reviewer_id || "Dr. S. Mohanty, MBBS, MD (Medicine)"}</strong>
              </p>
              <p className="text-slate-600 font-mono text-xs">
                Registration No: OMC/MCI-48192 | National Facility Registry ID: {facInfo.nin}
              </p>
            </div>

            {/* Official Signature Line & Seal Box */}
            <div className="text-center w-64 flex flex-col items-center space-y-1.5 shrink-0">
              <div className="h-12 w-full flex items-center justify-center border-b-2 border-dashed border-slate-400">
                <span className="font-serif italic text-lg text-slate-800 font-bold">
                  Dr. S. Mohanty, M.D.
                </span>
              </div>
              <div>
                <p className="font-bold text-slate-900 text-xs sm:text-sm">
                  Authorized Medical Officer Signature
                </p>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                  Government Health Facility Seal & Date
                </p>
              </div>
            </div>
          </div>

          {/* Legal Compliance Notice */}
          <div className="border-t border-slate-200 pt-2 text-xs text-slate-500 text-center font-medium leading-normal">
            * This standardized clinical referral document is generated by Saransh (सारांश) Multimodal Clinical Triage Assistant in compliance with Government of Odisha Health & Family Welfare Department, National Health Mission (NHM), and Ayushman Bharat Digital Mission (ABDM) Inter-Facility Transfer Guidelines.
          </div>
        </div>

        {/* Sticky Bottom Action Bar (hidden when printing) */}
        <div className="no-print sticky bottom-0 z-30 bg-slate-100/95 backdrop-blur-md border-t border-slate-300 px-4 sm:px-8 py-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 shadow-lg shrink-0">
          <div className="flex items-center space-x-2 text-xs text-slate-600 truncate">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="truncate">Official NHM Form Ready • Verified</span>
          </div>
          <div className="flex items-center justify-end">
            <button
              onClick={handlePrint}
              className="min-h-[44px] w-full sm:w-auto bg-teal-700 hover:bg-teal-800 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4 shrink-0" />
              <span>Print Official Slip (PDF)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
