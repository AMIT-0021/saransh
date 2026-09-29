import React, { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  Send,
  Building2,
  Sparkles,
  FileCheck,
  Check,
  Volume2
} from "lucide-react";
import { TRANSLATIONS } from "../data/translations";
import {
  speakHumanVoice,
  stopHumanVoice,
  getVocalAcoustics
} from "../utils/voiceSynthesisEngine";

export default function TriageResultCard({
  triageRecord,
  onSubmitFollowupAnswers,
  onGoToDoctorQueue,
  isSubmittingFollowup = false,
  selectedLanguage = "English"
}) {
  if (!triageRecord || !triageRecord.ai_triage_output) return null;

  const t = TRANSLATIONS[selectedLanguage] || TRANSLATIONS.English;
  const ai = triageRecord.ai_triage_output;
  const p = triageRecord.patient_basic_info || {};
  const priority = ai.final_computed_priority || "GREEN";

  const patientPrefLang = p?.language_preference || selectedLanguage || "English";
  const [askLang, setAskLang] = useState(patientPrefLang);
  const [answers, setAnswers] = useState({});
  const [submittedAnswersSuccess, setSubmittedAnswersSuccess] = useState(false);

  const [currentlySpeakingIdx, setCurrentlySpeakingIdx] = useState(null);

  // Empathetic bedside nurse speech synthesis for follow-up questions
  const handleSpeakQuestion = (text, lang, idx) => {
    if (currentlySpeakingIdx === idx) {
      stopHumanVoice();
      setCurrentlySpeakingIdx(null);
      return;
    }

    setCurrentlySpeakingIdx(idx);
    speakHumanVoice(text, {
      role: "nurse",
      language: lang,
      age: 32,
      gender: "Female",
      onStart: () => setCurrentlySpeakingIdx(idx),
      onEnd: () => setCurrentlySpeakingIdx(null),
      onError: () => setCurrentlySpeakingIdx(null)
    });
  };

  // Authoritative Medical Officer clinical triage audio briefing
  const handleSpeakTriageSummary = () => {
    if (currentlySpeakingIdx === "SUMMARY") {
      stopHumanVoice();
      setCurrentlySpeakingIdx(null);
      return;
    }

    const summaryText = `Clinical Triage Assessment for token ${triageRecord.token_number || "T-001"}. Priority: ${priority}. Destination: ${ai.suggested_department || "Emergency"}. ${ai.priority_label || ""}.`;
    setCurrentlySpeakingIdx("SUMMARY");
    speakHumanVoice(summaryText, {
      role: "doctor",
      language: "English",
      age: 45,
      gender: "Male",
      onStart: () => setCurrentlySpeakingIdx("SUMMARY"),
      onEnd: () => setCurrentlySpeakingIdx(null),
      onError: () => setCurrentlySpeakingIdx(null)
    });
  };

  const handleChipClick = (questionIdx, text) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIdx]: text
    }));
  };

  const handleCustomAnswerChange = (questionIdx, text) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIdx]: text
    }));
  };

  const handleSubmitFollowups = async (e) => {
    e.preventDefault();
    const formatted = Object.entries(answers)
      .filter(([_, ans]) => ans && ans.trim().length > 0)
      .map(([idx, ans]) => ({
        question: ai.suggested_followup_questions[Number(idx)] || `Question #${Number(idx) + 1}`,
        answer: ans.trim()
      }));

    if (formatted.length === 0) return;

    await onSubmitFollowupAnswers(triageRecord.visit_id, formatted);
    setSubmittedAnswersSuccess(true);
  };

  // Parse chronological timeline steps by "➔" delimiter
  const timelineSteps = (ai.chronological_timeline || "")
    .split("➔")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-hidden space-y-4 sm:space-y-6 p-3.5 sm:p-6 animate-fadeIn min-w-0 max-w-full">
      {/* 1. Urgency Classification Banner */}
      <div
        className={`p-3.5 sm:p-6 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4 min-w-0 max-w-full ${
          priority === "RED"
            ? "bg-rose-50 border-rose-300 text-rose-950 emergency-pulse ring-1 ring-rose-400/40"
            : priority === "YELLOW"
            ? "bg-amber-50 border-amber-200 text-amber-950"
            : "bg-emerald-50 border-emerald-200 text-emerald-950"
        }`}
      >
        <div className="space-y-1.5 min-w-0 flex-1">
          <div className="flex items-center space-x-2.5">
            <span
              className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 shadow-xs shrink-0 ${
                priority === "RED"
                  ? "bg-rose-600 text-white"
                  : priority === "YELLOW"
                  ? "bg-amber-500 text-white"
                  : "bg-emerald-600 text-white"
              }`}
            >
              {priority === "RED" && (
                <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
              )}
              <span>{priority} PRIORITY</span>
            </span>

            <span className="text-xs bg-white/80 text-slate-700 px-2.5 py-0.5 rounded-lg border border-slate-200 font-mono font-bold shadow-xs shrink-0">
              Token: {triageRecord.token_number}
            </span>
          </div>

          <h2 className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 break-words leading-tight">
            {priority === "RED" && (t.redPriority ? `${t.redPriority} — ${t.redDescription}` : "🔴 Emergency (P1) — Immediate Care")}
            {priority === "YELLOW" && (t.yellowPriority ? `${t.yellowPriority} — ${t.yellowDescription}` : "🟠 Urgent (P2) — Priority Outpatient")}
            {priority === "GREEN" && (t.greenPriority ? `${t.greenPriority} — ${t.greenDescription}` : "🟢 Routine (P3) — Standard Queue")}
          </h2>
          <p className="text-xs text-slate-600 font-medium truncate">{ai.priority_label}</p>
        </div>

        <div className="w-full md:w-auto flex flex-wrap items-center gap-2 min-w-0">
          <div className="bg-white/90 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-slate-200 shadow-xs text-left sm:text-right flex-1 sm:flex-none min-w-[120px]">
            <span className="block text-[10px] uppercase text-slate-500 font-bold">
              Routing Destination
            </span>
            <strong className="text-xs text-slate-900 flex items-center sm:justify-end space-x-1">
              <Building2 className="w-3.5 h-3.5 text-teal-600 mr-1 shrink-0" />
              <span className="truncate">{ai.suggested_department}</span>
            </strong>
          </div>

          <button
            type="button"
            onClick={handleSpeakTriageSummary}
            title="1-Click Audible Clinical Triage Briefing (Medical Officer Voice)"
            className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer min-h-[44px] ${
              currentlySpeakingIdx === "SUMMARY"
                ? "bg-rose-600 text-white border-rose-600 ring-2 ring-rose-400 animate-pulse"
                : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
            }`}
          >
            <Volume2 className={`w-3.5 h-3.5 ${currentlySpeakingIdx === "SUMMARY" ? "text-white animate-bounce" : "text-teal-600"}`} />
            <span>
              {currentlySpeakingIdx === "SUMMARY" ? "Stop" : "Audio"}
            </span>
          </button>

          <button
            onClick={onGoToDoctorQueue}
            className="flex-1 sm:flex-none bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl transition shadow-md shadow-teal-700/20 flex items-center justify-center space-x-2 shrink-0 cursor-pointer min-h-[44px]"
          >
            <span>Doctor Queue</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
        </div>
      </div>

      {/* 2. Explainable Rule Engine Triggers */}
      <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-2">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Deterministic Safety-Rule Engine Findings (Explainability):</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {(ai.deterministic_triggers || []).map((trig, idx) => (
            <span
              key={idx}
              className="bg-white border border-slate-200 text-slate-800 text-xs px-3 py-1.5 rounded-xl flex items-center space-x-2 shadow-xs font-medium"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0"></span>
              <span>{trig}</span>
            </span>
          ))}
        </div>
      </div>

      {/* 3. Vertical Chronological Timeline Stepper */}
      <div className="bg-white p-3.5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4 min-w-0 max-w-full overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
            <Clock className="w-4 h-4 text-teal-600" />
            <span>Vertical Chronological Symptom Timeline & Progression:</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Handoff Stepper</span>
        </div>

        <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-teal-200">
          {timelineSteps.map((step, idx) => (
            <div key={idx} className="relative group">
              {/* Stepper Node Dot */}
              <div className="absolute -left-[27px] top-1 w-4 h-4 rounded-full bg-white border-2 border-teal-600 flex items-center justify-center shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
              </div>
              {/* Step Card */}
              <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80 shadow-xs space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                  <span>Milestone #{idx + 1}</span>
                  {idx === 0 && <span className="text-teal-700">Baseline History</span>}
                  {idx === timelineSteps.length - 1 && <span className="text-rose-700">Triage Presentation</span>}
                </div>
                <p className="text-xs text-slate-800 font-medium leading-relaxed">
                  {step}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. AI Insights & Bilingual Follow-Up Questions (Soft Indigo Card) */}
      <div className="bg-indigo-50/80 border border-indigo-200 rounded-2xl p-3.5 sm:p-6 space-y-4 sm:space-y-5 shadow-xs text-indigo-950 min-w-0 max-w-full overflow-hidden">
        <div className="flex flex-wrap items-center justify-between border-b border-indigo-200/60 pb-3 gap-3">
          <div className="flex items-center space-x-2 min-w-0">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-indigo-950 truncate">
                AI Clinical Insights & Follow-Up Bedside Questions
              </h4>
              <p className="text-xs text-indigo-800 truncate">
                Empathetic vernacular phrasing for frontline ASHA / ANM nurse bedside screening
              </p>
            </div>
          </div>

          {/* Interactive Language Toggle Chips */}
          <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-xl border border-indigo-200 shadow-xs w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setAskLang("Odia")}
              className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer text-center ${
                askLang === "Odia"
                  ? "bg-teal-600 text-white shadow-xs"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <span className="sm:hidden">ଓଡ଼ିଆ</span>
              <span className="hidden sm:inline">ଓଡ଼ିଆ ରେ ପଚାରନ୍ତୁ</span>
            </button>
            <button
              type="button"
              onClick={() => setAskLang("Hindi")}
              className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer text-center ${
                askLang === "Hindi"
                  ? "bg-teal-600 text-white shadow-xs"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <span className="sm:hidden">हिन्दी</span>
              <span className="hidden sm:inline">हिन्दी में पूछें</span>
            </button>
            <button
              type="button"
              onClick={() => setAskLang("English")}
              className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer text-center ${
                askLang === "English"
                  ? "bg-teal-600 text-white shadow-xs"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Missing Gaps bullets */}
        {ai.missing_information_gaps && ai.missing_information_gaps.length > 0 && (
          <div className="bg-white/80 p-4 rounded-xl border border-indigo-200/80 text-xs space-y-1.5 shadow-xs">
            <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wide block">
              Identified Clinical Information Gaps:
            </span>
            <ul className="list-disc list-inside space-y-0.5 text-indigo-900 text-xs">
              {ai.missing_information_gaps.map((gap, gi) => (
                <li key={gi}>{gap}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Interactive Questions List */}
        <form onSubmit={handleSubmitFollowups} className="space-y-4">
          {(ai.suggested_followup_questions || []).map((qEn, idx) => {
            const odiaQuestions = [
              "ମଉସା/ବାପା, ଏହି ଛାତି ଦରଦଟା ହଠାତ୍ ବସିଥିବା ବେଳେ ହେଲା ନା ଚାଲିବା କିମ୍ବା କାମ କରିବା ବେଳେ ବଢୁଛି?",
              "ଦରଦଟା କଣ ଛାତିରୁ ଯାଇ ବାମ ହାତ, କାନ୍ଧ କିମ୍ବା ବେକ ଆଡ଼କୁ ବିନ୍ଧୁଛି କି?",
              "ଆଜି ସକାଳେ ବିପି କି ଡାଇବେଟିସ୍ ବଟିକା ଖାଇବାକୁ ଭୁଲି ଯାଇନାହାନ୍ତି ତ?"
            ];
            const hindiQuestions = [
              "चाचाजी, ये सीने का दर्द अचानक बैठे-बैठे शुरू हुआ या चलने-फिरने से बढ़ रहा है?",
              "क्या यह दर्द सीने से खिंचकर आपके बाएं हाथ, कंधे या जबड़े की तरफ भी जा रहा है?",
              "क्या आज सुबह बीपी या शुगर की दवा लेना भूल तो नहीं गए थे?"
            ];
            const englishQuestions = [
              "Did the pain start suddenly while resting, or does it worsen with movement or deep breaths?",
              "Does the discomfort spread toward your left arm, jaw, or shoulder?",
              "Did you take your prescribed blood pressure or diabetes medication this morning?"
            ];

            const currentEn = englishQuestions[idx] || qEn;

            const qLocal =
              ai.followup_questions_local_language && ai.followup_questions_local_language[idx]
                ? ai.followup_questions_local_language[idx]
                : askLang === "Hindi"
                ? hindiQuestions[idx] || currentEn
                : odiaQuestions[idx] || currentEn;

            const primaryText =
              askLang === "Odia"
                ? (p.language_preference === "Odia" && ai.followup_questions_local_language ? ai.followup_questions_local_language[idx] : odiaQuestions[idx]) || currentEn
                : askLang === "Hindi"
                ? (p.language_preference === "Hindi" && ai.followup_questions_local_language ? ai.followup_questions_local_language[idx] : hindiQuestions[idx]) || currentEn
                : currentEn;

            const secondaryText = askLang === "English" ? qLocal : qEn;

            return (
              <div
                key={idx}
                className="bg-white p-4 rounded-xl border border-indigo-200/90 shadow-xs space-y-3 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 min-w-0">
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-start space-x-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="font-bold text-slate-900 text-xs sm:text-sm leading-snug break-words">
                        {primaryText}
                      </p>
                    </div>

                    {secondaryText && secondaryText !== primaryText && (
                      <p className="text-slate-500 text-xs italic pl-7 break-words">
                        "{secondaryText}"
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSpeakQuestion(primaryText, askLang, idx)}
                    className={`self-start sm:self-auto flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border font-bold text-xs transition shrink-0 cursor-pointer shadow-xs min-h-[38px] ${
                      currentlySpeakingIdx === idx
                        ? "bg-indigo-600 text-white border-indigo-600 ring-2 ring-indigo-400 animate-pulse"
                        : "bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border-indigo-200"
                    }`}
                    title={`Speak aloud to patient in ${askLang}`}
                  >
                    <Volume2 className={`w-3.5 h-3.5 ${currentlySpeakingIdx === idx ? "text-white animate-bounce" : "text-indigo-600"}`} />
                    <span>
                      {currentlySpeakingIdx === idx ? "Speaking..." : `Speak (${askLang})`}
                    </span>
                  </button>
                </div>

                {/* 1-Click Tri-lingual Response Buttons (User requirement: [ Yes / ହଁ / हाँ ] [ No / ନାହିଁ / नहीं ] [ Unsure / ଜଣାନାହିଁ / पता नहीं ]) */}
                <div className="space-y-1 pt-1 border-t border-slate-100">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                    1-Click Patient Response:
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      {
                        label: "Yes / ହଁ / हाँ",
                        value: "Yes / ହଁ / हाँ",
                        hoverClass: "hover:border-emerald-500 hover:text-emerald-700"
                      },
                      {
                        label: "No / ନାହିଁ / नहीं",
                        value: "No / ନାହିଁ / नहीं",
                        hoverClass: "hover:border-rose-500 hover:text-rose-700"
                      },
                      {
                        label: "Unsure / ଜଣାନାହିଁ / पता नहीं",
                        value: "Unsure / ଜଣାନାହିଁ / पता नहीं",
                        hoverClass: "hover:border-amber-500 hover:text-amber-700"
                      }
                    ].map((btn) => {
                      const isSelected = answers[idx] === btn.value;
                      return (
                        <button
                          key={btn.value}
                          type="button"
                          onClick={() => handleChipClick(idx, btn.value)}
                          className={`text-xs px-3.5 py-1.5 rounded-xl border font-bold transition-all shadow-xs cursor-pointer ${
                            isSelected
                              ? "bg-teal-600 text-white border-teal-600 ring-2 ring-teal-500/30"
                              : `bg-slate-50 text-slate-700 border-slate-200 ${btn.hoverClass}`
                          }`}
                        >
                          {btn.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Additional Clinical Context Options */}
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="text-[10px] text-slate-400 font-medium">Or specific detail:</span>
                  {idx === 0 && (
                    <>
                      {["At Rest (Suddenly)", "During Physical Exertion", "After Heavy Meal", "Gradual Over Hours"].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleChipClick(idx, opt)}
                          className={`text-[11px] px-2.5 py-1 rounded-lg border transition font-medium cursor-pointer ${
                            answers[idx] === opt
                              ? "bg-slate-800 text-white border-slate-800 font-bold"
                              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </>
                  )}

                  {idx === 1 && (
                    <>
                      {["Taken Morning BP Dose", "Missed BP Medicine", "Ran out of tablets", "Took Aspirin"].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleChipClick(idx, opt)}
                          className={`text-[11px] px-2.5 py-1 rounded-lg border transition font-medium cursor-pointer ${
                            answers[idx] === opt
                              ? "bg-slate-800 text-white border-slate-800 font-bold"
                              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </>
                  )}

                  {idx === 2 && (
                    <>
                      {["Radiates to left arm", "Radiates to neck / jaw", "Localized center chest", "Spreads to back"].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleChipClick(idx, opt)}
                          className={`text-[11px] px-2.5 py-1 rounded-lg border transition font-medium cursor-pointer ${
                            answers[idx] === opt
                              ? "bg-slate-800 text-white border-slate-800 font-bold"
                              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </>
                  )}
                </div>

                {/* Free Text Input */}
                <input
                  type="text"
                  placeholder="Or type patient's spoken reply..."
                  value={answers[idx] || ""}
                  onChange={(e) => handleCustomAnswerChange(idx, e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
              </div>
            );
          })}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <span className="text-[11px] text-indigo-900 font-medium">
              {submittedAnswersSuccess
                ? "✅ Answers appended to patient's clinical timeline!"
                : "Record patient responses at bedside before transferring to doctor queue"}
            </span>

            <button
              type="submit"
              disabled={isSubmittingFollowup}
              className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition flex items-center space-x-1.5 shadow-md shadow-teal-700/20 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmittingFollowup ? "Updating..." : "Save Patient Responses"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 5. Handover Summary */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1">
        <span className="font-bold text-slate-700 uppercase tracking-wide block">
          Clinician Handover Summary:
        </span>
        <p className="text-slate-800 leading-relaxed font-medium">
          {ai.concise_clinician_summary}
        </p>
      </div>
    </div>
  );
}
