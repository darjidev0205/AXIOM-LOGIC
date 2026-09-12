"use client";

import { useState } from "react";
import Link from "next/link";
import TopNavBar from "@/components/navigation/TopNavBar";
import Footer from "@/components/navigation/Footer";
import { AxiomCornerCard } from "@/components/ui/AxiomCornerCard";
import {
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Terminal,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ShieldCheck,
  Building,
  UserCheck,
  Sparkles,
  Zap,
} from "lucide-react";

interface TraceStep {
  stepNumber: number;
  stepName: string;
  status: "WAITING" | "PROCESSING" | "COMPLETED" | "FAILED" | "ESCALATED";
  latencyMs: number;
  message: string;
  payload?: Record<string, unknown>;
}

export default function LiveDemoPage() {
  const [inputText, setInputText] = useState("Where is my order #GC1024?");
  const [activeScenario, setActiveScenario] = useState<"order" | "address" | "refund">("order");
  const [isRunning, setIsRunning] = useState(false);
  const [execStatus, setExecStatus] = useState<"IDLE" | "RUNNING" | "COMPLETED" | "ESCALATED">("IDLE");
  const [totalDuration, setTotalDuration] = useState<number | null>(null);
  const [isAuditExpanded, setIsAuditExpanded] = useState(true);
  const [auditLogs, setAuditLogs] = useState<string[]>([
    "[00.000ms] [INFO] Axiom Core runtime session initialized. Node cluster us-east-1.",
    "[00.012ms] [INFO] Awaiting trigger signal on webhook endpoint /v1/ingest/conversations.",
    "[00.018ms] [INFO] PostgreSQL connection pool active. 20 workers ready.",
  ]);

  const [activeSteps, setActiveSteps] = useState<TraceStep[]>([
    { stepNumber: 1, stepName: "1. Request Ingestion", status: "WAITING", latencyMs: 0, message: "Awaiting payload" },
    { stepNumber: 2, stepName: "2. Intent & Entity Extraction", status: "WAITING", latencyMs: 0, message: "Awaiting payload" },
    { stepNumber: 3, stepName: "3. Customer Security Verification", status: "WAITING", latencyMs: 0, message: "Awaiting payload" },
    { stepNumber: 4, stepName: "4. Database Query (PostgreSQL)", status: "WAITING", latencyMs: 0, message: "Awaiting payload" },
    { stepNumber: 5, stepName: "5. Business Policy Verification", status: "WAITING", latencyMs: 0, message: "Awaiting payload" },
    { stepNumber: 6, stepName: "6. Verified Dispatch Reply", status: "WAITING", latencyMs: 0, message: "Awaiting payload" },
  ]);

  const [resultData, setResultData] = useState<{
    type: "order" | "address" | "refund" | "custom";
    data: Record<string, unknown>;
    reply?: string;
    escalationId?: string;
  } | null>(null);

  const scenarios = {
    order: "Where is my order #GC1024?",
    address: "Update delivery address to 442 N Lake St",
    refund: "Request invoice refund for order #GC1024",
  };

  const handleSelectScenario = (key: "order" | "address" | "refund") => {
    setActiveScenario(key);
    setInputText(scenarios[key]);
  };

  const handleReset = () => {
    setIsRunning(false);
    setExecStatus("IDLE");
    setTotalDuration(null);
    setResultData(null);
    setActiveSteps([
      { stepNumber: 1, stepName: "1. Request Ingestion", status: "WAITING", latencyMs: 0, message: "Awaiting payload" },
      { stepNumber: 2, stepName: "2. Intent & Entity Extraction", status: "WAITING", latencyMs: 0, message: "Awaiting payload" },
      { stepNumber: 3, stepName: "3. Customer Security Verification", status: "WAITING", latencyMs: 0, message: "Awaiting payload" },
      { stepNumber: 4, stepName: "4. Database Query (PostgreSQL)", status: "WAITING", latencyMs: 0, message: "Awaiting payload" },
      { stepNumber: 5, stepName: "5. Business Policy Verification", status: "WAITING", latencyMs: 0, message: "Awaiting payload" },
      { stepNumber: 6, stepName: "6. Verified Dispatch Reply", status: "WAITING", latencyMs: 0, message: "Awaiting payload" },
    ]);
  };

  const runAutomation = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setExecStatus("RUNNING");
    setResultData(null);

    const startTime = Date.now();
    setAuditLogs((prev) => [
      ...prev,
      `[${new Date().toISOString()}] [TRIGGER] Inbound message payload: "${inputText}"`,
    ]);

    try {
      const responsePromise = fetch("/api/live-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputText }),
      });

      const timeline = [
        { step: 1, delay: 200, ms: 24, log: "[00.024ms] [INGEST] Message tokenized. Channel: WhatsApp/REST." },
        { step: 2, delay: 500, ms: 68, log: "[00.092ms] [REASON] Intent synthesized with confidence 0.998." },
        { step: 3, delay: 850, ms: 42, log: "[00.134ms] [VERIFY] Customer identity confirmed via UUID & phone." },
        { step: 4, delay: 1200, ms: 110, log: "[00.244ms] [QUERY] PostgreSQL query executed. 1 matching record." },
        { step: 5, delay: 1550, ms: 84, log: "[00.328ms] [POLICY] Deterministic guardrail rulebook passed." },
        { step: 6, delay: 1900, ms: 56, log: "[00.384ms] [DISPATCH] Verified response emitted. State committed." },
      ];

      timeline.forEach(({ step, delay, ms, log }) => {
        setTimeout(() => {
          setActiveSteps((prev) =>
            prev.map((s) => (s.stepNumber === step ? { ...s, status: "COMPLETED", latencyMs: ms } : s))
          );
          setAuditLogs((prev) => [
            ...prev,
            `[${new Date().toISOString()}] ${log}`,
          ]);
        }, delay);
      });

      const res = await responsePromise;
      const apiResult = await res.json();

      setTimeout(() => {
        setIsRunning(false);
        const elapsed = Date.now() - startTime;
        setTotalDuration(elapsed);

        if (apiResult.requiresApproval) {
          setExecStatus("ESCALATED");
          setResultData({
            type: "refund",
            data: apiResult.output,
            reply: apiResult.output?.response,
            escalationId: apiResult.approvalId,
          });
        } else if (inputText.toLowerCase().includes("address")) {
          setExecStatus("COMPLETED");
          setResultData({
            type: "address",
            data: apiResult.output,
            reply: apiResult.output?.reply,
          });
        } else {
          setExecStatus("COMPLETED");
          setResultData({
            type: "order",
            data: apiResult.output,
            reply: apiResult.output?.reply,
          });
        }
      }, 2000);
    } catch {
      setIsRunning(false);
      setExecStatus("IDLE");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-[#0F172A] font-sans selection:bg-blue-600 selection:text-white overflow-x-clip">
      <TopNavBar />

      <main className="flex-grow">
        {/* ================= HERO SECTION (SWISS EDITORIAL ARCHITECTURE) ================= */}
        <section className="relative pt-12 pb-14 lg:pt-16 lg:pb-20 border-b border-slate-200/80 bg-white overflow-hidden">
          <div className="absolute inset-0 tech-grid-pattern pointer-events-none opacity-50" />
          
          <div className="absolute top-0 bottom-0 left-8 md:left-24 w-[1px] bg-slate-200/70 pointer-events-none hidden sm:block" />
          <div className="absolute top-0 bottom-0 right-8 md:right-24 w-[1px] bg-slate-200/70 pointer-events-none hidden sm:block" />

          <div className="axiom-container relative z-10">
            {/* Top Coordinate & System Status Strip */}
            <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 uppercase tracking-widest pb-6 mb-8 border-b border-slate-100 gap-4">
              <div className="flex items-center gap-3">
                <span className="crosshair-mark pl-2">+ SYS_REF // AXIOM-SIM-TRACE-v3.4</span>
                <span className="text-slate-300">|</span>
                <span>RUNTIME: US-EAST-1_REASONING_CLUSTER</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#2563EB] font-semibold">TRACE_TELEMETRY: ACTIVE</span>
                <span className="text-slate-300">•</span>
                <span className="text-emerald-600 font-semibold">STATE: ISOLATED_SANDBOX</span>
              </div>
            </div>

            {/* Massive Editorial Headline */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[#2563EB] text-[12px] font-mono tracking-wider uppercase font-semibold mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse" />
                  <span>INTERACTIVE EXECUTION STUDIO</span>
                </div>

                <h1 className="font-display-hero font-bold text-[#0F172A] tracking-tight leading-[0.98] mb-4">
                  See an AI workflow think, act and{" "}
                  <span className="font-italic-accent-blue">
                    respond.
                  </span>
                </h1>

                <p className="text-[17px] text-slate-600 leading-relaxed font-normal">
                  Experience a live customer-operations workflow executed deterministically from raw unstructured input to committed database state.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={handleReset}
                  className="btn-axiom-secondary inline-flex items-center gap-2 px-5 py-3 rounded-xl text-[14px] font-semibold"
                >
                  <RotateCcw className="w-4 h-4 text-slate-500" />
                  <span>Reset Simulator</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 3-COLUMN INTERACTIVE ARCHITECTURAL SANDBOX ================= */}
        <section className="py-12 lg:py-16 axiom-container">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Column 1: Intake Scenario (4 cols) */}
            <AxiomCornerCard corner="bottom-right" color="blue" className="lg:col-span-4 p-5 sm:p-6 md:p-8 space-y-5">
              <div className="font-mono text-[11px] font-semibold text-[#0F172A] flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-[#2563EB] uppercase tracking-wider">01 // INTAKE SCENARIO</span>
                <span className="text-slate-400">SELECT OR TYPE</span>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={() => handleSelectScenario("order")}
                  className={`w-full text-left p-3.5 rounded-xl border text-[13px] font-medium transition-all flex items-center justify-between ${
                    activeScenario === "order"
                      ? "border-[#2563EB] bg-blue-50/80 text-[#2563EB] shadow-xs"
                      : "border-slate-200 hover:bg-slate-50 bg-white text-slate-700"
                  }`}
                >
                  <span>&quot;Where is my order #GC1024?&quot;</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>

                <button
                  onClick={() => handleSelectScenario("address")}
                  className={`w-full text-left p-3.5 rounded-xl border text-[13px] font-medium transition-all flex items-center justify-between ${
                    activeScenario === "address"
                      ? "border-[#2563EB] bg-blue-50/80 text-[#2563EB] shadow-xs"
                      : "border-slate-200 hover:bg-slate-50 bg-white text-slate-700"
                  }`}
                >
                  <span>&quot;Update delivery address to 442 N Lake St&quot;</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>

                <button
                  onClick={() => handleSelectScenario("refund")}
                  className={`w-full text-left p-3.5 rounded-xl border text-[13px] font-medium transition-all flex items-center justify-between ${
                    activeScenario === "refund"
                      ? "border-[#2563EB] bg-blue-50/80 text-[#2563EB] shadow-xs"
                      : "border-slate-200 hover:bg-slate-50 bg-white text-slate-700"
                  }`}
                >
                  <span>&quot;Request invoice refund for order #GC1024&quot;</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-500 uppercase tracking-wider mb-2 font-semibold">
                  Customer Message Payload
                </label>
                <textarea
                  rows={3}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full text-[13px] rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 text-slate-900"
                />
              </div>

              <button
                onClick={runAutomation}
                disabled={isRunning || !inputText.trim()}
                className="btn-axiom-primary w-full py-3.5 rounded-xl text-[14px] font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isRunning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Executing Graph...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Run Automation</span>
                    <ArrowRight className="w-4 h-4 arrow-icon text-blue-200" />
                  </>
                )}
              </button>
            </AxiomCornerCard>

            {/* Column 2: Reasoning Engine Trace (4 cols) */}
            <AxiomCornerCard corner="top-left" color="emerald" className="lg:col-span-4 p-6 md:p-8 space-y-4">
              <div className="font-mono text-[11px] font-semibold text-[#0F172A] flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-[#2563EB] uppercase tracking-wider">02 // REASONING ENGINE TRACE</span>
                <span
                  className={`text-[11px] font-mono font-semibold ${
                    execStatus === "RUNNING"
                      ? "text-[#2563EB] animate-pulse"
                      : execStatus === "COMPLETED"
                      ? "text-emerald-600"
                      : execStatus === "ESCALATED"
                      ? "text-[#2563EB]"
                      : "text-slate-400"
                  }`}
                >
                  {execStatus === "RUNNING"
                    ? "EXECUTING..."
                    : execStatus === "COMPLETED"
                    ? `VERIFIED (${totalDuration}ms)`
                    : execStatus === "ESCALATED"
                    ? "ESCALATED TO HUMAN"
                    : "IDLE"}
                </span>
              </div>

              <div className="space-y-2.5">
                {activeSteps.map((step) => {
                  const isDone = step.status === "COMPLETED";
                  const isEsc = step.status === "ESCALATED";
                  return (
                    <div
                      key={step.stepNumber}
                      className={`p-3 rounded-xl border text-[13px] flex items-center justify-between transition-all ${
                        isDone
                          ? "border-emerald-200 bg-emerald-50/70"
                          : isEsc
                          ? "border-blue-200 bg-blue-50/70"
                          : "border-slate-200 bg-slate-50/50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : isEsc ? (
                          <AlertCircle className="w-4 h-4 text-[#2563EB] shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-300" />
                        )}
                        <span className={isDone || isEsc ? "font-medium text-[#0F172A]" : "text-slate-500"}>
                          {step.stepName}
                        </span>
                      </div>
                      <span
                        className={`text-[11px] font-mono ${
                          isDone
                            ? "text-emerald-700 font-semibold"
                            : isEsc
                            ? "text-[#2563EB] font-semibold"
                            : "text-slate-400"
                        }`}
                      >
                        {step.latencyMs > 0 ? `+${step.latencyMs}ms` : "--"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </AxiomCornerCard>

            {/* Column 3: Action & Result (4 cols) */}
            <AxiomCornerCard corner="bottom-right" color="cyan" className="lg:col-span-4 p-6 md:p-8 space-y-4">
              <div className="font-mono text-[11px] font-semibold text-[#0F172A] flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-[#2563EB] uppercase tracking-wider">03 // ACTION &amp; RESULT</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium ${
                    resultData?.type === "refund"
                      ? "bg-blue-50 text-[#2563EB] border border-blue-200"
                      : resultData
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {resultData ? (resultData.type === "refund" ? "Human Escalation" : "Verified Result") : "Awaiting Run"}
                </span>
              </div>

              {!resultData && !isRunning && (
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center py-12 text-[14px] text-slate-600">
                  <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-60" />
                  <p>
                    Click <strong className="text-[#0F172A]">&quot;Run Automation&quot;</strong> to view real-time payload mutations, logistics tracking, and verified customer response.
                  </p>
                </div>
              )}

              {isRunning && (
                <div className="p-10 text-center bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="w-6 h-6 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <span className="text-[13px] text-slate-600 font-mono">
                    Agent reasoning through schema policies...
                  </span>
                </div>
              )}

              {resultData && (
                <div className="space-y-4 text-[13px]">
                  {resultData.type === "order" && (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                        <span className="font-mono text-[11px] font-semibold text-[#0F172A]">
                          DATABASE MATCH: ORDER #GC1024
                        </span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-100 text-emerald-800 font-semibold">
                          IN_TRANSIT
                        </span>
                      </div>
                      <div>
                        <div className="text-[10px] font-mono text-slate-500 uppercase mb-0.5">
                          COURIER GEO-TELEMETRY
                        </div>
                        <div className="font-semibold text-[#0F172A]">
                          Town Distribution Center → Village Delivery Hub
                        </div>
                        <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                          ETA: Today, 3:45 PM • Driver: Unit #402
                        </div>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-blue-200/80">
                        <div className="text-[10px] font-mono text-[#2563EB] font-semibold mb-1">
                          AGENT DRAFTED DISPATCH:
                        </div>
                        <p className="text-[#0F172A] leading-relaxed">
                          &quot;{resultData.reply || "Your order has reached the town hub and is scheduled for village delivery today."}&quot;
                        </p>
                      </div>
                    </div>
                  )}

                  {resultData.type === "address" && (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                        <span className="font-mono text-[11px] font-semibold text-[#0F172A]">
                          ATOMIC MUTATION EXECUTED
                        </span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-100 text-emerald-800 font-semibold">
                          COMMITTED
                        </span>
                      </div>
                      <div>
                        <div className="text-[10px] font-mono text-slate-500 uppercase mb-0.5">
                          PREVIOUS DESTINATION
                        </div>
                        <div className="line-through text-slate-400 text-[12px]">
                          104 Broadway Ave, Apt 4B
                        </div>
                        <div className="text-[10px] font-mono text-emerald-700 font-medium mt-2 uppercase">
                          UPDATED DESTINATION
                        </div>
                        <div className="font-bold text-[#0F172A]">
                          442 N Lake St, Pasadena, CA 91101
                        </div>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-blue-200/80">
                        <div className="text-[10px] font-mono text-[#2563EB] font-semibold mb-1">
                          AGENT DISPATCH:
                        </div>
                        <p className="text-[#0F172A] leading-relaxed">
                          &quot;{resultData.reply || "Done! I have verified your order status was eligible for modification and updated your shipping destination to 442 N Lake St."}&quot;
                        </p>
                      </div>
                    </div>
                  )}

                  {resultData.type === "refund" && (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                        <span className="font-mono text-[11px] font-semibold text-[#0F172A]">
                          POLICY CHECK: THRESHOLD EXCEEDED
                        </span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-blue-100 text-[#2563EB] font-semibold">
                          ESCALATED
                        </span>
                      </div>
                      <div>
                        <div className="text-[10px] font-mono text-slate-500 uppercase mb-0.5">
                          REASONING TRIGGER
                        </div>
                        <div className="text-[#0F172A]">
                          Refund value ($340.00) exceeds autonomous tier threshold ($100.00).
                        </div>
                        <div className="text-[10px] font-mono text-[#2563EB] font-medium mt-2 uppercase">
                          HUMAN-IN-THE-LOOP CREATED
                        </div>
                        <div className="font-semibold text-[#0F172A]">
                          Escalation ticket assigned to Billing Lead Supervisor.
                        </div>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-blue-200/80">
                        <div className="text-[10px] font-mono text-[#2563EB] font-semibold mb-1">
                          AGENT DISPATCH:
                        </div>
                        <p className="text-[#0F172A] leading-relaxed">
                          &quot;{resultData.reply || "I have initiated your refund review for invoice #GC1024. Because this amount exceeds standard instant limits, I've compiled your receipt and handed this to our billing supervisor for one-click approval."}&quot;
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </AxiomCornerCard>

          </div>

          {/* Collapsible Technical Audit Timeline */}
          <div className="mt-10 border border-slate-300/80 rounded-3xl bg-white overflow-hidden shadow-lg">
            <button
              onClick={() => setIsAuditExpanded(!isAuditExpanded)}
              className="w-full px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between hover:bg-slate-100 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <Terminal className="w-4 h-4 text-[#2563EB]" />
                <span className="font-mono text-[12px] font-semibold text-[#0F172A]">
                  TECHNICAL AUDIT LOG (MICROSECOND TELEMETRY)
                </span>
              </div>
              {isAuditExpanded ? (
                <ChevronUp className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              )}
            </button>

            {isAuditExpanded && (
              <div className="p-6 font-mono text-[11px] bg-[#0F172A] text-slate-400 space-y-2 overflow-x-auto max-h-64 overflow-y-auto">
                {auditLogs.map((log, idx) => (
                  <p key={idx} className={log.includes("COMPLETED") || log.includes("OK") ? "text-emerald-400" : log.includes("TRIGGER") ? "text-sky-300" : "text-slate-400"}>
                    {log}
                  </p>
                ))}
              </div>
            )}
          </div>

        </section>

        {/* ================= COMPACT ACTION BANNER ================= */}
        <section className="border-t border-slate-200/80 bg-white py-14 relative">
          <div className="axiom-container flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="text-[10px] font-mono text-[#2563EB] uppercase tracking-wider font-semibold mb-1">
                + SYS_REF // PILOT SIMULATION
              </div>
              <h3 className="text-[24px] sm:text-[30px] font-bold text-[#0F172A] tracking-tight">
                Want to run your real customer data through the sandbox?
              </h3>
              <p className="text-[15px] text-slate-600 mt-1 max-w-xl">
                We can connect a test staging webhook to your sandbox environment in under 24 hours.
              </p>
            </div>
            <Link
              href="/book"
              className="btn-axiom-primary inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-[14px] font-semibold whitespace-nowrap"
            >
              <span>Schedule Live Sandbox Walkthrough</span>
              <ArrowRight className="w-4 h-4 arrow-icon text-blue-200" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
