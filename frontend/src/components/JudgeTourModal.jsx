import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Sparkles,
  X,
  Stethoscope,
  ShieldCheck,
  Volume2,
  AlertTriangle,
  FileText,
  CheckCircle2,
  ArrowRight,
  Zap,
  Globe,
  Building2,
  HeartPulse,
  Share2
} from "lucide-react";

export default function JudgeTourModal({
  isOpen,
  onClose,
  onLaunchPreset
}) {
  // Handle Esc key to close
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="judge-tour-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden text-slate-900">
        {/* Top Gradient Header */}
        <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white p-5 sm:p-6 shrink-0 relative overflow-hidden">
          {/* Ambient decorative glow */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-teal-400/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-start justify-between relative z-10 gap-3">
            <div className="space-y-1.5">
              <div className="inline-flex items-center space-x-2 bg-teal-500/20 border border-teal-400/40 px-3 py-0.5 rounded-full text-xs font-black tracking-wider text-teal-200 uppercase">
                <Sparkles className="w-3.5 h-3.5 text-teal-300 animate-pulse" />
                <span>BPUT Hackathon • 3-Minute Evaluator Tour</span>
              </div>
              <h2 id="judge-tour-title" className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                <span>🎯 Quick Demo Guide for Judges</span>
              </h2>
              <p className="text-xs sm:text-sm text-teal-100/90 font-medium max-w-2xl">
                Experience Saransh (सारांश) from frontline vernacular intake to deterministic resuscitation alert and ABDM cryptographic referral handoff.
              </p>
            </div>

            <button
              onClick={onClose}
              aria-label="Close Judge Tour"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6 text-sm">
          {/* Quick Launch Hero Card */}
          <div className="bg-gradient-to-br from-teal-50 via-emerald-50/50 to-slate-50 border-2 border-teal-500/30 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-teal-800 bg-teal-200/60 px-2 py-0.5 rounded-md">
                Fast-Track Evaluation
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                1-Click Recommended Demo: Acute Cardiac Emergency (62M)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                Loads an authentic 62M rural patient presenting with SpO₂ 89%, crushing chest pain, and 24kHz studio-mastered Odia voice. Demonstrates instant deterministic RED escalation!
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                if (onLaunchPreset) onLaunchPreset("RAMESH_CARDIAC_RED");
              }}
              className="w-full md:w-auto shrink-0 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-5 py-3 rounded-xl font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer group"
            >
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300 group-hover:scale-110 transition-transform" />
              <span>🚀 Launch Ramesh Demo Now</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* The 3-Step Winning Evaluation Sequence */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>The 3 Core Demonstration Pillars</span>
              </h3>
              <span className="text-[11px] text-slate-500 font-semibold">Total time: ~3 mins</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* Step 1 */}
              <div className="bg-slate-50 hover:bg-teal-50/30 border border-slate-200 rounded-2xl p-4 space-y-2.5 transition">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-xl bg-teal-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                    1
                  </span>
                  <span className="text-[10px] font-bold text-teal-800 bg-teal-100/80 px-2 py-0.5 rounded-full">
                    Nurse Station
                  </span>
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">
                  Vernacular Audio & Vitals
                </h4>
                <ul className="text-xs text-slate-600 space-y-1.5 leading-relaxed">
                  <li className="flex items-start gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                    <span>Hit <strong>"Listen to Patient"</strong> to hear authentic 24kHz DSP Odia speech (*"ଡାକ୍ତର ବାବୁ, ୨ ଘଣ୍ଟା ହେଲା ଛାତିଟା ପଥର ଭଳି..."*).</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                    <span>Switch language to <strong>Hindi</strong> or <strong>English</strong> to see synchronous script adaptation.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                    <span>Notice the <strong>2D Body Map</strong> for non-literate patients.</span>
                  </li>
                </ul>
              </div>

              {/* Step 2 */}
              <div className="bg-slate-50 hover:bg-rose-50/30 border border-slate-200 rounded-2xl p-4 space-y-2.5 transition">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-xl bg-rose-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                    2
                  </span>
                  <span className="text-[10px] font-bold text-rose-800 bg-rose-100/80 px-2 py-0.5 rounded-full">
                    Dual-Engine AI
                  </span>
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">
                  Deterministic Safety Floor
                </h4>
                <ul className="text-xs text-slate-600 space-y-1.5 leading-relaxed">
                  <li className="flex items-start gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                    <span>Click <strong>"Run Clinical AI Triage"</strong> to trigger the dual engine.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                    <span>Formula: <code>MAX(Rule, AI)</code> enforces SpO₂ 89% as <strong>strictly RED</strong>. AI cannot hallucinate or downgrade!</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                    <span>Hear the <strong>Hospital Emergency Siren</strong> and view the bay alert banner.</span>
                  </li>
                </ul>
              </div>

              {/* Step 3 */}
              <div className="bg-slate-50 hover:bg-emerald-50/30 border border-slate-200 rounded-2xl p-4 space-y-2.5 transition">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                    3
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                    Doctor Command
                  </span>
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">
                  Doctor Review & Referral
                </h4>
                <ul className="text-xs text-slate-600 space-y-1.5 leading-relaxed">
                  <li className="flex items-start gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Switch to <strong>Doctor Queue</strong> tab. Ramesh appears at the top of the RED lane with bed telemetry.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Click <strong>"Generate Referral Slip"</strong> to see the Government NHM transfer document.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Highlights: <strong>SHA-256 Hash</strong>, 108 ambulance escort, and <strong>ABDM FHIR R4</strong> format.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Other Preset Patient Profiles */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-2.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
              Try Other Clinical Scenarios:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <button
                onClick={() => {
                  onClose();
                  if (onLaunchPreset) onLaunchPreset("PRIYA_DENGUE_YELLOW");
                }}
                className="p-2.5 bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-xl text-left transition font-semibold flex items-center justify-between group cursor-pointer shadow-2xs"
              >
                <div>
                  <strong className="block text-amber-900">🟠 Priya S. (34F)</strong>
                  <span className="text-[11px] text-slate-500">Dengue Fever • Platelets 85k (YELLOW)</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                onClick={() => {
                  onClose();
                  if (onLaunchPreset) onLaunchPreset("MEENA_MATERNAL_YELLOW");
                }}
                className="p-2.5 bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-xl text-left transition font-semibold flex items-center justify-between group cursor-pointer shadow-2xs"
              >
                <div>
                  <strong className="block text-amber-900">🤰 Meena D. (28F)</strong>
                  <span className="text-[11px] text-slate-500">8M Pregnant • Pre-eclampsia BP 168/110</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                onClick={() => {
                  onClose();
                  if (onLaunchPreset) onLaunchPreset("SUBHASH_HEADACHE_GREEN");
                }}
                className="p-2.5 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-left transition font-semibold flex items-center justify-between group cursor-pointer shadow-2xs"
              >
                <div>
                  <strong className="block text-emerald-900">🟢 Subhash P. (24M)</strong>
                  <span className="text-[11px] text-slate-500">Tension Headache • Routine OPD (GREEN)</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          </div>

          {/* Winning Pitch Line for Judges */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 text-xs space-y-1.5 border border-slate-800">
            <div className="flex items-center space-x-2 text-teal-400 font-bold">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>Core Architectural Principle (The Judge Pitch):</span>
            </div>
            <p className="text-slate-300 leading-relaxed italic">
              “Saransh does not train a black-box medical model because neural networks carry lethal hallucination risks. Instead, we use India's sovereign Sarvam AI for Indic vernacular speech, and couple it with an unbreakable, deterministic AIIMS/WHO safety floor (<code>MAX(Rule, AI)</code>) so mathematical rules guarantee an emergency is never downgraded.”
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100/90 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
          <div className="text-slate-500 font-semibold flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-teal-600" />
            <span>Problem Statement 1 • Team CODEX (BH26PS07T060)</span>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition cursor-pointer shadow-xs"
          >
            Close & Start Testing
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
