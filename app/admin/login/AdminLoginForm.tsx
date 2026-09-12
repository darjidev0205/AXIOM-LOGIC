"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Eye, EyeOff, ArrowRight, Lock } from "lucide-react";

export default function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  async function handleLogin(e: React.FormEvent) {
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
      if (data.user?.role !== "ADMIN") {
        await fetch("/api/auth/logout", { method: "POST" });
        setError("Access restricted to AXIOM administrators only.");
        return;
      }
      router.push(from === "/admin/login" ? "/admin" : from);
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0F1A] flex flex-col">
      {/* Dark grid background */}
      <div className="fixed inset-0 pointer-events-none select-none">
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="admin-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#3B82F6" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#admin-grid)" />
        </svg>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/8 rounded-full blur-[120px]" />
      </div>

      {/* Top bar */}
      <header className="relative z-10 border-b border-white/8 py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-[#2563EB] flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-[12px] font-bold text-white tracking-[0.1em] font-mono uppercase">AXIOM LOGIC</div>
            <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">ADMINISTRATIVE PORTAL</div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div
          className={`w-full max-w-[400px] transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {/* Badge */}
          <div className="flex items-center gap-2 mb-8 flex-wrap">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-slate-600" />
              RESTRICTED ACCESS
            </span>
            <span className="text-slate-700 text-[10px]">//</span>
            <span className="text-[11px] font-mono text-slate-600">AXIOM PERSONNEL ONLY</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-[28px] sm:text-[32px] font-bold text-white tracking-tight leading-[1.1] mb-3">
              Admin Access.
            </h1>
            <p className="text-[14px] text-slate-500 leading-relaxed">
              This portal is reserved for authorized AXIOM administrators only.
            </p>
          </div>

          {/* Form */}
          <form
            id="axiom-admin-login-form"
            onSubmit={handleLogin}
            className="bg-[#111827] border border-white/8 rounded-2xl p-7 space-y-5"
          >
            {error && (
              <div className="flex items-center gap-2.5 bg-red-950/60 border border-red-800/60 rounded-xl px-4 py-3 text-[13px] text-red-400 font-medium animate-in fade-in duration-200">
                <svg className="w-4 h-4 shrink-0 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="admin-email" className="block text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                Administrator Email
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@axiomlogic.com"
                className="w-full h-11 px-4 rounded-xl border border-white/8 bg-white/5 text-[14px] text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 focus:border-[#2563EB]/60 transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="admin-password" className="block text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-11 px-4 pr-11 rounded-xl border border-white/8 bg-white/5 text-[14px] text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 focus:border-[#2563EB]/60 transition-all"
                />
                <button
                  type="button"
                  id="admin-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="admin-login-submit"
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 disabled:cursor-not-allowed text-white text-[14px] font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(37,99,235,0.2)]"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Verifying…</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Access Admin Portal</span>
                  <ArrowRight className="w-4 h-4 ml-auto opacity-60" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-[12px] font-mono text-slate-600 hover:text-slate-400 transition-colors">
              ← Return to AXIOM
            </Link>
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/5 py-4 px-6">
        <div className="text-[10px] font-mono text-slate-700 uppercase tracking-widest text-center">
          AXIOM Logic Admin Portal · Authorized Access Only · {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
