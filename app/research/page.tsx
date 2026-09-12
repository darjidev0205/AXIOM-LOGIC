"use client";

import Link from "next/link";
import TopNavBar from "@/components/navigation/TopNavBar";
import Footer from "@/components/navigation/Footer";
import { AxiomCornerCard } from "@/components/ui/AxiomCornerCard";
import ResearchHeroTelemetry from "@/components/research/ResearchHeroTelemetry";
import {
  BookOpen,
  FileText,
  ArrowRight,
  BarChart3,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  TrendingUp,
} from "lucide-react";

export default function ResearchPage() {
  const papers = [
    {
      category: "AI AGENTS // COMPARATIVE ANALYSIS",
      title: "AI Agents vs Traditional Workflow Automation",
      subtitle: "Why moving from step-based if/then recipes to goal-seeking agents with tool autonomy fundamentally shifts operational velocity without brittleness.",
      readTime: "8 MIN READ",
      author: "Systems Architecture Group",
      metrics: "3.8x Velocity Increase",
    },
    {
      category: "MARKET // FAILURE PATTERNS",
      title: "Where Current Enterprise Automation Falls Short",
      subtitle: "The hidden operational overhead when brittle API connectors break and human operators are left with no audit trail or debugging visibility.",
      readTime: "11 MIN READ",
      author: "Enterprise Reliability Lab",
      metrics: "62% Time Reclaimed",
    },
    {
      category: "GOVERNANCE // RELIABILITY",
      title: "Deterministic Guardrails for Probabilistic LLMs",
      subtitle: "Architectural techniques for preventing model hallucination in high-stakes financial, logistics, and healthcare transactions.",
      readTime: "14 MIN READ",
      author: "Safety & Alignment Team",
      metrics: "99.98% Verification Rate",
    },
    {
      category: "TELEMETRY // LATENCY BENCHMARK",
      title: "Sub-500ms End-to-End Autonomous Workflows",
      subtitle: "Optimizing multi-system state retrieval, schema validation, and carrier dispatch queries in asynchronous distributed topologies.",
      readTime: "9 MIN READ",
      author: "Infrastructure Core Team",
      metrics: "382ms Average Latency",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-[#0F172A] font-sans selection:bg-blue-600 selection:text-white overflow-x-clip">
      <TopNavBar />

      <main className="flex-grow">
        {/* ================= HERO SECTION (SWISS EDITORIAL ARCHITECTURE) ================= */}
        <section className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-slate-200/80 bg-white overflow-hidden">
          <div className="absolute inset-0 tech-grid-pattern pointer-events-none opacity-50" />
          
          <div className="absolute top-0 bottom-0 left-8 md:left-24 w-[1px] bg-slate-200/70 pointer-events-none hidden sm:block" />
          <div className="absolute top-0 bottom-0 right-8 md:right-24 w-[1px] bg-slate-200/70 pointer-events-none hidden sm:block" />

          <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
            {/* Top Coordinate & System Status Strip */}
            <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 uppercase tracking-widest pb-6 mb-8 border-b border-slate-100 gap-4">
              <div className="flex items-center gap-3">
                <span className="crosshair-mark pl-2">+ SYS_REF // AXIOM-RESEARCH-LAB</span>
                <span className="text-slate-300">|</span>
                <span>DATASET: N=1,240,000_ENTERPRISE_WORKFLOW_TRACES</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#2563EB] font-semibold">PEER_REVIEW: ARCHIVAL</span>
                <span className="text-slate-300">•</span>
                <span className="text-emerald-600 font-semibold">METHODOLOGY: EMPIRICAL</span>
              </div>
            </div>

            {/* 2-Column Hero Split: Headline & CTA on Left, Animated Telemetry & Network on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-12 items-center">
              {/* Left Column (6 cols): Typography & CTA */}
              <div className="lg:col-span-6 xl:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[#2563EB] text-[12px] font-mono tracking-wider uppercase font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse" />
                  <span>OPERATIONAL INTELLIGENCE &amp; RESEARCH</span>
                </div>

                <h1 className="text-[42px] sm:text-[56px] lg:text-[64px] xl:text-[74px] font-bold text-[#0F172A] tracking-tight leading-[0.98]">
                  Understanding where automation still{" "}
                  <span className="font-italic-accent-blue">
                    falls short.
                  </span>
                </h1>

                <p className="text-[17px] sm:text-[18px] text-slate-600 leading-relaxed font-normal max-w-xl">
                  Rigorous field research, operational telemetry, and architectural analysis of enterprise workflows across 400+ production agent deployments.
                </p>

                <div className="pt-2">
                  <Link
                    href="/book"
                    className="btn-axiom-primary inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-[15px] font-semibold shadow-sm"
                  >
                    <span>Request Research Briefing</span>
                    <ArrowRight className="w-4 h-4 arrow-icon text-blue-200" />
                  </Link>
                </div>
              </div>

              {/* Right Column (6 cols): Live Interactive Animated SVG Network & Telemetry Cards */}
              <div className="lg:col-span-6 xl:col-span-6 relative flex justify-center items-center">
                <ResearchHeroTelemetry />
              </div>
            </div>
          </div>
        </section>

        {/* ================= FEATURED WHITE PAPER (70/30 BREAKOUT CONTAINER) ================= */}
        <section className="py-12 lg:py-20 max-w-[1440px] mx-auto px-6 md:px-12">
          
          <div className="relative pt-12 md:pt-16 mb-20">
            <AxiomCornerCard corner="top-left" color="blue" className="relative p-7 md:p-10 lg:p-12 shadow-lg bg-white border-slate-300/80">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: Text */}
                <div className="lg:col-span-5 space-y-4 relative z-10">
                  <div className="inline-flex items-center gap-2 text-[11px] font-mono text-[#2563EB] font-semibold tracking-wider uppercase">
                    <span>FEATURED WHITE PAPER // MARCH 2025</span>
                  </div>

                  <h2 className="text-[34px] sm:text-[44px] font-bold text-[#0F172A] tracking-tight leading-[1.08]">
                    Why most business automation still{" "}
                    <span className="font-editorial font-normal text-slate-700">
                      requires humans
                    </span>
                  </h2>

                  <p className="text-[15px] text-slate-600 leading-relaxed">
                    Legacy Robotic Process Automation (RPA) assumed the enterprise is neat and structured. It collapsed because 80% of business context arrives as unstructured human thought. We analyzed 1.2M failures to understand why deterministic rules shatter.
                  </p>

                  <div className="pt-2 text-[13px] font-mono text-slate-500">
                    <div>AUTHORS: Dr. Evan Vance, Sarah Chen (Axiom Systems Lab)</div>
                    <div className="text-[#2563EB] font-semibold mt-1">DOI // 10.1042/AXIOM.2025.03.01</div>
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
                      <BarChart3 className="w-3.5 h-3.5" />
                      <span>TELEMETRY_DATASET // 1.2M_FAILURES</span>
                    </span>
                    <span className="text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                      BENCHMARK: COMPLETE
                    </span>
                  </div>

                  <div className="space-y-2.5 text-[11px]">
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-300">Naive RPA bots break within 90 days from minor UI/API shifts</span>
                      <span className="text-red-400 font-semibold">71% BREAKAGE</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-300">Customer queries containing unstructured missing variables</span>
                      <span className="text-amber-400 font-semibold">88% AMBIGUITY</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-700/60 flex items-center justify-between">
                      <span className="text-emerald-200">Error rate when bounded by hard policy constraint matrices</span>
                      <span className="text-emerald-400 font-semibold">&lt; 0.1% DRIFT</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Metric Callout */}
              <div className="lg:absolute -bottom-6 left-10 z-30 bg-white border border-slate-300/90 rounded-xl p-4 shadow-lg flex items-center gap-6 mt-6 lg:mt-0">
                <div className="border-r border-slate-200 pr-5">
                  <div className="text-[28px] font-bold text-red-600 tracking-tight leading-none">
                    71%
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-1 font-semibold">
                    TRADITIONAL RPA BREAK RATE
                  </div>
                </div>
                <div>
                  <div className="text-[28px] font-bold text-emerald-700 tracking-tight leading-none">
                    &lt; 0.1%
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-1 font-semibold">
                    AXIOM DETERMINISTIC DRIFT
                  </div>
                </div>
              </div>

            </AxiomCornerCard>
          </div>

          {/* ================= RESEARCH INVESTIGATIONS GRID ================= */}
          <div>
            <div className="mb-10">
              <span className="text-[11px] font-mono text-[#2563EB] uppercase tracking-wider font-semibold">
                + SYS_REF // ARCHIVAL PUBLICATIONS
              </span>
              <h3 className="text-[30px] sm:text-[36px] font-bold text-[#0F172A] tracking-tight mt-1">
                Published field notes &amp; investigations.
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {papers.map((p, i) => (
                <AxiomCornerCard
                  key={i}
                  corner={i % 2 === 0 ? "bottom-right" : "bottom-left"}
                  color={i === 0 ? "blue" : i === 1 ? "emerald" : i === 2 ? "cyan" : "amber"}
                  className="p-7 shadow-sm hover:border-slate-400 transition-all flex flex-col justify-between bg-white"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3 text-[11px] font-mono">
                      <span className="text-[#2563EB] font-semibold">{p.category}</span>
                      <span className="text-slate-400">{p.readTime}</span>
                    </div>
                    <h4 className="text-[20px] font-bold text-[#0F172A] mb-2">{p.title}</h4>
                    <p className="text-[14px] text-slate-600 leading-relaxed mb-4">{p.subtitle}</p>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[12px] font-mono">
                    <span className="text-slate-500">{p.author}</span>
                    <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {p.metrics}
                    </span>
                  </div>
                </AxiomCornerCard>
              ))}
            </div>
          </div>

        </section>

        {/* ================= COMPACT ACTION BANNER ================= */}
        <section className="border-t border-slate-200/80 bg-white py-14 relative">
          <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="text-[10px] font-mono text-[#2563EB] uppercase tracking-wider font-semibold mb-1">
                + SYS_REF // ENTERPRISE LABS
              </div>
              <h3 className="text-[24px] sm:text-[30px] font-bold text-[#0F172A] tracking-tight">
                Want to run an empirical benchmark on your workflow?
              </h3>
              <p className="text-[15px] text-slate-600 mt-1 max-w-xl">
                Our research team simulates custom datasets against your policy constraints to calculate failure reduction.
              </p>
            </div>
            <Link
              href="/book"
              className="btn-axiom-primary inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-[14px] font-semibold whitespace-nowrap"
            >
              <span>Request Custom Benchmark</span>
              <ArrowRight className="w-4 h-4 arrow-icon text-blue-200" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
