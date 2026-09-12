import Link from "next/link";
import { ShieldOff, ArrowLeft } from "lucide-react";
import AxiomLogo from "@/components/brand/AxiomLogo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Access Restricted — AXIOM Logic",
  description: "This area requires special authorization.",
};

export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen bg-[#0A0F1A] flex flex-col">
      {/* Grid background */}
      <div className="fixed inset-0 pointer-events-none select-none">
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="denied-grid" width="56" height="56" patternUnits="userSpaceOnUse">
              <path d="M 56 0 L 0 0 0 56" fill="none" stroke="#EF4444" strokeWidth="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#denied-grid)" />
        </svg>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-red-900/8 rounded-full blur-[100px]" />
      </div>

      {/* Top bar */}
      <header className="relative z-10 border-b border-white/6 py-4 px-6">
        <Link href="/" aria-label="AXIOM Logic Home">
          <AxiomLogo variant="compact" theme="dark" height={32} />
        </Link>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-16">
        <div className="text-center max-w-md">

          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-950/60 border border-red-800/40 mb-8">
            <ShieldOff className="w-8 h-8 text-red-500" />
          </div>

          {/* Status code */}
          <div className="text-[11px] font-mono text-slate-600 uppercase tracking-widest mb-4">
            ERROR 403 // AUTHORIZATION FAILURE
          </div>

          {/* Headline */}
          <h1 className="text-[36px] sm:text-[48px] font-bold text-white tracking-tight leading-[1.05] mb-4">
            Access restricted.
          </h1>

          {/* Body */}
          <p className="text-[15px] text-slate-400 leading-relaxed mb-10">
            This area is reserved for authorized AXIOM personnel.<br />
            Your request has been logged.
          </p>

          {/* CTA */}
          <Link
            id="access-denied-return"
            href="/"
            className="inline-flex items-center gap-2 bg-white/8 hover:bg-white/12 border border-white/12 text-white text-[14px] font-medium px-6 py-3 rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to AXIOM
          </Link>

          {/* Telemetry */}
          <div className="mt-12 text-[11px] font-mono text-slate-700 uppercase tracking-widest">
            AXIOM SECURITY · ZERO-TRUST ACCESS CONTROL
          </div>
        </div>
      </main>

      {/* Bottom */}
      <footer className="relative z-10 border-t border-white/4 py-4 px-6 text-center">
        <div className="text-[10px] font-mono text-slate-700 uppercase tracking-widest">
          © {new Date().getFullYear()} AXIOM Logic Inc.
        </div>
      </footer>
    </div>
  );
}
