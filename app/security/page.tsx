"use client";

import Link from "next/link";
import TopNavBar from "@/components/navigation/TopNavBar";
import Footer from "@/components/navigation/Footer";
import { AxiomCornerCard } from "@/components/ui/AxiomCornerCard";
import {
  ShieldCheck,
  Lock,
  Database,
  FileCheck,
  Key,
  EyeOff,
  ArrowRight,
  Sparkles,
  Server,
  Terminal,
  Check,
} from "lucide-react";

export default function SecurityPage() {
  const securityFeatures = [
    {
      code: "SEC-01 // ENCRYPTION",
      icon: <Lock className="w-5 h-5 text-[#2563EB]" />,
      title: "Zero Plaintext Credentials",
      desc: "All API tokens, database connection strings, and webhook secrets are encrypted at rest using AES-256-GCM KMS envelope encryption. Decryption keys live in ephemeral worker memory and are never persisted.",
    },
    {
      code: "SEC-02 // ISOLATION",
      icon: <Database className="w-5 h-5 text-[#2563EB]" />,
      title: "Strict Multi-Tenant Row Isolation",
      desc: "Every database query automatically enforces organization-scoped row-level filtering. Cross-tenant data leakage is mathematically impossible at the ORM layer.",
    },
    {
      code: "SEC-03 // RBAC",
      icon: <Key className="w-5 h-5 text-[#2563EB]" />,
      title: "Role-Based Access & Dual-Custody",
      desc: "Granular permission boundaries across Organization Owners, Admins, and Operators. Critical production mutations require cryptographic two-person authorization.",
    },
    {
      code: "SEC-04 // AUDIT",
      icon: <FileCheck className="w-5 h-5 text-[#2563EB]" />,
      title: "Immutable Microsecond Audit Ledger",
      desc: "Every intent classification, tool invocation parameter, downstream query, and human supervisor override is written to an append-only cryptographic audit stream.",
    },
    {
      code: "SEC-05 // GOVERNANCE",
      icon: <ShieldCheck className="w-5 h-5 text-[#2563EB]" />,
      title: "Deterministic Guardrail Policy Trees",
      desc: "Probabilistic AI model outputs must pass deterministic schema and range checks before executing any backend database mutations or API calls.",
    },
    {
      code: "SEC-06 // PRIVACY",
      icon: <EyeOff className="w-5 h-5 text-[#2563EB]" />,
      title: "PII Scrubbing & Zero Training Guarantee",
      desc: "Customer names, credit card numbers, and health identifiers are automatically redacted before inference. Your enterprise data is never used for model training.",
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
                <span className="crosshair-mark pl-2">+ SYS_REF // SOC2-ISO27001-COMPLIANCE</span>
                <span className="text-slate-300">|</span>
                <span>KMS_KEY_MANAGEMENT: AES-256-GCM_ENVELOPE</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#2563EB] font-semibold">ZERO_RETENTION_POLICY: ACTIVE</span>
                <span className="text-slate-300">•</span>
                <span className="text-emerald-600 font-semibold">AUDIT_LOG_IMMUTABILITY: 100%</span>
              </div>
            </div>

            {/* Massive Editorial Headline */}
            <div className="max-w-5xl">
              <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[#2563EB] text-[12px] font-mono tracking-wider uppercase font-semibold mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                <span>ENTERPRISE GOVERNANCE &amp; SECURITY</span>
              </div>

              <h1 className="text-[44px] sm:text-[62px] lg:text-[78px] font-bold text-[#0F172A] tracking-tight leading-[0.98] mb-6">
                Security engineered for critical{" "}
                <span className="font-italic-accent-emerald">
                  workflows.
                </span>
              </h1>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-1">
                <p className="lg:col-span-8 text-[18px] sm:text-[20px] text-slate-600 leading-relaxed font-normal">
                  Axiom Logic was built from the ground up for zero-trust enterprise environments where errors have real financial, legal, and operational consequences.
                </p>
                <div className="lg:col-span-4 flex lg:justify-end">
                  <Link
                    href="/book"
                    className="btn-axiom-primary inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-[15px] font-semibold"
                  >
                    <span>Request Security Whitepaper</span>
                    <ArrowRight className="w-4 h-4 arrow-icon text-blue-200" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 70/30 BREAKOUT SECURITY CONSOLE ================= */}
        <section className="py-12 lg:py-20 max-w-[1440px] mx-auto px-6 md:px-12">
          
          <div className="relative pt-12 md:pt-16 mb-20">
            <AxiomCornerCard corner="bottom-right" color="emerald" className="relative p-7 md:p-10 lg:p-12 shadow-lg bg-white border-slate-300/80">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: Text */}
                <div className="lg:col-span-5 space-y-4 relative z-10">
                  <div className="inline-flex items-center gap-2 text-[11px] font-mono text-[#2563EB] font-semibold tracking-wider uppercase">
                    <span>ZERO-TRUST ARCHITECTURE</span>
                  </div>

                  <h2 className="text-[34px] sm:text-[44px] font-bold text-[#0F172A] tracking-tight leading-[1.08]">
                    Deterministic{" "}
                    <span className="font-editorial font-normal text-slate-700">
                      Protection
                    </span>
                  </h2>

                  <p className="text-[15px] text-slate-600 leading-relaxed">
                    AI operations run in ephemeral, isolated sandboxes. Keys are fetched just-in-time via KMS, outputs are checked against strict schema boundaries, and all mutations are validated before commit.
                  </p>

                  <div className="space-y-2 pt-1 text-[14px] text-slate-700">
                    <div className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                      <span>Dedicated KMS customer-managed key (CMK) support</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                      <span>Zero customer data retention in inference prompts</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-900 shrink-0" />
                      <span>Continuous pen-testing and SOC-2 Type II audit readiness</span>
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
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>CRYPTO_ENCLAVE // MEMORY_ISOLATION</span>
                    </span>
                    <span className="text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                      AES-256-GCM ENCRYPTED
                    </span>
                  </div>

                  <div className="space-y-2 text-[11px]">
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-300">KMS Key Authorization: KMS_KEY_US_EAST_PROD</span>
                      <span className="text-emerald-400 font-semibold">VALIDATED</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-300">Tenant Isolation Verification: org_id == ctx.auth</span>
                      <span className="text-emerald-400 font-semibold">ENFORCED</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-300">PII Scrubbing Filter: Regex + NER Scrubbing</span>
                      <span className="text-blue-400 font-semibold">0 IDENTIFIERS EXPOSED</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Metric Callout */}
              <div className="lg:absolute -bottom-6 left-10 z-30 bg-white border border-slate-300/90 rounded-xl p-4 shadow-lg flex items-center gap-6 mt-6 lg:mt-0">
                <div className="border-r border-slate-200 pr-5">
                  <div className="text-[28px] font-bold text-[#2563EB] tracking-tight leading-none">
                    100%
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-1 font-semibold">
                    AUDIT LOG IMMUTABILITY
                  </div>
                </div>
                <div>
                  <div className="text-[28px] font-bold text-emerald-700 tracking-tight leading-none">
                    0
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-1 font-semibold">
                    CROSS-TENANT LEAKS
                  </div>
                </div>
              </div>

            </AxiomCornerCard>
          </div>

          {/* ================= 6 SECURITY PILLARS ARCHITECTURAL GRID ================= */}
          <div>
            <div className="mb-10">
              <span className="text-[11px] font-mono text-[#2563EB] uppercase tracking-wider font-semibold">
                + SYS_REF // SIX GOVERNANCE PILLARS
              </span>
              <h3 className="text-[30px] sm:text-[36px] font-bold text-[#0F172A] tracking-tight mt-1">
                Zero-trust by design, deterministic by constraint.
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {securityFeatures.map((f, i) => (
                <AxiomCornerCard
                  key={i}
                  corner={i % 2 === 0 ? "bottom-right" : "top-left"}
                  color={i % 3 === 0 ? "emerald" : i % 3 === 1 ? "blue" : "cyan"}
                  className="p-7 shadow-sm hover:border-slate-400 transition-all flex flex-col justify-between bg-white"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                        {f.icon}
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                        {f.code}
                      </span>
                    </div>
                    <h4 className="text-[18px] font-bold text-[#0F172A] mb-2">{f.title}</h4>
                    <p className="text-[14px] text-slate-600 leading-relaxed">{f.desc}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1 text-[11px] font-mono text-emerald-600 font-semibold">
                    <Check className="w-3.5 h-3.5" />
                    <span>POLICY COMPLIANT</span>
                  </div>
                </AxiomCornerCard>
              ))}
            </div>
          </div>

          {/* SOC2 / ISO Package Banner */}
          <AxiomCornerCard corner="bottom-left" color="emerald" className="mt-16 !bg-[#0F172A] !text-white border !border-slate-800 p-8 md:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-[11px] font-mono text-emerald-400 font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>+ SYS_REF // COMPLIANCE VAULT</span>
              </div>
              <h4 className="text-[22px] font-bold text-white">
                Need our SOC-2 Type II or ISO 27001 Audit Package?
              </h4>
              <p className="text-[14px] text-slate-400 max-w-xl">
                Our enterprise compliance team provides full third-party penetration reports and architecture attestations under standard NDA.
              </p>
            </div>

            <Link
              href="/book"
              className="btn-axiom-primary !bg-blue-600 hover:!bg-blue-500 text-white px-6 py-3.5 rounded-xl text-[14px] font-semibold transition-all shrink-0"
            >
              <span>Request Audit Package</span>
              <ArrowRight className="w-4 h-4 arrow-icon text-blue-200" />
            </Link>
          </AxiomCornerCard>

        </section>

        {/* ================= COMPACT ACTION BANNER ================= */}
        <section className="border-t border-slate-200/80 bg-white py-14 relative">
          <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="text-[10px] font-mono text-[#2563EB] uppercase tracking-wider font-semibold mb-1">
                + SYS_REF // SECURITY BRIEFING
              </div>
              <h3 className="text-[24px] sm:text-[30px] font-bold text-[#0F172A] tracking-tight">
                Review security architecture with our CISO office
              </h3>
              <p className="text-[15px] text-slate-600 mt-1 max-w-xl">
                Schedule a 30-minute technical review covering data residency, key custody, and network isolation.
              </p>
            </div>
            <Link
              href="/book"
              className="btn-axiom-primary inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-[14px] font-semibold whitespace-nowrap"
            >
              <span>Schedule Security Review</span>
              <ArrowRight className="w-4 h-4 arrow-icon text-blue-200" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
