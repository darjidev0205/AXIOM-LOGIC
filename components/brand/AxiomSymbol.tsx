import React from "react";

interface AxiomSymbolProps {
  className?: string;
  size?: number;
  theme?: "light" | "dark";
  animated?: boolean;
}

export default function AxiomSymbol({
  className = "",
  size = 32,
  theme = "light",
  animated = false,
}: AxiomSymbolProps) {
  const isDark = theme === "dark";
  const mainLetterColor = isDark ? "#FFFFFF" : "#0F172A";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="AXIOM Logic Symbol"
    >
      <defs>
        {/* Foot gradient from emerald to electric blue */}
        <linearGradient id="axiom-foot-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>

        {/* Dynamic workflow swoosh gradient */}
        <linearGradient id="axiom-swoosh-grad" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="60%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>

        {/* Subtle glow filter */}
        <filter id="axiom-node-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Main Stylized 'A' */}
      <g>
        {/* Left Leg of A */}
        <polygon
          points="46,12 55,12 28,88 18,88"
          fill={mainLetterColor}
        />
        {/* Apex cap */}
        <polygon
          points="46,12 55,12 62,28 38,28"
          fill={mainLetterColor}
        />
        {/* Right Leg of A (upper portion) */}
        <polygon
          points="54,12 63,12 82,65 72,65"
          fill={mainLetterColor}
        />
        {/* Right Leg Foot Gradient Accent (Brand Signature) */}
        <polygon
          points="72,65 82,65 91,88 79,88"
          fill="url(#axiom-foot-grad)"
        />
      </g>

      {/* Orbital Ring behind/wrapping left */}
      <path
        d="M 22,78 C 8,72 6,48 28,32 C 42,22 62,20 74,24"
        stroke={isDark ? "rgba(16, 185, 129, 0.4)" : "rgba(37, 99, 235, 0.35)"}
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />

      {/* Dynamic Workflow Swoosh cutting through the crossbar */}
      <path
        d="M 12,74 C 20,70 34,56 50,49 C 66,42 80,32 88,26"
        stroke="url(#axiom-swoosh-grad)"
        strokeWidth="7"
        strokeLinecap="round"
      />

      {/* Data Node 1: Left Node (Electric Blue) */}
      <circle
        cx="12"
        cy="74"
        r="4.5"
        fill="#2563EB"
        filter="url(#axiom-node-glow)"
      />
      <circle cx="12" cy="74" r="2" fill="#FFFFFF" />

      {/* Data Node 2: Right / Upper Node (Emerald Green) */}
      <circle
        cx="88"
        cy="26"
        r="4.5"
        fill="#10B981"
        filter="url(#axiom-node-glow)"
      />
      <circle cx="88" cy="26" r="2" fill="#FFFFFF" />

      {/* Optional Animated Pulse when active */}
      {animated && (
        <circle
          cx="88"
          cy="26"
          r="8"
          fill="none"
          stroke="#10B981"
          strokeWidth="1.5"
          className="animate-ping opacity-75"
        />
      )}
    </svg>
  );
}
