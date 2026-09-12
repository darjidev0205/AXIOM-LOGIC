"use client";

import Link from "next/link";
import TopNavBar from "@/components/navigation/TopNavBar";
import Footer from "@/components/navigation/Footer";
import AxiomCornerCard from "@/components/ui/AxiomCornerCard";
import AxiomOrchestrationFlow from "@/components/architecture/AxiomOrchestrationFlow";
import {
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Cpu,
  Terminal,
  Users,
  Lock,
  GitBranch,
  Database,
  Server,
  Zap,
  Check,
  Sparkles,
} from "lucide-react";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#0F172A] font-sans selection:bg-blue-600 selection:text-white overflow-x-clip">
      <TopNavBar />

      <main className="flex-grow">
        {/* ================= HERO SECTION (SWISS EDITORIAL ARCHITECTURE) ================= */}
        <section className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-slate-200/80 bg-white overflow-hidden">
          {/* Subtle Technical Grid & Architectural Guide Lines */}
          <div className="absolute inset-0 tech-grid-pattern pointer-events-none opacity-50" />
          
          <div className="absolute top-0 bottom-0 left-8 md:left-24 w-[1px] bg-slate-200/70 pointer-events-none hidden sm:block" />
          <div className="absolute top-0 bottom-0 right-8 md:right-24 w-[1px] bg-slate-200/70 pointer-events-none hidden sm:block" />

          <div className="axiom-container relative z-10">
            {/* Top Coordinate & System Status Strip */}
            <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 uppercase tracking-widest pb-6 mb-8 border-b border-slate-100 gap-4">
              <div className="flex items-center gap-3">
                <span className="crosshair-mark pl-2 text-[#2563EB] font-bold">+ SYS_REF // AXIOM-CORE-ENGINE-v3.4</span>
                <span className="text-slate-300">|</span>
                <span>EXECUTION_MODEL: PROBABILISTIC_REASONING + DETERMINISTIC_GATES</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#2563EB] font-semibold">DETERMINISTIC_GATES: 100%</span>
                <span className="text-slate-300">•</span>
                <span className="text-emerald-600 font-semibold">ZERO_HALLUCINATION_POLICY: ACTIVE</span>
              </div>
            </div>

            {/* 2-Column Hero Split: Headline & CTA on Left, Animated Architecture Flow on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-12 items-center">
              {/* Left Column (6 cols): Typography & CTA */}
              <div className="lg:col-span-6 xl:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[#2563EB] text-[12px] font-mono tracking-wider uppercase font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse" />
                  <span>CORE ENGINE // ARCHITECTURE</span>
                </div>

                <h1 className="font-display-hero font-bold text-[#0F172A] tracking-tight leading-[0.98]">
                  From request to result,{" "}
                  <span className="font-italic-accent-blue block sm:inline">
                    automatically.
                  </span>
                </h1>

                <p className="text-[17px] sm:text-[19px] text-slate-600 leading-relaxed font-normal max-w-xl">
                  Axiom Logic combines probabilistic language models with strictly deterministic business guardrails to ensure zero hallucinations and absolute execution fidelity.
                </p>

                <div className="pt-2">
                  <Link
                    href="/live-demo"
                    className="btn-arrow-slide btn-axiom-primary px-6 py-3.5 text-[15px] gap-2.5 shadow-sm inline-flex items-center"
                  >
                    <span>Test In Live Simulator</span>
                    <ArrowRight className="w-4 h-4 arrow-icon text-blue-200" />
                  </Link>
                </div>
              </div>

              {/* Right Column (6 cols): Real Responsive Animated System Architecture Engine */}
              <div className="lg:col-span-6 xl:col-span-6 relative flex justify-center items-center">
                <AxiomOrchestrationFlow />
              </div>
            </div>
          </div>
        </section>

        {/* ================= 4-STAGE ARCHITECTURAL PIPELINE (70/30 OVERFLOW & ALTERNATING RHYTHM) ================= */}
        <section className="py-12 lg:py-20 axiom-container space-y-20 sm:space-y-24 lg:space-y-28">

          {/* ================= STAGE 01 // UNDERSTAND (VISUAL OVERFLOW TOP-RIGHT) ================= */}
          <div className="relative pt-12 md:pt-16">
            <AxiomCornerCard
              corner="bottom-right"
              color="blue"
              className="p-7 md:p-10 lg:p-12 shadow-lg border-slate-300/80"
            >
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: Text */}
                <div className="lg:col-span-5 space-y-4 relative z-10">
                  <div className="inline-flex items-center gap-2 text-[11px] font-mono text-[#2563EB] font-semibold tracking-wider uppercase">
                    <span>STAGE 01 // SEMANTIC EXTRACTION</span>
                  </div>

                  <h2 className="text-[34px] sm:text-[44px] font-bold text-[#0F172A] tracking-tight leading-[1.08]">
                    Intent{" "}
                    <span className="font-italic-accent-blue">
                      Synthesis
                    </span>
                  </h2>

                  <p className="text-[15px] text-slate-600 leading-relaxed">
                    Raw human intent arriving through WhatsApp, Gmail, Slack, web forms, or webhooks is parsed into strictly typed, validated entity dictionaries with zero ambiguity.
                  </p>

                  <div className="space-y-2 pt-1 text-[14px] text-slate-700">
                    <div className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                      <span>Zero-shot entity extraction (Dates, Order IDs, Currencies, Addresses)</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                      <span>Sentiment and urgency scoring index with threshold triggers</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-900 shrink-0" />
                      <span>Multi-lingual semantic normalization to internal database schemas</span>
                    </div>
                  </div>
                </div>

                {/* Right Placeholder */}
                <div className="lg:col-span-7 hidden lg:block" style={{ minHeight: "260px" }} />
              </div>

              {/* 70/30 IMAGE OVERFLOW (Top 30% breaks out ABOVE top border) */}
              <div className="lg:absolute lg:-top-14 lg:-right-6 xl:-right-12 lg:w-[56%] xl:w-[58%] z-20 mt-6 lg:mt-0">
                <div className="bg-[#0F172A] text-white rounded-2xl border border-slate-700/80 p-5 md:p-6 shadow-2xl backdrop-blur-xl space-y-3 font-mono text-[12px]">
                  <div className="flex justify-between items-center text-[10px] text-slate-400 pb-2.5 border-b border-slate-800">
                    <span className="flex items-center gap-2 text-blue-400">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>RAW_PAYLOAD_TRANSFORM</span>
                    </span>
                    <span className="text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                      SCHEMA_STRICT: PASS
                    </span>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] leading-relaxed">
                    <span className="text-blue-400">&#123;</span><br />
                    &nbsp;&nbsp;<span className="text-slate-300">&quot;raw_input&quot;</span>: <span className="text-emerald-400">&quot;Can you change delivery address for #GC1024 to 442 North Lake St?&quot;</span>,<br />
                    &nbsp;&nbsp;<span className="text-slate-300">&quot;extracted_intent&quot;</span>: <span className="text-amber-300">&quot;MODIFY_SHIPPING_DESTINATION&quot;</span>,<br />
                    &nbsp;&nbsp;<span className="text-slate-300">&quot;order_id&quot;</span>: <span className="text-emerald-400">&quot;GC-1024&quot;</span>,<br />
                    &nbsp;&nbsp;<span className="text-slate-300">&quot;normalized_address&quot;</span>: <span className="text-blue-300">&quot;442 N LAKE ST, CA 90026&quot;</span>,<br />
                    &nbsp;&nbsp;<span className="text-slate-300">&quot;confidence&quot;</span>: <span className="text-emerald-400 font-bold">0.998</span><br />
                    <span className="text-blue-400">&#125;</span>
                  </div>
                </div>
              </div>

              {/* Floating Metric Callout */}
              <div className="lg:absolute -bottom-6 left-10 z-30 bg-white border border-slate-300/90 rounded-xl p-4 shadow-lg flex items-center gap-6 mt-6 lg:mt-0">
                <div className="border-r border-slate-200 pr-5">
                  <div className="text-[28px] font-bold text-[#2563EB] tracking-tight leading-none">
                    99.8%
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-1 font-semibold">
                    ENTITY EXTRACTION FIDELITY
                  </div>
                </div>
                <div>
                  <div className="text-[28px] font-bold text-emerald-700 tracking-tight leading-none">
                    38ms
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-1 font-semibold">
                    PARSING LATENCY
                  </div>
                </div>
              </div>

            </AxiomCornerCard>
          </div>

          {/* ================= STAGE 02 // DECIDE (ALTERNATING: VISUAL OVERFLOW TOP-LEFT) ================= */}
          <div className="relative pt-12 md:pt-16">
            <AxiomCornerCard
              corner="top-left"
              color="emerald"
              className="p-7 md:p-10 lg:p-12 shadow-lg border-slate-300/80"
            >
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Placeholder for desktop visual */}
                <div className="lg:col-span-7 hidden lg:block" style={{ minHeight: "260px" }} />

                {/* Right: Text */}
                <div className="lg:col-span-5 space-y-4 relative z-10">
                  <div className="inline-flex items-center gap-2 text-[11px] font-mono text-[#2563EB] font-semibold tracking-wider uppercase">
                    <span>STAGE 02 // DETERMINISTIC BOUNDARY</span>
                  </div>

                  <h2 className="text-[34px] sm:text-[44px] font-bold text-[#0F172A] tracking-tight leading-[1.08]">
                    Policy{" "}
                    <span className="font-italic-accent-emerald">
                      Governance
                    </span>
                  </h2>

                  <p className="text-[15px] text-slate-600 leading-relaxed">
                    The agent queries your company&apos;s business rules engine before touching any production database. If an order is already in &quot;Out For Delivery&quot; status or exceeds financial approval limits, mutation is safely halted.
                  </p>

                  <div className="space-y-2 pt-1 text-[14px] text-slate-700">
                    <div className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                      <span>Deterministic state evaluation against PostgreSQL schemas</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                      <span>Immutable policy constraints matrix with versioned rules</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-900 shrink-0" />
                      <span>Dual-custody verification for high-risk transactional mutations</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 70/30 IMAGE OVERFLOW (Top 30% breaks out ABOVE top border, overflows to the LEFT) */}
              <div className="lg:absolute lg:-top-14 lg:-left-6 xl:-left-12 lg:w-[56%] xl:w-[58%] z-20 mt-6 lg:mt-0 order-first lg:order-none">
                <div className="bg-[#0F172A] text-white rounded-2xl border border-slate-700/80 p-5 md:p-6 shadow-2xl backdrop-blur-xl space-y-3 font-mono text-[12px]">
                  <div className="flex justify-between items-center text-[10px] text-slate-400 pb-2.5 border-b border-slate-800">
                    <span className="flex items-center gap-2 text-purple-400">
                      <Lock className="w-3.5 h-3.5" />
                      <span>POLICY_GATE_EVALUATION</span>
                    </span>
                    <span className="text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                      STATUS: AUTHORIZED
                    </span>
                  </div>

                  <div className="space-y-2 text-[11px]">
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-300">Rule #104: Time Since Order Placement &lt; 24h</span>
                      <span className="text-emerald-400 font-semibold">PASS (4.2h)</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-300">Rule #105: Warehouse Dispatch Status == PENDING</span>
                      <span className="text-emerald-400 font-semibold">PASS (HUB_QUEUED)</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-300">Rule #106: Address Region Match == US_CONTINENTAL</span>
                      <span className="text-emerald-400 font-semibold">PASS (ZONE_1)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Metric Callout */}
              <div className="lg:absolute -bottom-6 right-10 z-30 bg-white border border-slate-300/90 rounded-xl p-4 shadow-lg flex items-center gap-6 mt-6 lg:mt-0">
                <div className="border-r border-slate-200 pr-5">
                  <div className="text-[28px] font-bold text-[#2563EB] tracking-tight leading-none">
                    100%
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-1 font-semibold">
                    POLICY ENFORCEMENT
                  </div>
                </div>
                <div>
                  <div className="text-[28px] font-bold text-emerald-700 tracking-tight leading-none">
                    0 Drift
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-1 font-semibold">
                    DETERMINISTIC FIDELITY
                  </div>
                </div>
              </div>
            </AxiomCornerCard>
          </div>

          {/* ================= STAGE 03 // ACT (VISUAL OVERFLOW TOP-RIGHT) ================= */}
          <div className="relative pt-12 md:pt-16">
            <AxiomCornerCard
              corner="bottom-left"
              color="cyan"
              className="p-7 md:p-10 lg:p-12 shadow-lg border-slate-300/80"
            >
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: Text */}
                <div className="lg:col-span-5 space-y-4 relative z-10">
                  <div className="inline-flex items-center gap-2 text-[11px] font-mono text-[#2563EB] font-semibold tracking-wider uppercase">
                    <span>STAGE 03 // WRITE EXECUTION</span>
                  </div>

                  <h2 className="text-[34px] sm:text-[44px] font-bold text-[#0F172A] tracking-tight leading-[1.08]">
                    Tool{" "}
                    <span className="font-italic-accent-blue">
                      Execution
                    </span>
                  </h2>

                  <p className="text-[15px] text-slate-600 leading-relaxed">
                    Once verified, the agent commits write mutations through authenticated enterprise connectors. Changes are atomic, isolated, and accompanied by rollback checkpoints.
                  </p>

                  <div className="space-y-2 pt-1 text-[14px] text-slate-700">
                    <div className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                      <span>PostgreSQL atomic transaction commits with rollback safety</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                      <span>REST &amp; GraphQL tool execution with retry exponential backoff</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-900 shrink-0" />
                      <span>Multi-system synchronization across CRM, ERP, and payment engines</span>
                    </div>
                  </div>
                </div>

                {/* Right Placeholder */}
                <div className="lg:col-span-7 hidden lg:block" style={{ minHeight: "260px" }} />
              </div>

              {/* 70/30 IMAGE OVERFLOW (Top 30% breaks out ABOVE top border) */}
              <div className="lg:absolute lg:-top-14 lg:-right-6 xl:-right-12 lg:w-[56%] xl:w-[58%] z-20 mt-6 lg:mt-0">
                <div className="bg-[#0F172A] text-white rounded-2xl border border-slate-700/80 p-5 md:p-6 shadow-2xl backdrop-blur-xl space-y-3 font-mono text-[12px]">
                  <div className="flex justify-between items-center text-[10px] text-slate-400 pb-2.5 border-b border-slate-800">
                    <span className="flex items-center gap-2 text-blue-400">
                      <Server className="w-3.5 h-3.5" />
                      <span>TOOL_DISPATCH_BUS</span>
                    </span>
                    <span className="text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                      COMMIT: SUCCESS (200 OK)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-[9px] text-slate-400">DATABASE MUTATION</div>
                      <div className="text-emerald-400 font-semibold mt-1">UPDATE orders SET address</div>
                      <div className="text-[10px] text-slate-500 mt-1">Affected Rows: 1 (14ms)</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-[9px] text-slate-400">CARRIER API</div>
                      <div className="text-blue-400 font-semibold mt-1">POST /v2/shipments/reroute</div>
                      <div className="text-[10px] text-slate-500 mt-1">Tracking Token Matched</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Metric Callout */}
              <div className="lg:absolute -bottom-6 left-10 z-30 bg-white border border-slate-300/90 rounded-xl p-4 shadow-lg flex items-center gap-6 mt-6 lg:mt-0">
                <div className="border-r border-slate-200 pr-5">
                  <div className="text-[28px] font-bold text-[#2563EB] tracking-tight leading-none">
                    &lt; 500ms
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-1 font-semibold">
                    TOTAL DISPATCH LATENCY
                  </div>
                </div>
                <div>
                  <div className="text-[28px] font-bold text-emerald-700 tracking-tight leading-none">
                    99.98%
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-1 font-semibold">
                    EXECUTION SUCCESS RATE
                  </div>
                </div>
              </div>

            </AxiomCornerCard>
          </div>

          {/* ================= STAGE 04 // ESCALATE (ALTERNATING: VISUAL OVERFLOW TOP-LEFT) ================= */}
          <div className="relative pt-12 md:pt-16">
            <AxiomCornerCard
              corner="top-right"
              color="amber"
              className="p-7 md:p-10 lg:p-12 shadow-lg border-slate-300/80"
            >
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Placeholder for desktop visual */}
                <div className="lg:col-span-7 hidden lg:block" style={{ minHeight: "260px" }} />

                {/* Right: Text */}
                <div className="lg:col-span-5 space-y-4 relative z-10">
                  <div className="inline-flex items-center gap-2 text-[11px] font-mono text-[#2563EB] font-semibold tracking-wider uppercase">
                    <span>STAGE 04 // SAFE HANDOFF</span>
                  </div>

                  <h2 className="text-[34px] sm:text-[44px] font-bold text-[#0F172A] tracking-tight leading-[1.08]">
                    Human{" "}
                    <span className="font-italic-accent-amber">
                      Supervision
                    </span>
                  </h2>

                  <p className="text-[15px] text-slate-600 leading-relaxed">
                    When confidence falls below 95% or a request violates safety thresholds, the execution safely freezes and packages the full context into an operator approval queue with 1-click resolution.
                  </p>

                  <div className="space-y-2 pt-1 text-[14px] text-slate-700">
                    <div className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                      <span>Instant Slack / Dashboard dispatch with pre-filled recommendations</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                      <span>Operator decisions feed continuous reinforcement calibration</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-900 shrink-0" />
                      <span>Zero customer friction: seamless escalation without conversation restart</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 70/30 IMAGE OVERFLOW (Top 30% breaks out ABOVE top border, overflows to the LEFT) */}
              <div className="lg:absolute lg:-top-14 lg:-left-6 xl:-left-12 lg:w-[56%] xl:w-[58%] z-20 mt-6 lg:mt-0 order-first lg:order-none">
                <div className="bg-[#0F172A] text-white rounded-2xl border border-slate-700/80 p-5 md:p-6 shadow-2xl backdrop-blur-xl space-y-3 font-mono text-[12px]">
                  <div className="flex justify-between items-center text-[10px] text-slate-400 pb-2.5 border-b border-slate-800">
                    <span className="flex items-center gap-2 text-amber-400">
                      <Users className="w-3.5 h-3.5" />
                      <span>OPERATOR_DISPATCH_QUEUE</span>
                    </span>
                    <span className="text-amber-400 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded">
                      WAITING_APPROVAL (CONF: 89.2%)
                    </span>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-2 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">TRIGGER REASON</span>
                      <span className="text-amber-400">ORDER_ALREADY_DISPATCHED</span>
                    </div>
                    <div className="text-slate-200">                      Customer requests destination update for shipment already in-transit.
                    </div>
                    <div className="flex gap-2 pt-2">
                      <span className="px-2.5 py-1 bg-emerald-600 text-white rounded text-[10px] font-bold">
                        APPROVE REROUTE ($8.50 FEE)
                      </span>
                      <span className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded text-[10px]">
                        ESCALATE TO CARRIER
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Metric Callout */}
              <div className="lg:absolute -bottom-6 right-10 z-30 bg-white border border-slate-300/90 rounded-xl p-4 shadow-lg flex items-center gap-6 mt-6 lg:mt-0">
                <div className="border-r border-slate-200 pr-5">
                  <div className="text-[28px] font-bold text-[#2563EB] tracking-tight leading-none">
                    &lt; 2min
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-1 font-semibold">
                    MEDIAN OPERATOR RESOLUTION
                  </div>
                </div>
                <div>
                  <div className="text-[28px] font-bold text-emerald-700 tracking-tight leading-none">
                    0 Errors
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-1 font-semibold">
                    ESCALATION ACCURACY
                  </div>
                </div>
              </div>

            </AxiomCornerCard>
          </div>

        </section>

        {/* ================= COMPACT ACTION BANNER ================= */}
        <section className="border-t border-slate-200/80 bg-white py-14 relative">
          <div className="axiom-container flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="text-[10px] font-mono text-[#2563EB] uppercase tracking-wider font-semibold mb-1">
                SYSTEM ARCHITECTURES
              </div>
              <h3 className="text-[24px] sm:text-[30px] font-bold text-[#0F172A] tracking-tight">
                Ready to trace your own operational graph?
              </h3>
              <p className="text-[15px] text-slate-600 mt-1 max-w-xl">
                Deploy autonomous reasoning operators tailored directly to your APIs and database models.
              </p>
            </div>
            <Link
              href="/book"
              className="btn-arrow-slide btn-axiom-primary px-6 py-3.5 text-[14px] gap-2.5 shadow-sm whitespace-nowrap"
            >
              <span>Schedule 1:1 Architecture Session</span>
              <ArrowRight className="w-4 h-4 arrow-icon text-blue-200" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
