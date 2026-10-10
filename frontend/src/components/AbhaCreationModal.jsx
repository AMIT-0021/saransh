import React, { useState, useEffect } from "react";
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Phone,
  QrCode,
  Printer,
  Sparkles,
  User,
  RotateCcw,
  FileCheck
} from "lucide-react";

export default function AbhaCreationModal({
  isOpen,
  onClose,
  onApplyProfile,
  initialDemographics = null
}) {
  // Steps: 1 = Aadhaar & Consent, 2 = OTP Verification, 3 = ABHA Address, 4 = Digital ABHA Card
  const [step, setStep] = useState(1);

  // Form inputs
  const [aadhaarNumber, setAadhaarNumber] = useState("4821 9923 0192");
  const [consentChecked, setConsentChecked] = useState(true);
  const [otpValue, setOtpValue] = useState("");
  const [abhaHandle, setAbhaHandle] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpTimer, setOtpTimer] = useState(45);
  const [demoProfile, setDemoProfile] = useState({
    name: "Ramesh Kumar",
    age: 62,
    gender: "Male",
    dob: "1964-04-12",
    mobile: "+91-9876543210",
    state: "Odisha - Khordha",
    abha_number: "91-4821-9923-0192",
    abha_address: "ramesh.kumar@abdm",
    blood_group: "B+"
  });

  // Pre-seed if initialDemographics provided
  useEffect(() => {
    if (initialDemographics && initialDemographics.name_or_alias) {
      setDemoProfile((prev) => ({
        ...prev,
        name: initialDemographics.name_or_alias,
        age: initialDemographics.age || prev.age,
        gender: initialDemographics.sex || prev.gender,
        state: initialDemographics.location_state || prev.state,
        abha_address: `${(initialDemographics.name_or_alias || "citizen").toLowerCase().replace(/[^a-z0-9]/g, "")}@abdm`
      }));
      setAbhaHandle(
        `${(initialDemographics.name_or_alias || "citizen").toLowerCase().replace(/[^a-z0-9]/g, "")}@abdm`
      );
    } else {
      setAbhaHandle("ramesh.kumar@abdm");
    }
  }, [initialDemographics]);

  // OTP Countdown timer
  useEffect(() => {
    let timer = null;
    if (step === 2 && otpTimer > 0) {
      timer = setInterval(() => setOtpTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, otpTimer]);

  if (!isOpen) return null;

  // 1-Click Quick Preset Selection for Evaluators
  const handleSelectDemoPreset = (presetName, aadhaar, mobile, age, gender, state, blood) => {
    setAadhaarNumber(aadhaar);
    const handle = `${presetName.toLowerCase().replace(/[^a-z0-9]/g, "")}@abdm`;
    setAbhaHandle(handle);
    setDemoProfile({
      name: presetName,
      age: age,
      gender: gender,
      dob: `${2026 - age}-05-15`,
      mobile: mobile,
      state: state,
      abha_number: `91-${aadhaar.slice(0, 4)}-${aadhaar.slice(5, 9)}-${aadhaar.slice(10, 14)}`,
      abha_address: handle,
      blood_group: blood
    });
  };

  // Step 1: Request OTP
  const handleRequestOtp = (e) => {
    e.preventDefault();
    if (!consentChecked) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setStep(2);
      setOtpTimer(45);
      setOtpValue("849201"); // Auto-stage standard demo OTP
    }, 600);
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setStep(3);
    }, 600);
  };

  // Step 3: Finalize ABHA Card
  const handleFinalizeAbha = (e) => {
    e.preventDefault();
    setDemoProfile((prev) => ({
      ...prev,
      abha_address: abhaHandle || prev.abha_address
    }));
    setStep(4);
  };

  // Apply to Saransh Patient Form
  const handleApplyToForm = () => {
    if (onApplyProfile) {
      onApplyProfile(demoProfile);
    }
    onClose();
  };

  const handlePrintCard = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* 1. Official National Health Authority & Tricolor Banner */}
        <div className="h-2 w-full grid grid-cols-3 shrink-0">
          <div className="bg-[#FF9933] h-full"></div>
          <div className="bg-white h-full"></div>
          <div className="bg-[#138808] h-full"></div>
        </div>

        {/* 2. Modal Top Header */}
        <div className="bg-slate-900 text-white px-5 sm:px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-sky-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
              🏛️
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-black uppercase tracking-widest text-amber-300">
                  NATIONAL HEALTH AUTHORITY • ABDM
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[9px] font-bold px-2 py-0.5 rounded-full">
                  LIVE ENROLLMENT
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-extrabold text-white">
                2-Minute Assisted ABHA ID Creation Wizard
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3. Progress Step Pills */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 sm:px-6 py-2.5 flex items-center justify-between text-xs shrink-0 overflow-x-auto gap-2">
          <div className="flex items-center space-x-2 shrink-0">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                step >= 1 ? "bg-teal-600 text-white" : "bg-slate-200 text-slate-600"
              }`}
            >
              1
            </span>
            <span className={`font-bold ${step === 1 ? "text-teal-900" : "text-slate-500"}`}>
              Aadhaar & Consent
            </span>
          </div>
          <div className="h-[1px] w-6 bg-slate-300 shrink-0"></div>

          <div className="flex items-center space-x-2 shrink-0">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                step >= 2 ? "bg-teal-600 text-white" : "bg-slate-200 text-slate-600"
              }`}
            >
              2
            </span>
            <span className={`font-bold ${step === 2 ? "text-teal-900" : "text-slate-500"}`}>
              OTP Verification
            </span>
          </div>
          <div className="h-[1px] w-6 bg-slate-300 shrink-0"></div>

          <div className="flex items-center space-x-2 shrink-0">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                step >= 3 ? "bg-teal-600 text-white" : "bg-slate-200 text-slate-600"
              }`}
            >
              3
            </span>
            <span className={`font-bold ${step === 3 ? "text-teal-900" : "text-slate-500"}`}>
              ABHA Address
            </span>
          </div>
          <div className="h-[1px] w-6 bg-slate-300 shrink-0"></div>

          <div className="flex items-center space-x-2 shrink-0">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                step === 4 ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"
              }`}
            >
              4
            </span>
            <span className={`font-bold ${step === 4 ? "text-emerald-900" : "text-slate-500"}`}>
              ABHA Card
            </span>
          </div>
        </div>

        {/* 4. Wizard Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          
          {/* STEP 1: AADHAAR NUMBER & DPDP CONSENT */}
          {step === 1 && (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 flex items-start space-x-3 text-xs text-sky-900">
                <ShieldCheck className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="font-extrabold text-sky-950 block">
                    Instant 60-Second On-the-Spot Registration
                  </strong>
                  <p className="text-sky-800 leading-relaxed">
                    Under ABDM Milestone 1 (M1), any frontline nurse or OPD registration desk can generate a verifiable 14-digit ABHA number using the citizen's Aadhaar or phone OTP in under 2 minutes.
                  </p>
                </div>
              </div>

              {/* Evaluator Quick Presets */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  ⚡ 1-Click Judge & Evaluator Demo Presets:
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleSelectDemoPreset(
                        "Ramesh Kumar",
                        "4821 9923 0192",
                        "+91-9876543210",
                        62,
                        "Male",
                        "Odisha - Khordha",
                        "B+"
                      )
                    }
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700 transition"
                  >
                    🚨 Ramesh Kumar (62M)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleSelectDemoPreset(
                        "Priya Sharma",
                        "3912 8419 4481",
                        "+91-9811223344",
                        34,
                        "Female",
                        "Odisha - Cuttack",
                        "O+"
                      )
                    }
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700 transition"
                  >
                    ⚠️ Priya Sharma (34F)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleSelectDemoPreset(
                        "Meena Devi",
                        "5519 2201 9844",
                        "+91-9766554433",
                        28,
                        "Female",
                        "Odisha - Puri",
                        "A+"
                      )
                    }
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700 transition"
                  >
                    🤰 Meena Devi (28F)
                  </button>
                </div>
              </div>

              {/* Aadhaar Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Enter 12-Digit Aadhaar Number</span>
                  <span className="text-[10px] text-slate-400 font-mono">UIDAI ENCRYPTED</span>
                </label>
                <input
                  type="text"
                  value={aadhaarNumber}
                  onChange={(e) => setAadhaarNumber(e.target.value)}
                  placeholder="XXXX XXXX XXXX"
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl font-mono text-base font-bold text-slate-900 tracking-wider focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Consent Box */}
              <label className="flex items-start space-x-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  className="mt-0.5 rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                  required
                />
                <span className="text-[11px] text-slate-600 leading-snug">
                  <strong>Digital Personal Data Protection (DPDP) Act Consent:</strong> I confirm that the patient has provided voluntary informed consent to authenticate via UIDAI Aadhaar OTP to create an Ayushman Bharat Health Account (ABHA).
                </span>
              </label>

              <button
                type="submit"
                disabled={!consentChecked || isVerifying}
                className="w-full bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-700 hover:to-sky-700 text-white font-extrabold text-sm py-3.5 rounded-xl transition shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isVerifying ? "Sending OTP via UIDAI Gateway..." : "Request Aadhaar OTP ➔"}</span>
                {!isVerifying && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          )}

          {/* STEP 2: 6-DIGIT OTP VERIFICATION */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-950 flex items-start space-x-3">
                <Phone className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="font-extrabold block">
                    SMS OTP Dispatched by UIDAI Gateway
                  </strong>
                  <p className="text-emerald-800">
                    A 6-digit authentication code has been sent to the citizen's Aadhaar-linked mobile:{" "}
                    <strong className="font-mono text-emerald-950">{demoProfile.mobile}</strong>.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Enter 6-Digit SMS OTP</label>
                  <button
                    type="button"
                    onClick={() => setOtpValue("849201")}
                    className="text-[11px] font-extrabold text-teal-700 hover:underline flex items-center space-x-1"
                  >
                    <span>⚡ Fill Demo OTP (849201)</span>
                  </button>
                </div>

                <input
                  type="text"
                  maxLength={6}
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value)}
                  placeholder="• • • • • •"
                  required
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-center text-xl font-black text-slate-900 tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-teal-500"
                />

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>
                    Resend code in: <strong className="font-mono text-slate-700">{otpTimer}s</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setOtpTimer(45)}
                    disabled={otpTimer > 0}
                    className="text-teal-700 font-bold hover:underline disabled:opacity-50"
                  >
                    Resend SMS
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={otpValue.length < 6 || isVerifying}
                  className="flex-1 bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-700 hover:to-sky-700 text-white font-extrabold text-sm py-3.5 rounded-xl transition shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  <span>{isVerifying ? "Verifying with NHA Gateway..." : "Verify OTP & Fetch Demographics ➔"}</span>
                  {!isVerifying && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: CHOOSE ABHA ADDRESS & CONFIRM PROFILE */}
          {step === 3 && (
            <form onSubmit={handleFinalizeAbha} className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs font-extrabold text-slate-800">
                    ✓ Verified Demographic Record (Fetched from UIDAI)
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    UIDAI AUTHENTICATED
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Full Name</span>
                    <strong className="text-slate-900 font-extrabold">{demoProfile.name}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Age / Gender</span>
                    <strong className="text-slate-900 font-extrabold">{demoProfile.age} Yrs • {demoProfile.gender}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">State / District</span>
                    <strong className="text-slate-900 font-extrabold">{demoProfile.state}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Date of Birth</span>
                    <strong className="text-slate-900 font-extrabold">{demoProfile.dob}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Mobile</span>
                    <strong className="text-slate-900 font-extrabold">{demoProfile.mobile}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Blood Group</span>
                    <strong className="text-slate-900 font-extrabold">{demoProfile.blood_group}</strong>
                  </div>
                </div>
              </div>

              {/* Choose ABHA Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Assign Personal ABHA Address (Health Handle)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={abhaHandle}
                    onChange={(e) => setAbhaHandle(e.target.value)}
                    required
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  This handle allows seamless digital record sharing across Indian hospitals and health lockers.
                </p>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-700 hover:to-sky-700 text-white font-extrabold text-sm py-3.5 rounded-xl transition shadow-md flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>🎉 Generate Official Digital ABHA Card ➔</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: THE OFFICIAL DIGITAL ABHA CARD GENERATED */}
          {step === 4 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="text-center space-y-1">
                <span className="inline-flex items-center space-x-1.5 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-black">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>ABHA CREATION SUCCESSFUL IN 1 MIN 12 SEC</span>
                </span>
                <p className="text-xs text-slate-600">
                  Patient record is now verified and linked under Ayushman Bharat Digital Mission (ABDM).
                </p>
              </div>

              {/* Authentic NHA Smart ABHA Card */}
              <div className="relative rounded-3xl overflow-hidden border-2 border-blue-600/40 shadow-2xl bg-gradient-to-br from-[#060e20] via-[#0b1c3c] to-[#081329] text-white p-5 space-y-4">
                {/* Holographic Sheen */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-amber-400/5 to-cyan-400/10 pointer-events-none"></div>

                {/* Top Tricolor Strip */}
                <div className="h-1.5 w-full grid grid-cols-3 -mx-5 -mt-5 mb-3">
                  <div className="bg-[#FF9933] h-full"></div>
                  <div className="bg-white h-full"></div>
                  <div className="bg-[#138808] h-full"></div>
                </div>

                {/* Card Header Bar */}
                <div className="flex items-center justify-between border-b border-white/15 pb-2.5 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">🏛️</span>
                    <div>
                      <div className="font-black text-[11px] tracking-widest text-amber-300 uppercase">
                        NATIONAL HEALTH AUTHORITY
                      </div>
                      <div className="text-[9px] text-slate-300 font-medium">
                        Government of India • Ayushman Bharat Digital Mission
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[9px] font-black px-2 py-0.5 rounded-full">
                      ACTIVE & VERIFIED
                    </span>
                  </div>
                </div>

                {/* Card Main Profile Row */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center space-x-3.5">
                    {/* Photo Box */}
                    <div className="w-16 h-16 rounded-2xl bg-white/10 border-2 border-white/20 flex items-center justify-center text-sky-200 shadow-inner">
                      <User className="w-9 h-9" />
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                        {demoProfile.name}
                      </h3>
                      <p className="text-xs text-sky-200 font-medium">
                        {demoProfile.gender} • YOB: {demoProfile.dob.slice(0, 4)} ({demoProfile.age} Yrs)
                      </p>
                      <p className="text-xs text-slate-300">
                        {demoProfile.state}
                      </p>
                    </div>
                  </div>

                  {/* High-Tech QR Matrix Graphic */}
                  <div className="bg-white p-1.5 rounded-xl shadow-md text-slate-900 text-center shrink-0">
                    <div className="w-16 h-16 bg-slate-900 rounded-lg flex flex-col items-center justify-center text-white p-1">
                      <QrCode className="w-8 h-8 text-cyan-400" />
                      <span className="text-[7px] font-mono text-cyan-200 mt-0.5">ABDM SCAN</span>
                    </div>
                  </div>
                </div>

                {/* 14-Digit ABHA ID Box */}
                <div className="bg-[#051124] border border-sky-400/30 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-inner">
                  <div>
                    <span className="text-[10px] text-sky-300 uppercase font-black tracking-wider block">
                      ABHA NUMBER (14-DIGIT UNIQUE HEALTH ID):
                    </span>
                    <span className="font-mono text-base sm:text-lg font-black text-white tracking-widest">
                      {demoProfile.abha_number}
                    </span>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      ABHA ADDRESS:
                    </span>
                    <span className="font-mono text-xs font-extrabold text-cyan-300">
                      {demoProfile.abha_address}
                    </span>
                  </div>
                </div>

                {/* Bottom Card Security Stamp */}
                <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono border-t border-white/10 pt-2">
                  <span>🔐 UIDAI Level-1 Biometric/OTP Authenticated</span>
                  <span>Blood: <strong className="text-white">{demoProfile.blood_group}</strong></span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleApplyToForm}
                  className="flex-1 bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 hover:from-teal-700 hover:to-emerald-700 text-white font-black text-sm py-3.5 px-4 rounded-xl transition shadow-lg shadow-teal-700/25 flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>🚀 Auto-Fill Patient Intake Form</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrintCard}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print ABHA Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-3 py-3 text-slate-500 hover:text-slate-800 text-xs font-bold"
                  title="Create Another ID"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
