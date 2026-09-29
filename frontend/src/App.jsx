import React, { useState, useEffect, useCallback } from "react";
import HeaderBar from "./components/HeaderBar";
import IntakeStation from "./components/IntakeStation";
import DoctorDashboard from "./components/DoctorDashboard";
import ClinicianReviewModal from "./components/ClinicianReviewModal";
import ReferralSlipModal from "./components/ReferralSlipModal";
import {
  getOfflinePendingCount,
  saveOfflineRecord,
  syncOfflineQueueWithBackend
} from "./utils/offlineQueue";
import { evaluateLocalDeterministicTriage } from "./utils/localTriageRules";

const API_BASE = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_BACKEND_URL)
  ? import.meta.env.VITE_BACKEND_URL
  : (import.meta.env.DEV ? "http://localhost:8000" : "");

function getBilingualFollowups(lang) {
  if (lang === "Hindi" || lang === "हिन्दी") {
    return {
      english: [
        "Did the pain start suddenly while resting, or does it worsen with movement or deep breaths?",
        "Does the discomfort spread toward your left arm, jaw, or shoulder?",
        "Did you take your prescribed blood pressure or diabetes medication this morning?"
      ],
      local: [
        "चाचाजी, ये सीने का दर्द अचानक बैठे-बैठे शुरू हुआ या चलने-फिरने से बढ़ रहा है?",
        "क्या यह दर्द सीने से खिंचकर आपके बाएं हाथ, कंधे या जबड़े की तरफ भी जा रहा है?",
        "क्या आज सुबह बीपी या शुगर की दवा लेना भूल तो नहीं गए थे?"
      ]
    };
  }
  return {
    english: [
      "Did the pain start suddenly while resting, or does it worsen with movement or deep breaths?",
      "Does the discomfort spread toward your left arm, jaw, or shoulder?",
      "Did you take your prescribed blood pressure or diabetes medication this morning?"
    ],
    local: [
      "ମଉସା/ବାପା, ଏହି ଛାତି ଦରଦଟା ହଠାତ୍ ବସିଥିବା ବେଳେ ହେଲା ନା ଚାଲିବା କିମ୍ବା କାମ କରିବା ବେଳେ ବଢୁଛି?",
      "ଦରଦଟା କଣ ଛାତିରୁ ଯାଇ ବାମ ହାତ, କାନ୍ଧ କିମ୍ବା ବେକ ଆଡ଼କୁ ବିନ୍ଧୁଛି କି?",
      "ଆଜି ସକାଳେ ବିପି କି ଡାଇବେଟିସ୍ ବଟିକା ଖାଇବାକୁ ଭୁଲି ଯାଇନାହାନ୍ତି ତ?"
    ]
  };
}

