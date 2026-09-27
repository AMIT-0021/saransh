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
  CheckCircle2
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

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-subtle transition-all">
      {/* 1. Non-Diagnostic Clinical Safety Strip */}
      <div className="bg-amber-50/90 border-b border-amber-200/70 px-4 py-1.5 text-xs text-amber-900 flex items-center justify-between font-medium">
        <div className="flex items-center space-x-2 truncate">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="truncate">
            <strong className="font-semibold text-amber-950 uppercase tracking-wide mr-1.5">
              {t.safetyNoticeTitle || "CLINICAL ADVISORY TOOL ONLY:"}
            </strong>
            {t.headerSafetyDisclaimer || "Clinical Advisory Tool Only. Final decisions rest with qualified healthcare professionals."}
          </span>
        </div>
        <div className="hidden lg:flex items-center space-x-2 shrink-0 text-[11px] text-amber-800">
          <span className="bg-white/80 border border-amber-300 text-amber-900 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs">
            {t.safetyBadge || "MAX(Rule, AI) Safety Floor"}
          </span>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3 flex-wrap lg:flex-nowrap">
        {/* Brand Logo & Subtitle */}
        <div className="flex items-center space-x-3 min-w-0 shrink">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-700 via-teal-600 to-teal-500 flex items-center justify-center shadow-md shadow-teal-700/20 text-white shrink-0">
            <Activity className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 whitespace-nowrap">
                {t.appTitle || "Saransh"}
              </h1>
              <span className="text-[10px] bg-teal-50 text-teal-800 px-2 py-0.5 rounded-md font-semibold tracking-wide border border-teal-200 hidden sm:inline-flex whitespace-nowrap">
                {t.edition || "National Healthcare Innovation Edition"}
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden xl:block truncate max-w-sm">
              {t.appSubtitle || "Multimodal Human-in-the-Loop Healthcare Triage Assistant"}
            </p>
          </div>
        </div>

        {/* Right Action Controls: Facility, Connectivity, Language Switcher, Reset */}
        <div className="flex items-center space-x-2 shrink-0 ml-auto justify-end flex-wrap sm:flex-nowrap gap-y-2">
          {/* Facility Scenario Switcher */}
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-xs">
            <Building2 className="w-3.5 h-3.5 text-teal-600 mr-1.5 shrink-0" />
            <select
              value={selectedFacility}
              onChange={(e) => onFacilityChange(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer pr-1 max-w-[150px] sm:max-w-[190px] truncate"
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
            className={`flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-xl border transition-all shadow-xs ${
              isOffline
                ? "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
                : "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
            }`}
          >
            {isOffline ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                <span>{t.offlineMode || "Offline Mode"}</span>
                {pendingSyncCount > 0 && (
                  <span className="bg-amber-500 text-white px-1.5 py-0.2 rounded-full text-[10px] font-bold">
                    {pendingSyncCount}
                  </span>
                )}
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">{t.onlineSync || "Online Sync"}</span>
              </>
            )}
          </button>

          {/* Sync button when offline queue has items */}
          {pendingSyncCount > 0 && (
            <button
              onClick={onSyncOffline}
              disabled={isSyncing}
              className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-2.5 py-1.5 rounded-xl flex items-center space-x-1 transition shadow-xs"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? "animate-spin" : ""}`} />
              <span>{t.syncBtn || "Sync"} ({pendingSyncCount})</span>
            </button>
          )}

          {/* Language Switcher Pill (Apple-style Segmented Control) */}
          <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200 shrink-0">
            <Globe className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-1" />
            {[
              { code: "English", label: "EN English" },
              { code: "Hindi", label: "हिन्दी Hindi" },
              { code: "Odia", label: "ଓଡ଼ିଆ Odia" },
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => onLanguageChange(lang.code)}
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
            className="flex items-center space-x-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-xl border border-slate-200 transition shadow-xs font-medium"
          >
            <RotateCcw className="w-3 h-3 text-slate-500" />
            <span className="hidden md:inline">{t.resetBtn || "Reset Cases"}</span>
          </button>

          {/* Privacy & DPDP Policy Modal Button */}
          <button
            onClick={() => setIsPrivacyModalOpen(true)}
            title="View India DPDP Act 2023 & ABDM Clinical Privacy Safeguards"
            className="flex items-center space-x-1.5 text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-2.5 py-1.5 rounded-xl border border-emerald-200 transition shadow-xs font-semibold"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">DPDP & ABDM Privacy</span>
          </button>
        </div>
      </div>

      {/* 3. Top-Level Segmented Navigation Bar (Clear Separation of Concerns) */}
      <div className="bg-slate-50/90 px-4 py-2 border-t border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex p-1 bg-slate-200/70 rounded-2xl border border-slate-200 shadow-inner">
            {/* Tab 1: Patient Intake Station */}
            <button
              type="button"
              onClick={() => onRoleChange("NURSE")}
              className={`flex items-center space-x-2.5 py-2.5 px-5 text-xs rounded-xl font-bold transition-all ${
                activeRole === "NURSE"
                  ? "bg-teal-600 text-white shadow-md shadow-teal-700/25"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <ClipboardList className="w-4 h-4 shrink-0" />
              <span>{t.tabIntake || "🩺 Patient Intake Station"}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                activeRole === "NURSE" ? "bg-teal-700/60 text-teal-100" : "bg-slate-300/60 text-slate-700"
              }`}>
                {t.frontlineNurseBadge || "Frontline Nurse / ASHA"}
              </span>
            </button>

            {/* Tab 2: Doctor Queue & Review Dashboard */}
            <button
              type="button"
              onClick={() => onRoleChange("DOCTOR")}
              className={`flex items-center space-x-2.5 py-2.5 px-5 text-xs rounded-xl font-bold transition-all ${
                activeRole === "DOCTOR"
                  ? "bg-teal-600 text-white shadow-md shadow-teal-700/25"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <Stethoscope className="w-4 h-4 shrink-0" />
              <span>{t.tabDoctorQueue || "🏥 Doctor Queue & Review Dashboard"}</span>
              <span className={`flex items-center space-x-1.5 text-[10px] px-2.5 py-0.5 rounded-full font-black ${
                activeRole === "DOCTOR"
                  ? "bg-white text-teal-900 shadow-xs"
                  : "bg-teal-100 text-teal-800"
              }`}>
                {redCount > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                )}
                <span>
                  {t.doctorQueueBadge || "Doctor Queue"} ({totalWaiting})
                </span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 overflow-hidden relative max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shadow-xs">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                    Clinical Security & Privacy Safeguards
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold border border-emerald-300">
                      DPDP ACT 2023 COMPLIANT
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    National Health Mission (NHM) & Ayushman Bharat Digital Mission (ABDM) HDMP Standard
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPrivacyModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: Bento Cards of the 4 Pillars */}
            <div className="overflow-y-auto py-4 space-y-3 pr-1 text-xs">
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
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
              <span className="flex items-center gap-1.5 font-medium">
                <Lock className="w-3.5 h-3.5 text-teal-600" /> AES-256 Encryption at Rest &bull; TLS 1.3 in Transit
              </span>
              <button
                onClick={() => setIsPrivacyModalOpen(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition shadow-xs text-xs"
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
