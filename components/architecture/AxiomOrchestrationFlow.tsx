"use client";

import React, { useState, useEffect } from "react";
import {
  Brain,
  Layers,
  Database,
  Cpu,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Lock,
  ArrowDown,
  Terminal,
  Server,
  Activity,
  GitBranch,
  ChevronRight,
  ExternalLink,
  Sparkles,
} from "lucide-react";

export default function AxiomOrchestrationFlow() {
  const [activeStage, setActiveStage] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);

  // 8-stage automated execution sequence (8-second loop)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveStage((prev) => (prev >= 7 ? 1 : prev + 1));
    }, 1300);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Stage details for click inspection
  const stageDetails: Record<number, { title: string; desc: string; metrics: string; hash?: string }> = {
    1: {
      title: "01 // INTENT SYNTHESIS",
      desc: "Natural language input parsed into typed JSON entity schema with zero-shot validation.",
      metrics: "LATENCY: 18ms • CONFIDENCE: 99.8%",
    },
    2: {
      title: "02 // CONTEXT ENRICHMENT",
      desc: "Unified Context Protocol hydrates user session, account history, inventory state, and SLAs.",
      metrics: "ENTITIES HYDRATED: 14 • LATENCY: 24ms",
    },
    3: {
      title: "03 // RAG RETRIEVAL",
      desc: "Live vector similarity query over PostgreSQL, ERP, and CRM with strict row-level security.",
      metrics: "RECORDS MATCHED: 1 • RELEVANCE: 0.994",
    },
    4: {
      title: "04 // AI REASONING AGENT",
      desc: "Axiom Core Runtime evaluates policies, forms decision tree, and generates validated tool payload.",
      metrics: "MODEL: CLUSTER-US-EAST • DETERMINISTIC: YES",
    },
    5: {
      title: "05 // POLICY GUARDRAIL GATE",
      desc: "Deterministic constraint matrices enforce spend thresholds, authorization, and PII scrubbing.",
      metrics: "RULES EVALUATED: 48 • DRIFT: 0.0%",
    },
    6: {
      title: "06 // TOOL DISPATCH BUS",
      desc: "Branching execution router dispatches authenticated webhook to carrier logistics endpoint.",
      metrics: "HTTP 200 OK • PAYLOAD COMMITTED",
    },
    7: {
      title: "07 // VERIFIED ACTION COMMIT",
      desc: "Atomic database mutation committed with cryptographic SHA-256 audit ledger hash.",
      metrics: "AUDIT HASH: #998F42 • ZERO-DRIFT GUARANTEED",
      hash: "0x998F42a7c3b9d01e4f68",
    },
  };

  return (
    <div
      className="relative w-full max-w-[560px] mx-auto select-none py-2"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        setSelectedNode(null);
      }}
    >
      {/* Background Unified Context Protocol Ambient Watermark Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-40 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      {/* Floating System Telemetry Header Ribbon */}
      <div className="flex items-center justify-between px-4 py-2.5 mb-3 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-sm text-[11px] font-mono">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-semibold text-slate-800 tracking-wider uppercase">
            AXIOM ORCHESTRATION ENGINE
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-500">
          <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
            ONLINE
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-[#2563EB] font-bold">412ms</span>
        </div>
      </div>

      {/* Inbound Request Capsule */}
      <div className="relative mb-3 group cursor-pointer" onClick={() => setActiveStage(1)}>
        <div className="px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-50/90 via-white to-blue-50/80 border border-blue-200/90 shadow-sm flex items-center justify-between transition-all duration-300 hover:border-blue-400 hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Terminal className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-[#2563EB] uppercase font-bold tracking-wider">
                INBOUND TRIGGER // USER REQUEST
              </div>
              <div className="text-[13px] font-semibold text-[#0F172A]">
                &quot;Create a workflow for delayed deliveries&quot;
              </div>
            </div>
          </div>
          <span className="text-[10px] font-mono text-slate-400 shrink-0 uppercase tracking-widest hidden sm:inline">
            INGESTED
          </span>
        </div>

        {/* Animated Downward Vector Connector */}
        <div className="w-[2px] h-4 bg-gradient-to-b from-blue-500 to-slate-200 mx-auto" />
      </div>

      {/* ================= STAGE 01 & 02: INTENT + CONTEXT SPLIT CONTAINER ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        {/* Node 01: Intent Understanding */}
        <div
          onClick={() => setSelectedNode(selectedNode === 1 ? null : 1)}
          className={`axiom-corner-card relative p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
            activeStage === 1
              ? "bg-blue-50/80 border-blue-500 shadow-md ring-2 ring-blue-100"
              : "bg-white/90 border-slate-200/90 shadow-xs hover:border-blue-300"
          }`}
        >
          <div className="axiom-corner-accent corner-br accent-blue" />
          <div className="relative z-10 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#2563EB] uppercase">
                <Brain className="w-3.5 h-3.5" />
                <span>01 // INTENT</span>
              </div>
              <span
                className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                  activeStage >= 1
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                ● PARSED
              </span>
            </div>
            <div className="text-[12px] font-bold text-[#0F172A]">Natural Language → Intent</div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Synthesizes raw syntax into deterministic dispatch intent.
            </p>
          </div>
        </div>

        {/* Node 02: Context Enrichment */}
        <div
          onClick={() => setSelectedNode(selectedNode === 2 ? null : 2)}
          className={`axiom-corner-card relative p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
            activeStage === 2
              ? "bg-blue-50/80 border-blue-500 shadow-md ring-2 ring-blue-100"
              : "bg-white/90 border-slate-200/90 shadow-xs hover:border-blue-300"
          }`}
        >
          <div className="axiom-corner-accent corner-tl accent-emerald" />
          <div className="relative z-10 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-600 uppercase">
                <Layers className="w-3.5 h-3.5" />
                <span>02 // CONTEXT</span>
              </div>
              <span className="text-[9px] font-mono text-slate-400">ENRICHED</span>
            </div>
            <div className="text-[12px] font-bold text-[#0F172A]">Unified Context Layer</div>
            {/* Animated Context Chips */}
            <div className="flex flex-wrap gap-1 pt-0.5">
              {["CUSTOMER", "ORDER", "INVENTORY", "HISTORY"].map((chip, idx) => (
                <span
                  key={chip}
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded border transition-all duration-300 ${
                    activeStage === 2
                      ? "bg-blue-600 text-white border-blue-600 font-semibold shadow-xs"
                      : "bg-slate-100 text-slate-600 border-slate-200"
                  }`}
                  style={{ transitionDelay: `${idx * 80}ms` }}
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Vector Connector */}
      <div className="w-[2px] h-3 bg-gradient-to-b from-blue-500 to-slate-300 mx-auto mb-1" />

      {/* ================= STAGE 03: RAG / ENTERPRISE DATA RETRIEVAL ================= */}
      <div
        onClick={() => setSelectedNode(selectedNode === 3 ? null : 3)}
        className={`axiom-corner-card relative p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer mb-3 overflow-hidden ${
          activeStage === 3
            ? "bg-blue-50/80 border-blue-500 shadow-md ring-2 ring-blue-100"
            : "bg-white/90 border-slate-200/90 shadow-xs hover:border-blue-300"
        }`}
      >
        <div className="axiom-corner-accent corner-br accent-cyan" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-[#06B6D4]" />
              <span className="text-[10px] font-mono font-bold text-[#06B6D4] uppercase tracking-wider">
                03 // RAG DATA RETRIEVAL
              </span>
              <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                LIVE QUERY
              </span>
            </div>
            <div className="text-[12px] font-bold text-[#0F172A]">
              Vector Search &amp; Enterprise Grounding
            </div>
          </div>

          {/* Connected Data Sources Micro-Grid */}
          <div className="flex flex-wrap items-center gap-1.5">
            {["PostgreSQL", "CRM", "ERP", "Docs", "Tickets"].map((source, sIdx) => {
              const isActive = activeStage === 3 && (sIdx === 0 || sIdx === 1);
              return (
                <span
                  key={source}
                  className={`text-[9px] font-mono px-2 py-1 rounded-lg border transition-all duration-200 flex items-center gap-1 ${
                    isActive
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-xs scale-105 font-bold"
                      : "bg-slate-50 text-slate-600 border-slate-200"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isActive ? "bg-white animate-ping" : "bg-slate-300"
                    }`}
                  />
                  <span>{source}</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Vector Connector */}
      <div className="w-[2px] h-3 bg-gradient-to-b from-blue-500 to-[#0F172A] mx-auto mb-1" />

      {/* ================= STAGE 04: AI REASONING AGENT (THE HERO NODE) ================= */}
      <div
        onClick={() => setSelectedNode(selectedNode === 4 ? null : 4)}
        className={`axiom-corner-card relative p-4 sm:p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer mb-3 shadow-xl overflow-hidden ${
          activeStage === 4
            ? "border-blue-400 ring-4 ring-blue-500/20 shadow-blue-500/20"
            : "border-slate-800"
        } bg-[#0F172A] text-white`}
      >
        <div className="axiom-corner-accent corner-top-right accent-blue" />

        <div className="relative z-10 space-y-3">
          {/* Hero Node Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-400/50 flex items-center justify-center text-blue-400">
                <Cpu className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <div className="text-[13px] font-bold tracking-tight text-white flex items-center gap-2">
                  <span>AI REASONING AGENT</span>
                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                    HERO CORE
                  </span>
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  Axiom Core Runtime • Deterministic Mode
                </div>
              </div>
            </div>

            <div className="text-right font-mono">
              <div className="text-[10px] text-slate-400">CONFIDENCE</div>
              <div className="text-[13px] font-bold text-emerald-400">99.4%</div>
            </div>
          </div>

          {/* Three-Stage Sequential Engine Progress Pipeline */}
          <div className="grid grid-cols-3 gap-2 p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-center font-mono text-[10px]">
            <div
              className={`p-2 rounded-lg transition-all duration-300 ${
                activeStage >= 4
                  ? "bg-blue-600 text-white font-bold shadow-xs"
                  : "bg-slate-800/60 text-slate-400"
              }`}
            >
              1. UNDERSTAND
            </div>
            <div
              className={`p-2 rounded-lg transition-all duration-300 ${
                activeStage >= 4
                  ? "bg-blue-500 text-white font-bold shadow-xs"
                  : "bg-slate-800/60 text-slate-400"
              }`}
            >
              2. REASON
            </div>
            <div
              className={`p-2 rounded-lg transition-all duration-300 ${
                activeStage >= 4
                  ? "bg-emerald-600 text-white font-bold shadow-xs"
                  : "bg-slate-800/60 text-slate-400"
              }`}
            >
              3. DECIDE
            </div>
          </div>
        </div>
      </div>

      {/* Vector Connector */}
      <div className="w-[2px] h-3 bg-gradient-to-b from-[#0F172A] to-emerald-600 mx-auto mb-1" />

      {/* ================= STAGE 05: POLICY / GUARDRAILS GATEWAY ================= */}
      <div
        onClick={() => setSelectedNode(selectedNode === 5 ? null : 5)}
        className={`axiom-corner-card relative p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer mb-3 overflow-hidden ${
          activeStage === 5
            ? "bg-emerald-50/80 border-emerald-500 shadow-md ring-2 ring-emerald-100"
            : "bg-white/90 border-slate-200/90 shadow-xs hover:border-emerald-300"
        }`}
      >
        <div className="axiom-corner-accent corner-bl accent-emerald" />
        <div className="relative z-10 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-700 uppercase">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>05 // DETERMINISTIC GUARDRAILS</span>
            </div>
            <span className="text-[9px] font-mono text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded">
              GATE: PASS ✓
            </span>
          </div>

          {/* 4 Green Policy Verification Pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10px] font-mono text-slate-700">
            {[
              "Access Control",
              "Policy Enforced",
              "PII Scrubbed",
              "Human Escalation",
            ].map((policy) => (
              <div
                key={policy}
                className="flex items-center gap-1 px-2 py-1 rounded bg-white border border-emerald-200/80 shadow-2xs"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                <span className="truncate">{policy}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vector Connector */}
      <div className="w-[2px] h-3 bg-gradient-to-b from-emerald-600 to-blue-600 mx-auto mb-1" />

      {/* ================= STAGE 06: TOOL DISPATCH BUS (BRANCHING LOGIC) ================= */}
      <div
        onClick={() => setSelectedNode(selectedNode === 6 ? null : 6)}
        className={`axiom-corner-card relative p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer mb-3 overflow-hidden ${
          activeStage === 6
            ? "bg-blue-50/80 border-blue-500 shadow-md ring-2 ring-blue-100"
            : "bg-white/90 border-slate-200/90 shadow-xs hover:border-blue-300"
        }`}
      >
        <div className="axiom-corner-accent corner-br accent-blue" />
        <div className="relative z-10 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#2563EB] uppercase">
              <GitBranch className="w-3.5 h-3.5" />
              <span>06 // TOOL DISPATCH BUS (BRANCHING)</span>
            </div>
            <span className="text-[9px] font-mono text-slate-500">07 TOOLS CONNECTED</span>
          </div>

          {/* Branching Tool Connectors Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 text-[10px] font-mono">
            {/* Active Branch: Shipping API */}
            <div
              className={`p-1.5 rounded-lg border text-center transition-all duration-300 ${
                activeStage >= 6
                  ? "bg-blue-600 text-white border-blue-600 font-bold shadow-xs scale-102 ring-2 ring-blue-200"
                  : "bg-blue-50 text-[#2563EB] border-blue-200"
              }`}
            >
              <div>SHIPPING API</div>
              <div className="text-[9px] opacity-90">● 200 OK</div>
            </div>

            {/* Standby Branches */}
            {[
              { name: "CRM API", status: "STANDBY" },
              { name: "PAYMENTS", status: "STANDBY" },
              { name: "WHATSAPP", status: "STANDBY" },
              { name: "DATABASE", status: "STANDBY" },
            ].map((tool) => (
              <div
                key={tool.name}
                className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 text-center"
              >
                <div className="text-[9px] font-semibold text-slate-700">{tool.name}</div>
                <div className="text-[8px] text-slate-400">{tool.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vector Connector */}
      <div className="w-[2px] h-3 bg-gradient-to-b from-blue-600 to-emerald-700 mx-auto mb-1" />

      {/* ================= STAGE 07: VERIFIED ACTION COMPLETE ================= */}
      <div
        onClick={() => setSelectedNode(selectedNode === 7 ? null : 7)}
        className={`axiom-corner-card relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
          activeStage === 7
            ? "bg-[#0F172A] border-emerald-400 ring-2 ring-emerald-500/30 text-white shadow-lg"
            : "bg-[#0F172A] border-slate-800 text-white"
        }`}
      >
        <div className="axiom-corner-accent corner-top-left accent-emerald" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[12px] font-bold tracking-tight text-white flex items-center gap-2">
                <span>✓ VERIFIED ACTION COMPLETE</span>
                <span className="text-[9px] font-mono text-emerald-300 bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-800">
                  ZERO-DRIFT ✓
                </span>
              </div>
              <div className="text-[10px] font-mono text-slate-400">
                State Committed • Audit Hash #998F42
              </div>
            </div>
          </div>

          <div className="text-right font-mono hidden sm:block">
            <div className="text-[9px] text-slate-400">STATUS</div>
            <div className="text-[11px] font-bold text-emerald-400">SUCCESS</div>
          </div>
        </div>
      </div>

      {/* Expandable Technical Detail Drawer if user clicks a stage */}
      {selectedNode && stageDetails[selectedNode] && (
        <div className="mt-3 p-3.5 rounded-xl bg-slate-900 text-white border border-blue-500/50 shadow-lg text-[11px] font-mono animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between text-[#06B6D4] font-bold mb-1">
            <span>{stageDetails[selectedNode].title}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedNode(null);
              }}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <p className="text-slate-300 text-[12px] leading-relaxed mb-2 font-sans">
            {stageDetails[selectedNode].desc}
          </p>
          <div className="text-[10px] text-emerald-400 font-mono">
            {stageDetails[selectedNode].metrics}
          </div>
        </div>
      )}
    </div>
  );
}
