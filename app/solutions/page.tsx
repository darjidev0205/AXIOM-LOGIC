"use client";

import Link from "next/link";
import TopNavBar from "@/components/navigation/TopNavBar";
import Footer from "@/components/navigation/Footer";
import AxiomCornerCard from "@/components/ui/AxiomCornerCard";
import {
  ArrowRight,
  ShieldCheck,
  Check,
  Cpu,
  Layers,
  Database,
  Server,
  Zap,
  Lock,
  Workflow,
  Sparkles,
  GitBranch,
  Terminal,
  Activity,
  FileCheck,
  UserCheck,
} from "lucide-react";

export default function SolutionsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#0F172A] font-sans selection:bg-blue-600 selection:text-white overflow-x-clip">
      <TopNavBar />

      <main className="flex-grow">
        {/* ================= HERO SECTION (SWISS EDITORIAL ARCHITECTURE) ================= */}
        <section className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-slate-200/80 bg-white overflow-hidden">
          {/* Subtle Technical Grid & Architectural Guide Lines */}
          <div className="absolute inset-0 tech-grid-pattern pointer-events-none opacity-50" />
          
          {/* Architectural Axis Lines */}
          <div className="absolute top-0 bottom-0 left-8 md:left-24 w-[1px] bg-slate-200/70 pointer-events-none hidden sm:block" />
          <div className="absolute top-0 bottom-0 right-8 md:right-24 w-[1px] bg-slate-200/70 pointer-events-none hidden sm:block" />

          <div className="axiom-container relative z-10">
            {/* Top Coordinate & System Status Strip */}
            <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 uppercase tracking-widest pb-6 mb-8 border-b border-slate-100 gap-4">
              <div className="flex items-center gap-3">
                <span className="crosshair-mark pl-2 text-[#2563EB] font-bold">+ SYS_REF // AXIOM-SOLUTIONS-V3.4</span>
                <span className="text-slate-300">|</span>
                <span>COORD 37.7749° N, 122.4194° W</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#2563EB] font-semibold">LATENCY_TARGET &lt; 500MS</span>
                <span className="text-slate-300">•</span>
                <span className="text-emerald-600 font-semibold">ZERO_DRIFT: ENABLED</span>
              </div>
            </div>

            {/* Massive Editorial Headline */}
            <div className="max-w-5xl">
              <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[#2563EB] text-[12px] font-mono tracking-wider uppercase font-semibold mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse" />
                <span>SYSTEM ARCHITECTURES</span>
              </div>

              <h1 className="font-display-hero font-bold text-[#0F172A] tracking-tight leading-[1.04] mb-6">
                Built around the way your enterprise{" "}
                <span className="font-italic-accent-gradient block sm:inline">
                  works.
                </span>
              </h1>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-1">
                <p className="lg:col-span-8 text-[18px] sm:text-[20px] text-slate-600 leading-relaxed font-normal">
                  Connect customer interactions, business data, and operational tools into intelligent workflows that require zero manual orchestration.
                </p>
                <div className="lg:col-span-4 flex lg:justify-end">
                  <Link
                    href="/book"
                    className="btn-arrow-slide btn-axiom-primary px-6 py-3.5 text-[15px] gap-2.5 shadow-sm"
                  >
                    <span>Model Your Architecture</span>
                    <ArrowRight className="w-4 h-4 arrow-icon text-blue-200" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= BLUEPRINT ARCHITECTURAL COMPOSITIONS (COMPACT & OVERFLOWING) ================= */}
        {/* Spacing between blueprint containers: 80–120px desktop, 48–72px tablet, 40–56px mobile */}
        <section className="py-12 lg:py-20 axiom-container space-y-20 sm:space-y-24 lg:space-y-28">

          {/* ================= BLUEPRINT 01 // CUSTOMER OPERATIONS (IMAGE OVERFLOW TOP-RIGHT) ================= */}
          <div id="customer-operations" className="relative pt-12 md:pt-16">
            
            {/* White Architectural Frame */}
            <AxiomCornerCard
              corner="bottom-right"
              color="blue"
              className="p-5 sm:p-8 md:p-10 lg:p-12 shadow-lg border-slate-300/80"
            >
              
              {/* Main Content Grid: Text on Left (approx 42%), Spacer on Right */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* LEFT: Editorial Typography */}
                <div className="lg:col-span-5 space-y-4 relative z-10">
                  <div className="inline-flex items-center gap-2 text-[11px] font-mono text-[#2563EB] font-semibold tracking-wider uppercase">
                    <span>BLUEPRINT 01 // FRONT-LINE INGESTION</span>
                  </div>

                  <h2 className="text-[34px] sm:text-[44px] font-bold text-[#0F172A] tracking-tight leading-[1.08]">
                    Customer{" "}
                    <span className="font-italic-accent-blue">
                      Operations
                    </span>
                  </h2>

                  <p className="text-[15px] text-slate-600 leading-relaxed">
                    Eliminates repetitive ticket triage. The agent absorbs multi-channel inputs (WhatsApp, email, web chat), identifies customer records in your database, evaluates return or cancellation eligibility, executes mutations in your store engine, and replies in natural, verified language.
                  </p>

                  <div className="space-y-2 pt-1 text-[14px] text-slate-700">
                    <div className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                      <span>Multi-channel payload ingestion without schema drift</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                      <span>Real-time verification against PostgreSQL and carrier APIs</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-900 shrink-0" />
                      <span>Automatic confidence gating with zero-touch human escalation</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      href="/live-demo"
                      className="btn-arrow-slide inline-flex items-center gap-2 text-[#2563EB] font-semibold text-[14px] hover:underline"
                    >
                      <span>Launch Customer Ops Simulation</span>
                      <ArrowRight className="w-4 h-4 arrow-icon" />
                    </Link>
                  </div>
                </div>

                {/* Right Placeholder Spacer for desktop layered layout */}
                <div className="lg:col-span-7 hidden lg:block" style={{ minHeight: "260px" }} />
              </div>

              {/* 70/30 IMAGE OVERFLOW LAYER (Top 30% breaks out ABOVE top border, 70% remains inside) */}
              <div className="lg:absolute lg:-top-14 lg:-right-6 xl:-right-12 lg:w-[56%] xl:w-[58%] z-20 mt-6 lg:mt-0">
                <div className="bg-[#0F172A] text-white rounded-2xl border border-slate-700/80 p-5 md:p-6 shadow-2xl backdrop-blur-xl">
                  {/* Console Header */}
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-[11px] font-mono">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                      <span className="text-slate-300 font-semibold tracking-wider">
                        AUTONOMOUS REASONING CORE // UNIT-01
                      </span>
                    </div>
                    <span className="text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded text-[10px]">
                      REASONING: 38ms
                    </span>
                  </div>

                  {/* Machine Layers */}
                  <div className="space-y-3 font-mono text-[12px]">
                    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3">
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                        <span>INBOUND MULTI-CHANNEL ADAPTER</span>
                        <span className="text-blue-400">OKTA_AUTH: VALID</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-[11px]">
                        <span className="px-2.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-200">
                          WhatsApp: &quot;Where is order #GC1024?&quot;
                        </span>
                        <span className="px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800">
                          PAYLOAD ATTACHED
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-900/90 border border-blue-500/40 rounded-lg p-3">
                      <div className="text-[10px] text-blue-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                        <span>DECISION NODE &amp; DATA ENGINE</span>
                        <span className="text-emerald-400">99.8% CERTAINTY</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="bg-slate-950 p-2 rounded border border-slate-800">
                          <div className="text-slate-400 text-[10px]">POSTGRES DB</div>
                          <div className="text-white font-semibold">Order: #GC1024</div>
                        </div>
                        <div className="bg-slate-950 p-2 rounded border border-slate-800">
                          <div className="text-slate-400 text-[10px]">CARRIER STATUS</div>
                          <div className="text-emerald-300 font-semibold">TOWN HUB (OUT)</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-emerald-950/40 border border-emerald-500/50 rounded-lg p-2.5 flex items-center justify-between text-[11px]">
                      <span className="text-emerald-300 font-semibold">
                        ✓ DISPATCHED RESPONSE &amp; STATE COMMITTED
                      </span>
                      <span className="text-emerald-400 text-[10px]">LATENCY: 412ms</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* FLOATING METRICS OVERLAPPING BOUNDARY */}
              <div className="lg:absolute -bottom-6 left-10 z-30 bg-white border border-slate-300/90 rounded-xl p-4 shadow-lg flex items-center gap-6 mt-6 lg:mt-0">
                <div className="border-r border-slate-200 pr-5">
                  <div className="text-[28px] font-bold text-[#2563EB] tracking-tight leading-none">
                    -78%
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-1 font-semibold">
                    FIRST RESPONSE TIME
                  </div>
                </div>
                <div>
                  <div className="text-[28px] font-bold text-emerald-700 tracking-tight leading-none">
                    91.4%
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-1 font-semibold">
                    ZERO-TOUCH RESOLUTION
                  </div>
                </div>
              </div>

              {/* 6-STAGE AUTONOMOUS EXECUTION RAIL */}
              <div className="mt-12 pt-8 border-t border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-semibold">
                    6-STAGE DETERMINISTIC EXECUTION GRAPH
                  </span>
                  <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-medium">
                    IDEMPOTENT PROTOCOL
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70">
                    <div className="text-[9px] font-mono text-slate-400 font-semibold mb-0.5">01 INGEST</div>
                    <div className="text-[13px] font-bold text-[#0F172A]">Customer Message</div>
                    <div className="text-[10px] font-mono text-slate-500 mt-1">Multi-modal payload</div>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70">
                    <div className="text-[9px] font-mono text-slate-400 font-semibold mb-0.5">02 REASON</div>
                    <div className="text-[13px] font-bold text-[#0F172A]">Intent Recognition</div>
                    <div className="text-[10px] font-mono text-slate-500 mt-1">Entity: #GC1024</div>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70">
                    <div className="text-[9px] font-mono text-slate-400 font-semibold mb-0.5">03 VERIFY</div>
                    <div className="text-[13px] font-bold text-[#0F172A]">Customer Auth</div>
                    <div className="text-[10px] font-mono text-slate-500 mt-1">UUID &amp; Phone</div>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70">
                    <div className="text-[9px] font-mono text-slate-400 font-semibold mb-0.5">04 QUERY</div>
                    <div className="text-[13px] font-bold text-[#0F172A]">Data Retrieval</div>
                    <div className="text-[10px] font-mono text-slate-500 mt-1">Postgres / Shopify</div>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70">
                    <div className="text-[9px] font-mono text-slate-400 font-semibold mb-0.5">05 MUTATE</div>
                    <div className="text-[13px] font-bold text-[#0F172A]">Action Performed</div>
                    <div className="text-[10px] font-mono text-slate-500 mt-1">Carrier update</div>
                  </div>
                  <div className="p-3 rounded-lg border-2 border-emerald-500/60 bg-emerald-50/80 shadow-xs">
                    <div className="flex items-center justify-between text-[9px] font-mono text-emerald-800 font-bold mb-0.5">
                      <span>06 DISPATCH</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    </div>
                    <div className="text-[13px] font-bold text-emerald-950">Verified Response</div>
                    <div className="text-[10px] font-mono text-emerald-800 mt-1 font-medium">
                      Confirmation sent ✓
                    </div>
                  </div>
                </div>
              </div>

            </AxiomCornerCard>
          </div>

          {/* ================= BLUEPRINT 02 // LEAD AUTOMATION (ALTERNATING: IMAGE OVERFLOW TOP-LEFT, TEXT RIGHT) ================= */}
          <div id="lead-automation" className="relative pt-12 md:pt-16">
            
            {/* White Architectural Frame with Emerald Corner Accent */}
            <AxiomCornerCard
              corner="top-left"
              color="emerald"
              className="p-5 sm:p-8 md:p-10 lg:p-12 shadow-lg border-slate-300/80"
            >
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Placeholder Spacer on desktop for the overlapping image */}
                <div className="lg:col-span-7 hidden lg:block" style={{ minHeight: "260px" }} />

                {/* RIGHT: Editorial Typography */}
                <div className="lg:col-span-5 space-y-4 relative z-10">
                  <div className="inline-flex items-center gap-2 text-[11px] font-mono text-[#2563EB] font-semibold tracking-wider uppercase">
                    <span>BLUEPRINT 02 // REVENUE VELOCITY</span>
                  </div>

                  <h2 className="text-[34px] sm:text-[44px] font-bold text-[#0F172A] tracking-tight leading-[1.08]">
                    Lead Qualification &amp;{" "}
                    <span className="font-italic-accent-emerald">
                      Sync
                    </span>
                  </h2>

                  <p className="text-[15px] text-slate-600 leading-relaxed">
                    Stops high-intent prospects from cooling off. The agent receives inbound inquiries, enriches domain metrics via Apollo/Clearbit, computes fit score according to your ICP model, updates HubSpot/Salesforce, and books calendar intervals directly.
                  </p>

                  <div className="space-y-2 pt-1 text-[14px] text-slate-700">
                    <div className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                      <span>Instant reverse-IP and domain firmographic lookup</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                      <span>Dynamic scoring model tuned to enterprise ARR requirements</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-900 shrink-0" />
                      <span>Automated meeting routing based on rep specialty &amp; timezone</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      href="/book"
                      className="btn-arrow-slide inline-flex items-center gap-2 text-[#2563EB] font-semibold text-[14px] hover:underline"
                    >
                      <span>Request Lead Qualification Architecture</span>
                      <ArrowRight className="w-4 h-4 arrow-icon" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* 70/30 IMAGE OVERFLOW LAYER (Top 30% breaks out ABOVE top border, overflows to the LEFT) */}
              <div className="lg:absolute lg:-top-14 lg:-left-6 xl:-left-12 lg:w-[56%] xl:w-[58%] z-20 mt-6 lg:mt-0 order-first lg:order-none">
                <div className="bg-[#0F172A] text-white rounded-2xl border border-slate-700/80 p-5 md:p-6 shadow-2xl backdrop-blur-xl space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-[11px] font-mono">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-slate-300 font-semibold tracking-wider">INBOUND SIGNAL CONVERTER</span>
                    </div>
                    <span className="text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded text-[10px]">
                      ICP FIT: 96/100 (TIER-1)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-[11px]">
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-[9px] text-slate-400">STEP 1: SIGNAL</div>
                      <div className="text-white font-semibold mt-0.5">Form Submission Ingested</div>
                      <div className="text-[10px] text-slate-400 mt-1">Acme Corp ($42M ARR)</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-[9px] text-slate-400">STEP 2: ENRICH</div>
                      <div className="text-blue-400 font-semibold mt-0.5">Firmographics Appended</div>
                      <div className="text-[10px] text-slate-400 mt-1">280 Employees • Salesforce</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-[9px] text-slate-400">STEP 3: SCORE</div>
                      <div className="text-purple-400 font-semibold mt-0.5">ICP Matrix Evaluated</div>
                      <div className="text-[10px] text-slate-400 mt-1">Enterprise High-Value</div>
                    </div>
                    <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-700">
                      <div className="text-[9px] text-emerald-400">STEP 4: ROUTE</div>
                      <div className="text-emerald-300 font-semibold mt-0.5">Calendar &amp; CRM Locked</div>
                      <div className="text-[10px] text-emerald-400 mt-1">AE Notified in 14s</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* FLOATING METRICS OVERLAPPING BOUNDARY */}
              <div className="lg:absolute -bottom-6 right-10 z-30 bg-white border border-slate-300/90 rounded-xl p-4 shadow-lg flex items-center gap-6 mt-6 lg:mt-0">
                <div className="border-r border-slate-200 pr-5">
                  <div className="text-[28px] font-bold text-[#2563EB] tracking-tight leading-none">
                    &lt; 30s
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-1 font-semibold">
                    INBOUND ENRICHMENT
                  </div>
                </div>
                <div>
                  <div className="text-[28px] font-bold text-emerald-700 tracking-tight leading-none">
                    3.4x
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-1 font-semibold">
                    DISCOVERY CONVERSION
                  </div>
                </div>
              </div>
            </AxiomCornerCard>
          </div>

          {/* ================= BLUEPRINT 03 // INTERNAL OPS & IT (IMAGE OVERFLOW TOP-RIGHT) ================= */}
          <div id="internal-operations" className="relative pt-12 md:pt-16">
            
            {/* White Architectural Frame with Cyan Corner Accent */}
            <AxiomCornerCard
              corner="bottom-left"
              color="cyan"
              className="p-5 sm:p-8 md:p-10 lg:p-12 shadow-lg border-slate-300/80"
            >
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* LEFT: Text & Specs */}
                <div className="lg:col-span-5 space-y-4 relative z-10">
                  <div className="inline-flex items-center gap-2 text-[11px] font-mono text-[#2563EB] font-semibold tracking-wider uppercase">
                    <span>BLUEPRINT 03 // ENTERPRISE GOVERNANCE</span>
                  </div>

                  <h2 className="text-[34px] sm:text-[44px] font-bold text-[#0F172A] tracking-tight leading-[1.08]">
                    Internal Ops &amp;{" "}
                    <span className="font-italic-accent-blue">
                      Provisioning
                    </span>
                  </h2>

                  <p className="text-[15px] text-slate-600 leading-relaxed">
                    Removes cross-departmental paperwork friction. New hires, permission escalations, hardware allocations, and invoice validation executed autonomously under explicit compliance policies.
                  </p>

                  <div className="space-y-2 pt-1 text-[14px] text-slate-700">
                    <div className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                      <span>Role-based access provisioning across Okta, GitHub &amp; Slack</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                      <span>Automated financial ledger matching against invoice line items</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-900 shrink-0" />
                      <span>Deterministic escalation triggers for privileged AWS credentials</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      href="/security"
                      className="btn-arrow-slide inline-flex items-center gap-2 text-[#2563EB] font-semibold text-[14px] hover:underline"
                    >
                      <span>Inspect Security Architecture</span>
                      <ArrowRight className="w-4 h-4 arrow-icon" />
                    </Link>
                  </div>
                </div>

                {/* Right Placeholder Spacer on desktop */}
                <div className="lg:col-span-7 hidden lg:block" style={{ minHeight: "260px" }} />
              </div>

              {/* 70/30 IMAGE OVERFLOW LAYER (Top 30% breaks out ABOVE top border, overflows to the RIGHT) */}
              <div className="lg:absolute lg:-top-14 lg:-right-6 xl:-right-12 lg:w-[56%] xl:w-[58%] z-20 mt-6 lg:mt-0">
                <div className="bg-[#0F172A] text-white rounded-2xl border border-slate-700/80 p-5 md:p-6 shadow-2xl backdrop-blur-xl space-y-2.5 font-mono text-[11px]">
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 text-[10px]">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>COMPLIANCE POLICY MATRIX: STRICT_SOX_ISO27001</span>
                    </div>
                    <span className="text-slate-400">IMMUTABLE LOG</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-slate-200 font-medium">Okta Role Provisioning (Contractor ID #9042)</div>
                      <div className="text-[9px] text-slate-500 mt-0.5">Policy: Least-Privilege Enforced</div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[9px]">
                      COMMITTED
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-slate-200 font-medium">Invoice #INV-8821 Match against ERP Ledger</div>
                      <div className="text-[9px] text-slate-500 mt-0.5">Variance: $0.00 • PDF Parsed</div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[9px]">
                      MATCHED
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-slate-200 font-medium">AWS Production DB Root Key Request</div>
                      <div className="text-[9px] text-slate-500 mt-0.5">Threshold trigger &gt; Tier 3</div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 text-[9px]">
                      ESCALATED TO HUMAN
                    </span>
                  </div>
                </div>
              </div>

              {/* FLOATING METRICS OVERLAPPING BOUNDARY */}
              <div className="lg:absolute -bottom-6 left-10 z-30 bg-white border border-slate-300/90 rounded-xl p-4 shadow-lg flex items-center gap-6 mt-6 lg:mt-0">
                <div className="border-r border-slate-200 pr-5">
                  <div className="text-[28px] font-bold text-[#2563EB] tracking-tight leading-none">
                    100%
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-1 font-semibold">
                    AUDIT LOG COMPLIANCE
                  </div>
                </div>
                <div>
                  <div className="text-[28px] font-bold text-emerald-700 tracking-tight leading-none">
                    0 hrs
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-1 font-semibold">
                    MANUAL CSV EXPORTS
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
                CUSTOM WORKFLOW GRAPH
              </div>
              <h3 className="text-[24px] sm:text-[30px] font-bold text-[#0F172A] tracking-tight">
                Ready to model your business workflows?
              </h3>
              <p className="text-[15px] text-slate-600 mt-1 max-w-xl">
                Our solutions engineers will trace your current bottlenecks in under 30 minutes.
              </p>
            </div>
            <Link
              href="/book"
              className="btn-arrow-slide btn-axiom-primary px-6 py-3.5 text-[14px] gap-2.5 shadow-sm whitespace-nowrap"
            >
              <span>Discuss Your Workflow</span>
              <ArrowRight className="w-4 h-4 arrow-icon text-blue-200" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
