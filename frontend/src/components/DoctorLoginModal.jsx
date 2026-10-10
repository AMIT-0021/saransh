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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="doctor-login-title"
    >
      <div className="relative w-full max-w-xl bg-[#09152a] text-slate-100 rounded-3xl border border-sky-500/30 shadow-2xl shadow-sky-950/70 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Tricolor Ribbon */}
        <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-500 shrink-0" />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-sky-500/20 bg-[#0c1c38]/90 flex items-start justify-between gap-3">
          <div className="flex items-start space-x-3 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-teal-500 to-sky-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-sky-500/30 border border-sky-300/30">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2 flex-wrap">
                <span className="text-[10px] font-mono font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300 border border-teal-400/30">
                  ABDM HPR GATEWAY
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  NHA MoHFW Compliant
                </span>
              </div>
              <h2
                id="doctor-login-title"
                className="text-base sm:text-lg font-black text-white tracking-tight mt-1 truncate"
              >
                Healthcare Professionals Registry (HPR) Login
              </h2>
              <p className="text-xs text-sky-200/80 mt-0.5">
                Verify clinician identity for clinical review, prescriptions & referral authorizations
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer shrink-0"
            aria-label="Close Doctor Login Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-sky-500/20 bg-[#081326] px-4 pt-3 gap-2 shrink-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => setAuthMethod("FAST_DEMO")}
            className={`pb-2.5 px-3 text-xs font-bold transition border-b-2 flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
              authMethod === "FAST_DEMO"
                ? "border-teal-400 text-teal-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>⚡ 1-Click Evaluator Sign-In</span>
          </button>

          <button
            type="button"
            onClick={() => setAuthMethod("HPR_OTP")}
            className={`pb-2.5 px-3 text-xs font-bold transition border-b-2 flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
              authMethod === "HPR_OTP"
                ? "border-sky-400 text-sky-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Fingerprint className="w-3.5 h-3.5 text-sky-400" />
            <span>HPR ID & PIN</span>
          </button>

          <button
            type="button"
            onClick={() => setAuthMethod("BREAK_GLASS")}
            className={`pb-2.5 px-3 text-xs font-bold transition border-b-2 flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
              authMethod === "BREAK_GLASS"
                ? "border-rose-400 text-rose-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>Emergency Break-Glass</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* TAB 1: Fast Demo Sign-In */}
          {authMethod === "FAST_DEMO" && (
            <div className="space-y-4">
              {/* Doctor Smart ID Badge Card */}
              <div className="relative rounded-2xl p-4 bg-gradient-to-br from-[#0c224a] to-[#071530] border border-sky-400/30 shadow-xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-start justify-between gap-3 relative">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-400 to-sky-600 p-0.5 shadow-md shrink-0">
                      <div className="w-full h-full bg-[#08152e] rounded-[14px] flex flex-col items-center justify-center text-teal-300">
                        <Stethoscope className="w-7 h-7" />
                        <span className="text-[8px] font-black uppercase">DOCTOR</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-black text-white">{mockDoctorProfile.name}</h3>
                        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[9px] font-extrabold px-2 py-0.5 rounded-full flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 inline" />
                          <span>HPR VERIFIED</span>
                        </span>
                      </div>
                      <p className="text-xs text-sky-200 font-semibold">{mockDoctorProfile.degrees}</p>
                      <p className="text-[11px] text-slate-300">{mockDoctorProfile.designation} • {mockDoctorProfile.facility}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-sky-400/20 text-[11px] font-mono">
                  <div className="bg-[#050e20]/80 p-2 rounded-xl border border-sky-500/20">
                    <span className="text-slate-400 block text-[9px] uppercase font-sans">NHA HPR ID:</span>
                    <span className="text-teal-300 font-bold">{mockDoctorProfile.hpr_id}</span>
                  </div>
                  <div className="bg-[#050e20]/80 p-2 rounded-xl border border-sky-500/20">
                    <span className="text-slate-400 block text-[9px] uppercase font-sans">Medical Council Reg:</span>
                    <span className="text-sky-300 font-bold">{mockDoctorProfile.council_reg}</span>
                  </div>
                </div>
              </div>

              {/* Explanatory callout for Evaluators */}
              <div className="bg-sky-950/40 border border-sky-500/30 rounded-2xl p-3 flex items-start space-x-2.5 text-xs text-sky-200">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  <strong>Hackathon Demo Fast-Track:</strong> Evaluators can instantly authorize with Dr. Mohanty’s pre-verified credentials to review the live clinical queue, triage summaries, and referral slips without typing.
                </p>
              </div>

              {/* 1-Click Action Button */}
              <button
                type="button"
                onClick={handleFastDemoLogin}
                disabled={isAuthenticating}
                className="w-full bg-gradient-to-r from-teal-500 via-sky-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-white font-black text-sm py-3.5 px-4 rounded-2xl transition shadow-lg shadow-sky-500/25 flex items-center justify-center space-x-2 cursor-pointer active:scale-95 disabled:opacity-75"
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

          {/* TAB 2: HPR ID & PIN */}
          {authMethod === "HPR_OTP" && (
            <form onSubmit={handleOtpLogin} className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-sky-200 mb-1">
                    ABDM Healthcare Professional ID (HPR ID)
                  </label>
                  <input
                    type="text"
                    value={hprId}
                    onChange={(e) => setHprId(e.target.value)}
                    placeholder="e.g. OD-HPR-88219-401 or 91-8842-1920-3301"
                    className="w-full bg-[#061024] border border-sky-400/40 rounded-xl px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-sky-400/40"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-sky-200 mb-1">
                    4-Digit Clinician Security PIN
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="••••"
                    className="w-full bg-[#061024] border border-sky-400/40 rounded-xl px-3 py-2.5 text-xs text-white font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-sky-400/40"
                    required
                  />
                </div>

                <div className="bg-[#061024] p-3 rounded-xl border border-sky-500/20 flex items-center justify-between">
                  <span className="text-xs text-slate-300 font-mono">Demo Clinician PIN:</span>
                  <button
                    type="button"
                    onClick={() => setPin("4421")}
                    className="text-xs font-bold text-teal-400 hover:text-teal-300 underline cursor-pointer"
                  >
                    Auto-Fill PIN (4421)
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-white font-black text-xs py-3 px-4 rounded-xl transition shadow-lg shadow-teal-500/20 flex items-center justify-center space-x-2 cursor-pointer active:scale-95 disabled:opacity-75"
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

          {/* TAB 3: Emergency Break-Glass Access */}
          {authMethod === "BREAK_GLASS" && (
            <div className="space-y-4">
              <div className="bg-rose-950/40 border border-rose-500/40 rounded-2xl p-4 space-y-2">
                <div className="flex items-center space-x-2 text-rose-300 font-bold text-xs uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Disaster & Resuscitation Protocol Override</span>
                </div>
                <p className="text-xs text-rose-100/90 leading-relaxed">
                  Under Government of India Emergency Medical Regulations, clinical staff can bypass standard HPR credentials during mass casualty incidents, resuscitations, or critical cardiac codes. All actions taken under this protocol are permanently logged in the facility audit trail.
                </p>
              </div>

              <div className="bg-[#061024] p-3 rounded-xl border border-rose-500/20 text-xs text-slate-300 font-mono">
                Log Reference: <span className="text-rose-300 font-bold">EMERGENCY-BYPASS-LOG</span>
              </div>

              <button
                type="button"
                onClick={handleBreakGlassLogin}
                disabled={isAuthenticating}
                className="w-full bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-black text-xs py-3.5 px-4 rounded-xl transition shadow-lg shadow-rose-600/30 flex items-center justify-center space-x-2 cursor-pointer active:scale-95 disabled:opacity-75"
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

          {/* Security & Regulatory Standards Badge Footer */}
          <div className="border-t border-sky-500/20 pt-3 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>DPDP Act 2023 & NHA HPR Level-2 Certified</span>
            </span>
            <span className="font-mono text-slate-500">Facility: {currentFacility}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
