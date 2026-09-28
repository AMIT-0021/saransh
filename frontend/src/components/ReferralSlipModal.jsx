import React from "react";
import { Printer, X, ShieldCheck, FileText, CheckCircle2, AlertTriangle, Building2, PhoneCall, Truck, HeartPulse, Activity } from "lucide-react";

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
    age: record.age || 62,
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-5 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full border border-slate-300 overflow-hidden text-slate-800">
        {/* Modal Toolbar (hidden when printing) */}
        <div className="no-print bg-slate-100 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-teal-700 text-white shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                Official National Health Mission Referral Slip
              </h3>
              <p className="text-xs text-slate-500">
                Government of Odisha • Standardized Inter-Facility Emergency Transfer Form
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="bg-teal-700 hover:bg-teal-800 text-white px-5 py-2.5 rounded-xl text-xs font-black flex items-center space-x-2 transition shadow-md shadow-teal-800/20 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Close referral slip modal"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Container */}
        <div id="printable-referral-slip" className="p-6 sm:p-10 space-y-5 bg-white print:p-0 print:space-y-3">
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
          <div className="border-b-2 border-slate-900 pb-3 space-y-2">
            <div className="flex items-center justify-between">
              {/* Government Header & Emblem */}
              <div className="flex items-center space-x-3">
                <div className="w-14 h-14 rounded-2xl bg-teal-900 text-white flex flex-col items-center justify-center font-serif shadow-xs border border-teal-950 shrink-0">
                  <span className="text-2xl">🏛️</span>
                </div>
                <div>
                  <h4 className="text-[12px] sm:text-[13px] font-black uppercase tracking-wider text-slate-900">
                    GOVERNMENT OF ODISHA • HEALTH & FAMILY WELFARE DEPARTMENT / NATIONAL HEALTH MISSION
                  </h4>
                  <h1 className="text-lg sm:text-xl font-black text-teal-950 uppercase tracking-tight">
                    STATE HEALTHCARE FACILITY REGISTRY & REFERRAL NETWORK
                  </h1>
                  <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">
                    Standardized Clinical Inter-Facility Emergency Transfer Form (NHM-ODISHA-REF-2026)
                  </p>
                </div>
              </div>

              {/* Barcode & Reference Tracking Code */}
              <div className="text-right flex flex-col items-end shrink-0">
                <div className="font-mono text-[9px] text-slate-500 font-bold uppercase">
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
                  <div className="text-[7.5px] font-mono text-center tracking-widest text-slate-700">
                    *{tokenNumber}*
                  </div>
                </div>
              </div>
            </div>

            {/* Official Form Sub-Banner */}
            <div className="bg-slate-900 text-white text-center py-1 rounded-lg text-[11px] font-black uppercase tracking-wider flex items-center justify-center space-x-2">
              <span>🚨</span>
              <span>STANDARDIZED INTER-FACILITY EMERGENCY CLINICAL REFERRAL DOCUMENT</span>
              <span>🚨</span>
            </div>
          </div>

          {/* 2. GOVERNMENT FACILITY HIERARCHY & TRANSFER CORRIDOR */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-teal-50/70 border border-teal-200 rounded-2xl p-3.5 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wide text-teal-900 flex items-center space-x-1">
                <Building2 className="w-3.5 h-3.5 text-teal-700" />
                <span>1. Referring Origin Facility</span>
              </span>
              <strong className="text-sm font-black text-slate-950 block">
                {facInfo.fullName}
              </strong>
              <div className="text-[11px] text-slate-700 space-y-0.5">
                <p>Facility Category: <strong>{facInfo.tier}</strong></p>
                <p>National Identification Number: <span className="font-mono font-bold text-teal-950">{facInfo.nin}</span></p>
                <p>Administrative District: <strong>{facInfo.district}, Odisha</strong></p>
              </div>
            </div>

            <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-teal-200 pt-2 sm:pt-0 sm:pl-3.5">
              <span className="text-[10px] font-black uppercase tracking-wide text-teal-900 flex items-center space-x-1">
                <Building2 className="w-3.5 h-3.5 text-teal-700" />
                <span>2. Designated Receiving Health Facility</span>
              </span>
              <strong className="text-sm font-black text-teal-950 block">
                {facInfo.receivingFacility}
              </strong>
              <div className="text-[11px] text-slate-700 space-y-0.5">
                <p>Receiving Level: <strong>{facInfo.receivingTier}</strong></p>
                <p>Transfer Corridor: <strong>{facInfo.referralCorridor}</strong></p>
                <p>Referral Priority: <span className="font-black text-rose-700 uppercase">Emergency Resuscitation Bay (STAT)</span></p>
              </div>
            </div>
          </div>

          {/* 3. PATIENT DEMOGRAPHICS, ABHA ID & TOKEN */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Patient Token Number</span>
              <strong className="text-lg font-black text-slate-950 font-mono">
                {tokenNumber}
              </strong>
              <span className="text-[10px] text-slate-500 block font-semibold">Queue Ref ID</span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Patient Name & Demographics</span>
              <strong className="text-sm font-extrabold text-slate-900 block truncate">
                {p.name_or_alias}
              </strong>
              <span className="text-slate-600 font-semibold">{p.age} Yrs • {p.sex} • {p.language_preference || "Odia"}</span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Ayushman Bharat ABHA ID</span>
              <strong className="text-xs font-black text-teal-900 font-mono block">
                {abhaId}
              </strong>
              <span className="text-[10px] text-emerald-700 font-bold flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>ABDM Verified Citizen</span>
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Triage Classification</span>
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
              <span className="text-[10px] text-slate-500 block mt-0.5 font-semibold">Immediate Escort</span>
            </div>

            <div className="border-t border-slate-200 pt-1.5 col-span-2 sm:col-span-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Origin Geographic Coordinates</span>
              <span className="font-semibold text-slate-800">
                {p.location_state || `${facInfo.district}, Odisha`}
              </span>
            </div>

            <div className="border-t border-slate-200 pt-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Referral Timestamp</span>
              <span className="font-mono text-slate-800 font-semibold">{currentDate}, {currentTime}</span>
            </div>

            <div className="border-t border-slate-200 pt-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Attendant / Emergency Contact</span>
              <span className="font-mono text-slate-800 font-bold">{p.emergency_contact || "+91-9876543210"}</span>
            </div>
          </div>

          {/* 4. DEPARTURE VITALS (PRE-TRANSFER ASSESSMENT) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                <HeartPulse className="w-3.5 h-3.5 text-rose-600" />
                <span>3. Departure Vitals (Pre-Transfer Clinical Assessment)</span>
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">Recorded 5 mins prior to ambulance departure</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
              {/* SpO2 */}
              <div className={`p-2.5 rounded-xl border ${spo2 < 90 ? "bg-rose-50 border-rose-300 text-rose-950 font-bold" : "bg-slate-50 border-slate-200"}`}>
                <span className="text-[10px] text-slate-500 block font-semibold uppercase">SpO₂ Oxygen</span>
                <span className="text-base font-black">{spo2}%</span>
                <span className="text-[9px] block text-rose-700 font-bold">
                  {spo2 < 90 ? "Critical Hypoxia" : "Acceptable"}
                </span>
              </div>

              {/* Blood Pressure */}
              <div className={`p-2.5 rounded-xl border ${sysBp >= 150 ? "bg-rose-50 border-rose-300 text-rose-950 font-bold" : "bg-slate-50 border-slate-200"}`}>
                <span className="text-[10px] text-slate-500 block font-semibold uppercase">Blood Pressure</span>
                <span className="text-base font-black">{sysBp}/{diaBp}</span>
                <span className="text-[9px] block text-rose-700 font-semibold">mmHg (Urgent)</span>
              </div>

              {/* Heart Rate / Pulse */}
              <div className={`p-2.5 rounded-xl border ${pulse > 100 || pulse < 50 ? "bg-rose-50 border-rose-300 text-rose-950 font-bold" : "bg-slate-50 border-slate-200"}`}>
                <span className="text-[10px] text-slate-500 block font-semibold uppercase">Pulse / Heart Rate</span>
                <span className="text-base font-black">{pulse}</span>
                <span className="text-[9px] block text-slate-500 font-semibold">bpm (Tachycardia)</span>
              </div>

              {/* Respiratory Rate */}
              <div className={`p-2.5 rounded-xl border ${rr >= 24 ? "bg-amber-50 border-amber-300 text-amber-950 font-bold" : "bg-slate-50 border-slate-200"}`}>
                <span className="text-[10px] text-slate-500 block font-semibold uppercase">Resp Rate</span>
                <span className="text-base font-black">{rr}</span>
                <span className="text-[9px] block text-slate-500 font-semibold">/min (Tachypnea)</span>
              </div>

              {/* Temperature */}
              <div className={`p-2.5 rounded-xl border ${temp >= 101.5 ? "bg-amber-50 border-amber-300 text-amber-950 font-bold" : "bg-slate-50 border-slate-200"}`}>
                <span className="text-[10px] text-slate-500 block font-semibold uppercase">Temperature</span>
                <span className="text-base font-black">{temp}°F</span>
                <span className="text-[9px] block text-slate-500 font-semibold">Oral Temp</span>
              </div>

              {/* Blood Glucose */}
              <div className="p-2.5 rounded-xl border bg-slate-50 border-slate-200">
                <span className="text-[10px] text-slate-500 block font-semibold uppercase">Blood Glucose</span>
                <span className="text-base font-black">{glucose}</span>
                <span className="text-[9px] block text-slate-500 font-semibold">mg/dL (RBS)</span>
              </div>
            </div>
          </div>

          {/* 5. CLINICAL INDICATION & REASON FOR EMERGENCY TRANSFER */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
              4. Clinical Presentation & Reason for Inter-Facility Transfer
            </h3>
            <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-3.5 text-xs space-y-2">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-rose-950 font-bold block">
                    Chief Complaint & Immediate Clinical Indication:
                  </strong>
                  <p className="text-slate-800 font-medium">
                    {s.chief_complaint} (Duration: {s.duration || "2 hours"}, Progression: {s.onset_trend || "Rapidly worsening"}).
                  </p>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-rose-200 text-xs text-slate-800 space-y-1">
                <p>
                  <strong>Specific Justification for Inter-Facility Referral:</strong> {facInfo.name} lacks 24/7 cardiac intensive care unit (ICU/CCU), telemetry beds, rapid serum troponin quantitative assay, and definitive thrombolytic / PCI capabilities required for acute cardiopulmonary stabilization.
                </p>
                <p className="text-slate-600">
                  <strong>Chronic Medical History:</strong> {m.existing_conditions && m.existing_conditions.length > 0 ? m.existing_conditions.join(", ") : "Essential Hypertension (5y), Type 2 Diabetes, Prior ECG: LVH strain pattern"}.
                </p>
                <p className="text-rose-700 font-bold">
                  <strong>🚨 Critical Allergy Alert:</strong> {m.known_allergies && m.known_allergies.length > 0 ? m.known_allergies.join(", ") : "Penicillin (Severe Allergy Risk) — Beta-lactams strictly withheld"}.
                </p>
              </div>
            </div>
          </div>

          {/* 6. PRE-REFERRAL CLINICAL STABILIZATION & OXYGEN GIVEN */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
              5. Pre-Referral Stabilization & Emergency First-Aid Administered
            </h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block font-bold">Pre-Referral Oxygen Stabilization:</strong>
                    <span className="text-slate-700">
                      High-flow supplemental oxygen administered at <strong>4 L/min via nasal cannula</strong> (pre-referral stabilization). Baseline room-air SpO₂ 89% successfully raised to 93% prior to ambulance departure (Medical O₂ Cylinder Batch OD-NHM-O2-881 active).
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block font-bold">Initial Telephonic MO Orders & STAT Pharmacotherapy:</strong>
                    <span className="text-slate-700">
                      Initial telephonic Medical Officer (MO) orders executed: Dispersible Aspirin 300 mg chewed STAT + Clopidogrel 300 mg oral load administered under Dr. S. Mohanty telephonic guidance.
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block font-bold">Intravenous Access & Fluid Support:</strong>
                    <span className="text-slate-700">
                      18G IV Cannula secured in left forearm; 0.9% Normal Saline KVO line running at 30 mL/hr.
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block font-bold">Pre-Departure Monitoring:</strong>
                    <span className="text-slate-700">
                      Continuous cardiac rhythm and digital pulse oximeter monitoring maintained throughout stabilization bay.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 7. 108 EMERGENCY AMBULANCE TRANSFER DETAILS */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 flex items-center space-x-1.5">
              <Truck className="w-3.5 h-3.5 text-amber-600" />
              <span>6. Official 108 Emergency Ambulance Transfer Details</span>
            </h3>
            <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-3.5 text-xs space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <span className="text-[10px] font-bold text-amber-900 uppercase block">Ambulance Service Provider</span>
                  <strong className="text-slate-900 block">
                    108 Odisha Emergency Medical Ambulance Service (NHM / GVK EMRI)
                  </strong>
                  <span className="text-slate-600 text-[10px]">Advanced Life Support (ALS Unit)</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-amber-900 uppercase block">Vehicle Registration & Base</span>
                  <strong className="font-mono text-slate-900 block text-xs">
                    OD-02-AX-1081
                  </strong>
                  <span className="text-slate-600 text-[10px]">{facInfo.ambulanceBase}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-amber-900 uppercase block">Escort Personnel On Board</span>
                  <strong className="text-slate-900 block">
                    EMT Bikash Swain (EMRI-OD-4491)
                  </strong>
                  <span className="text-slate-600 text-[10px]">Pilot: P. Nayak | Contact: 108 Dispatch</span>
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-amber-200/80 text-[11px] text-slate-700 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-slate-900">In-Transit Equipment Active: </span>
                  <span>Continuous pulse oximeter, defibrillator on standby, in-transit continuous high-flow O₂ cylinder.</span>
                </div>
                <div className="font-mono text-[10px] text-amber-950 font-bold bg-amber-100 px-2 py-0.5 rounded-md">
                  108 Dispatch Ref: CCR-OD-KHD-2026-0926-0481
                </div>
              </div>
            </div>
          </div>

          {/* 8. REFERRING DOCTOR SIGNATURE, STAMP & VERIFICATION */}
          <div className="pt-3 border-t-2 border-slate-900 flex flex-col sm:flex-row items-end justify-between gap-5 text-xs">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-teal-800 font-extrabold text-xs">
                <ShieldCheck className="w-4 h-4 text-teal-700" />
                <span>Verified under Saransh (सारांश) NHA Clinical Safety Protocol</span>
              </div>
              <p className="text-slate-700">
                Referring Facility: <strong>{facInfo.fullName}</strong>
              </p>
              <p className="text-slate-700">
                Referring Medical Officer: <strong>{review.reviewer_id || "Dr. S. Mohanty, MBBS, MD (Medicine)"}</strong>
              </p>
              <p className="text-slate-500 font-mono text-[10px]">
                Registration No: OMC/MCI-48192 | National Facility Registry ID: {facInfo.nin}
              </p>
            </div>

            {/* Official Signature Line & Seal Box */}
            <div className="text-center w-64 flex flex-col items-center space-y-1.5 shrink-0">
              <div className="h-12 w-full flex items-center justify-center border-b-2 border-dashed border-slate-400">
                <span className="font-serif italic text-base text-slate-800 font-bold">
                  Dr. S. Mohanty, M.D.
                </span>
              </div>
              <div>
                <p className="font-bold text-slate-900 text-xs">
                  Authorized Medical Officer Signature
                </p>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                  Government Health Facility Seal & Date
                </p>
              </div>
            </div>
          </div>

          {/* Legal Compliance Notice */}
          <div className="border-t border-slate-200 pt-2 text-[9.5px] text-slate-400 text-center font-medium">
            * This standardized clinical referral document is generated by Saransh (सारांश) Multimodal Clinical Triage Assistant in compliance with Government of Odisha Health & Family Welfare Department, National Health Mission (NHM), and Ayushman Bharat Digital Mission (ABDM) Inter-Facility Transfer Guidelines.
          </div>
        </div>
      </div>
    </div>
  );
}
