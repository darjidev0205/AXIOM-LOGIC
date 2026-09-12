"use client";

import Link from "next/link";
import TopNavBar from "@/components/navigation/TopNavBar";
import Footer from "@/components/navigation/Footer";
import { AxiomCornerCard } from "@/components/ui/AxiomCornerCard";
import { Check, ArrowRight, ShieldCheck, Sparkles, Server, Zap, Lock } from "lucide-react";

export default function PricingPage() {
  const plans = [
    {
      name: "Starter Pilot",
      tierLabel: "TIER 01 // DISCOVERY",
      price: "$2,400",
      cadence: "/month",
      description: "For teams automating 1-2 critical operational workflows with deterministic human oversight.",
      features: [
        "Up to 2 deployed autonomous AI Agents",
        "10,000 monthly verified node executions",
        "Human escalation review queue with Slack alerts",
        "CRM & PostgreSQL tool connectors",
        "99.9% uptime SLA with latency telemetry",
        "Standard engineering support (Slack & Email)",
      ],
      cta: "Start 30-Day Pilot",
      href: "/book",
      highlight: false,
    },
    {
      name: "Enterprise Growth",
      tierLabel: "TIER 02 // MULTI-DEPT PRODUCTION",
      price: "$6,800",
      cadence: "/month",
      description: "For scaling companies deploying cross-departmental agent networks with strict policy governance.",
      features: [
        "Up to 10 autonomous AI Agents",
        "100,000 monthly verified node executions",
        "Sub-second execution traces & immutable audit ledger",
        "Bidirectional n8n, WhatsApp, Stripe & ERP connectors",
        "Dedicated Solutions Architect & weekly calibration",
        "Custom policy constraint rulebook & dual-custody approval",
        "Priority 1-hour critical response SLA",
      ],
      cta: "Schedule Architecture Review",
      href: "/book",
      highlight: true,
    },
    {
      name: "Dedicated Cluster",
      tierLabel: "TIER 03 // AIR-GAPPED VPC",
      price: "Custom",
      cadence: "contract",
      description: "VPC and on-premise deployments for strictly regulated financial, healthcare, and defense entities.",
      features: [
        "Unlimited agents & custom fine-tuned weights",
        "Self-hosted PostgreSQL & ephemeral worker cluster",
        "Air-gapped and HIPAA / SOC-2 Type II isolation",
        "Custom ERP & legacy mainframe tool adapters",
        "24/7 dedicated mission control engineering team",
        "Guaranteed sovereign data residency",
      ],
      cta: "Contact Enterprise Team",
      href: "/book",
      highlight: false,
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

          <div className="axiom-container relative z-10">
            {/* Top Coordinate & System Status Strip */}
            <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 uppercase tracking-widest pb-6 mb-8 border-b border-slate-100 gap-4">
              <div className="flex items-center gap-3">
                <span className="crosshair-mark pl-2">+ SYS_REF // DEPLOYMENT-CAPACITIES-2025</span>
                <span className="text-slate-300">|</span>
                <span>BILLING_MODEL: FIXED_CAPACITY_ZERO_TOKEN_MARKUP</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#2563EB] font-semibold">UPTIME_SLA: 99.9% - 99.99%</span>
                <span className="text-slate-300">•</span>
                <span className="text-emerald-600 font-semibold">OVERAGE_POLICY: PREDICTABLE_BURST</span>
              </div>
            </div>

            {/* Massive Editorial Headline */}
            <div className="max-w-5xl">
              <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[#2563EB] text-[12px] font-mono tracking-wider uppercase font-semibold mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                <span>DEPLOYMENT TIERS // TRANSPARENCY</span>
              </div>

              <h1 className="font-display-hero font-bold text-[#0F172A] tracking-tight leading-[0.98] mb-6">
                Priced for real business{" "}
                <span className="font-italic-accent-blue">
                  execution.
                </span>
              </h1>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-1">
                <p className="lg:col-span-8 text-[18px] sm:text-[20px] text-slate-600 leading-relaxed font-normal">
                  No unpredictable token surges. Fixed monthly operational capacity, deterministic policy guardrails, and dedicated solutions engineering.
                </p>
                <div className="lg:col-span-4 flex lg:justify-end">
                  <Link
                    href="/book"
                    className="btn-axiom-primary inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-[15px] font-semibold"
                  >
                    <span>Custom Enterprise Quote</span>
                    <ArrowRight className="w-4 h-4 arrow-icon text-blue-200" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= PRICING ARCHITECTURAL CONTAINERS ================= */}
        <section className="py-16 lg:py-24 axiom-container">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {plans.map((p, idx) => (
              <AxiomCornerCard
                key={p.name}
                corner={idx === 1 ? "top-left" : "bottom-right"}
                color={idx === 0 ? "blue" : idx === 1 ? "emerald" : "cyan"}
                className={`p-6 sm:p-8 md:p-10 flex flex-col justify-between transition-all ${
                  p.highlight
                    ? "!bg-[#0F172A] !text-white border-2 !border-blue-500 shadow-2xl lg:-translate-y-3 z-10"
                    : "bg-white text-[#0F172A] shadow-lg hover:border-slate-400"
                }`}
              >
                {/* Highlight Badge */}
                {p.highlight && (
                  <div className="absolute -top-3.5 left-8 px-3 py-1 rounded-full bg-blue-600 text-white text-[11px] font-mono uppercase tracking-wider font-semibold shadow-sm z-20">
                    MOST POPULAR // PRODUCTION CHOICE
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-[11px] font-mono tracking-wider uppercase font-semibold ${
                        p.highlight ? "text-blue-400" : "text-[#2563EB]"
                      }`}
                    >
                      {p.tierLabel}
                    </span>
                    {p.highlight && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </div>

                  <h3 className="text-[26px] font-bold tracking-tight mb-2">
                    {p.name}
                  </h3>
                  <p
                    className={`text-[14px] leading-relaxed mb-6 ${
                      p.highlight ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    {p.description}
                  </p>

                  {/* Price Readout */}
                  <div className="flex items-baseline gap-2 pb-6 mb-6 border-b border-slate-200/40">
                    <span className="text-[44px] font-bold tracking-tight leading-none">
                      {p.price}
                    </span>
                    <span
                      className={`text-[14px] font-mono ${
                        p.highlight ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      {p.cadence}
                    </span>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3.5 text-[14px] mb-8">
                    {p.features.map((f, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3">
                        <Check
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            p.highlight ? "text-emerald-400" : "text-[#2563EB]"
                          }`}
                        />
                        <span className={p.highlight ? "text-slate-300" : "text-slate-700"}>
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={p.href}
                  className={`w-full py-3.5 px-6 rounded-xl text-[14px] font-semibold text-center transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    p.highlight
                      ? "btn-axiom-primary !bg-blue-600 hover:!bg-blue-500 text-white"
                      : "btn-axiom-primary text-white"
                  }`}
                >
                  <span>{p.cta}</span>
                  <ArrowRight className="w-4 h-4 arrow-icon text-blue-200" />
                </Link>
              </AxiomCornerCard>
            ))}
          </div>

          {/* SLA & Governance Floating Panel */}
          <AxiomCornerCard corner="bottom-left" color="emerald" className="mt-16 p-6 sm:p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 bg-white border-slate-300/80 shadow-lg">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-[11px] font-mono text-emerald-600 font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>+ SYS_REF // ENTERPRISE CAPACITY GUARANTEE</span>
              </div>
              <h4 className="text-[20px] font-bold text-[#0F172A]">
                Predictable SLAs with zero hidden inference markups
              </h4>
              <p className="text-[14px] text-slate-600 max-w-2xl leading-relaxed">
                All production tiers include dedicated worker isolation, cryptographic audit trails, and automatic fallback escalation to human operators if model confidence drifts.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 font-mono text-center shrink-0">
              <div className="border-r border-slate-200 pr-6">
                <div className="text-[26px] font-bold text-[#2563EB]">99.98%</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">
                  UPTIME SLA
                </div>
              </div>
              <div>
                <div className="text-[26px] font-bold text-emerald-700">&lt; 500ms</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">
                  LATENCY COMMITMENT
                </div>
              </div>
            </div>
          </AxiomCornerCard>

        </section>

        {/* ================= COMPACT ACTION BANNER ================= */}
        <section className="border-t border-slate-200/80 bg-white py-14 relative">
          <div className="axiom-container flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="text-[10px] font-mono text-[#2563EB] uppercase tracking-wider font-semibold mb-1">
                + SYS_REF // DISCOVERY CONSULTATION
              </div>
              <h3 className="text-[24px] sm:text-[30px] font-bold text-[#0F172A] tracking-tight">
                Not sure which capacity tier fits your stack?
              </h3>
              <p className="text-[15px] text-slate-600 mt-1 max-w-xl">
                We will calculate your monthly execution volume and design an optimal node allocation in 30 minutes.
              </p>
            </div>
            <Link
              href="/book"
              className="btn-axiom-primary inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-[14px] font-semibold whitespace-nowrap"
            >
              <span>Book Architecture Sizing</span>
              <ArrowRight className="w-4 h-4 arrow-icon text-blue-200" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
