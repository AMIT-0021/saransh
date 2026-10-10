import React, { useState } from "react";
import {
  Bed,
  Users,
  Stethoscope,
  Activity,
  Clock,
  Search,
  CheckCircle2,
  ChevronRight,
  FileText,
  RefreshCw,
  X
} from "lucide-react";
import { TRANSLATIONS } from "../data/translations";

export default function DoctorDashboard({
  queueData,
  onSelectPatientForReview,
  onOpenReferralSlip,
  selectedLanguage = "English",
  onRefreshQueue,
  isRefreshing = false,
  authenticatedDoctor = null,
  onDoctorLogout = null
}) {
  const t = TRANSLATIONS[selectedLanguage] || TRANSLATIONS.English;
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModal, setActiveModal] = useState(null); // null | "BAYS" | "STAFF"
  const [activeMobileLane, setActiveMobileLane] = useState("RED"); // "RED" | "YELLOW" | "GREEN" for mobile tab bar

  const activeQueue = queueData?.active_queue || [];
  const facilityStats = queueData?.facility_stats || {
    emergency_beds_available: 4,
    emergency_beds_total: 5,
    general_beds_available: 24,
    general_beds_total: 24,
    doctors_on_duty: 5,
    nurses_available: 8,
    facility_name: "PHC Jatni",
    facility_nin: "OD-KHD-PHC-102",
    district: "Khordha",
    oxygen_level_percent: 98,
    oxygen_status: "42 L/min Manifold Pressure Normal",
    ambulance_status: "OD-02-AX-1081 (ALS Standby at Jatni Base)",
    occupancy_rate_percent: 3,
    last_updated: "Just now",
    bay_allocations: [],
    active_doctors: ["Dr. S. Mohanty, MBBS, MD (MO In-Charge)", "Dr. R. Mishra, MBBS (Emergency MO)"],
    active_nurses: ["Sister Manorama Nayak (Staff Nurse)", "ANM Pravati Das (Emergency Triage)", "ASHA Sunita Swain", "ANM K. Behera"]
  };

  // Filter queue items
  const filteredQueue = activeQueue.filter((item) => {
    if (priorityFilter !== "ALL" && item.priority !== priorityFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchToken = (item.token_number || "").toLowerCase().includes(q);
      const matchName = (item.name_or_alias || "").toLowerCase().includes(q);
      const matchComplaint = (item.chief_complaint || "").toLowerCase().includes(q);
      if (!matchToken && !matchName && !matchComplaint) return false;
    }
    return true;
  });

  const redItems = filteredQueue.filter((i) => i.priority === "RED");
  const yellowItems = filteredQueue.filter((i) => i.priority === "YELLOW");
  const greenItems = filteredQueue.filter((i) => i.priority === "GREEN");

  const totalEmergency = facilityStats.emergency_beds_total || 5;
  const availableEmergency = facilityStats.emergency_beds_available ?? 4;
  const occupiedEmergency = Math.max(0, totalEmergency - availableEmergency);
  const emergencyOccupancyPct = totalEmergency > 0 ? Math.round((occupiedEmergency / totalEmergency) * 100) : 0;

  const totalGeneral = facilityStats.general_beds_total || 24;
  const availableGeneral = facilityStats.general_beds_available ?? 24;
  const occupiedGeneral = Math.max(0, totalGeneral - availableGeneral);
  const generalOccupancyPct = totalGeneral > 0 ? Math.round((occupiedGeneral / totalGeneral) * 100) : 0;

  return (
    <div className="space-y-4 sm:space-y-6 min-w-0 max-w-full">
      {/* 0. Authenticated Clinician HPR Banner (Clean White Aesthetic) */}
      {authenticatedDoctor && (
        <div className="bg-white/95 backdrop-blur-xl text-slate-800 p-3.5 sm:p-4 rounded-3xl border border-slate-200/90 shadow-sm shadow-slate-900/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center space-x-3.5 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-100 border border-teal-200 p-0.5 shadow-2xs shrink-0 flex items-center justify-center text-teal-700">
              <Stethoscope className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2 flex-wrap">
                <span className="font-black text-sm text-slate-900 tracking-tight truncate">
                  {authenticatedDoctor.name}
                </span>
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center space-x-1 shrink-0 shadow-2xs">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 inline" />
                  <span>HPR LEVEL-2 VERIFIED</span>
                </span>
              </div>
              <p className="text-xs text-slate-600 truncate mt-0.5 font-medium">
                {authenticatedDoctor.degrees} • {authenticatedDoctor.designation} • HPR:{" "}
                <span className="font-mono text-teal-800 font-bold bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/80">
                  {authenticatedDoctor.hpr_id}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
            <span className="text-[10px] text-slate-500 font-mono hidden md:inline bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200">
              Session: <strong className="text-slate-700">{authenticatedDoctor.verified_at || "Active"}</strong>
            </span>
            {onDoctorLogout && (
              <button
                type="button"
                onClick={onDoctorLogout}
                className="px-3 py-1.5 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 rounded-xl text-xs font-bold transition border border-slate-200 hover:border-rose-200 cursor-pointer shadow-2xs"
                title="Sign Out of Doctor Session & Switch to Nurse Station"
              >
                Sign Out ➔
              </button>
            )}
          </div>
        </div>
      )}

      {/* 1. Hospital Resource & Capacity Bar (Apple Health Style Live Telemetry) */}
      <div className="card-premium bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/90 p-4 sm:p-6 shadow-sm shadow-slate-900/5 transition-all min-w-0 max-w-full overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-100 pb-3 sm:pb-4 min-w-0">
          <div className="flex items-center space-x-3.5 min-w-0">
            <div className="p-2 sm:p-3 rounded-2xl bg-gradient-to-tr from-teal-700 to-teal-500 text-white relative shadow-md shadow-teal-700/25 shrink-0">
              <Activity className="w-5 h-5 stroke-[2.5]" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400 border border-white"></span>
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <h3 className="font-black text-xs sm:text-sm text-slate-900 uppercase tracking-wider truncate">
                  {t.telemetryTitle || "HOSPITAL TELEMETRY & CAPACITY"}
                </h3>
                <span className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-900 text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full flex items-center space-x-1 border border-emerald-300 shadow-2xs shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  <span>LIVE SURGE MONITOR</span>
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 truncate font-medium">
                {facilityStats.facility_name || "PHC Jatni"} ({facilityStats.facility_nin || "OD-KHD-PHC-102"}) • Sync: <strong className="font-mono text-slate-800">{facilityStats.last_updated || "Just now"}</strong>
              </p>
            </div>
          </div>

          <div className="w-full sm:w-auto flex flex-wrap sm:flex-nowrap items-center gap-2">
            <button
              onClick={onRefreshQueue}
              className="flex-1 sm:flex-none px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-1.5 transition border border-slate-200 cursor-pointer shadow-2xs hover:shadow-xs min-h-[38px] sm:min-h-[40px]"
              title="Force Real-Time Telemetry Refresh"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-teal-700 shrink-0 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>{isRefreshing ? "Syncing..." : "Sync Live Data"}</span>
            </button>
            <button
              onClick={() => setActiveModal("BAYS")}
              className="flex-1 sm:flex-none px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-1.5 transition cursor-pointer shadow-2xs hover:shadow-xs min-h-[38px] sm:min-h-[40px]"
            >
              <Bed className="w-3.5 h-3.5 shrink-0" />
              <span>View Bay Roster</span>
            </button>
          </div>
        </div>

        {/* The 4 Real-Time Interactive Capacity Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs w-full pt-4">
          {/* Emergency Bays */}
          <button
            type="button"
            onClick={() => setActiveModal("BAYS")}
            className="bg-slate-50 hover:bg-rose-50/40 p-3.5 rounded-2xl border border-slate-200 hover:border-rose-300 flex flex-col justify-between text-left transition shadow-xs cursor-pointer group"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 group-hover:scale-105 transition-transform">
                  <Bed className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">{t.emergencyBays || "Emergency Bays"}</span>
                  <strong className="text-slate-900 text-sm font-black">
                    {availableEmergency} / {totalEmergency} {t.available || "Available"}
                  </strong>
                </div>
              </div>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                availableEmergency <= 1 ? "bg-rose-200 text-rose-900 animate-pulse" : "bg-emerald-100 text-emerald-800"
              }`}>
                {availableEmergency <= 1 ? "SURGE" : "READY"}
              </span>
            </div>

            <div className="mt-2.5 w-full">
              <div className="flex justify-between text-[9px] text-slate-500 mb-1 font-semibold">
                <span>Real-Time Bay Load</span>
                <span className="font-bold text-slate-700">{occupiedEmergency} Occupied ({emergencyOccupancyPct}%)</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    emergencyOccupancyPct > 75 ? "bg-rose-600" : emergencyOccupancyPct > 40 ? "bg-amber-500" : "bg-teal-600"
                  }`}
                  style={{ width: `${Math.max(5, emergencyOccupancyPct)}%` }}
                />
              </div>
            </div>
          </button>

          {/* General Beds */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex flex-col justify-between text-left shadow-xs">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
                  <Bed className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">{t.generalBeds || "General Beds"}</span>
                  <strong className="text-slate-900 text-sm font-black">
                    {availableGeneral} / {totalGeneral}
                  </strong>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                WARD
              </span>
            </div>

            <div className="mt-2.5 w-full">
              <div className="flex justify-between text-[9px] text-slate-500 mb-1 font-semibold">
                <span>Inpatient Ward</span>
                <span className="font-bold text-slate-700">{occupiedGeneral} in care ({generalOccupancyPct}%)</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(4, generalOccupancyPct)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Doctors On Duty */}
          <button
            type="button"
            onClick={() => setActiveModal("STAFF")}
            className="bg-slate-50 hover:bg-teal-50/40 p-3.5 rounded-2xl border border-slate-200 hover:border-teal-300 flex flex-col justify-between text-left transition shadow-xs cursor-pointer group"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 group-hover:scale-105 transition-transform">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">{t.doctorsActive || "Doctors Active"}</span>
                  <strong className="text-slate-900 text-sm font-black">
                    {facilityStats.doctors_on_duty} {t.onDuty || "On Duty"}
                  </strong>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-100 text-teal-800">
                ROSTER
              </span>
            </div>

            <div className="mt-2.5 text-[10px] text-teal-900 font-semibold flex items-center space-x-1 truncate">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span className="truncate">MO In-Charge & Casualty Lead Active</span>
            </div>
          </button>

          {/* Nurses Available */}
          <button
            type="button"
            onClick={() => setActiveModal("STAFF")}
            className="bg-slate-50 hover:bg-purple-50/40 p-3.5 rounded-2xl border border-slate-200 hover:border-purple-300 flex flex-col justify-between text-left transition shadow-xs cursor-pointer group"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-200 group-hover:scale-105 transition-transform">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">{t.nursesActive || "Nurses Available"}</span>
                  <strong className="text-slate-900 text-sm font-black">
                    {facilityStats.nurses_available} {t.available || "Available"}
                  </strong>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800">
                SHIFT
              </span>
            </div>

            <div className="mt-2.5 text-[10px] text-purple-900 font-semibold flex items-center space-x-1 truncate">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              <span className="truncate">Staff Nurses & Triage ANM on Floor</span>
            </div>
          </button>
        </div>

        {/* 2. Critical Infrastructure Live Telemetry Sub-Bar */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-slate-600">
          {/* Medical Oxygen */}
          <div className="flex items-center space-x-2.5 bg-emerald-50/70 border border-emerald-200/80 px-3 py-2 rounded-xl shadow-2xs">
            <span className="text-lg">🫁</span>
            <div className="truncate">
              <span className="text-[10px] text-emerald-800 font-bold uppercase block tracking-wider">Medical O₂ Supply Pressure</span>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-black text-slate-900">{facilityStats.oxygen_level_percent || 98}%</span>
                <span className="text-[10px] text-slate-600 font-medium truncate">({facilityStats.oxygen_status || "42 L/min Manifold Pressure Normal"})</span>
              </div>
            </div>
          </div>

          {/* 108 Emergency Ambulance */}
          <div className="flex items-center space-x-2.5 bg-amber-50/70 border border-amber-200/80 px-3 py-2 rounded-xl shadow-2xs">
            <span className="text-lg">🚑</span>
            <div className="truncate">
              <span className="text-[10px] text-amber-800 font-bold uppercase block tracking-wider">108 Emergency Ambulance</span>
              <span className="text-xs font-black text-slate-900 block truncate">{facilityStats.ambulance_status || "OD-02-AX-1081 (ALS Standby at Jatni Base)"}</span>
            </div>
          </div>

          {/* Overall Facility Load */}
          <div className="flex items-center space-x-2.5 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl shadow-2xs">
            <span className="text-lg">📊</span>
            <div className="truncate flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Overall Facility Load</span>
                <span className="text-xs font-black text-slate-900">{facilityStats.occupancy_rate_percent || 3}%</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-teal-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(3, facilityStats.occupancy_rate_percent || 3)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white border border-slate-200/90 p-4 rounded-2xl shadow-sm">
        <div className="flex items-center space-x-2.5 bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200 w-full sm:w-80 shadow-xs min-h-[44px]">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder={t.searchPlaceholder || "Search by token, patient name, complaint..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none w-full font-medium"
          />
        </div>

        {/* Priority Filter Tabs (Desktop lg:flex) */}
        <div className="hidden lg:flex items-center space-x-1.5 text-xs">
          {[
            { id: "ALL", label: `${t.allQueue || "All"} (${activeQueue.length})` },
            { id: "RED", label: `${t.emergencyLabel} (${queueData?.red_count || 0})` },
            { id: "YELLOW", label: `${t.urgentLabel} (${queueData?.yellow_count || 0})` },
            { id: "GREEN", label: `${t.routineLabel} (${queueData?.green_count || 0})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setPriorityFilter(tab.id)}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-xl font-semibold transition cursor-pointer ${
                priorityFilter === tab.id
                  ? "bg-teal-600 text-white shadow-xs"
                  : "bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Segmented Lane Tab Bar (< lg:) */}
      <div className="flex lg:hidden items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200 gap-1.5 min-h-[48px]">
        <button
          type="button"
          onClick={() => {
            setActiveMobileLane("RED");
            setPriorityFilter("ALL");
          }}
          className={`flex-1 min-h-[42px] px-2 py-2 rounded-xl font-black text-xs flex items-center justify-center space-x-1.5 transition cursor-pointer ${
            activeMobileLane === "RED"
              ? "bg-rose-600 text-white shadow-md shadow-rose-950/20"
              : "text-slate-700 hover:text-rose-700 hover:bg-white/70"
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shrink-0"></span>
          <span className="truncate">🔴 Emergency ({redItems.length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveMobileLane("YELLOW");
            setPriorityFilter("ALL");
          }}
          className={`flex-1 min-h-[42px] px-2 py-2 rounded-xl font-black text-xs flex items-center justify-center space-x-1.5 transition cursor-pointer ${
            activeMobileLane === "YELLOW"
              ? "bg-amber-500 text-white shadow-md shadow-amber-950/20"
              : "text-slate-700 hover:text-amber-700 hover:bg-white/70"
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-amber-300 shrink-0"></span>
          <span className="truncate">🟠 Urgent ({yellowItems.length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveMobileLane("GREEN");
            setPriorityFilter("ALL");
          }}
          className={`flex-1 min-h-[42px] px-2 py-2 rounded-xl font-black text-xs flex items-center justify-center space-x-1.5 transition cursor-pointer ${
            activeMobileLane === "GREEN"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/20"
              : "text-slate-700 hover:text-emerald-700 hover:bg-white/70"
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 shrink-0"></span>
          <span className="truncate">🟢 Routine ({greenItems.length})</span>
        </button>
      </div>

      {/* 3. Sleek 3-Column Clinical Queue Layout (Tri-lane on Desktop lg:, Single Lane Tab on Mobile < lg:) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: RED EMERGENCY QUEUE */}
        {(priorityFilter === "ALL" || priorityFilter === "RED") && (
          <div className={`${activeMobileLane === "RED" ? "block" : "hidden"} lg:block bg-rose-950/[0.03] border border-rose-300/80 rounded-3xl p-4 space-y-4 shadow-sm relative overflow-hidden ring-1 ring-rose-400/20`}>
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center justify-between shadow-xs emergency-pulse">
              <div className="flex items-center space-x-2.5">
                <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping"></span>
                <div>
                  <h4 className="font-extrabold text-sm text-rose-950 uppercase tracking-wide">
                    {t.emergencyQueueTitle}
                  </h4>
                  <span className="text-[10px] text-rose-800 font-bold block">{t.immediateTarget}</span>
                </div>
              </div>
              <span className="bg-rose-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-xs flex items-center space-x-1">
                <span>{redItems.length}</span>
                <span className="text-[10px] font-semibold opacity-90">P1</span>
              </span>
            </div>

            {redItems.length === 0 ? (
              <div className="p-6 rounded-2xl bg-white border border-dashed border-rose-200 text-center text-xs text-rose-400">
                No active Emergency (RED) patients currently waiting.
              </div>
            ) : (
              <div className="space-y-3">
                {redItems.map((item) => (
                  <QueueCard
                    key={item.visit_id}
                    item={item}
                    t={t}
                    onReview={() => onSelectPatientForReview(item.visit_id)}
                    onOpenReferralSlip={onOpenReferralSlip}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Column 2: YELLOW URGENT QUEUE */}
        {(priorityFilter === "ALL" || priorityFilter === "YELLOW") && (
          <div className={`${activeMobileLane === "YELLOW" ? "block" : "hidden"} lg:block bg-amber-950/[0.02] border border-amber-200/80 rounded-3xl p-4 space-y-4 shadow-sm relative overflow-hidden`}>
            <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 flex items-center justify-between shadow-xs">
              <div className="flex items-center space-x-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <div>
                  <h4 className="font-extrabold text-sm text-amber-950 uppercase tracking-wide">
                    {t.urgentQueueTitle}
                  </h4>
                  <span className="text-[10px] text-amber-800 font-bold block">{t.urgentTarget}</span>
                </div>
              </div>
              <span className="bg-amber-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-xs flex items-center space-x-1">
                <span>{yellowItems.length}</span>
                <span className="text-[10px] font-semibold opacity-90">P2</span>
              </span>
            </div>

            {yellowItems.length === 0 ? (
              <div className="p-6 rounded-2xl bg-white border border-dashed border-amber-200 text-center text-xs text-amber-400">
                No active Urgent (YELLOW) patients currently waiting.
              </div>
            ) : (
              <div className="space-y-3">
                {yellowItems.map((item) => (
                  <QueueCard
                    key={item.visit_id}
                    item={item}
                    t={t}
                    onReview={() => onSelectPatientForReview(item.visit_id)}
                    onOpenReferralSlip={onOpenReferralSlip}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Column 3: GREEN ROUTINE QUEUE */}
        {(priorityFilter === "ALL" || priorityFilter === "GREEN") && (
          <div className={`${activeMobileLane === "GREEN" ? "block" : "hidden"} lg:block bg-emerald-950/[0.02] border border-emerald-200/80 rounded-3xl p-4 space-y-4 shadow-sm relative overflow-hidden`}>
            <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between shadow-xs">
              <div className="flex items-center space-x-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <div>
                  <h4 className="font-extrabold text-sm text-emerald-950 uppercase tracking-wide">
                    {t.routineQueueTitle}
                  </h4>
                  <span className="text-[10px] text-emerald-800 font-bold block">{t.routineTarget}</span>
                </div>
              </div>
              <span className="bg-emerald-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-xs flex items-center space-x-1">
                <span>{greenItems.length}</span>
                <span className="text-[10px] font-semibold opacity-90">P3</span>
              </span>
            </div>

            {greenItems.length === 0 ? (
              <div className="p-6 rounded-2xl bg-white border border-dashed border-emerald-200 text-center text-xs text-emerald-400">
                No active Routine (GREEN) patients in queue.
              </div>
            ) : (
              <div className="space-y-3">
                {greenItems.map((item) => (
                  <QueueCard
                    key={item.visit_id}
                    item={item}
                    t={t}
                    onReview={() => onSelectPatientForReview(item.visit_id)}
                    onOpenReferralSlip={onOpenReferralSlip}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* LIVE EMERGENCY RESUSCITATION BAY MODAL */}
      {activeModal === "BAYS" && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full border border-slate-300 overflow-hidden text-slate-800">
            <div className="bg-rose-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-rose-800 text-white shadow-xs">
                  <Bed className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm uppercase tracking-wide">
                    Live Emergency Resuscitation Bay Allocation
                  </h3>
                  <p className="text-xs text-rose-200">
                    {facilityStats.facility_name} ({facilityStats.facility_nin}) • Real-time patient bed assignment
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                aria-label="Close emergency resuscitation bay modal"
                className="p-1.5 rounded-xl hover:bg-rose-800 text-white/80 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="flex items-center justify-between bg-slate-50 border border-slate-200 p-3 rounded-2xl text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Capacity Status</span>
                  <strong className="text-slate-900 text-sm font-black">
                    {availableEmergency} of {totalEmergency} Resuscitation Bays Available
                  </strong>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase ${
                  availableEmergency <= 1 ? "bg-rose-100 text-rose-800 animate-pulse" : "bg-emerald-100 text-emerald-800"
                }`}>
                  {availableEmergency <= 1 ? "⚠️ High Surge Capacity" : "🟢 Operational Ready"}
                </span>
              </div>

              <div className="space-y-3">
                {(facilityStats.bay_allocations && facilityStats.bay_allocations.length > 0
                  ? facilityStats.bay_allocations
                  : [
                      {
                        bay_number: "Resuscitation Bay #1",
                        status: "OCCUPIED",
                        patient_token: "T-024",
                        patient_name: "Emergency Patient (Token #T-024)",
                        priority: "RED",
                        chief_complaint: "Acute Retrosternal Chest Pain & Hypoxia",
                        vitals: "SpO₂ 89% • BP 158/96 • HR 112",
                        admit_time: "Active STAT Bay Intake"
                      },
                      {
                        bay_number: "Resuscitation Bay #2",
                        status: "AVAILABLE",
                        patient_token: null,
                        patient_name: "Available for Emergency Intake",
                        priority: "GREEN",
                        chief_complaint: "Prepped for Emergency Intake • O2 Manifold Connected",
                        vitals: "Defibrillator Standby",
                        admit_time: null
                      },
                      {
                        bay_number: "Resuscitation Bay #3",
                        status: "AVAILABLE",
                        patient_token: null,
                        patient_name: "Available for Emergency Intake",
                        priority: "GREEN",
                        chief_complaint: "Ready for STAT Resuscitation",
                        vitals: "O2 Cylinder Prepped",
                        admit_time: null
                      },
                      {
                        bay_number: "Resuscitation Bay #4",
                        status: "AVAILABLE",
                        patient_token: null,
                        patient_name: "Available for Emergency Intake",
                        priority: "GREEN",
                        chief_complaint: "Ready for STAT Resuscitation",
                        vitals: "Standby",
                        admit_time: null
                      },
                      {
                        bay_number: "Resuscitation Bay #5",
                        status: "AVAILABLE",
                        patient_token: null,
                        patient_name: "Available for Emergency Intake",
                        priority: "GREEN",
                        chief_complaint: "Ready for STAT Resuscitation",
                        vitals: "Standby",
                        admit_time: null
                      }
                    ]
                ).map((bay, idx) => {
                  const isOccupied = bay.status === "OCCUPIED";
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border transition-all ${
                        isOccupied
                          ? "bg-rose-50/70 border-rose-200"
                          : "bg-emerald-50/40 border-emerald-200"
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-lg text-xs font-black font-mono ${
                              isOccupied ? "bg-rose-600 text-white" : "bg-emerald-700 text-white"
                            }`}
                          >
                            {bay.bay_number}
                          </span>
                          <strong className="text-slate-900 text-sm font-black">
                            {bay.patient_name}
                          </strong>
                          {bay.patient_token && (
                            <span className="font-mono text-xs font-bold bg-white px-2 py-0.5 rounded border border-rose-300 text-rose-900">
                              {bay.patient_token}
                            </span>
                          )}
                        </div>

                        <span
                          className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                            isOccupied
                              ? "bg-rose-200 text-rose-900"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {isOccupied ? "🔴 OCCUPIED (CRITICAL)" : "🟢 VACANT / READY"}
                        </span>
                      </div>

                      <div className="mt-2 text-xs grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold uppercase">Clinical Presentation:</span>
                          <span className="font-semibold text-slate-900">{bay.chief_complaint}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold uppercase">Telemetry & Vitals:</span>
                          <span className="font-mono font-bold text-slate-900">{bay.vitals}</span>
                        </div>
                      </div>

                      {isOccupied && onOpenReferralSlip && (
                        <div className="mt-3 pt-2 border-t border-rose-200 flex justify-end">
                          <button
                            onClick={() => {
                              setActiveModal(null);
                              onOpenReferralSlip("VISIT-PHC-1024");
                            }}
                            className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer shadow-xs"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Generate 1-Click Referral Slip</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Close Roster
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIVE CLINICAL STAFF ROSTER MODAL */}
      {activeModal === "STAFF" && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-300 overflow-hidden text-slate-800">
            <div className="bg-teal-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-teal-800 text-white shadow-xs">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm uppercase tracking-wide">
                    On-Duty Clinical Staff & Medical Roster
                  </h3>
                  <p className="text-xs text-teal-200">
                    {facilityStats.facility_name} • Active shift registry & on-call coverage
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                aria-label="Close on-duty clinical staff modal"
                className="p-1.5 rounded-xl hover:bg-teal-800 text-white/80 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
              <div>
                <h4 className="font-black text-slate-900 uppercase tracking-wide mb-2 flex items-center space-x-1.5">
                  <Stethoscope className="w-4 h-4 text-teal-700" />
                  <span>Medical Officers on Duty ({facilityStats.doctors_on_duty})</span>
                </h4>
                <div className="space-y-2">
                  {(facilityStats.active_doctors && facilityStats.active_doctors.length > 0
                    ? facilityStats.active_doctors
                    : [
                        "Dr. S. Mohanty, MBBS, MD (MO In-Charge)",
                        "Dr. R. Mishra, MBBS (Emergency MO)"
                      ]
                  ).map((doc, idx) => (
                    <div key={idx} className="p-3 bg-teal-50/60 rounded-xl border border-teal-200 flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse"></span>
                        <strong className="text-slate-900 font-bold">{doc}</strong>
                      </div>
                      <span className="bg-teal-100 text-teal-900 font-black text-[10px] px-2 py-0.5 rounded-md">
                        POST ACTIVE
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-black text-slate-900 uppercase tracking-wide mb-2 flex items-center space-x-1.5">
                  <Users className="w-4 h-4 text-purple-700" />
                  <span>Nursing Staff & ANM Coverage ({facilityStats.nurses_available})</span>
                </h4>
                <div className="space-y-2">
                  {(facilityStats.active_nurses && facilityStats.active_nurses.length > 0
                    ? facilityStats.active_nurses
                    : [
                        "Sister Manorama Nayak (Staff Nurse)",
                        "ANM Pravati Das (Emergency Triage)",
                        "ASHA Sunita Swain",
                        "ANM K. Behera"
                      ]
                  ).map((nurse, idx) => (
                    <div key={idx} className="p-3 bg-purple-50/60 rounded-xl border border-purple-200 flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></span>
                        <strong className="text-slate-900 font-bold">{nurse}</strong>
                      </div>
                      <span className="bg-purple-100 text-purple-900 font-black text-[10px] px-2 py-0.5 rounded-md">
                        ON STATION
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Close Roster
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function QueueCard({ item, onReview, onOpenReferralSlip, t }) {
  const isRed = item.priority === "RED";
  const isYellow = item.priority === "YELLOW";

  return (
    <div
      onClick={onReview}
      className={`bg-white rounded-2xl border transition-all p-4 shadow-sm hover:shadow-card hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between space-y-3 ${
        isRed
          ? "border-rose-300 hover:border-rose-500 ring-1 ring-rose-200/80 shadow-rose-100/50"
          : isYellow
          ? "border-amber-200 hover:border-amber-400 ring-1 ring-amber-200/60"
          : "border-slate-200 hover:border-teal-400"
      }`}
    >
      <div className="space-y-2">
        {/* Token, Patient Info & Live Wait Timer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span
              className={`font-mono text-xs font-black px-2.5 py-1 rounded-xl shadow-xs ${
                isRed
                  ? "bg-rose-600 text-white"
                  : isYellow
                  ? "bg-amber-500 text-white"
                  : "bg-emerald-600 text-white"
              }`}
            >
              {item.token_number}
            </span>
            <strong className="text-slate-900 text-sm font-bold truncate max-w-[140px]">
              {item.name_or_alias}
            </strong>
          </div>

          <div className="flex items-center space-x-1 text-[11px] text-slate-500 font-semibold bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{item.wait_time_minutes ?? 0}m {t?.waitLabel || "Wait"}</span>
          </div>
        </div>

        {/* Demographics & Facility Tags */}
        <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
            {Math.max(0, Math.abs(Number(item.age) || 0))}y / {item.sex}
          </span>
          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
            {item.language_preference}
          </span>
          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium truncate max-w-[120px]">
            {item.facility_type}
          </span>
        </div>

        {/* Chief Complaint */}
        <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 text-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block">
            {t?.complaintLabel || "Complaint"}
          </span>
          <p className="text-slate-800 font-medium line-clamp-2 mt-0.5">
            {item.chief_complaint}
          </p>
        </div>

        {/* Vitals Summary Strip */}
        <div className="text-[11px] font-mono text-slate-700 bg-white p-2 rounded-xl border border-slate-200">
          <span className="text-[10px] text-slate-400 block font-sans font-bold uppercase">
            {t?.vitalsAtIntake || "Vitals At Intake:"}
          </span>
          <span className="font-semibold">{item.vitals_summary}</span>
        </div>
      </div>

      {/* Card Action & Routing */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 min-w-0">
        <div className="text-[11px] text-slate-500 truncate max-w-[120px] min-w-0">
          <span className="text-[10px] text-slate-400 block font-bold uppercase">{t?.unitLabel || "Unit"}</span>
          <span className="font-semibold text-slate-700 truncate block">{item.department}</span>
        </div>

        <div className="flex items-center space-x-1.5 shrink-0 ml-auto">
          {onOpenReferralSlip && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenReferralSlip(item.visit_id);
              }}
              title="1-Click Official Government Referral Slip"
              className="min-h-[38px] sm:min-h-[44px] px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1 border border-teal-200 bg-teal-50 hover:bg-teal-100 text-teal-800 shadow-xs cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-teal-700 shrink-0" />
              <span>Slip</span>
            </button>
          )}

          <button
            onClick={onReview}
            title="1-Click Clinician Review & Counter-Sign"
            className={`min-h-[38px] sm:min-h-[44px] px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-xs cursor-pointer ${
              isRed
                ? "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-950/20 ring-1 ring-rose-400"
                : isYellow
                ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-950/20 ring-1 ring-amber-400"
                : "bg-teal-600 hover:bg-teal-700 text-white shadow-teal-950/20 ring-1 ring-teal-400"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate">Counter-Sign</span>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
}
