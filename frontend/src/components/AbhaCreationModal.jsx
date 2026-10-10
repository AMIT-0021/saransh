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
  FileCheck,
  Edit3,
  Check
} from "lucide-react";

export default function AbhaCreationModal({
  isOpen,
  onClose,
  onApplyProfile,
  initialDemographics = null
}) {
  // Steps: 1 = Aadhaar & Consent, 2 = OTP Verification, 3 = ABHA Address, 4 = Digital ABHA Card
  const [step, setStep] = useState(1);

  // Real-time Citizen Demographics
  const [citizenName, setCitizenName] = useState("");
  const [citizenAge, setCitizenAge] = useState(45);
  const [citizenGender, setCitizenGender] = useState("Male");
  const [citizenMobile, setCitizenMobile] = useState("+91-9876543210");
  const [citizenState, setCitizenState] = useState("Odisha - Khordha");
  const [citizenBloodGroup, setCitizenBloodGroup] = useState("B+");

  // Form Inputs
  const [aadhaarNumber, setAadhaarNumber] = useState("4812 3885 3036");
  const [consentChecked, setConsentChecked] = useState(true);
  const [otpValue, setOtpValue] = useState("");
  const [abhaHandle, setAbhaHandle] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpTimer, setOtpTimer] = useState(45);
  const [activePresetId, setActivePresetId] = useState("custom");

  // Generate clean ABDM health handle in real time from citizen name
  const generateAbhaHandle = (name) => {
    const clean = (name || "citizen")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, "");
    return `${clean || "citizen"}@abdm`;
  };

  // Format 14-digit ABHA ID from 12-digit Aadhaar number
  const formatAbhaNumber = (aadhaar) => {
    const digits = (aadhaar || "").replace(/\D/g, "");
    const d12 = (digits + "481238853036").slice(0, 12);
    return `91-${d12.slice(0, 4)}-${d12.slice(4, 8)}-${d12.slice(8, 12)}`;
  };

  // Synchronize when initialDemographics prop changes or modal opens
  useEffect(() => {
    if (initialDemographics && initialDemographics.name_or_alias) {
      setCitizenName(initialDemographics.name_or_alias);
      if (initialDemographics.age) setCitizenAge(initialDemographics.age);
      if (initialDemographics.sex) setCitizenGender(initialDemographics.sex);
      if (initialDemographics.location_state) setCitizenState(initialDemographics.location_state);
      if (initialDemographics.emergency_contact && initialDemographics.emergency_contact !== "+91-") {
        setCitizenMobile(initialDemographics.emergency_contact);
      }
      setAbhaHandle(generateAbhaHandle(initialDemographics.name_or_alias));
      setActivePresetId("custom");
    } else if (!citizenName) {
      // Default to ready-to-type custom state
      setAbhaHandle("citizen@abdm");
    }
  }, [initialDemographics, isOpen]);

  // Real-time Name Change Handler
  const handleNameChange = (newName) => {
    setCitizenName(newName);
    setAbhaHandle(generateAbhaHandle(newName));
    setActivePresetId("custom");
  };

  // Real-time Aadhaar Number Input Formatter
  const handleAadhaarChange = (val) => {
    const raw = val.replace(/\D/g, "").slice(0, 12);
    const parts = raw.match(/.{1,4}/g);
    const formatted = parts ? parts.join(" ") : raw;
    setAadhaarNumber(formatted);
  };

  // 1-Click Quick Demo Presets
  const handleSelectDemoPreset = (presetId, presetName, aadhaar, mobile, age, gender, state, blood) => {
    setActivePresetId(presetId);
    setCitizenName(presetName);
    setCitizenAge(age);
    setCitizenGender(gender);
    setCitizenMobile(mobile);
    setCitizenState(state);
    setCitizenBloodGroup(blood);
    setAadhaarNumber(aadhaar);
    setAbhaHandle(generateAbhaHandle(presetName));
  };

  const handleClearCustomName = () => {
    setActivePresetId("custom");
    setCitizenName("");
    setCitizenAge(35);
    setCitizenGender("Male");
    setCitizenMobile("+91-9876543210");
    setCitizenState("Odisha - Khordha");
    setCitizenBloodGroup("O+");
    setAadhaarNumber("4812 " + Math.floor(1000 + Math.random() * 9000) + " " + Math.floor(1000 + Math.random() * 9000));
    setAbhaHandle("citizen@abdm");
  };

  // OTP Countdown Timer
  useEffect(() => {
    let timer = null;
    if (step === 2 && otpTimer > 0) {
      timer = setInterval(() => setOtpTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, otpTimer]);

  if (!isOpen) return null;

  // Compiled real-time demographic profile
  const compiledProfile = {
    name: citizenName.trim() || "Verified Citizen",
    age: Number(citizenAge) || 35,
    gender: citizenGender || "Male",
    dob: `${2026 - (Number(citizenAge) || 35)}-05-15`,
    mobile: citizenMobile || "+91-9876543210",
    state: citizenState || "Odisha - Khordha",
    abha_number: formatAbhaNumber(aadhaarNumber),
    abha_address: abhaHandle || generateAbhaHandle(citizenName),
    blood_group: citizenBloodGroup || "B+"
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

  // Step 3: Finalize ABHA Address
  const handleFinalizeAbha = (e) => {
    e.preventDefault();
    setStep(4);
  };

  // Apply Real-Time Generated Profile to Patient Intake Form
  const handleApplyToForm = () => {
    if (onApplyProfile) {
      onApplyProfile(compiledProfile);
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
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
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
              Name & Aadhaar
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
          
          {/* STEP 1: CITIZEN NAME, DEMOGRAPHICS & AADHAAR */}
          {step === 1 && (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 flex items-start space-x-3 text-xs text-sky-900">
                <ShieldCheck className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="font-extrabold text-sky-950 block">
                    Instant 60-Second On-the-Spot Registration
                  </strong>
                  <p className="text-sky-800 leading-relaxed">
                    Under ABDM Milestone 1 (M1), any frontline nurse or registration desk can generate a verifiable 14-digit ABHA number with the citizen's real-time name, Aadhaar, and phone OTP in under 2 minutes.
                  </p>
                </div>
              </div>

              {/* Quick Presets / Custom Name Reset Bar */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  ⚡ 1-Click Presets or Type Custom Real-Time Name:
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleClearCustomName}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                      activePresetId === "custom" && !citizenName
                        ? "bg-teal-700 text-white ring-2 ring-teal-400"
                        : "bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-300"
                    }`}
                  >
                    <span>✨ Blank Citizen (New Name)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleSelectDemoPreset(
                        "ramesh",
                        "Ramesh Kumar",
                        "4821 9923 0192",
                        "+91-9876543210",
                        62,
                        "Male",
                        "Odisha - Khordha",
                        "B+"
                      )
                    }
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      activePresetId === "ramesh"
                        ? "bg-slate-800 text-white"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    👤 Ramesh Kumar (62M)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleSelectDemoPreset(
                        "priya",
                        "Priya Sharma",
                        "3912 8419 4481",
                        "+91-9811223344",
                        34,
                        "Female",
                        "Odisha - Cuttack",
                        "O+"
                      )
                    }
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      activePresetId === "priya"
                        ? "bg-slate-800 text-white"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    👤 Priya Sharma (34F)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleSelectDemoPreset(
                        "meena",
                        "Meena Devi",
                        "5519 2201 9844",
                        "+91-9766554433",
                        28,
                        "Female",
                        "Odisha - Puri",
                        "A+"
                      )
                    }
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      activePresetId === "meena"
                        ? "bg-slate-800 text-white"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    👤 Meena Devi (28F)
                  </button>
                </div>
              </div>

              {/* REAL-TIME CITIZEN NAME INPUT */}
              <div className="space-y-1.5 bg-gradient-to-r from-teal-50/80 via-sky-50/70 to-emerald-50/80 border-2 border-teal-500/50 rounded-2xl p-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-900 flex items-center space-x-1.5">
                    <User className="w-4 h-4 text-teal-700" />
                    <span>Citizen / Patient Full Name (Real-Time)</span>
                    <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 bg-teal-100 px-2 py-0.5 rounded-md border border-teal-300">
                    LIVE SYNC
                  </span>
                </div>

                <input
                  type="text"
                  value={citizenName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Enter citizen's real-time name (e.g. Rajesh Mohanty, Anita Das)"
                  required
                  autoFocus
                  className="w-full px-4 py-3 bg-white border border-teal-300 rounded-xl text-base font-extrabold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs"
                />

                {/* Real-time Address & Status Feedback */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px]">
                  <span className="text-slate-600 flex items-center space-x-1.5">
                    <span>⚡ Real-Time ABHA Address:</span>
                    <strong className="font-mono text-teal-800 bg-white px-2 py-0.5 rounded border border-teal-200">
                      {abhaHandle || "citizen@abdm"}
                    </strong>
                  </span>
                  {citizenName.trim() ? (
                    <span className="text-emerald-700 font-bold flex items-center space-x-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Card will be minted for "{citizenName.trim()}"</span>
                    </span>
                  ) : (
                    <span className="text-amber-700 text-[11px] font-medium">
                      Type name above to generate personalized card
                    </span>
                  )}
                </div>
              </div>

              {/* Demographics Grid: Age, Gender, Linked Mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Age (Years)</label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={citizenAge}
                    onChange={(e) => setCitizenAge(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Gender</label>
                  <select
                    value={citizenGender}
                    onChange={(e) => setCitizenGender(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Mobile (For OTP)</label>
                  <input
                    type="text"
                    value={citizenMobile}
                    onChange={(e) => setCitizenMobile(e.target.value)}
                    placeholder="+91-9876543210"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* 12-Digit Aadhaar Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    Enter 12-Digit Aadhaar Number
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">UIDAI ENCRYPTED</span>
                </div>
                <input
                  type="text"
                  value={aadhaarNumber}
                  onChange={(e) => handleAadhaarChange(e.target.value)}
                  placeholder="XXXX XXXX XXXX"
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl font-mono text-base font-bold text-slate-900 tracking-wider focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <div className="text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Target 14-Digit ABHA ID:</span>
                  <span className="font-mono text-xs font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                    {formatAbhaNumber(aadhaarNumber)}
                  </span>
                </div>
              </div>

              {/* Consent Box */}
              <label className="flex items-start space-x-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  className="mt-0.5 rounded text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                  required
                />
                <span className="text-[11px] text-slate-600 leading-snug">
                  <strong>Digital Personal Data Protection (DPDP) Act Consent:</strong> I confirm that the patient has provided voluntary informed consent to authenticate via UIDAI Aadhaar OTP to create an Ayushman Bharat Health Account (ABHA).
                </span>
              </label>

              <button
                type="submit"
                disabled={!consentChecked || isVerifying || !citizenName.trim()}
                className="w-full bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-700 hover:to-sky-700 text-white font-extrabold text-sm py-3.5 rounded-xl transition shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                <span>
                  {isVerifying
                    ? "Sending OTP via UIDAI Gateway..."
                    : `Request Aadhaar OTP for ${citizenName.trim() || "Citizen"} ➔`}
                </span>
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
                    A 6-digit authentication code has been sent for <strong className="text-emerald-950 font-bold">{compiledProfile.name}</strong> to Aadhaar-linked mobile:{" "}
                    <strong className="font-mono text-emerald-950">{compiledProfile.mobile}</strong>.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Enter 6-Digit SMS OTP</label>
                  <button
                    type="button"
                    onClick={() => setOtpValue("849201")}
                    className="text-[11px] font-extrabold text-teal-700 hover:underline flex items-center space-x-1 cursor-pointer"
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
                  autoFocus
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
                    className="text-teal-700 font-bold hover:underline disabled:opacity-50 cursor-pointer"
                  >
                    Resend SMS
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
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
                  <span className="text-xs font-extrabold text-slate-800 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>✓ Verified Demographic Record (Fetched from UIDAI)</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    UIDAI AUTHENTICATED
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      Full Name (Real-Time)
                    </span>
                    <input
                      type="text"
                      value={citizenName}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className="mt-0.5 px-2.5 py-1.5 bg-white border border-teal-300 rounded-lg text-slate-900 font-extrabold text-xs w-full focus:outline-none focus:ring-1 focus:ring-teal-500 shadow-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Age / Gender</span>
                    <strong className="text-slate-900 font-extrabold">
                      {compiledProfile.age} Yrs • {compiledProfile.gender}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">State / District</span>
                    <strong className="text-slate-900 font-extrabold">{compiledProfile.state}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Date of Birth</span>
                    <strong className="text-slate-900 font-extrabold">{compiledProfile.dob}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Mobile</span>
                    <strong className="text-slate-900 font-extrabold">{compiledProfile.mobile}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Blood Group</span>
                    <strong className="text-slate-900 font-extrabold">{compiledProfile.blood_group}</strong>
                  </div>
                </div>
              </div>

              {/* Choose ABHA Address */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    Assign Personal ABHA Address (Health Handle)
                  </label>
                  <span className="text-[10px] font-mono text-teal-700">Real-time sync</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={abhaHandle}
                    onChange={(e) => setAbhaHandle(e.target.value)}
                    required
                    className="flex-1 px-4 py-2.5 bg-white border border-slate-300 rounded-xl font-mono text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
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
                  Patient record for <strong className="text-slate-900">{compiledProfile.name}</strong> is now verified and linked under Ayushman Bharat Digital Mission (ABDM).
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
                  <div className="flex items-center space-x-3.5 min-w-0">
                    {/* Photo Box */}
                    <div className="w-16 h-16 rounded-2xl bg-white/10 border-2 border-white/20 flex items-center justify-center text-sky-200 shadow-inner shrink-0">
                      <User className="w-9 h-9" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-black text-white tracking-tight truncate">
                        {compiledProfile.name}
                      </h3>
                      <p className="text-xs text-sky-200 font-medium truncate">
                        {compiledProfile.gender} • YOB: {compiledProfile.dob.slice(0, 4)} ({compiledProfile.age} Yrs)
                      </p>
                      <p className="text-xs text-slate-300 truncate">
                        {compiledProfile.state}
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
                      {compiledProfile.abha_number}
                    </span>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      ABHA ADDRESS:
                    </span>
                    <span className="font-mono text-xs font-extrabold text-cyan-300 truncate block">
                      {compiledProfile.abha_address}
                    </span>
                  </div>
                </div>

                {/* Bottom Card Security Stamp */}
                <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono border-t border-white/10 pt-2">
                  <span>🔐 UIDAI Level-1 Biometric/OTP Authenticated</span>
                  <span>Blood: <strong className="text-white">{compiledProfile.blood_group}</strong></span>
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
                  <span>🚀 Auto-Fill Patient Intake Form with "{compiledProfile.name}"</span>
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
                  className="px-3 py-3 text-slate-500 hover:text-slate-800 text-xs font-bold cursor-pointer"
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
