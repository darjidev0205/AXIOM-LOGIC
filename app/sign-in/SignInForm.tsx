"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, Eye, EyeOff, ArrowRight, ShieldCheck, Lock } from "lucide-react";
import AxiomLogo from "@/components/brand/AxiomLogo";

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/connection";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Authentication failed");
        return;
      }
      router.push(data.redirectTo ?? from);
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Technical grid background */}
      <div className="fixed inset-0 pointer-events-none select-none">
        <svg className="absolute inset-0 w-full h-full opacity-[0.035]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="signin-grid" width="56" height="56" patternUnits="userSpaceOnUse">
              <path d="M 56 0 L 0 0 0 56" fill="none" stroke="#0F172A" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#signin-grid)" />
        </svg>
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[400px] h-[400px] bg-emerald-500/4 rounded-full blur-[80px]" />
      </div>

      {/* Top bar */}
      <header className="relative z-10 border-b border-slate-200/80 bg-white/90 backdrop-blur-sm">
        <div className="axiom-container flex items-center justify-between h-16">
          <Link href="/" aria-label="AXIOM Logic Home">
            <AxiomLogo variant="compact" theme="light" height={34} priority />
          </Link>
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-widest hidden sm:block">
            SECURE ACCESS GATEWAY
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-16">
        <div
          className={`w-full max-w-[420px] transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {/* Telemetry badge */}
          <div className="flex items-center gap-2 mb-8 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-slate-400 uppercase tracking-widest">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              AXIOM ACCESS GATEWAY
            </span>
            <span className="text-slate-300 text-[10px]">//</span>
            <span className="text-[11px] font-mono text-slate-400">SECURE CHANNEL ACTIVE</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-[32px] sm:text-[38px] font-bold text-[#0F172A] tracking-tight leading-[1.1] mb-3">
              Access your AXIOM<br />
              <span className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] bg-clip-text text-transparent">
                connection.
              </span>
            </h1>
            <p className="text-[15px] text-slate-500 leading-relaxed">
              Securely sign in to your private AXIOM workspace.
            </p>
          </div>

          {/* Form card */}
          <form
            id="axiom-signin-form"
            onSubmit={handleSignIn}
            className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_8px_40px_-8px_rgba(15,23,42,0.08)] p-7 space-y-5"
          >
            {/* Error */}
            {error && (
              <div className="flex items-center gap-2.5 bg-red-50 border border-red-200/80 rounded-xl px-4 py-3 text-[13px] text-red-700 font-medium animate-in fade-in slide-in-from-top-1 duration-200">
                <svg className="w-4 h-4 shrink-0 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="signin-email" className="block text-[12px] font-mono text-slate-500 uppercase tracking-wider">
                Email Address
              </label>
              <input
                id="signin-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50/60 text-[14px] text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="signin-password" className="block text-[12px] font-mono text-slate-500 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  className="text-[12px] text-[#2563EB] hover:text-blue-700 font-medium transition-colors"
                  onClick={() => setError("Password reset requires a Resend API key. Contact your AXIOM representative.")}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="signin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-11 px-4 pr-11 rounded-xl border border-slate-200 bg-slate-50/60 text-[14px] text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-all"
                />
                <button
                  type="button"
                  id="toggle-password-visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="axiom-signin-submit"
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-60 disabled:cursor-not-allowed text-white text-[14px] font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(37,99,235,0.25)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.35)] hover:-translate-y-px active:translate-y-0"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Authenticating…</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 ml-auto opacity-60" />
                </>
              )}
            </button>
          </form>

          {/* Security badges */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              <span>END-TO-END ENCRYPTED</span>
            </div>
            <div className="hidden sm:block text-slate-300">·</div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>SOC 2 TYPE II</span>
            </div>
            <div className="hidden sm:block text-slate-300">·</div>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              <span>99.98% UPTIME</span>
            </div>
          </div>

          {/* Dev hint */}
          {process.env.NODE_ENV !== "production" && (
            <div className="mt-6 bg-amber-50 border border-amber-200/80 rounded-xl p-4 text-[12px] text-amber-800 font-mono">
              <div className="font-semibold mb-1">DEV MODE — Seeded accounts</div>
              Password field can be anything (leave blank or type anything).<br />
              Admin: <code className="bg-amber-100 px-1 rounded">darjidev4350@gmail.com</code><br />
              Also admin: <code className="bg-amber-100 px-1 rounded">marcus@acme.com</code>
            </div>
          )}

          {/* Footer note */}
          <p className="mt-8 text-center text-[12px] text-slate-400">
            Don&apos;t have access?{" "}
            <Link href="/book" className="text-[#2563EB] hover:text-blue-700 font-medium transition-colors">
              Request an AXIOM connection →
            </Link>
          </p>
        </div>
      </main>

      {/* Bottom bar */}
      <footer className="relative z-10 border-t border-slate-200/60 py-4">
        <div className="axiom-container flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
          <span>© {new Date().getFullYear()} AXIOM Logic Inc.</span>
          <div className="flex items-center gap-4">
            <Link href="/security" className="hover:text-slate-600 transition-colors">Security</Link>
            <Link href="/book" className="hover:text-slate-600 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