export default function App() {
  const [selectedFacility, setSelectedFacility] = useState("PHC_JATNI");
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [activeRole, setActiveRole] = useState("NURSE"); // "NURSE" or "DOCTOR"
  const [isOffline, setIsOffline] = useState(false);
  const [pendingSyncCount, setPendingSyncCount] = useState(getOfflinePendingCount());
  const [isSyncing, setIsSyncing] = useState(false);

  const [queueData, setQueueData] = useState({
    active_queue: [],
    red_count: 0,
    yellow_count: 0,
    green_count: 0,
    total_waiting: 0,
    facility_stats: {
      emergency_beds_available: 3,
      emergency_beds_total: 5,
      general_beds_available: 18,
      general_beds_total: 24,
      doctors_on_duty: 5,
      nurses_available: 8
    }
  });

  const [triageResult, setTriageResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedRecordForReview, setSelectedRecordForReview] = useState(null);
  const [selectedRecordForReferral, setSelectedRecordForReferral] = useState(null);
  const [backendError, setBackendError] = useState("");
  const [emergencyNotification, setEmergencyNotification] = useState(null);

  // Hospital-grade Emergency Sound Tone
  const playEmergencyTone = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      // AudioContext policy safe catch
    }
  };

  // High-visibility Emergency Escalation Trigger
  const triggerEmergencyEscalation = (token, patientName = "Ramesh K.", conditionSummary = "Critical Hypoxia SpO2 89%") => {
    const cleanToken = token || "T-024";
    playEmergencyTone();
    setEmergencyNotification({
      token: cleanToken,
      patientName,
      conditionSummary,
      message: `🚨 EMERGENCY ESCALATION: Immediate notification dispatched to Emergency Care Bay for Token ${cleanToken} (${patientName} - ${conditionSummary}).`,
      timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    });
  };

  // Auto-dismiss emergency notification after 6 seconds
  useEffect(() => {
    if (emergencyNotification) {
      const timer = setTimeout(() => {
        setEmergencyNotification(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [emergencyNotification]);

  const [isFetchingQueue, setIsFetchingQueue] = useState(false);

  // Fetch live queue from backend with real-time telemetry
  const fetchQueue = useCallback(async (facilityOverride) => {
    if (isOffline) return;
    setIsFetchingQueue(true);
    try {
      const fac = facilityOverride || selectedFacility || "PHC_JATNI";
      const res = await fetch(`${API_BASE}/api/v1/queue?facility_type=${fac}`);
      if (res.ok) {
        const data = await res.json();
        setQueueData(data);
        setBackendError("");
      }
    } catch (err) {
      console.warn("Backend not reachable, operating in fallback mode:", err);
      setBackendError("Backend connection offline; using client-side deterministic safety engine.");
    } finally {
      setIsFetchingQueue(false);
    }
  }, [isOffline, selectedFacility]);

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(() => {
      fetchQueue();
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchQueue]);

  // Run Triage Analysis
  const handleAnalyze = async (payload) => {
    setIsAnalyzing(true);
    setBackendError("");

    const targetLang = payload?.patient_basic_info?.primary_language || selectedLanguage || "English";
    const followups = getBilingualFollowups(targetLang);

    if (isOffline) {
      // Execute offline client-side deterministic triage
      const local = evaluateLocalDeterministicTriage(
        payload.vital_signs,
        payload.red_flag_checklist,
        payload.patient_basic_info
      );

      const offlineRecord = {
        visit_id: `OFFLINE-${Date.now()}`,
        token_number: "OFF-T-001",
        created_at: new Date().toISOString(),
        queue_status: "WAITING",
        patient_basic_info: payload.patient_basic_info,
        symptoms_and_complaints: payload.symptoms_and_complaints,
        vital_signs: payload.vital_signs,
        medical_history: payload.medical_history,
        uploaded_reports: payload.uploaded_reports,
        visual_inputs: payload.visual_inputs,
        red_flag_checklist: payload.red_flag_checklist,
        ai_triage_output: {
          rule_engine_priority: local.priority,
          ai_suggested_priority: local.priority,
          final_computed_priority: local.priority,
          priority_label: local.priorityLabel,
          deterministic_triggers: local.triggers,
          chronological_timeline: `[Offline Local Engine] Onset of ${payload.symptoms_and_complaints.chief_complaint} (${payload.symptoms_and_complaints.duration}). Vitals: SpO2 ${payload.vital_signs.spo2_percent}%, BP ${payload.vital_signs.bp_systolic}/${payload.vital_signs.bp_diastolic}.`,
          missing_information_gaps: [
            "Exact onset timing: at rest vs during exertion",
            "Current compliance with morning prescribed medications",
            "Emergency referral facility availability"
          ],
          suggested_followup_questions: followups.english,
          followup_questions_english: followups.english,
          followup_questions_local_language: followups.local,
          suggested_department: local.department,
          concise_clinician_summary: `Patient presenting with ${payload.symptoms_and_complaints.chief_complaint}. Deterministic priority: ${local.priority}. Route to ${local.department}.`,
          referral_note_draft: `OFFLINE REFERRAL SLIP: ${payload.patient_basic_info.name_or_alias} (${payload.patient_basic_info.age}y/${payload.patient_basic_info.sex}) presenting with ${payload.symptoms_and_complaints.chief_complaint}. Triage Priority: ${local.priority}. Triggers: ${local.triggers.join("; ")}.`,
          non_diagnostic_disclaimer: "Offline local deterministic triage advisory note. Non-diagnostic."
        },
        human_review_feedback: {
          review_status: "PENDING",
          was_ai_overridden: false
        },
        followup_answers: []
      };

      const saved = saveOfflineRecord(offlineRecord);
      setTriageResult(saved);
      setPendingSyncCount(getOfflinePendingCount());
      if (local.priority === "RED") {
        const patName = payload?.patient_basic_info?.name_or_alias || "Ramesh K.";
        const spo2 = payload?.vital_signs?.spo2_percent || 89;
        triggerEmergencyEscalation(
          offlineRecord.token_number,
          patName,
          `Critical Hypoxia SpO2 ${spo2}%`
        );
      }
      setIsAnalyzing(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/v1/triage/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`Server returned error status ${res.status}`);
      }

      const data = await res.json();
      setTriageResult(data);
      if (data?.ai_triage_output?.final_computed_priority === "RED" || data?.priority === "RED") {
        const tok = data.token_number || data.patient_basic_info?.token_number || payload.patient_basic_info?.token_number || "T-024";
        const patName = data.patient_basic_info?.name_or_alias || payload.patient_basic_info?.name_or_alias || "Ramesh K.";
        const spo2 = data.vital_signs?.spo2_percent || payload.vital_signs?.spo2_percent || 89;
        triggerEmergencyEscalation(
          tok,
          patName,
          `Critical Hypoxia SpO2 ${spo2}%`
        );
      }
      fetchQueue();
    } catch (err) {
      console.error("Triage analysis failed, switching to local offline fallback:", err);
      setBackendError("Backend API unavailable. Processed via Client-Side Deterministic Rule Engine.");

      const local = evaluateLocalDeterministicTriage(
        payload.vital_signs,
        payload.red_flag_checklist,
        payload.patient_basic_info
      );

      const fallbackRecord = {
        visit_id: `LOCAL-${Date.now()}`,
        token_number: payload.patient_basic_info.token_number || "T-099",
        created_at: new Date().toISOString(),
        queue_status: "WAITING",
        patient_basic_info: payload.patient_basic_info,
        symptoms_and_complaints: payload.symptoms_and_complaints,
        vital_signs: payload.vital_signs,
        medical_history: payload.medical_history,
        uploaded_reports: payload.uploaded_reports,
        visual_inputs: payload.visual_inputs,
        red_flag_checklist: payload.red_flag_checklist,
        ai_triage_output: {
          rule_engine_priority: local.priority,
          ai_suggested_priority: local.priority,
          final_computed_priority: local.priority,
          priority_label: local.priorityLabel,
          deterministic_triggers: local.triggers,
          chronological_timeline: `Onset of ${payload.symptoms_and_complaints.chief_complaint} (${payload.symptoms_and_complaints.duration}). Vitals: SpO2 ${payload.vital_signs.spo2_percent}%, BP ${payload.vital_signs.bp_systolic}/${payload.vital_signs.bp_diastolic}.`,
          missing_information_gaps: [
            "Exact onset timing: at rest vs during exertion",
            "Morning medication dosage compliance",
            "Local facility 12-lead ECG availability"
          ],
          suggested_followup_questions: followups.english,
          followup_questions_english: followups.english,
          followup_questions_local_language: followups.local,
          suggested_department: local.department,
          concise_clinician_summary: `Patient presenting with ${payload.symptoms_and_complaints.chief_complaint}. Deterministic priority: ${local.priority}. Route to ${local.department}.`,
          referral_note_draft: `LOCAL REFERRAL NOTE: ${payload.patient_basic_info.name_or_alias} presenting with ${payload.symptoms_and_complaints.chief_complaint}. Priority: ${local.priority}. Triggers: ${local.triggers.join("; ")}.`,
          non_diagnostic_disclaimer: "Deterministic triage advisory output. Non-diagnostic."
        },
        human_review_feedback: { review_status: "PENDING" },
        followup_answers: []
      };

      setTriageResult(fallbackRecord);
      if (local.priority === "RED") {
        const patName = payload?.patient_basic_info?.name_or_alias || "Ramesh K.";
        const spo2 = payload?.vital_signs?.spo2_percent || 89;
        triggerEmergencyEscalation(
          fallbackRecord.token_number,
          patName,
          `Critical Hypoxia SpO2 ${spo2}%`
        );
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Submit Follow-up Answers
  const handleSubmitFollowupAnswers = async (visitId, answers) => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/triage/${visitId}/followup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers })
      });

      if (res.ok) {
        const updated = await res.json();
        setTriageResult(updated);
        fetchQueue();
      }
    } catch (e) {
      console.warn("Followup submission handled locally:", e);
    }
  };

  // Select patient for review in Doctor Dashboard
  const handleSelectPatientForReview = async (visitId) => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/triage/${visitId}`);
      if (res.ok) {
        const record = await res.json();
        setSelectedRecordForReview(record);
        const prio = record?.ai_triage_output?.final_computed_priority || record?.priority;
        if (prio === "RED") {
          const tok = record.token_number || record.patient_basic_info?.token_number || "T-024";
          const patName = record.patient_basic_info?.name_or_alias || record.name_or_alias || "Ramesh K.";
          const spo2 = record.vital_signs?.spo2_percent || record.vitals?.spo2_percent || 89;
          triggerEmergencyEscalation(
            tok,
            patName,
            `Critical Hypoxia SpO2 ${spo2}%`
          );
        }
      }
    } catch (e) {
      const found = queueData.active_queue.find((q) => q.visit_id === visitId);
      if (found) {
        setSelectedRecordForReview(triageResult || found);
        if (found.priority === "RED" || triageResult?.ai_triage_output?.final_computed_priority === "RED") {
          const tok = found.token_number || "T-024";
          const patName = found.patient_name || found.name_or_alias || "Ramesh K.";
          const spo2 = found.vitals?.spo2_percent || 89;
          triggerEmergencyEscalation(
            tok,
            patName,
            `Critical Hypoxia SpO2 ${spo2}%`
          );
        }
      }
    }
  };

  // Open 1-click Referral Slip modal
  const handleOpenReferralSlip = async (recOrId) => {
    if (typeof recOrId === "string") {
      try {
        const res = await fetch(`${API_BASE}/api/v1/triage/${recOrId}`);
        if (res.ok) {
          const rec = await res.json();
          setSelectedRecordForReferral(rec);
          return;
        }
      } catch (err) {
        console.warn("Failed fetching full record for referral slip:", err);
      }
      const found = queueData?.active_queue?.find((q) => q.visit_id === recOrId);
      setSelectedRecordForReferral(found || triageResult);
    } else {
      setSelectedRecordForReferral(recOrId);
    }
  };

  // Submit Clinician Review & Override
  const handleSaveReview = async (reviewPayload) => {
    if (!selectedRecordForReview) return;

    try {
      const res = await fetch(
        `${API_BASE}/api/v1/triage/${selectedRecordForReview.visit_id}/review`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reviewPayload)
        }
      );

      if (res.ok) {
        const updated = await res.json();
        if (reviewPayload.final_priority === "RED") {
          const patName = selectedRecordForReview.patient_basic_info?.name_or_alias || "Ramesh K.";
          triggerEmergencyEscalation(
            selectedRecordForReview.token_number,
            patName,
            "Direct Medical Officer Emergency Bay Escalation"
          );
        }
        setSelectedRecordForReview(null);
        fetchQueue();
      }
    } catch (e) {
      setSelectedRecordForReview(null);
    }
  };

  // Reset Demo Data
  const handleResetDemo = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/demo/seed`, {
        method: "POST"
      });
      if (res.ok) {
        fetchQueue();
        setTriageResult(null);
      }
    } catch (e) {
      // Local fallback
    }
  };

  // Offline Sync
  const handleSyncOffline = async () => {
    setIsSyncing(true);
    const result = await syncOfflineQueueWithBackend(API_BASE);
    setIsSyncing(false);
    setPendingSyncCount(result.remainingCount);
    fetchQueue();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* 🚨 FLOATING HIGH-CONTRAST EMERGENCY ESCALATION ALERT TOAST (TOP-RIGHT CORNER) */}
      {emergencyNotification && (
        <aside
          aria-live="assertive"
          role="alert"
          className="fixed top-5 right-5 z-50 w-[92vw] sm:w-[460px] animate-slideInRight"
        >
          <div className="bg-rose-700/95 backdrop-blur-md text-white rounded-2xl p-4 shadow-2xl border-2 border-rose-300 ring-4 ring-rose-500/30 emergency-glow flex flex-col space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-lg shrink-0 shadow-inner mt-0.5">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] font-black uppercase tracking-wider bg-black/30 text-rose-200 px-2 py-0.5 rounded border border-rose-400/40">
                      LIVE ESCALATION
                    </span>
                    <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                      {emergencyNotification.timestamp}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-extrabold text-white leading-snug">
                    {emergencyNotification.message}
                  </p>
                </div>
              </div>

              {/* Dismiss Button */}
              <button
                type="button"
                onClick={() => setEmergencyNotification(null)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer text-sm font-bold shrink-0"
                title="Dismiss (auto-closes in 6s)"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center justify-between border-t border-rose-600/70 pt-2 text-xs">
              <span className="text-rose-100 text-[11px] font-medium flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-300 animate-pulse"></span>
                <span>Immediate 0-min SLA Target</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setActiveRole("DOCTOR");
                  setEmergencyNotification(null);
                }}
                className="bg-white text-rose-800 hover:bg-rose-50 font-black text-xs px-3 py-1.5 rounded-xl transition shadow-xs cursor-pointer whitespace-nowrap"
              >
                Emergency Care Bay ➔
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* 1. Modern Hospital-Grade Header Bar */}
      <HeaderBar
        selectedFacility={selectedFacility}
        onFacilityChange={setSelectedFacility}
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
        activeRole={activeRole}
        onRoleChange={setActiveRole}
        isOffline={isOffline}
        onToggleOffline={() => setIsOffline(!isOffline)}
        pendingSyncCount={pendingSyncCount}
        onSyncOffline={handleSyncOffline}
        onResetDemo={handleResetDemo}
        redCount={queueData.red_count}
        yellowCount={queueData.yellow_count}
        totalWaiting={queueData.total_waiting}
        isSyncing={isSyncing}
      />

      {/* Backend Status Alert (if offline/fallback) */}
      {backendError && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-800 text-center font-medium shadow-xs">
          {backendError}
        </div>
      )}

      {/* 2. Main Clinical Workspace */}
      <main className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full space-y-6">
        {activeRole === "NURSE" ? (
          <IntakeStation
            selectedFacility={selectedFacility}
            selectedLanguage={selectedLanguage}
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
            triageResult={triageResult}
            onSubmitFollowupAnswers={handleSubmitFollowupAnswers}
            onGoToDoctorQueue={() => setActiveRole("DOCTOR")}
          />
        ) : (
          <DoctorDashboard
            queueData={queueData}
            onSelectPatientForReview={handleSelectPatientForReview}
            onOpenReferralSlip={handleOpenReferralSlip}
            selectedFacility={selectedFacility}
            onFacilityChange={(fac) => {
              setSelectedFacility(fac);
              fetchQueue(fac);
            }}
            selectedLanguage={selectedLanguage}
            onRefreshQueue={() => fetchQueue(selectedFacility)}
            isRefreshing={isFetchingQueue}
          />
        )}
      </main>

      {/* 3. Human-in-the-Loop Clinician Review Modal */}
      {selectedRecordForReview && (
        <ClinicianReviewModal
          record={selectedRecordForReview}
          onClose={() => setSelectedRecordForReview(null)}
          onSaveReview={handleSaveReview}
          onOpenReferralSlip={handleOpenReferralSlip}
          selectedLanguage={selectedLanguage}
        />
      )}

      {/* 4. Standardized Government Referral Slip Modal */}
      {selectedRecordForReferral && (
        <ReferralSlipModal
          record={selectedRecordForReferral}
          onClose={() => setSelectedRecordForReferral(null)}
          selectedLanguage={selectedLanguage}
        />
      )}

      {/* 5. Minimalist Healthcare Footer */}
      <footer className="border-t border-slate-200 bg-white text-slate-500 text-xs py-4 px-6 text-center shadow-xs">
        Saransh (सारांश) — Multimodal Human-in-the-Loop Healthcare Triage Assistant | Government & Institutional Health Facilities Edition | Non-Diagnostic Clinical Decision Support
      </footer>
    </div>
  );
}
