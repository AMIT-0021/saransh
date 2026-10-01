import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
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
  Sparkles,
  ChevronDown,
  ChevronRight
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
  pendingSyncCount = 0,
  onSyncOffline,
  onResetDemo,
  onOpenVoiceStudio,
  redCount = 0,
  yellowCount = 0,
  greenCount,
  totalWaiting = 0,
  isSyncing = false
}) {
  const t = TRANSLATIONS[selectedLanguage] || TRANSLATIONS.English;
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState("PRIVACY");
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const toolsMenuRef = useRef(null);

  // Derive greenCount if not explicitly passed
  const resolvedGreenCount =
    greenCount !== undefined
      ? greenCount
      : Math.max(0, totalWaiting - redCount - yellowCount);

  // Find active facility display label
  const currentFacilityObj =
    FACILITY_SCENARIOS.find((f) => f.id === selectedFacility) ||
    FACILITY_SCENARIOS[0];
  const currentFacilityLabel =
    t[currentFacilityObj.id.toLowerCase()] || currentFacilityObj.label;

  // Click-outside and Escape key detection for Clinical Tools dropdown & Modal
  useEffect(() => {
    function handleClickOutside(event) {
      if (toolsMenuRef.current && !toolsMenuRef.current.contains(event.target)) {
        setIsToolsOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsToolsOpen(false);
        setIsPrivacyModalOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    if (isToolsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isToolsOpen]);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-xs transition-all">
      {/* 1. Non-Diagnostic Clinical Safety Strip */}
      <div className="bg-amber-50/95 border-b border-amber-200/70 px-3 sm:px-4 py-1 text-xs text-amber-900 flex items-center justify-between font-medium">
        <div className="flex items-center space-x-2 truncate">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span className="truncate text-[11px] sm:text-xs">
            <strong className="font-bold text-amber-950 uppercase tracking-wide mr-1.5">
              {t.safetyNoticeTitle || "CLINICAL ADVISORY TOOL ONLY:"}
            </strong>
            {t.headerSafetyDisclaimer ||
              "Clinical Advisory Tool Only. Final decisions rest with qualified healthcare professionals."}
          </span>
        </div>
        <div className="hidden lg:flex items-center space-x-2 shrink-0 text-[11px] text-amber-800">
          <span className="bg-white/90 border border-amber-300 text-amber-900 px-2 py-0.5 rounded-full text-[10px] font-black shadow-2xs">
            {t.safetyBadge || "MAX(Rule, AI) Safety Floor"}
          </span>
        </div>
      </div>

      {/* 2. Main Tier 1 Emergency Navigation Bar */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-4 py-2 sm:py-2.5 w-full">
        <div className="flex items-center justify-between gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-teal-800 via-teal-600 to-teal-500 flex items-center justify-center shadow-md shadow-teal-700/20 ring-2 ring-teal-500/20 text-white shrink-0">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2 min-w-0">
                <h1 className="text-base sm:text-xl font-black tracking-tight text-slate-900 truncate">
                  {t.appTitle || "Saransh"}
                </h1>
                <span className="text-[9px] sm:text-[10px] bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-900 px-2 py-0.5 rounded-full font-bold tracking-wide border border-teal-200/90 shadow-2xs hidden md:inline-flex items-center gap-1 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {t.edition || "National Healthcare Innovation Edition"}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden xl:block truncate max-w-sm font-medium">
                {t.appSubtitle || "Multimodal Human-in-the-Loop Healthcare Triage Assistant"}
              </p>
            </div>
          </div>

          {/* Tier 1 Always-Visible Emergency Controls + Consolidated Tools Dropdown */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0 ml-auto justify-end">
            {/* Live Emergency Priority Counters (Always Visible) */}
            <div
              className="flex items-center bg-slate-100/90 border border-slate-200/90 rounded-xl p-0.5 sm:p-1 gap-1 shadow-2xs shrink-0"
              title="Real-Time Triage Acuity Distribution (RED: Immediate Bay, YELLOW: Urgent, GREEN: Routine)"
            >
              <span className="text-[10px] uppercase font-bold text-slate-500 px-1 hidden 2xl:inline">
                Triage:
              </span>
              <span
                className={`inline-flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-lg text-[11px] sm:text-xs font-black transition ${
                  redCount > 0
                    ? "bg-rose-600 text-white shadow-xs"
                    : "bg-white text-slate-700"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    redCount > 0 ? "bg-white animate-ping" : "bg-rose-500"
                  }`}
                ></span>
                <span>🔴 {redCount}</span>
                <span className="text-[9px] font-bold opacity-90 hidden sm:inline">
                  RED
                </span>
              </span>
              <span className="inline-flex items-center gap-1 bg-white text-slate-800 px-1.5 sm:px-2 py-1 rounded-lg text-[11px] sm:text-xs font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span>🟡 {yellowCount}</span>
                <span className="text-[9px] text-slate-500 font-bold hidden sm:inline">
                  YEL
                </span>
              </span>
              <span className="inline-flex items-center gap-1 bg-white text-slate-800 px-1.5 sm:px-2 py-1 rounded-lg text-[11px] sm:text-xs font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>🟢 {resolvedGreenCount}</span>
                <span className="text-[9px] text-slate-500 font-bold hidden sm:inline">
                  GRN
                </span>
              </span>
            </div>

            {/* Offline / Online Sync Pill (Always Visible) */}
            <button
              type="button"
              onClick={onToggleOffline}
              title={
                isOffline
                  ? "Offline Mode Active (Data stored locally in IndexedDB)"
                  : "Online Mode (Connected to Central Hospital Server)"
              }
              aria-label="Toggle Online/Offline Sync"
              className={`flex items-center space-x-1 sm:space-x-1.5 text-xs font-semibold px-2 sm:px-2.5 py-1.5 rounded-xl border transition-all shadow-xs min-h-[36px] sm:min-h-[38px] cursor-pointer ${
                isOffline
                  ? "bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100"
                  : "bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100"
              }`}
            >
              {isOffline ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                  <span className="font-bold text-[11px] sm:text-xs">Offline</span>
                  {pendingSyncCount > 0 && (
                    <span className="bg-amber-600 text-white px-1.5 py-0.2 rounded-full text-[9px] font-black">
                      {pendingSyncCount}
                    </span>
                  )}
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <Wifi className="w-3.5 h-3.5 text-emerald-600 hidden xs:inline" />
                  <span className="font-bold text-[11px] sm:text-xs">
                    {t.onlineSync || "Online"}
                  </span>
                </>
              )}
            </button>

            {/* Pending Sync Button (if queued records) */}
            {pendingSyncCount > 0 && (
              <button
                type="button"
                onClick={onSyncOffline}
                disabled={isSyncing}
                title={`Sync ${pendingSyncCount} offline records with central server`}
                aria-label={`Sync ${pendingSyncCount} records`}
                className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-2 sm:px-2.5 py-1.5 rounded-xl flex items-center space-x-1 transition shadow-xs min-h-[36px] sm:min-h-[38px] cursor-pointer"
              >
                <RefreshCw
                  className={`w-3 h-3 ${isSyncing ? "animate-spin" : ""}`}
                />
                <span className="text-[11px] sm:text-xs font-bold">
                  {t.syncBtn || "Sync"} ({pendingSyncCount})
                </span>
              </button>
            )}

            {/* Language Switcher Pill (Always Visible) */}
            <div className="flex items-center bg-slate-100/90 rounded-xl p-0.5 sm:p-1 border border-slate-200 shrink-0 min-h-[36px] sm:min-h-[38px]">
              <Globe className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-1 hidden sm:block" />
              {[
                { code: "English", short: "EN", label: "EN" },
                { code: "Hindi", short: "हिन्दी", label: "हिन्दी" },
                { code: "Odia", short: "ଓଡ଼ିଆ", label: "ଓଡ଼ିଆ" }
              ].map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => onLanguageChange(lang.code)}
                  aria-label={`Switch application language to ${lang.code}`}
                  className={`text-[11px] sm:text-xs px-2 sm:px-2.5 py-1 rounded-lg transition font-medium cursor-pointer ${
                    selectedLanguage === lang.code
                      ? "bg-white text-teal-900 shadow-xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {/* Consolidated "⚡ Clinical Tools ▾" Dropdown Button */}
            <div className="relative shrink-0" ref={toolsMenuRef}>
              <button
                type="button"
                onClick={() => setIsToolsOpen(!isToolsOpen)}
                aria-expanded={isToolsOpen}
                aria-haspopup="true"
                aria-label="Toggle Clinical Tools & System Configuration Menu"
                className={`flex items-center space-x-1.5 text-xs px-2.5 sm:px-3 py-1.5 rounded-xl border transition-all shadow-xs font-bold min-h-[36px] sm:min-h-[38px] cursor-pointer ${
                  isToolsOpen
                    ? "bg-teal-700 text-white border-teal-800 shadow-md ring-2 ring-teal-500/20"
                    : "bg-gradient-to-r from-teal-50 to-emerald-50 hover:from-teal-100 hover:to-emerald-100 text-teal-950 border-teal-300"
                }`}
              >
                <Sparkles
                  className={`w-3.5 h-3.5 ${
                    isToolsOpen ? "text-teal-200" : "text-teal-600 animate-pulse"
                  }`}
                />
                <span className="hidden xs:inline">⚡ Clinical Tools</span>
                <span className="xs:hidden">⚡ Tools</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isToolsOpen ? "rotate-180 text-teal-200" : "text-teal-700"
                  }`}
                />
              </button>

              {/* Consolidated Dropdown Menu Panel */}
              {isToolsOpen && (
                <div
                  role="menu"
                  aria-orientation="vertical"
                  className="absolute right-0 top-full mt-2 w-[330px] sm:w-[380px] max-w-[calc(100vw-1.5rem)] bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-slate-200/90 p-3 sm:p-3.5 z-50 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150 text-slate-900"
                >
                  {/* Dropdown Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div>
                      <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">
                        Clinical Tools & System
                      </span>
                      <p className="text-[11px] text-slate-500">
                        Operational facility controls & compliance
                      </p>
                    </div>
                    <span className="text-[10px] bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded-full font-bold">
                      v2.4 Ready
                    </span>
                  </div>

                  {/* 1. Health Facility Switcher (Item 2) */}
                  <div className="p-2.5 rounded-xl bg-slate-50/90 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
                        <Building2 className="w-3.5 h-3.5 text-teal-600" />
                        <span>Active Healthcare Facility:</span>
                      </div>
                      <span className="text-[10px] text-teal-700 font-mono font-bold bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                        {currentFacilityObj.id.replace(/_/g, " ")}
                      </span>
                    </div>
                    <select
                      value={selectedFacility}
                      onChange={(e) => onFacilityChange(e.target.value)}
                      className="w-full bg-white text-xs font-semibold text-slate-800 border border-slate-200 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 cursor-pointer shadow-2xs"
                    >
                      {FACILITY_SCENARIOS.map((fac) => (
                        <option key={fac.id} value={fac.id} className="text-slate-900">
                          {t[fac.id.toLowerCase()] || fac.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 2. Interactive Clinical Action Items */}
                  <div className="space-y-1.5">
                    {/* Item 1: Sovereign Voice Studio */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsToolsOpen(false);
                        if (onOpenVoiceStudio) onOpenVoiceStudio();
                      }}
                      className="w-full text-left p-2.5 rounded-xl bg-gradient-to-r from-teal-50/80 to-emerald-50/60 hover:from-teal-100 hover:to-emerald-100 border border-teal-200/90 transition flex items-center justify-between group cursor-pointer shadow-2xs"
                    >
                      <div className="flex items-start space-x-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-1.5 flex-wrap">
                            <span className="text-xs font-bold text-slate-900 group-hover:text-teal-950">
                              Sovereign Voice Studio
                            </span>
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-1.5 py-0.2 rounded font-extrabold whitespace-nowrap">
                              Zero-Recording AI
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-tight mt-0.5 truncate">
                            Acoustic neural modulation without voice audio retention
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-teal-600 group-hover:translate-x-0.5 transition-transform shrink-0 ml-1.5" />
                    </button>

                    {/* Item 3: Reset Demo Cases */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsToolsOpen(false);
                        if (onResetDemo) onResetDemo();
                      }}
                      className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 transition flex items-center justify-between group cursor-pointer shadow-2xs"
                    >
                      <div className="flex items-start space-x-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200">
                          <RotateCcw className="w-4 h-4 text-slate-600 group-hover:-rotate-45 transition-transform" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-slate-900 block">
                            {t.resetBtn || "Reset Demo Cases"}
                          </span>
                          <p className="text-[11px] text-slate-500 leading-tight mt-0.5 truncate">
                            Reload standard multi-acuity synthetic patient cases
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-600 group-hover:text-slate-900 border border-slate-200 bg-slate-50 px-2 py-1 rounded-md shrink-0 ml-1.5">
                        Reset
                      </span>
                    </button>

                    {/* Item 4: DPDP Privacy & Clinical Terms */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsToolsOpen(false);
                        setIsPrivacyModalOpen(true);
                      }}
                      className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 transition flex items-center justify-between group cursor-pointer shadow-2xs"
                    >
                      <div className="flex items-start space-x-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-1.5 flex-wrap">
                            <span className="text-xs font-bold text-slate-900 block">
                              DPDP Privacy & Clinical Terms
                            </span>
                            <span className="text-[9px] bg-slate-100 text-slate-700 border border-slate-300 px-1.5 py-0.2 rounded font-bold whitespace-nowrap">
                              CDSCO & NMC
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-tight mt-0.5 truncate">
                            Consent protocol, edge de-identification & liability terms
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0 ml-1.5" />
                    </button>
                  </div>

                  {/* Item 5: ABDM & FHIR R4 Bundle Status Indicator */}
                  <div className="p-2.5 rounded-xl bg-gradient-to-r from-slate-50 to-teal-50/40 border border-slate-200/90 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-800 flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                        <span>ABDM & FHIR R4 Architecture:</span>
                      </span>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        ACTIVE
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-snug">
                      Milestone M1/M2/M3 compliant • FHIR R4 DiagnosticReport and Encounter Profiles active
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Top-Level Role Navigation Bar (Mobile Thumb-Friendly & Sticky) */}
      <div className="bg-slate-50/95 backdrop-blur-md px-3 sm:px-4 py-2 border-t border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Role Switcher Container (Always Visible) */}
          <div className="w-full sm:w-auto grid grid-cols-2 sm:inline-flex p-1 bg-slate-200/70 backdrop-blur-md rounded-2xl border border-slate-300/80 shadow-inner gap-1">
            {/* Tab 1: Patient Intake Station */}
            <button
              type="button"
              onClick={() => onRoleChange("NURSE")}
              className={`flex items-center justify-center space-x-2 py-2 px-3 sm:px-5 text-xs rounded-xl font-extrabold transition-all duration-300 min-h-[40px] cursor-pointer ${
                activeRole === "NURSE"
                  ? "bg-gradient-to-r from-teal-700 via-teal-600 to-teal-600 text-white shadow-lg shadow-teal-700/30 ring-1 ring-white/20"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/70"
              }`}
            >
              <ClipboardList className="w-4 h-4 shrink-0" />
              <span className="truncate">{t.tabIntake || "🩺 Patient Intake"}</span>
              <span
                className={`hidden md:inline-flex text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  activeRole === "NURSE"
                    ? "bg-teal-800/80 text-teal-100"
                    : "bg-slate-300/80 text-slate-700"
                }`}
              >
                {t.frontlineNurseBadge || "ASHA"}
              </span>
            </button>

            {/* Tab 2: Doctor Queue & Review Dashboard */}
            <button
              type="button"
              onClick={() => onRoleChange("DOCTOR")}
              className={`flex items-center justify-center space-x-2 py-2 px-3 sm:px-5 text-xs rounded-xl font-extrabold transition-all duration-300 min-h-[40px] cursor-pointer ${
                activeRole === "DOCTOR"
                  ? "bg-gradient-to-r from-teal-700 via-teal-600 to-teal-600 text-white shadow-lg shadow-teal-700/30 ring-1 ring-white/20"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/70"
              }`}
            >
              <Stethoscope className="w-4 h-4 shrink-0" />
              <span className="truncate">{t.tabDoctorQueue || "🏥 Doctor Queue"}</span>
              <span
                className={`inline-flex items-center space-x-1.5 text-[10px] px-2 py-0.5 rounded-full font-black ${
                  activeRole === "DOCTOR"
                    ? "bg-white text-teal-900 shadow-xs"
                    : "bg-teal-100/90 text-teal-900"
                }`}
              >
                {redCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                )}
                <span>({totalWaiting})</span>
              </span>
            </button>
          </div>

          {/* Right Status / Facility Strip */}
          <div className="flex items-center space-x-2 text-xs text-slate-500 justify-between sm:justify-end">
            <span className="flex items-center space-x-1.5 bg-white px-3 py-1 rounded-full border border-slate-200/90 shadow-2xs truncate">
              <Building2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span className="font-bold text-slate-800 truncate max-w-[150px] sm:max-w-[200px]">
                {currentFacilityLabel}
              </span>
            </span>

            <span className="flex items-center space-x-1.5 bg-white px-3 py-1 rounded-full border border-slate-200/90 shadow-2xs shrink-0">
              <span className="w-2 h-2 rounded-full bg-teal-500"></span>
              <span>
                {t.activeTokens || "Tokens"}:{" "}
                <strong className="text-slate-900 font-extrabold">
                  {totalWaiting}
                </strong>
              </span>
              {redCount > 0 && (
                <span className="bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.5 rounded-full text-[9px] font-bold">
                  {redCount} Emergency
                </span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* 4. DPDP Act 2023 & ABDM Privacy & Security Safeguards Modal (Portaled to document.body) */}
      {typeof document !== "undefined" &&
        isPrivacyModalOpen &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="clinical-safeguards-title"
            className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/75 backdrop-blur-md p-3 sm:p-6 flex min-h-screen items-center justify-center animate-in fade-in duration-200"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsPrivacyModalOpen(false);
            }}
          >
            <div
              className="relative bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[85vh] sm:max-h-[88vh] animate-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header (Pinned Top, shrink-0) */}
              <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-slate-100 bg-white shrink-0">
                <div className="flex items-center space-x-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs shrink-0 ${
                      activeModalTab === "PRIVACY"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                    }`}
                  >
                    {activeModalTab === "PRIVACY" ? (
                      <ShieldCheck className="w-5 h-5" />
                    ) : (
                      <Scale className="w-5 h-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3
                        id="clinical-safeguards-title"
                        className="text-base sm:text-lg font-black text-slate-900 tracking-tight"
                      >
                        {activeModalTab === "PRIVACY"
                          ? "Clinical Security & Privacy"
                          : "Clinical Terms & Disclaimers"}
                      </h3>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold border border-emerald-300">
                        {activeModalTab === "PRIVACY"
                          ? "DPDP ACT 2023"
                          : "CDSCO CLASS A"}
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">
                      {activeModalTab === "PRIVACY"
                        ? "NHM & ABDM Health Data Management Policy Standard"
                        : "NMC Registered Medical Practitioner Liability Framework"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPrivacyModalOpen(false)}
                  aria-label="Close privacy and legal terms modal"
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition shrink-0 ml-2 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Segmented Control Tabs (Pinned, shrink-0) */}
              <div className="px-5 sm:px-7 pt-3 pb-2.5 bg-slate-50/70 border-b border-slate-100 shrink-0">
                <div className="flex items-center bg-slate-200/80 p-1 rounded-xl border border-slate-300/70 gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveModalTab("PRIVACY")}
                    className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeModalTab === "PRIVACY"
                        ? "bg-white text-emerald-900 shadow-xs font-black"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>1. DPDP Privacy</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveModalTab("TERMS")}
                    className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeModalTab === "TERMS"
                        ? "bg-white text-indigo-900 shadow-xs font-black"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Scale className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>2. Clinical Terms</span>
                  </button>
                </div>
              </div>

              {/* Modal Body: Bento Cards (Scrollable flex-1) */}
              <div className="flex-1 overflow-y-auto px-5 sm:px-7 py-4 space-y-3 text-xs">
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

              {/* Modal Footer (Pinned Bottom, shrink-0) */}
              <div className="px-5 sm:px-7 py-3 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 shrink-0">
                <span className="flex items-center gap-1.5 font-medium text-center sm:text-left">
                  <Lock className="w-3.5 h-3.5 text-teal-600 shrink-0" /> CDSCO Medical Device Rules 2017 &bull; NMC Guidelines
                </span>
                <button
                  type="button"
                  onClick={() => setIsPrivacyModalOpen(false)}
                  className="w-full sm:w-auto px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition shadow-xs text-xs min-h-[38px] flex items-center justify-center cursor-pointer"
                >
                  Close Safeguards
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
}
