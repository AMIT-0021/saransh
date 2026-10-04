import React from "react";

/**
 * SaranshLogo — "The Sanjeevani Pulse"
 * 
 * Unifies three core symbols:
 * 1. The Medical Cross (Frontline Healthcare & Clinical Safety)
 * 2. The Devanagari character 'स' / Odia curve (Indian Vernacular Sovereignty)
 * 3. The Vital Signs ECG Pulse Line (Real-Time Triage Telemetry)
 */
export default function SaranshLogo({
  size = 40,
  className = "",
  showGlow = true
}) {
  return (
    <div
      className={`relative flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
      title="Saransh (सारांश) — Frontline Healthcare Triage"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm select-none"
      >
        <defs>
          {/* Main Hospital Teal to Bio-Cyan Gradient */}
          <linearGradient id="saranshTealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0F766E" />
            <stop offset="50%" stopColor="#0D9488" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>

          {/* Pulse Glow Line Gradient */}
          <linearGradient id="saranshPulseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#A7F3D0" />
            <stop offset="80%" stopColor="#22D3EE" />
            <stop offset="100%" stopColor="#FFFFFF" />
          </linearGradient>

          {/* Squircle Badge Fill Gradient */}
          <linearGradient id="saranshBadgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#042F2E" />
            <stop offset="45%" stopColor="#0F766E" />
            <stop offset="100%" stopColor="#0D9488" />
          </linearGradient>

          {/* Soft Drop Shadow Filter */}
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Squircle Outer Badge Frame */}
        <rect
          x="3"
          y="3"
          width="94"
          height="94"
          rx="26"
          fill="url(#saranshBadgeGrad)"
        />
        <rect
          x="4.5"
          y="4.5"
          width="91"
          height="91"
          rx="24.5"
          stroke="#2DD4BF"
          strokeWidth="1.8"
          strokeOpacity="0.45"
        />

        {/* Subtle Background Geometric Cross Frame */}
        <path
          d="M38 18 H62 V38 H82 V62 H62 V82 H38 V62 H18 V38 H38 Z"
          fill="#FFFFFF"
          fillOpacity="0.10"
        />

        {/* 
          Sanjeevani Cross + Devanagari 'स' Shape:
          - Vertical trunk from top to bottom
          - Left cross arm
          - Right arm swoops into the characteristic 'स' loop and descending leg
        */}
        <path
          d="M 40 22
             C 40 20 42 19 45 19
             H 55
             C 58 19 60 20 60 22
             V 38
             H 68
             C 76 38 82 43 82 51
             C 82 58 76 63 68 63
             H 60
             V 78
             C 60 80 58 81 55 81
             H 45
             C 42 81 40 80 40 78
             V 62
             H 22
             C 20 62 19 60 19 57
             V 43
             C 19 40 20 38 22 38
             H 40
             Z"
          fill="url(#saranshTealGrad)"
          stroke="#5EEAD4"
          strokeWidth="1.5"
          strokeOpacity="0.5"
        />

        {/* The 'स' Lower Connecting Arch & Stem */}
        <path
          d="M 68 53
             C 74 53 78 57 78 64
             C 78 72 73 78 65 81"
          stroke="#E0F2FE"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeOpacity="0.9"
        />

        {/* Center Cross Bridge Highlight */}
        <rect
          x="38"
          y="42"
          width="24"
          height="16"
          rx="4"
          fill="#0D9488"
          fillOpacity="0.6"
        />

        {/* 
          High-Contrast Dynamic ECG Heartbeat Pulse Line:
          Runs horizontally across the symbol, spiking dramatically at the core
        */}
        <path
          d="M 14 50
             H 32
             L 37 40
             L 43 62
             L 51 28
             L 58 70
             L 64 45
             L 68 53
             H 86"
          stroke="url(#saranshPulseGrad)"
          strokeWidth="4.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={showGlow ? "url(#softGlow)" : undefined}
        />

        {/* Acute Vital Peak Indicator Dot */}
        <circle cx="51" cy="28" r="3.6" fill="#34D399" />
        <circle cx="51" cy="28" r="6" stroke="#A7F3D0" strokeWidth="1.2" strokeOpacity="0.8" className="animate-ping" />
      </svg>
    </div>
  );
}
