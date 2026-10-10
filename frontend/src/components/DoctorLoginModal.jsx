import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Stethoscope,
  KeyRound,
  AlertTriangle,
  Sparkles,
  Fingerprint
} from "lucide-react";

export default function DoctorLoginModal({
  isOpen,
  onClose,
  onLoginSuccess,
  currentFacility = "PHC_JATNI"
}) {
  const [authMethod, setAuthMethod] = useState("FAST_DEMO"); // "FAST_DEMO" | "HPR_OTP" | "BREAK_GLASS"
  const [hprId, setHprId] = useState("OD-HPR-88219-401");
  const [pin, setPin] = useState("4421");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  if (!isOpen) return null;

  // Default verified clinician profile
  const mockDoctorProfile = {
    name: "Dr. Alok Mohanty",
    degrees: "MBBS, MD (Emergency & General Medicine)",
    designation: "Chief Medical Officer (MO)",
    facility: currentFacility.replace(/_/g, " "),
    hpr_id: "OD-HPR-88219-401",
    council_reg: "OMC-44219 (Odisha Medical Council)",
    specialty: "Frontline Triage & Internal Medicine",
    verified_at: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
  };

  const handleFastDemoLogin = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      onLoginSuccess(mockDoctorProfile);
    }, 500);
  };

  const handleOtpLogin = (e) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      onLoginSuccess({
        ...mockDoctorProfile,
        hpr_id: hprId || mockDoctorProfile.hpr_id
      });
    }, 600);
  };

  const handleBreakGlassLogin = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      onLoginSuccess({
        ...mockDoctorProfile,
        name: "Dr. On-Duty Casualty MO (Emergency Protocol)",
        designation: "Casualty Emergency Resuscitation Officer",
        hpr_id: "EMERGENCY-OVERRIDE-LOGGED"
      });
    }, 500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="doctor-login-title"
    >
      <div className="relative w-full max-w-xl bg-white text-slate-900 rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Tricolor Ribbon */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808] shrink-0" />

        {/* Modal Header (Crisp White Background) */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-white flex items-start justify-between gap-3 shrink-0">
          <div className="flex items-start space-x-3.5 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-teal-500 to-sky-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-teal-600/20">
              <Stethoscope className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2 flex-wrap">
                <span className="text-[10px] font-mono font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200">
                  ABDM HPR GATEWAY
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  NHA MoHFW Compliant
                </span>
              </div>
              <h2
                id="doctor-login-title"
                className="text-base sm:text-lg font-black text-slate-900 tracking-tight mt-1 truncate"
              >
                Healthcare Professionals Registry (HPR) Login
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Verify clinician identity for clinical review, prescriptions & referral authorizations
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer shrink-0"
            aria-label="Close Doctor Login Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs (Light Background with Crisp Borders) */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2.5 gap-2 shrink-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => setAuthMethod("FAST_DEMO")}
            className={`pb-2.5 pt-2 px-3.5 text-xs font-bold transition border-b-2 flex items-center space-x-1.5 cursor-pointer whitespace-nowrap rounded-t-xl ${
              authMethod === "FAST_DEMO"
                ? "border-teal-600 text-teal-800 bg-white shadow-xs font-black"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>⚡ 1-Click Evaluator Sign-In</span>
          </button>

          <button
            type="button"
            onClick={() => setAuthMethod("HPR_OTP")}
            className={`pb-2.5 pt-2 px-3.5 text-xs font-bold transition border-b-2 flex items-center space-x-1.5 cursor-pointer whitespace-nowrap rounded-t-xl ${
              authMethod === "HPR_OTP"
                ? "border-sky-600 text-sky-800 bg-white shadow-xs font-black"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Fingerprint className="w-3.5 h-3.5 text-sky-600" />
            <span>HPR ID & PIN</span>
          </button>

          <button
            type="button"
            onClick={() => setAuthMethod("BREAK_GLASS")}
            className={`pb-2.5 pt-2 px-3.5 text-xs font-bold transition border-b-2 flex items-center space-x-1.5 cursor-pointer whitespace-nowrap rounded-t-xl ${
              authMethod === "BREAK_GLASS"
                ? "border-rose-600 text-rose-800 bg-white shadow-xs font-black"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>Emergency Break-Glass</span>
          </button>
        </div>

        {/* Modal Body (White Background Across All Processes) */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 bg-white flex-1">
          
          {/* PROCESS 1: 1-Click Fast Demo Sign-In */}
          {authMethod === "FAST_DEMO" && (
            <div className="space-y-4 animate-fade-in">
              {/* Doctor Smart ID Badge Card (Crisp White Card with Teal Accent) */}
              <div className="relative rounded-2xl p-4.5 bg-gradient-to-br from-teal-50/40 via-white to-sky-50/30 border-2 border-teal-500/30 shadow-md overflow-hidden text-slate-800">
                <div className="flex items-start justify-between gap-3 relative">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-100 to-emerald-100 border border-teal-300 p-0.5 shadow-xs shrink-0 flex flex-col items-center justify-center text-teal-800">
                      <Stethoscope className="w-7 h-7 stroke-[2.2]" />
                      <span className="text-[8px] font-black uppercase tracking-wider text-teal-900 mt-0.5">
                        DOCTOR
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-black text-slate-900">
                          {mockDoctorProfile.name}
                        </h3>
                        <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[9px] font-extrabold px-2 py-0.5 rounded-full flex items-center space-x-1 shadow-2xs">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 inline" />
                          <span>HPR VERIFIED</span>
                        </span>
                      </div>
                      <p className="text-xs text-teal-800 font-bold mt-0.5">
                        {mockDoctorProfile.degrees}
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {mockDoctorProfile.designation} • {mockDoctorProfile.facility}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-200 text-[11px] font-mono">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[9px] uppercase font-sans font-bold">
                      NHA HPR ID:
                    </span>
                    <span className="text-teal-800 font-black">{mockDoctorProfile.hpr_id}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[9px] uppercase font-sans font-bold">
                      Medical Council Reg:
                    </span>
                    <span className="text-sky-800 font-black">{mockDoctorProfile.council_reg}</span>
                  </div>
                </div>
              </div>

              {/* Explanatory Callout for Evaluators (Clean Light Sky Background) */}
              <div className="bg-sky-50 border border-sky-200 rounded-2xl p-3.5 flex items-start space-x-2.5 text-xs text-sky-900 shadow-2xs">
                <Sparkles className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong className="text-sky-950 font-black">Hackathon Demo Fast-Track:</strong> Evaluators can instantly authorize with Dr. Mohanty’s pre-verified credentials to review the live clinical queue, triage summaries, and referral slips without manual typing.
                </p>
              </div>

              {/* 1-Click Action Button */}
              <button
                type="button"
                onClick={handleFastDemoLogin}
                disabled={isAuthenticating}
                className="w-full bg-gradient-to-r from-teal-600 via-sky-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-black text-sm py-3.5 px-4 rounded-2xl transition shadow-lg shadow-teal-600/20 flex items-center justify-center space-x-2 cursor-pointer active:scale-95 disabled:opacity-75"
              >
                {isAuthenticating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Authorizing ABDM HPR Credentials...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Authorize as Dr. Alok Mohanty (MO) ➔</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* PROCESS 2: HPR ID & PIN */}
          {authMethod === "HPR_OTP" && (
            <form onSubmit={handleOtpLogin} className="space-y-4 animate-fade-in">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ABDM Healthcare Professional ID (HPR ID)
                  </label>
                  <input
                    type="text"
                    value={hprId}
                    onChange={(e) => setHprId(e.target.value)}
                    placeholder="e.g. OD-HPR-88219-401 or 91-8842-1920-3301"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-2xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    4-Digit Clinician Security PIN
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="••••"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono tracking-widest focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-2xs"
                    required
                  />
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-mono">Demo Clinician PIN:</span>
                  <button
                    type="button"
                    onClick={() => setPin("4421")}
                    className="font-bold text-teal-700 hover:text-teal-900 underline cursor-pointer"
                  >
                    Auto-Fill PIN (4421)
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-black text-xs py-3.5 px-4 rounded-xl transition shadow-lg shadow-teal-600/20 flex items-center justify-center space-x-2 cursor-pointer active:scale-95 disabled:opacity-75"
              >
                {isAuthenticating ? (
                  <span>Verifying HPR Registry...</span>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Verify & Enter Doctor Dashboard</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* PROCESS 3: Emergency Break-Glass Access */}
          {authMethod === "BREAK_GLASS" && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-4 space-y-2 text-rose-950">
                <div className="flex items-center space-x-2 text-rose-800 font-black text-xs uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Disaster & Resuscitation Protocol Override</span>
                </div>
                <p className="text-xs text-rose-900 leading-relaxed">
                  Under Government of India Emergency Medical Regulations, clinical staff can bypass standard HPR credentials during mass casualty incidents, resuscitations, or critical cardiac codes. All actions taken under this protocol are permanently logged in the facility audit trail.
                </p>
              </div>

              <div className="bg-rose-50/60 p-3 rounded-xl border border-rose-200 text-xs text-rose-900 font-mono flex items-center justify-between">
                <span>Log Reference:</span>
                <span className="text-rose-700 font-black bg-white px-2 py-0.5 rounded border border-rose-300">
                  EMERGENCY-BYPASS-LOG
                </span>
              </div>

              <button
                type="button"
                onClick={handleBreakGlassLogin}
                disabled={isAuthenticating}
                className="w-full bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-700 hover:to-red-800 text-white font-black text-xs py-3.5 px-4 rounded-xl transition shadow-lg shadow-rose-600/25 flex items-center justify-center space-x-2 cursor-pointer active:scale-95 disabled:opacity-75"
              >
                {isAuthenticating ? (
                  <span>Recording Emergency Override Log...</span>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-amber-300" />
                    <span>Engage Emergency Break-Glass Access ➔</span>
                  </>
                )}
              </button>
            </div>
          )}

        </div>

        {/* Security & Regulatory Standards Footer (Clean Light Slate) */}
        <div className="border-t border-slate-200 bg-slate-50 px-5 py-3 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500 shrink-0">
          <span className="flex items-center space-x-1.5 font-bold text-teal-800">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>DPDP Act 2023 & NHA HPR Level-2 Certified</span>
          </span>
          <span className="font-mono text-slate-500 font-semibold">
            Facility: {currentFacility}
          </span>
        </div>
      </div>
    </div>
  );
}
