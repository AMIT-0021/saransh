import React, { useState } from "react";
import {
  Activity,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Wifi,
  WifiOff,
  RefreshCw,
  Globe,
  Stethoscope,
  ClipboardList,
  Building2,
  RotateCcw,
  X,
  CheckCircle2,
  Scale,
  FileText
} from "lucide-react";
import { FACILITY_SCENARIOS } from "../data/syntheticCases";
import { TRANSLATIONS } from "../data/translations";

export default function HeaderBar({
  selectedFacility,
  onFacilityChange,
  selectedLanguage,
  onLanguageChange,
  activeRole,
  onRoleChange,
  isOffline,
  onToggleOffline,
  pendingSyncCount,
  onSyncOffline,
  onResetDemo,
  redCount = 0,
  yellowCount = 0,
  totalWaiting = 0,
  isSyncing = false
}) {
  const t = TRANSLATIONS[selectedLanguage] || TRANSLATIONS.English;
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState("PRIVACY");

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-xs transition-all">
      {/* 1. Non-Diagnostic Clinical Safety Strip */}
      <div className="bg-amber-50/95 border-b border-amber-200/70 px-4 py-1.5 text-xs text-amber-900 flex items-center justify-between font-medium">
        <div className="flex items-center space-x-2 truncate">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="truncate">
            <strong className="font-bold text-amber-950 uppercase tracking-wide mr-1.5">
              {t.safetyNoticeTitle || "CLINICAL ADVISORY TOOL ONLY:"}
            </strong>
            {t.headerSafetyDisclaimer || "Clinical Advisory Tool Only. Final decisions rest with qualified healthcare professionals."}
          </span>
        </div>
        <div className="hidden lg:flex items-center space-x-2 shrink-0 text-[11px] text-amber-800">
          <span className="bg-white/90 border border-amber-300 text-amber-900 px-2.5 py-0.5 rounded-full text-[10px] font-black shadow-2xs">
            {t.safetyBadge || "MAX(Rule, AI) Safety Floor"}
          </span>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-4 py-2 sm:py-3 w-full max-w-full overflow-hidden">
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-2 min-w-0">
          {/* Brand Logo & Subtitle */}
          <div className="flex items-center space-x-2.5 sm:space-x-3.5 min-w-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-teal-800 via-teal-600 to-teal-500 flex items-center justify-center shadow-lg shadow-teal-700/25 ring-2 ring-teal-500/20 text-white shrink-0">
              <Activity className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2 min-w-0">
                <h1 className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 truncate">
                  {t.appTitle || "Saransh"}
                </h1>
                <span className="text-[10px] bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-900 px-2.5 py-0.5 rounded-full font-bold tracking-wide border border-teal-200/90 shadow-2xs hidden sm:inline-flex items-center gap-1.5 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {t.edition || "National Healthcare Innovation Edition"}
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden xl:block truncate max-w-md font-medium">
                {t.appSubtitle || "Multimodal Human-in-the-Loop Healthcare Triage Assistant"}
              </p>
            </div>
          </div>

          {/* Desktop Right Action Controls (Hidden on < lg) */}
          <div className="hidden lg:flex items-center space-x-2 shrink-0 ml-auto justify-end">
            {/* Facility Scenario Switcher */}
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-xs min-h-[38px]">
              <Building2 className="w-3.5 h-3.5 text-teal-600 mr-1.5 shrink-0" />
              <select
                value={selectedFacility}
                onChange={(e) => onFacilityChange(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer pr-1 max-w-[190px] truncate"
              >
                {FACILITY_SCENARIOS.map((fac) => (
                  <option key={fac.id} value={fac.id} className="bg-white text-slate-900">
                    {t[fac.id.toLowerCase()] || fac.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Online / Offline Mode Toggle */}
            <button
              onClick={onToggleOffline}
              title="Toggle between Live API and Offline Mode"
              aria-label="Toggle between Live API and Offline Mode"
              className={`flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-xl border transition-all shadow-xs min-h-[38px] ${
                isOffline
                  ? "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
                  : "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
              }`}
            >
              {isOffline ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                  <span className="font-bold">⚡ Offline Mode</span>
                  {pendingSyncCount > 0 && (
                    <span className="bg-amber-600 text-white px-1.5 py-0.5 rounded-full text-[10px] font-black">
                      {pendingSyncCount}
                    </span>
                  )}
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t.onlineSync || "Online Sync"}</span>
                </>
              )}
            </button>

            {/* Sync button when offline queue has items */}
            {pendingSyncCount > 0 && (
              <button
                onClick={onSyncOffline}
                disabled={isSyncing}
                title="Sync offline queued records with central hospital server"
                aria-label={`Sync ${pendingSyncCount} offline queued records with central hospital server`}
                className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-2.5 py-1.5 rounded-xl flex items-center space-x-1 transition shadow-xs min-h-[38px]"
              >
                <RefreshCw className={`w-3 h-3 ${isSyncing ? "animate-spin" : ""}`} />
                <span>{t.syncBtn || "Sync"} ({pendingSyncCount})</span>
              </button>
            )}

            {/* Language Switcher Pill (Desktop) */}
            <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200 shrink-0 min-h-[38px]">
              <Globe className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-1" />
              {[
                { code: "English", label: "EN English" },
                { code: "Hindi", label: "हिन्दी Hindi" },
                { code: "Odia", label: "ଓଡ଼ିଆ Odia" },
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => onLanguageChange(lang.code)}
                  aria-label={`Switch application language to ${lang.label}`}
                  className={`text-xs px-2.5 py-1 rounded-lg transition font-medium ${
                    selectedLanguage === lang.code
                      ? "bg-white text-teal-800 shadow-xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {/* Demo Reset Button */}
            <button
              onClick={onResetDemo}
              title="Reset and reload standard synthetic clinical presets"
              aria-label="Reset and reload standard synthetic clinical presets"
              className="flex items-center space-x-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-xl border border-slate-200 transition shadow-xs font-medium min-h-[38px]"
            >
              <RotateCcw className="w-3 h-3 text-slate-500" />
              <span>{t.resetBtn || "Reset Cases"}</span>
            </button>

            {/* Privacy & Clinical Terms Modal Button */}
            <button
              onClick={() => setIsPrivacyModalOpen(true)}
              title="View India DPDP Act 2023, ABDM Safeguards & NMC Clinical Terms"
              aria-label="View India DPDP Act 2023, ABDM Safeguards and NMC Clinical Terms"
              className="flex items-center space-x-1.5 text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-2.5 py-1.5 rounded-xl border border-emerald-200 transition shadow-xs font-semibold min-h-[38px]"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Privacy & Terms</span>
            </button>
          </div>

          {/* Mobile Right Action Icons (< lg) */}
          <div className="flex lg:hidden items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Mobile Online/Offline Compact Pill */}
            <button
              onClick={onToggleOffline}
              title={isOffline ? "Offline Mode (Queued locally)" : "Online Mode (Connected)"}
              aria-label={isOffline ? "Offline Mode" : "Online Mode"}
              className={`flex items-center space-x-1 text-[11px] font-bold px-2 sm:px-2.5 py-1.5 rounded-xl border transition shadow-xs min-h-[38px] sm:min-h-[44px] min-w-[38px] sm:min-w-[44px] justify-center ${
                isOffline
                  ? "bg-amber-50 text-amber-800 border-amber-300"
                  : "bg-emerald-50 text-emerald-800 border-emerald-300"
              }`}
            >
              {isOffline ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                  <span className="hidden xs:inline text-[10px]">Offline</span>
                  {pendingSyncCount > 0 && (
                    <span className="bg-amber-600 text-white px-1.5 rounded-full text-[9px] font-black">
                      {pendingSyncCount}
                    </span>
                  )}
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="hidden xs:inline text-[10px]">Online</span>
                </>
              )}
            </button>

            {/* Mobile Sync Pill (If pending items) */}
            {pendingSyncCount > 0 && (
              <button
                onClick={onSyncOffline}
                disabled={isSyncing}
                title={`Sync ${pendingSyncCount} offline records`}
                className="bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold px-2 py-1.5 rounded-xl flex items-center space-x-1 shadow-xs min-h-[38px] sm:min-h-[44px] min-w-[38px] sm:min-w-[44px] justify-center"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                <span>{pendingSyncCount}</span>
              </button>
            )}

            {/* Mobile Demo Reset Icon Button */}
            <button
              onClick={onResetDemo}
              title="Reset synthetic clinical cases"
              aria-label="Reset synthetic clinical cases"
              className="p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 min-h-[38px] sm:min-h-[44px] min-w-[38px] sm:min-w-[44px] flex items-center justify-center transition shadow-xs"
            >
              <RotateCcw className="w-4 h-4 text-slate-600" />
            </button>

            {/* Mobile Privacy & Safeguards Icon Button */}
            <button
              onClick={() => setIsPrivacyModalOpen(true)}
              title="DPDP Privacy & NMC Terms"
              aria-label="View Privacy & Clinical Terms"
              className="p-1.5 sm:p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 min-h-[38px] sm:min-h-[44px] min-w-[38px] sm:min-w-[44px] flex items-center justify-center transition shadow-xs"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </button>
          </div>
        </div>

        {/* Mobile Sub-Bar: Facility Selector + Language Pills (Aligned neatly, prevents 4-row jagged wrapping) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2.5 lg:hidden">
          {/* Facility Scenario Dropdown */}
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 shadow-xs min-h-[44px]">
            <Building2 className="w-4 h-4 text-teal-600 mr-2 shrink-0" />
            <select
              value={selectedFacility}
              onChange={(e) => onFacilityChange(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer w-full truncate"
            >
              {FACILITY_SCENARIOS.map((fac) => (
                <option key={fac.id} value={fac.id} className="bg-white text-slate-900">
                  {t[fac.id.toLowerCase()] || fac.label}
                </option>
              ))}
            </select>
          </div>

          {/* Language Switcher Pills */}
          <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200 min-h-[44px]">
            <Globe className="w-3.5 h-3.5 text-slate-500 ml-2 mr-1.5 shrink-0" />
            <div className="grid grid-cols-3 gap-1 flex-1">
              {[
                { code: "English", label: "EN", full: "English" },
                { code: "Hindi", label: "हिन्दी", full: "Hindi" },
                { code: "Odia", label: "ଓଡ଼ିଆ", full: "Odia" },
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => onLanguageChange(lang.code)}
                  aria-label={`Switch language to ${lang.full}`}
                  className={`text-xs py-1.5 px-1 rounded-lg transition font-bold min-h-[36px] flex items-center justify-center ${
                    selectedLanguage === lang.code
                      ? "bg-white text-teal-800 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Top-Level Role Navigation Bar (Mobile Thumb-Friendly & Sticky) */}
      <div className="bg-slate-50/95 backdrop-blur-md px-3 sm:px-4 py-2 border-t border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5">
          {/* Role Switcher Container */}
          <div className="w-full lg:w-auto grid grid-cols-2 lg:inline-flex p-1.5 bg-slate-200/70 backdrop-blur-md rounded-2xl border border-slate-300/80 shadow-inner gap-1.5">
            {/* Tab 1: Patient Intake Station */}
            <button
              type="button"
              onClick={() => onRoleChange("NURSE")}
              className={`flex items-center justify-center space-x-2 py-2.5 px-3.5 sm:px-6 text-xs rounded-xl font-extrabold transition-all duration-300 min-h-[44px] cursor-pointer ${
                activeRole === "NURSE"
                  ? "bg-gradient-to-r from-teal-700 via-teal-600 to-teal-600 text-white shadow-lg shadow-teal-700/30 ring-1 ring-white/20"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/70"
              }`}
            >
              <ClipboardList className="w-4 h-4 shrink-0" />
              <span className="truncate">{t.tabIntake || "🩺 Patient Intake"}</span>
              <span className={`hidden md:inline-flex text-[10px] px-2 py-0.5 rounded-full font-bold ${
                activeRole === "NURSE" ? "bg-teal-800/80 text-teal-100" : "bg-slate-300/80 text-slate-700"
              }`}>
                {t.frontlineNurseBadge || "ASHA"}
              </span>
            </button>

            {/* Tab 2: Doctor Queue & Review Dashboard */}
            <button
              type="button"
              onClick={() => onRoleChange("DOCTOR")}
              className={`flex items-center justify-center space-x-2 py-2.5 px-3.5 sm:px-6 text-xs rounded-xl font-extrabold transition-all duration-300 min-h-[44px] cursor-pointer ${
                activeRole === "DOCTOR"
                  ? "bg-gradient-to-r from-teal-700 via-teal-600 to-teal-600 text-white shadow-lg shadow-teal-700/30 ring-1 ring-white/20"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/70"
              }`}
            >
              <Stethoscope className="w-4 h-4 shrink-0" />
              <span className="truncate">{t.tabDoctorQueue || "🏥 Doctor Queue"}</span>
              <span className={`inline-flex items-center space-x-1.5 text-[10px] px-2.5 py-0.5 rounded-full font-black ${
                activeRole === "DOCTOR"
                  ? "bg-white text-teal-900 shadow-xs"
                  : "bg-teal-100/90 text-teal-900"
              }`}>
                {redCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                )}
                <span>({totalWaiting})</span>
              </span>
            </button>
          </div>

          {/* Right Token & Status Counter */}
          <div className="hidden lg:flex items-center space-x-3 text-xs text-slate-500">
            <span className="flex items-center space-x-2 bg-white px-3.5 py-1.5 rounded-full border border-slate-200/90 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-teal-500"></span>
              <span>{t.activeTokens || "Active OPD Tokens"}: <strong className="text-slate-900 font-extrabold">{totalWaiting}</strong></span>
              {redCount > 0 && (
                <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                  {redCount} {t.emergencyBayBadge || "Emergency Bay"}
                </span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* 4. DPDP Act 2023 & ABDM Privacy & Security Safeguards Modal */}
      {isPrivacyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-2xl w-full p-5 sm:p-8 shadow-2xl border-t sm:border border-slate-200 overflow-hidden relative max-h-[92vh] sm:max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3.5 border-b border-slate-100 shrink-0">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs shrink-0 ${
                  activeModalTab === "PRIVACY"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                }`}>
                  {activeModalTab === "PRIVACY" ? <ShieldCheck className="w-6 h-6" /> : <Scale className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-1.5 flex-wrap">
                    <span>{activeModalTab === "PRIVACY" ? "Clinical Security & Privacy" : "Clinical Terms & NMC Disclaimers"}</span>
                    <span className="text-[9px] sm:text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold border border-emerald-300">
                      {activeModalTab === "PRIVACY" ? "DPDP ACT 2023" : "CDSCO CLASS A"}
                    </span>
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500">
                    {activeModalTab === "PRIVACY"
                      ? "NHM & ABDM Health Data Management Policy Standard"
                      : "NMC Registered Medical Practitioner Liability Framework"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPrivacyModalOpen(false)}
                aria-label="Close privacy and legal terms modal"
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition shrink-0 min-h-[44px] min-w-[44px]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Segmented Control Tabs */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl mt-3 border border-slate-200 shrink-0 gap-1">
              <button
                onClick={() => setActiveModalTab("PRIVACY")}
                className={`flex-1 py-2 px-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 min-h-[44px] ${
                  activeModalTab === "PRIVACY"
                    ? "bg-white text-emerald-800 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate">1. DPDP Privacy</span>
              </button>
              <button
                onClick={() => setActiveModalTab("TERMS")}
                className={`flex-1 py-2 px-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 min-h-[44px] ${
                  activeModalTab === "TERMS"
                    ? "bg-white text-indigo-800 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Scale className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="truncate">2. Clinical Terms</span>
              </button>
            </div>

            {/* Modal Body: Bento Cards */}
            <div className="overflow-y-auto py-4 space-y-3 pr-1 text-xs">
              {activeModalTab === "PRIVACY" ? (
                <>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center space-x-2 text-slate-900 font-bold mb-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>1. Edge-Based De-Identification (Zero Cloud PII)</span>
                    </div>
                    <p className="text-slate-600 pl-6 leading-relaxed">
                      Direct personal identifiers (Patient Name, Phone, Aadhaar) are stripped on the client tablet before any LLM inference occurs. The cloud AI only analyzes clinical parameters (e.g. <em>Patient_M62, crushing chest pain, SpO2 89%</em>).
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center space-x-2 text-slate-900 font-bold mb-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>2. Explicit Consent & Emergency Casualty Exemption</span>
                    </div>
                    <p className="text-slate-600 pl-6 leading-relaxed">
                      Informed consent is logged at intake. For unconscious or trauma casualties, the system invokes <strong>Section 7(a) DPDP Exemption</strong> (medical emergency), logging an emergency audit trail counter-signed by the Medical Officer.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center space-x-2 text-slate-900 font-bold mb-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>3. Role-Based Access Control (ASHA Intake vs. Doctor Decision)</span>
                    </div>
                    <p className="text-slate-600 pl-6 leading-relaxed">
                      Frontline ASHA/ANM workers can only record intake. Only licensed Medical Officers with valid State/NMC registration numbers can counter-sign triage notes, issue referral slips, or discharge patients.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center space-x-2 text-slate-900 font-bold mb-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>4. Cryptographic Non-Repudiation & Audit Hashing</span>
                    </div>
                    <p className="text-slate-600 pl-6 leading-relaxed">
                      Every triage classification and doctor override generates a SHA-256 tamper-evident hash linked to the physician's credentials, guaranteeing complete legal traceability under NMC regulations.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center space-x-2 text-slate-900 font-bold mb-1">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>1. CDSCO SaMD Class A Classification (Assistive CDSS Only)</span>
                    </div>
                    <p className="text-slate-600 pl-6 leading-relaxed">
                      Saransh operates strictly as an Assistive Clinical Decision Support System (CDSS). It <strong>DOES NOT</strong> diagnose illness, prescribe medication, or replace independent clinical examination.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center space-x-2 text-slate-900 font-bold mb-1">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>2. NMC Medical Officer Primacy & Mandatory Counter-Signature</span>
                    </div>
                    <p className="text-slate-600 pl-6 leading-relaxed">
                      Under National Medical Commission regulations, 100% legal, diagnostic, and clinical accountability rests with the attending Medical Officer. No triage note or referral is legally valid without verified doctor credentials.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center space-x-2 text-slate-900 font-bold mb-1">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>3. Resuscitation Bay Priority Over Digital Intake</span>
                    </div>
                    <p className="text-slate-600 pl-6 leading-relaxed">
                      For acute life threats (shock, respiratory arrest, major trauma), digital intake is strictly secondary to immediate physical transfer to the resuscitation bay. Deterministic red lines trigger an emergency chime automatically.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center space-x-2 text-slate-900 font-bold mb-1">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>4. Frontline ASHA & ANM Operational Boundaries</span>
                    </div>
                    <p className="text-slate-600 pl-6 leading-relaxed">
                      Frontline staff are authorized to record vernacular voice complaints, capture non-invasive vitals, and assist anatomical touch mapping. Modifying triage lanes or discharging patients without physician oversight is strictly forbidden.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 shrink-0">
              <span className="flex items-center gap-1.5 font-medium text-center sm:text-left">
                <Lock className="w-3.5 h-3.5 text-teal-600 shrink-0" /> CDSCO Medical Device Rules 2017 &bull; NMC Guidelines
              </span>
              <button
                onClick={() => setIsPrivacyModalOpen(false)}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition shadow-xs text-xs min-h-[44px] flex items-center justify-center"
              >
                Close Safeguards
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
