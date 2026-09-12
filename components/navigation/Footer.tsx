import Link from "next/link";
import { ArrowRight, ShieldCheck, CheckCircle2, Lock } from "lucide-react";
import AxiomLogo from "@/components/brand/AxiomLogo";

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-white border-t border-slate-800 w-full relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="axiom-container pt-16 pb-12 relative z-10">
        {/* Top Section: Official Brand + Positioning + CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
          <div className="lg:col-span-6 space-y-4">
            <Link href="/" className="inline-block group" aria-label="AXIOM Logic Home">
              <AxiomLogo
                variant="full"
                theme="dark"
                height={38}
                className="transition-opacity group-hover:opacity-95"
              />
            </Link>
            
            <p className="text-[14.5px] text-slate-400 max-w-lg leading-relaxed pt-1">
              High-reliability AI automation infrastructure and intelligent workflow systems. 
              Deterministic reasoning agents, verified tool execution, and zero-drift enterprise orchestration.
            </p>

            <div className="text-[11px] font-mono text-slate-400 flex flex-wrap gap-2 pt-1 uppercase tracking-wider">
              <span>AI AUTOMATION</span>
              <span className="text-blue-500">•</span>
              <span>INTELLIGENT WORKFLOWS</span>
              <span className="text-emerald-500">•</span>
              <span>SYSTEMS INTEGRATION</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-[12px] font-mono text-slate-400 pt-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800">
                <span className="relative flex h-2 w-2">
                  <span className="status-pulse-active absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-emerald-400 font-semibold">99.98% UPTIME</span>
                <span className="text-slate-600">•</span>
                <span>CLUSTER US-EAST-1</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>SOC 2 TYPE II COMPLIANT</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-center items-start lg:items-end gap-4">
            <div className="text-left lg:text-right">
              <h4 className="text-[17px] font-semibold text-white">Have operations ready to scale?</h4>
              <p className="text-[14px] text-slate-400 mt-1">
                Evaluate your architectural workflows with an AXIOM systems specialist.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/book"
                className="btn-arrow-slide btn-axiom-primary text-[14px] px-5 py-2.5 gap-2"
              >
                <span>Schedule 1:1 Architecture Review</span>
                <ArrowRight className="w-4 h-4 arrow-icon text-blue-200" />
              </Link>
              <Link
                href="/live-demo"
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[14px] font-medium px-4 py-2.5 rounded-xl transition-all"
              >
                <span>Run Interactive Trace</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Links Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-slate-800/80 text-[14px]">
          <div>
            <h5 className="font-mono text-[11px] font-semibold text-slate-400 tracking-wider uppercase mb-4">
              PLATFORM
            </h5>
            <ul className="space-y-2.5">
              <li>
                <Link href="/solutions" className="text-slate-400 hover:text-white transition-colors">
                  Solutions Matrix
                </Link>
              </li>
              <li>
                <Link href="/live-demo" className="text-slate-400 hover:text-white transition-colors">
                  Interactive Execution Trace
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-slate-400 hover:text-white transition-colors">
                  5-Stage Architecture
                </Link>
              </li>
              <li>
                <Link href="/sign-in" className="text-slate-400 hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-mono text-[11px] font-semibold text-slate-400 tracking-wider uppercase mb-4">
              SOLUTIONS
            </h5>
            <ul className="space-y-2.5">
              <li>
                <Link href="/solutions#customer-operations" className="text-slate-400 hover:text-white transition-colors">
                  Customer Operations
                </Link>
              </li>
              <li>
                <Link href="/solutions#lead-automation" className="text-slate-400 hover:text-white transition-colors">
                  Lead Scoring &amp; Routing
                </Link>
              </li>
              <li>
                <Link href="/solutions#internal-operations" className="text-slate-400 hover:text-white transition-colors">
                  Internal Ops &amp; Provisioning
                </Link>
              </li>
              <li>
                <Link href="/book" className="text-slate-400 hover:text-white transition-colors">
                  Custom Enterprise Graph
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-mono text-[11px] font-semibold text-slate-400 tracking-wider uppercase mb-4">
              ENGINEERING &amp; TRUST
            </h5>
            <ul className="space-y-2.5">
              <li>
                <Link href="/research" className="text-slate-400 hover:text-white transition-colors">
                  Research Papers
                </Link>
              </li>
              <li>
                <Link href="/security" className="text-slate-400 hover:text-white transition-colors">
                  Zero-Retention Security
                </Link>
              </li>
              <li>
                <Link href="/security" className="text-slate-400 hover:text-white transition-colors">
                  Human-in-the-Loop Isolation
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-slate-400 hover:text-white transition-colors">
                  Enterprise Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-mono text-[11px] font-semibold text-slate-400 tracking-wider uppercase mb-4">
              GOVERNANCE
            </h5>
            <ul className="space-y-2.5">
              <li className="text-slate-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Deterministic Fallback</span>
              </li>
              <li className="text-slate-400 flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-400 shrink-0" />
                <span>AES-256 KMS Encryption</span>
              </li>
              <li className="text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Audit Trail Immutability</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip: Legal & Copyright */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-8 text-[12px] text-slate-400 gap-4 font-mono">
          <p>© {new Date().getFullYear()} AXIOM Logic Inc. Intelligent Automation Infrastructure.</p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link href="/security" className="hover:text-white transition-colors">
              Security &amp; Compliance
            </Link>
            <Link href="/research" className="hover:text-white transition-colors">
              Documentation
            </Link>
            <Link href="/book" className="hover:text-white transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>

      {/* Oversized Architectural Brand Wordmark */}
      <div className="w-full max-w-full overflow-hidden select-none pointer-events-none pt-4 sm:pt-8 pb-0 flex justify-center items-end border-t border-slate-800/40 opacity-40">
        <div className="text-[clamp(32px,12vw,140px)] font-black tracking-[-0.04em] leading-[0.85] uppercase whitespace-nowrap text-center text-slate-800/80">
          <span>AXIOM</span>{" "}
          <span className="text-slate-700/60">LOGIC</span>
        </div>
      </div>
    </footer>
  );
}
