"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, AlertCircle, CheckCircle2, Activity, Terminal } from "lucide-react";

export default function ResearchHeroTelemetry() {
  const [pulseTick, setPulseTick] = useState(0);

  // Periodic heartbeat animation for live telemetry feel
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseTick((prev) => (prev + 1) % 100);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[440px] sm:h-[480px] lg:h-[500px] select-none flex items-center justify-center">
      {/* ================= SVG CONSTELLATION NETWORK GRAPH (BACKGROUND) ================= */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-visible">
        <svg
          viewBox="0 0 600 460"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-contain"
        >
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.35" />
            </linearGradient>

            <linearGradient id="warnLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.65" />
            </linearGradient>

            <linearGradient id="dangerLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0.75" />
            </linearGradient>

            {/* Radial Gradients for Glowing Nodes */}
            <radialGradient id="nodeBlueGlow">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="nodeAmberGlow">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="nodeRedGlow">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Connected Network Mesh Edges */}
          <g strokeWidth="1.5" strokeLinecap="round">
            {/* Top row connections */}
            <line x1="220" y1="95" x2="280" y2="55" stroke="url(#lineGrad)" />
            <line x1="280" y1="55" x2="360" y2="40" stroke="url(#lineGrad)" />
            <line x1="360" y1="40" x2="430" y2="65" stroke="url(#lineGrad)" />
            <line x1="430" y1="65" x2="510" y2="35" stroke="url(#warnLineGrad)" />
            <line x1="510" y1="35" x2="560" y2="70" stroke="url(#lineGrad)" />

            {/* Cross-connections to mid row */}
            <line x1="220" y1="95" x2="240" y2="150" stroke="url(#lineGrad)" />
            <line x1="280" y1="55" x2="330" y2="105" stroke="url(#lineGrad)" />
            <line x1="360" y1="40" x2="330" y2="105" stroke="url(#lineGrad)" />
            <line x1="360" y1="40" x2="410" y2="110" stroke="url(#lineGrad)" />
            <line x1="430" y1="65" x2="410" y2="110" stroke="url(#lineGrad)" />
            <line x1="430" y1="65" x2="480" y2="115" stroke="url(#lineGrad)" />
            <line x1="510" y1="35" x2="480" y2="115" stroke="url(#warnLineGrad)" />
            <line x1="560" y1="70" x2="530" y2="140" stroke="url(#lineGrad)" />
            <line x1="510" y1="35" x2="530" y2="140" stroke="url(#lineGrad)" />

            {/* Mid row lateral connections */}
            <line x1="240" y1="150" x2="330" y2="105" stroke="url(#lineGrad)" />
            <line x1="330" y1="105" x2="410" y2="110" stroke="url(#lineGrad)" />
            <line x1="410" y1="110" x2="480" y2="115" stroke="url(#lineGrad)" />
            <line x1="480" y1="115" x2="530" y2="140" stroke="url(#lineGrad)" />

            {/* Lower row connections */}
            <line x1="240" y1="150" x2="300" y2="195" stroke="url(#lineGrad)" />
            <line x1="330" y1="105" x2="300" y2="195" stroke="url(#lineGrad)" />
            <line x1="330" y1="105" x2="390" y2="185" stroke="url(#lineGrad)" />
            <line x1="410" y1="110" x2="390" y2="185" stroke="url(#lineGrad)" />
            <line x1="410" y1="110" x2="470" y2="180" stroke="url(#warnLineGrad)" />
            <line x1="480" y1="115" x2="470" y2="180" stroke="url(#warnLineGrad)" />
            <line x1="530" y1="140" x2="470" y2="180" stroke="url(#warnLineGrad)" />

            {/* Active animated pulses traveling across paths */}
            <line
              x1="280"
              y1="55"
              x2="410"
              y2="110"
              stroke="#60A5FA"
              strokeWidth="2"
              className="animate-axiom-dash"
            />
            <line
              x1="430"
              y1="65"
              x2="510"
              y2="35"
              stroke="#F59E0B"
              strokeWidth="2"
              className="animate-axiom-dash"
            />
          </g>

          {/* Node Circles & Glows */}
          <g>
            {/* Top Row Nodes */}
            <circle cx="220" cy="95" r="16" fill="url(#nodeBlueGlow)" />
            <circle cx="220" cy="95" r="6.5" fill="#3B82F6" stroke="#93C5FD" strokeWidth="2" />
            <circle cx="220" cy="95" r="2.5" fill="#FFFFFF" />

            <circle cx="280" cy="55" r="18" fill="url(#nodeBlueGlow)" />
            <circle cx="280" cy="55" r="7.5" fill="#3B82F6" stroke="#BFDBFE" strokeWidth="2" />
            <circle cx="280" cy="55" r="3" fill="#FFFFFF" />

            <circle cx="360" cy="40" r="20" fill="url(#nodeBlueGlow)" />
            <circle cx="360" cy="40" r="8" fill="#2563EB" stroke="#93C5FD" strokeWidth="2" />
            <circle cx="360" cy="40" r="3" fill="#FFFFFF" />

            <circle cx="430" cy="65" r="18" fill="url(#nodeBlueGlow)" />
            <circle cx="430" cy="65" r="7.5" fill="#3B82F6" stroke="#93C5FD" strokeWidth="2" />
            <circle cx="430" cy="65" r="2.5" fill="#FFFFFF" />

            {/* Anomaly 1: Amber Alert Triangle Node (Top Right) */}
            <circle cx="510" cy="35" r="24" fill="url(#nodeRedGlow)" className="animate-axiom-pulse" />
            <polygon
              points="510,24 521,43 499,43"
              fill="#FEE2E2"
              stroke="#EF4444"
              strokeWidth="2"
            />
            <circle cx="510" cy="37" r="2" fill="#EF4444" />

            <circle cx="560" cy="70" r="16" fill="url(#nodeBlueGlow)" />
            <circle cx="560" cy="70" r="6" fill="#06B6D4" stroke="#A5F3FC" strokeWidth="1.5" />
            <circle cx="560" cy="70" r="2" fill="#FFFFFF" />

            {/* Mid Row Nodes */}
            <circle cx="240" cy="150" r="16" fill="url(#nodeBlueGlow)" />
            <circle cx="240" cy="150" r="6.5" fill="#3B82F6" stroke="#DBEAFE" strokeWidth="2" />
            <circle cx="240" cy="150" r="2" fill="#FFFFFF" />

            <circle cx="330" cy="105" r="20" fill="url(#nodeBlueGlow)" />
            <circle cx="330" cy="105" r="8" fill="#2563EB" stroke="#60A5FA" strokeWidth="2" />
            <circle cx="330" cy="105" r="3" fill="#FFFFFF" />

            <circle cx="410" cy="110" r="20" fill="url(#nodeBlueGlow)" />
            <circle cx="410" cy="110" r="8" fill="#2563EB" stroke="#60A5FA" strokeWidth="2" />
            <circle cx="410" cy="110" r="3" fill="#FFFFFF" />

            <circle cx="480" cy="115" r="16" fill="url(#nodeBlueGlow)" />
            <circle cx="480" cy="115" r="6" fill="#3B82F6" stroke="#BFDBFE" strokeWidth="1.5" />
            <circle cx="480" cy="115" r="2" fill="#FFFFFF" />

            <circle cx="530" cy="140" r="18" fill="url(#nodeBlueGlow)" />
            <circle cx="530" cy="140" r="7" fill="#06B6D4" stroke="#A5F3FC" strokeWidth="2" />
            <circle cx="530" cy="140" r="2.5" fill="#FFFFFF" />

            {/* Lower Row Nodes */}
            <circle cx="300" cy="195" r="16" fill="url(#nodeBlueGlow)" />
            <circle cx="300" cy="195" r="6.5" fill="#3B82F6" stroke="#DBEAFE" strokeWidth="2" />
            <circle cx="300" cy="195" r="2" fill="#FFFFFF" />

            <circle cx="390" cy="185" r="18" fill="url(#nodeBlueGlow)" />
            <circle cx="390" cy="185" r="7.5" fill="#3B82F6" stroke="#93C5FD" strokeWidth="2" />
            <circle cx="390" cy="185" r="2.5" fill="#FFFFFF" />

            {/* Anomaly 2: Amber Alert Circle Node (Lower Right) */}
            <circle cx="470" cy="180" r="26" fill="url(#nodeAmberGlow)" className="animate-axiom-pulse" />
            <circle cx="470" cy="180" r="13" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
            <circle cx="470" cy="180" r="7.5" fill="#F59E0B" />
            <circle cx="470" cy="180" r="2.5" fill="#FFFFFF" />
          </g>
        </svg>
      </div>

      {/* ================= CARD 2: TELEMETRY ANOMALY FREQUENCY (TOP-RIGHT / LAYERED) ================= */}
      <div className="absolute top-[135px] sm:top-[120px] right-0 sm:right-2 md:right-4 w-[300px] sm:w-[360px] lg:w-[385px] z-10 animate-axiom-float">
        <div className="bg-white/85 backdrop-blur-xl border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-[0_18px_45px_-12px_rgba(15,23,42,0.14)] transition-all duration-300 hover:shadow-[0_22px_55px_-10px_rgba(37,99,235,0.18)] hover:border-blue-300/80">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#2563EB]" />
              <h3 className="text-[13px] font-semibold text-slate-800 tracking-tight">
                Telemetry Anomaly Frequency
              </h3>
            </div>
            <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-mono font-bold flex items-center justify-center">
              2
            </div>
          </div>

          {/* Anomaly Waveform Graph */}
          <div className="relative pt-6 pb-1">
            {/* Tooltip 1: Context Saturation (Amber) */}
            <div className="absolute top-0 left-[44%] -translate-x-1/2 flex flex-col items-center z-10">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 shadow-xs text-[10px] font-medium text-amber-800 font-mono whitespace-nowrap">
                <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" />
                <span>Context Saturation</span>
              </div>
              <div className="w-[1px] h-3 bg-amber-300/80" />
            </div>

            {/* Tooltip 2: State Desync (Red) */}
            <div className="absolute -top-1 left-[76%] -translate-x-1/2 flex flex-col items-center z-10">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-red-50 border border-red-200 shadow-xs text-[10px] font-medium text-red-700 font-mono whitespace-nowrap">
                <AlertCircle className="w-3 h-3 text-red-500 shrink-0" />
                <span>State Desync</span>
              </div>
              <div className="w-[1px] h-3 bg-red-300/80" />
            </div>

            {/* Waveform SVG */}
            <svg
              viewBox="0 0 360 110"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-[95px] overflow-visible"
            >
              <defs>
                <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity="0.25" />
                  <stop offset="40%" stopColor="#F59E0B" stopOpacity="0.18" />
                  <stop offset="85%" stopColor="#3B82F6" stopOpacity="0.04" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                </linearGradient>

                <linearGradient id="waveStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#93C5FD" />
                  <stop offset="35%" stopColor="#F59E0B" />
                  <stop offset="65%" stopColor="#EF4444" />
                  <stop offset="100%" stopColor="#60A5FA" />
                </linearGradient>
              </defs>

              {/* Subtle Horizontal Grid lines */}
              <line x1="0" y1="25" x2="360" y2="25" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="55" x2="360" y2="55" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="85" x2="360" y2="85" stroke="#E2E8F0" strokeWidth="1" />

              {/* Gradient Area under the Curve */}
              <path
                d="M 5 95 Q 60 93 100 88 C 125 84 140 48 160 38 C 175 30 185 75 205 78 C 220 80 235 24 255 16 C 275 10 288 88 320 92 L 355 95 L 355 98 L 5 98 Z"
                fill="url(#waveGradient)"
              />

              {/* Main Wave Curve Stroke */}
              <path
                d="M 5 95 Q 60 93 100 88 C 125 84 140 48 160 38 C 175 30 185 75 205 78 C 220 80 235 24 255 16 C 275 10 288 88 320 92 L 355 95"
                stroke="url(#waveStroke)"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />

              {/* Peak 1 Point: Context Saturation */}
              <circle cx="160" cy="38" r="5" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="2.5" />
              <circle cx="160" cy="38" r="2" fill="#F59E0B" />

              {/* Peak 2 Point: State Desync */}
              <circle cx="255" cy="16" r="5" fill="#FFFFFF" stroke="#EF4444" strokeWidth="2.5" />
              <circle cx="255" cy="16" r="2" fill="#EF4444" />
            </svg>

            {/* Timeline X-Axis Labels */}
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 pt-1 px-1 border-t border-slate-100">
              <span>00 hrs</span>
              <span>06 hrs</span>
              <span>12 hrs</span>
              <span>18 hrs</span>
              <span>24 hrs</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= CARD 1: LIVE-STREAM TRACE LOG (BOTTOM-LEFT) ================= */}
      <div className="absolute bottom-1 sm:bottom-3 left-0 sm:left-2 md:left-4 w-[310px] sm:w-[360px] lg:w-[380px] z-20 animate-axiom-float-reverse">
        <div className="bg-white/94 backdrop-blur-2xl border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-[0_24px_55px_-12px_rgba(15,23,42,0.18)] transition-all duration-300 hover:shadow-[0_28px_65px_-10px_rgba(37,99,235,0.22)] hover:border-blue-400/80">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#2563EB]" />
              <h3 className="text-[13px] font-semibold text-slate-800 tracking-tight">
                Live-stream trace log
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>LIVE</span>
              </span>
              <div className="w-5 h-5 rounded-full bg-blue-50 border border-blue-200 text-[#2563EB] text-[10px] font-mono font-bold flex items-center justify-center">
                1
              </div>
            </div>
          </div>

          {/* Monospace Code Stream */}
          <div className="font-mono text-[11px] leading-[1.65] space-y-1.5 text-slate-700 max-h-[160px] overflow-hidden">
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="px-1 py-0.2 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                [INFO]
              </span>
              <span className="text-slate-800 font-medium">AGENT_ID: 142a:</span>
              <span className="text-slate-500">State Synced (3.1ms)</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="px-1 py-0.2 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                [INFO]
              </span>
              <span className="text-slate-800 font-medium">AGENT_ID: 142a:</span>
              <span className="text-slate-500">State Synced (3.1ms)</span>
            </div>

            {/* Warning Line with Amber Accents */}
            <div className="p-1.5 rounded-lg bg-amber-50/80 border border-amber-200/80 text-amber-900 flex items-start gap-1.5">
              <span className="px-1 py-0.2 rounded bg-amber-200/80 text-amber-900 text-[10px] font-bold shrink-0 mt-0.5">
                [WARN]
              </span>
              <div className="leading-tight">
                <span className="font-bold">AGENT_ID: 98c3:</span>{" "}
                <span className="text-amber-800">Edge Case Detected → Manual Handover Required</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="px-1 py-0.2 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                [INFO]
              </span>
              <span className="text-slate-800 font-medium">AGENT_ID: 142a:</span>
              <span className="text-slate-500">State Synced (3.1ms)</span>
            </div>

            {/* Warning Line 2 */}
            <div className="p-1.5 rounded-lg bg-amber-50/80 border border-amber-200/80 text-amber-900 flex items-start gap-1.5">
              <span className="px-1 py-0.2 rounded bg-amber-200/80 text-amber-900 text-[10px] font-bold shrink-0 mt-0.5">
                [WARN]
              </span>
              <div className="leading-tight">
                <span className="font-bold">AGENT_ID: 98c3:</span>{" "}
                <span className="text-amber-800">Edge Case Detected → Manual Handover Required</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-slate-500">
              <span className="px-1 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">
                [INFO]
              </span>
              <span className="text-slate-700 font-medium">AGENT_ID: 142a:</span>
              <span className="text-slate-400">State Desync</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
