import React, { useState } from "react";
import {
  X,
  AlertTriangle,
  ShieldCheck,
  FileText,
  Clock,
  User,
  Heart,
  Activity,
  Layers,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Stethoscope,
  Send,
  Printer,
  ChevronRight,
  Radio,
  FileCheck
} from "lucide-react";
import { TRANSLATIONS } from "../data/translations";

export default function ClinicianReviewModal({
  record,
  onClose,
  onSaveReview,
  onOpenReferralSlip,
  selectedLanguage = "English"
}) {
  if (!record) return null;

  const t = TRANSLATIONS[selectedLanguage] || TRANSLATIONS.English;
  const p = record.patient_basic_info || {};
  const v = record.vital_signs || {};
  const s = record.symptoms_and_complaints || {};
  const ai = record.ai_triage_output || {};
  const existingReview = record.human_review_feedback || {};

  const originalAiPriority = ai.final_computed_priority || "GREEN";

  const [selectedPriority, setSelectedPriority] = useState(
    existingReview.clinician_assigned_priority || originalAiPriority
  );
  const [overrideReason, setOverrideReason] = useState(
    existingReview.override_reason || ""
  );
  const [clinicianNotes, setClinicianNotes] = useState(
    existingReview.clinician_corrections || ""
  );
  const [reviewerId, setReviewerId] = useState(
    existingReview.reviewer_id || "DR-MO-402 (Dr. S. Mohanty, Medical Officer)"
  );
  const [admitAction, setAdmitAction] = useState("ADMIT_BAY");
  const [resolvedGaps, setResolvedGaps] = useState(
    existingReview.missing_info_resolved || []
  );
  const [validationError, setValidationError] = useState("");

  const isOverridden = selectedPriority !== originalAiPriority;

  const toggleGapResolution = (gap) => {
    if (resolvedGaps.includes(gap)) {
      setResolvedGaps(resolvedGaps.filter((g) => g !== gap));
    } else {
      setResolvedGaps([...resolvedGaps, gap]);
    }
  };

  const handleConfirmReview = () => {
    if (isOverridden && !overrideReason.trim()) {
      setValidationError("Mandatory Requirement: Please provide a clinical justification / reason for overriding the AI priority.");
      return;
    }

    setValidationError("");
    onSaveReview({
      final_priority: selectedPriority,
      reviewer_id: reviewerId,
      override_reason: isOverridden ? overrideReason.trim() : null,
      clinician_notes: clinicianNotes.trim(),
      admit_action: admitAction,
      missing_info_resolved: resolvedGaps,
      rating: 5
    });
  };

  const timelineSteps = (ai.chronological_timeline || "")
    .split("➔")
    .map((step) => step.trim())
    .filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end animate-fadeIn">
      {/* Backdrop click to dismiss */}
      <div
        className="fixed inset-0 cursor-pointer"
        onClick={onClose}
        aria-label="Close review drawer"
      ></div>

      {/* Slide-over Review Drawer Panel */}
      <div className="relative z-10 w-full max-w-2xl bg-white shadow-2xl flex flex-col h-full border-l border-slate-200 overflow-hidden">
        {/* Drawer Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200 shadow-xs">
              <Stethoscope className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-extrabold text-slate-900">
                  {t.reviewModalTitle || "Clinical Review & Override Drawer"}
                </h3>
                <span className="text-xs bg-teal-50 text-teal-800 font-mono px-2 py-0.5 rounded-lg border border-teal-200 font-black">
                  {record.token_number}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {p.name_or_alias} • {p.age}y/{p.sex} • {p.facility_type}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onOpenReferralSlip(record)}
              title="Print Official Referral Slip"
              className="bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-300 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-teal-700" />
              <span className="hidden sm:inline">{t.printOfficialReferralSlip || "[ 📄 Print Official Referral Slip ]"}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* 1. Structured Clinical Summary Card */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                AI Computed Urgency Floor
              </span>
              <span
                className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-xs ${
                  originalAiPriority === "RED"
                    ? "bg-rose-600 text-white"
                    : originalAiPriority === "YELLOW"
                    ? "bg-amber-500 text-white"
                    : "bg-emerald-600 text-white"
                }`}
              >
                {originalAiPriority === "RED"
                  ? t.redPriority || "🔴 RED (Emergency P1)"
                  : originalAiPriority === "YELLOW"
                  ? t.yellowPriority || "🟠 YELLOW (Urgent P2)"
                  : t.greenPriority || "🟢 GREEN (Routine P3)"}
              </span>
            </div>

            {/* Chief Complaint & Vernacular Quote */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500 block">
                Clinical Chief Complaint:
              </span>
              <p className="text-xs font-bold text-slate-900 bg-white p-3 rounded-xl border border-slate-200">
                {s.chief_complaint || "Acute retrosternal chest pain with dyspnea"}
              </p>

              {s.verbatim_local_statement && (
                <div className="text-xs text-slate-700 bg-teal-50/60 p-2.5 rounded-xl border border-teal-200 font-medium">
                  <span className="text-[10px] text-teal-800 font-bold block mb-0.5">
                    Spoken Statement ({p.language_preference}):
                  </span>
                  <span>"{s.verbatim_local_statement}"</span>
                </div>
              )}
            </div>

            {/* Vitals Summary Strip */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
              <div className="bg-white p-2 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-semibold">SpO₂</span>
                <strong className={`text-xs font-black ${v.spo2_percent < 90 ? "text-rose-600" : "text-slate-900"}`}>
                  {v.spo2_percent}%
                </strong>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-semibold">HR</span>
                <strong className="text-xs font-black text-slate-900">{v.heart_rate_bpm}</strong>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-semibold">BP</span>
                <strong className="text-xs font-black text-slate-900">{v.bp_systolic}/{v.bp_diastolic}</strong>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-semibold">Temp</span>
                <strong className="text-xs font-black text-slate-900">{v.temperature_f}°F</strong>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-semibold">RR</span>
                <strong className="text-xs font-black text-slate-900">{v.respiratory_rate_min}</strong>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-semibold">Glucose</span>
                <strong className="text-xs font-black text-slate-900">{v.blood_glucose_mg_dl || "--"}</strong>
              </div>
            </div>

            {/* Deterministic Triggers */}
            {ai.deterministic_triggers && ai.deterministic_triggers.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500 block">
                  Rule Engine Safety Floor Overrides:
                </span>
                <ul className="space-y-1">
                  {ai.deterministic_triggers.map((trig, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-rose-900 flex items-center space-x-2 bg-rose-50/80 p-2 rounded-xl border border-rose-200 font-medium"
                    >
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span>{trig}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* 2. Chronological Symptom Timeline */}
          {timelineSteps.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2.5 shadow-xs">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
                Chronological Symptom Timeline:
              </span>
              <div className="relative pl-5 space-y-2 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-teal-200">
                {timelineSteps.map((step, idx) => (
                  <div key={idx} className="relative text-xs text-slate-800 font-medium">
                    <div className="absolute -left-[17px] top-1.5 w-2.5 h-2.5 rounded-full bg-teal-600 border-2 border-white"></div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      {step}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. 1-Click Clinician Priority Override Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              {t.verifyPriorityTitle || "Verify or Override Triage Urgency Priority:"}
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedPriority("RED")}
                className={`py-3 px-2 rounded-2xl text-xs font-black transition flex flex-col items-center justify-center space-y-1 border cursor-pointer ${
                  selectedPriority === "RED"
                    ? "bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/25"
                    : "bg-white text-slate-600 border-slate-200 hover:border-rose-300"
                }`}
              >
                <span>{t.emergencyLabel || "🔴 RED"}</span>
                <span className="text-[10px] font-medium opacity-90">Emergency (P1)</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPriority("YELLOW")}
                className={`py-3 px-2 rounded-2xl text-xs font-black transition flex flex-col items-center justify-center space-y-1 border cursor-pointer ${
                  selectedPriority === "YELLOW"
                    ? "bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/25"
                    : "bg-white text-slate-600 border-slate-200 hover:border-amber-300"
                }`}
              >
                <span>{t.urgentLabel || "🟠 YELLOW"}</span>
                <span className="text-[10px] font-medium opacity-90">Urgent (P2)</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPriority("GREEN")}
                className={`py-3 px-2 rounded-2xl text-xs font-black transition flex flex-col items-center justify-center space-y-1 border cursor-pointer ${
                  selectedPriority === "GREEN"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/25"
                    : "bg-white text-slate-600 border-slate-200 hover:border-emerald-300"
                }`}
              >
                <span>{t.routineLabel || "🟢 GREEN"}</span>
                <span className="text-[10px] font-medium opacity-90">Routine (P3)</span>
              </button>
            </div>
          </div>

          {/* Mandatory Override Clinical Justification (Shown when priority changed) */}
          {isOverridden && (
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 space-y-2 animate-fadeIn shadow-xs">
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{t.overrideReasonTitle || "Mandatory Audit Trail: Clinical Justification for Override"}</span>
              </div>
              <textarea
                rows={2}
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                placeholder={t.overrideReasonPlaceholder || "e.g. Repeated SpO2 on warm hand is 98%; chest wall tenderness reproduced on palpation; repeat vitals stable."}
                className="w-full bg-white border border-amber-300 rounded-xl p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-medium"
              />
              <p className="text-[10px] text-amber-800">
                * Modifying AI priority is logged immutably under Reviewer ID: {reviewerId}
              </p>
            </div>
          )}

          {/* 4. Doctor Bedside Orders & Assessment */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              {t.doctorOrdersTitle || "Doctor Clinical Orders & Assessment:"}
            </label>
            <textarea
              rows={3}
              value={clinicianNotes}
              onChange={(e) => setClinicianNotes(e.target.value)}
              placeholder={t.doctorOrdersPlaceholder || "e.g. Stat 12-lead ECG; start IV normal saline; maintain nasal oxygen at 4L/min; monitor repeat vitals at 15 mins."}
              className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-medium"
            />
          </div>

          {/* 5. Immediate Disposition Action Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              {t.dispositionTitle || "Immediate Disposition:"}
            </label>
            <select
              value={admitAction}
              onChange={(e) => setAdmitAction(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-semibold cursor-pointer"
            >
              <option value="ADMIT_BAY">{t.admitBay || "Admit to Emergency Observation Bay"}</option>
              <option value="FAST_TRACK_OPD">{t.fastTrackOpd || "Direct to Priority Specialist OPD Room"}</option>
              <option value="REFERRAL_TRANSFER">{t.referralTransfer || "Initiate 108 Ambulance Referral to District Hospital"}</option>
              <option value="DISCHARGE">{t.dischargeHome || "Discharge with Prescription & Home Advice"}</option>
            </select>
          </div>

          {/* Reviewer ID */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
            <span className="text-slate-500 font-semibold">{t.reviewerAuditId || "Reviewer ID"}:</span>
            <input
              type="text"
              value={reviewerId}
              onChange={(e) => setReviewerId(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-900 font-bold focus:outline-none text-right"
            />
          </div>

          {/* Validation Alert */}
          {validationError && (
            <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-xs text-rose-700 flex items-center space-x-2 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}
        </div>

        {/* Fixed Bottom Action Drawer Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-2.5 shrink-0">
          <button
            type="button"
            onClick={handleConfirmReview}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-extrabold py-3.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 transition shadow-md shadow-teal-700/20 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {isOverridden
                ? `${t.overrideCareBtn || "Log Override & Authorize Care"} (${selectedPriority})`
                : `${t.authorizeCareBtn || "Verify & Authorize Care"} (${selectedPriority})`}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onOpenReferralSlip(record)}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-3.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 transition shadow-md shadow-slate-900/20 cursor-pointer border border-slate-700"
          >
            <span>📄</span>
            <span>{t.printOfficialReferralSlip || "[ 📄 Print Official Referral Slip ]"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
