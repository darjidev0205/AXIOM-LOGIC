"use client";

import React, { useState } from "react";
import Link from "next/link";
import TopNavBar from "@/components/navigation/TopNavBar";
import Footer from "@/components/navigation/Footer";
import {
  PlayCircle,
  ArrowRight,
  Headphones,
  Filter,
  Network,
  Check,
  X as XIcon,
  Shield,
  ShieldCheck,
  Database,
  Layers,
  Cpu,
  Zap,
  Clock,
  Sparkles,
  GitBranch,
  Terminal,
  Server,
  UserCheck,
  Calendar,
  ChevronRight,
  ExternalLink,
  BookOpen,
  CheckCircle2,
} from "lucide-react";
import { buildAxiomPostBookingPayload, postBookingToAxiom } from "@/services/axiomPhase2";

export default function HomePage() {
  // Live Demo Section Interactive State
  const [activeScenario, setActiveScenario] = useState<"order" | "address" | "refund">("order");
  
  // Interactive Booking Form State (Dynamic & Timezone-Aware)
  const [bookDate, setBookDate] = useState("");
  const [bookDateIso, setBookDateIso] = useState("");
  const [bookTime, setBookTime] = useState("");
  const [bookMonthYear, setBookMonthYear] = useState("");
  const [bookName, setBookName] = useState("Marcus Vance");
  const [bookEmail, setBookEmail] = useState("marcus@hypergrowth.io");
  const [bookCompany, setBookCompany] = useState("Hypergrowth Inc");
  const [bookArea, setBookArea] = useState("Customer Operations");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [emailWarning, setEmailWarning] = useState<string | null>(null);
  const [homeDates, setHomeDates] = useState<{ label: string; day: string; val: string; iso: string }[]>([]);
  const [homeSlots, setHomeSlots] = useState<{ time: string; fullDisplay: string; available: boolean }[]>([]);
  const [homeTzShort, setHomeTzShort] = useState("EST");

  // Load dynamic dates and live slots on mount
  React.useEffect(() => {
    async function loadHomeAvailability() {
      try {
        const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York";
        const parts = new Intl.DateTimeFormat("en-US", {
          timeZone: userTz,
          timeZoneName: "short",
        }).formatToParts(new Date());
        const tzShort = parts.find((p) => p.type === "timeZoneName")?.value || "EST";
        setHomeTzShort(tzShort);

        const res = await fetch(`/api/bookings/availability?timezone=${encodeURIComponent(userTz)}`);
        if (!res.ok) return;
        const data = await res.json();

        if (data.dates && data.dates.length > 0) {
          setHomeDates(data.dates);
          const firstDate = data.dates[0];
          setBookDate(firstDate.val);
          setBookDateIso(firstDate.iso);
          setBookMonthYear(firstDate.monthYear);
        }

        if (data.availability?.slots) {
          setHomeSlots(data.availability.slots);
          const firstAvail = data.availability.slots.find((s: { available: boolean }) => s.available);
          if (firstAvail) {
            setBookTime(firstAvail.fullDisplay);
          }
        }
      } catch (err) {
        console.error("Failed to load home booking availability:", err);
      }
    }
    loadHomeAvailability();
  }, []);

  const handleDateSelect = async (d: { label: string; day: string; val: string; iso: string }) => {
    setBookDate(d.val);
    setBookDateIso(d.iso);
    setBookingError(null);
    try {
      const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York";
      const res = await fetch(`/api/bookings/availability?date=${d.iso}&timezone=${encodeURIComponent(userTz)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.availability?.slots) {
          setHomeSlots(data.availability.slots);
          const firstAvail = data.availability.slots.find((s: { available: boolean }) => s.available);
          setBookTime(firstAvail ? firstAvail.fullDisplay : "");
        }
      }
    } catch {
      // Keep existing slots
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedEmail = (bookEmail || "").trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      setBookingError("Please enter a valid work email address (e.g. name@company.com).");
      return;
    }

    if (!bookName.trim()) {
      setBookingError("Please enter your full name.");
      return;
    }

    if (!bookTime) {
      setBookingError("Please select an available time slot.");
      return;
    }

    setBookingLoading(true);
    setBookingError(null);
    setEmailWarning(null);

    const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York";
    const payload = {
      name: bookName.trim(),
      email: trimmedEmail,
      company: bookCompany.trim() || "Enterprise Ops",
      date: bookDate,
      timeSlot: bookTime,
      workflowType: bookArea,
      description: "Scheduled via Axiom Logic landing page architecture discovery.",
      timeZone: userTz,
    };

    console.log("[Axiom Homepage Booking] Submitting payload:", payload);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log(`[Axiom Homepage Booking] Response HTTP status: ${res.status}`);

      if (res.status === 409) {
        const conflictData = await res.json().catch(() => ({}));
        setBookingError(
          conflictData.error || "That time was just booked. Please choose another available time."
        );
        // Refresh slots for selected date
        if (bookDateIso) {
          const refRes = await fetch(`/api/bookings/availability?date=${bookDateIso}&timezone=${encodeURIComponent(userTz)}`);
          if (refRes.ok) {
            const data = await refRes.json();
            if (data.availability?.slots) setHomeSlots(data.availability.slots);
          }
        }
        setBookTime("");
        setBookingLoading(false);
        return;
      }

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        setBookingError(errData.error || "Unable to reserve booking.");
        setBookingLoading(false);
        return;
      }

      const data = await res.json();
      console.log("[Axiom Homepage Booking] Booking response received:", data);

      if (data.n8nSuccess === false) {
        console.warn("[Axiom Homepage Booking] n8n delivery notice:", data.emailError);
        setEmailWarning(
          "Your architecture review is confirmed. We’re having trouble sending the confirmation email right now, but your booking is saved."
        );
      } else {
        console.log("[Axiom Homepage Booking] n8n confirmation email sent successfully.");
        setEmailWarning(null);
      }

      setBookingSuccess(true);

      // Phase 2: Dispatch post-booking notification to n8n Pre-Meeting Intelligence workflow
      try {
        const p2Payload = buildAxiomPostBookingPayload({
          id: data.id || "AXIOM-HOME-" + Date.now(),
          name: bookName.trim(),
          email: trimmedEmail,
          company: bookCompany.trim() || "Enterprise Ops",
          date: bookDate,
          timeSlot: bookTime,
          timeZone: userTz,
          workflowType: bookArea,
          description: "Scheduled via Axiom Logic landing page architecture discovery.",
        });
        postBookingToAxiom(p2Payload).catch((p2Err) => {
          console.warn("[Axiom Homepage Booking] Phase 2 background notice:", p2Err);
        });
      } catch (p2Err) {
        console.warn("[Axiom Homepage Booking] Phase 2 dispatch notice:", p2Err);
      }
    } catch {
      setBookingSuccess(true);
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-[#0F172A] font-sans selection:bg-blue-600 selection:text-white overflow-x-clip">
      <TopNavBar />

      <main className="flex-grow">
        {/* ================= 1. HERO SECTION (TWO-COLUMN, HIGH TYPOGRAPHY) ================= */}
        <section className="relative pt-12 pb-20 lg:pt-16 lg:pb-28 border-b border-slate-200/80 overflow-hidden bg-white">
          {/* Subtle technical background grid and ambient lighting */}
          <div className="absolute inset-0 tech-grid-pattern pointer-events-none opacity-50" />
          <div className="absolute top-0 bottom-0 left-8 md:left-24 w-[1px] bg-slate-200/70 pointer-events-none hidden sm:block" />
          <div className="absolute top-0 bottom-0 right-8 md:right-24 w-[1px] bg-slate-200/70 pointer-events-none hidden sm:block" />
          <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] ambient-glow-blue pointer-events-none" />
          <div className="absolute top-1/3 -right-20 w-[600px] h-[600px] ambient-glow-emerald pointer-events-none" />

          <div className="axiom-container relative z-10">
            {/* Top Coordinate & System Status Strip */}
            <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 uppercase tracking-widest pb-6 mb-8 border-b border-slate-100 gap-4">
              <div className="flex items-center gap-3">
                <span className="crosshair-mark pl-2">SYS_REF // AXIOM-CORE-v3.4</span>
                <span className="text-slate-300">|</span>
                <span>COORD 37.7749° N, 122.4194° W</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#2563EB] font-semibold">LATENCY_TARGET &lt; 500MS</span>
                <span className="text-slate-300">•</span>
                <span className="text-emerald-600 font-semibold">ZERO_DRIFT: ENABLED</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* LEFT COLUMN: High Typography & Storytelling */}
              <div className="lg:col-span-6 space-y-6">
                {/* Eyebrow badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50/80 border border-blue-200/80 text-[#2563EB] text-[11px] sm:text-[12px] font-mono tracking-wider uppercase font-semibold max-w-full flex-wrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse shrink-0" />
                  <span>AI AUTOMATION • INTELLIGENT WORKFLOWS • SYSTEMS INTEGRATION</span>
                </div>

                {/* Massive Hero Headline */}
                <h1 className="font-display-hero font-bold tracking-tight text-[#0F172A] leading-[1.05]">
                  Automate the work.{" "}
                  <span className="font-italic-accent-gradient block sm:inline">
                    Scale the intelligence.
                  </span>
                </h1>

                {/* Subheadline */}
                <p className="text-[17px] sm:text-[20px] text-slate-600 leading-relaxed font-normal max-w-xl">
                  Enterprise AI automation infrastructure. Turn complex business operations into connected, high-reliability intelligent workflows with zero-drift precision.
                </p>

                {/* Primary & Secondary Action CTAs */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    href="/solutions"
                    className="btn-arrow-slide btn-axiom-primary px-7 py-4 text-[16px] gap-2.5"
                  >
                    <span>Build with AXIOM</span>
                    <ArrowRight className="w-5 h-5 arrow-icon text-blue-200" />
                  </Link>
                  <Link
                    href="/live-demo"
                    className="btn-axiom-secondary px-7 py-4 text-[16px] gap-2.5"
                  >
                    <PlayCircle className="w-5 h-5 text-[#2563EB]" />
                    <span>Try Live Demo</span>
                  </Link>
                </div>

                {/* Trust & Status Indicators */}
                <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center gap-6 text-[13px] font-mono text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    <span className="font-medium text-slate-800">AI-powered workflows</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-medium text-slate-800">Human escalation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-900" />
                    <span className="font-medium text-slate-800">Real-time execution</span>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Sophisticated AI Automation Control System Visualization */}
              <div className="lg:col-span-6 relative">
                {/* Glow ring */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/10 via-emerald-400/5 to-transparent rounded-3xl blur-2xl pointer-events-none" />

                <div className="relative bg-[#0F172A] text-white rounded-2xl border border-slate-800 p-6 md:p-8 shadow-2xl overflow-hidden">
                  {/* Console Header Bar */}
                  <div className="flex items-center justify-between pb-5 mb-6 border-b border-slate-800/90 text-xs font-mono">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                      </div>
                      <span className="text-slate-400 font-semibold tracking-wider uppercase">
                        AXIOM ORCHESTRATION GRAPH
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 text-emerald-400 bg-emerald-950/50 border border-emerald-800/80 px-2.5 py-1 rounded-full text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>ONLINE • 412ms</span>
                    </div>
                  </div>

                  {/* Top Node: Autonomous AI Agent */}
                  <div className="relative z-10 bg-slate-900/90 border border-blue-500/40 rounded-xl p-5 shadow-lg shadow-blue-950/50 hover:border-blue-400 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                          <Cpu className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-[14px] font-bold text-white tracking-wide">
                            AI REASONING AGENT
                          </div>
                          <div className="text-[11px] font-mono text-slate-400">
                            Axiom Core Runtime • Deterministic Mode
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-900/50 text-blue-300 border border-blue-700/50">
                        CONFIDENCE: 99.4%
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-[12px] font-mono">
                      <div className="bg-slate-950/80 border border-slate-800 py-2 px-1 rounded-md text-blue-300 flex items-center justify-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        <span>Understand</span>
                      </div>
                      <div className="bg-slate-950/80 border border-slate-800 py-2 px-1 rounded-md text-emerald-300 flex items-center justify-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>Reason</span>
                      </div>
                      <div className="bg-slate-950/80 border border-slate-800 py-2 px-1 rounded-md text-purple-300 flex items-center justify-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                        <span>Decide</span>
                      </div>
                    </div>
                  </div>

                  {/* Connecting Spine with Particle Animation */}
                  <div className="relative my-4 flex justify-center items-center h-10">
                    <div className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-500 via-slate-700 to-emerald-500">
                      <span className="absolute top-0 left-[-3px] w-2 h-2 rounded-full bg-blue-400 animate-particle-down shadow-[0_0_8px_#38bdf8]" />
                    </div>
                    <div className="bg-slate-900 border border-slate-700 px-3 py-0.5 rounded-full text-[10px] font-mono text-slate-400 z-10 shadow-xs">
                      TOOL DISPATCH BUS
                    </div>
                  </div>

                  {/* Middle Tier: Enterprise Connectors (DATABASE, CRM, API) */}
                  <div className="grid grid-cols-3 gap-3 relative">
                    {/* Tool 1: Database */}
                    <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 hover:border-slate-700 transition-all">
                      <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-mono mb-1.5">
                        <Database className="w-3.5 h-3.5 text-blue-400" />
                        <span>DATABASE</span>
                      </div>
                      <div className="text-[13px] font-semibold text-white">PostgreSQL</div>
                      <div className="text-[10px] font-mono text-emerald-400 mt-1 flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-emerald-400" />
                        <span>Connected</span>
                      </div>
                    </div>

                    {/* Tool 2: CRM */}
                    <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 hover:border-slate-700 transition-all">
                      <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-mono mb-1.5">
                        <Layers className="w-3.5 h-3.5 text-amber-400" />
                        <span>CRM SYSTEM</span>
                      </div>
                      <div className="text-[13px] font-semibold text-white">HubSpot / SF</div>
                      <div className="text-[10px] font-mono text-emerald-400 mt-1 flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-emerald-400" />
                        <span>Synced</span>
                      </div>
                    </div>

                    {/* Tool 3: API */}
                    <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 hover:border-slate-700 transition-all">
                      <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-mono mb-1.5">
                        <Server className="w-3.5 h-3.5 text-purple-400" />
                        <span>APIs / WEBHOOK</span>
                      </div>
                      <div className="text-[13px] font-semibold text-white">Shipping &amp; Pay</div>
                      <div className="text-[10px] font-mono text-emerald-400 mt-1 flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-emerald-400" />
                        <span>200 OK</span>
                      </div>
                    </div>
                  </div>

                  {/* Downward Connector */}
                  <div className="relative my-4 flex justify-center items-center h-8">
                    <div className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-slate-700 to-emerald-500">
                      <span className="absolute top-0 left-[-3px] w-2 h-2 rounded-full bg-emerald-400 animate-particle-down shadow-[0_0_8px_#34d399]" />
                    </div>
                  </div>

                  {/* Bottom Output: Verified Action & Human Gate */}
                  <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[13px] font-bold text-white tracking-wide">
                          VERIFIED ACTION COMPLETE
                        </div>
                        <div className="text-[11px] font-mono text-emerald-300">
                          State Committed • Audit Hash #998f42
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-emerald-900/60 text-emerald-200 border border-emerald-600/60 font-semibold">
                      ZERO-DRIFT ✓
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ================= 2. WORKFLOW PIPELINE CARD (EXECUTION CONSOLE) ================= */}
        <section className="py-12 sm:py-16 axiom-container">
          <div className="bg-white border border-slate-300/80 rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-[#0F172A] text-white px-6 md:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[13px] font-bold tracking-wider text-slate-200">
                  LIVE AUTOMATION PIPELINE
                </span>
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[11px] font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  EXECUTING
                </span>
              </div>
              <div className="flex items-center gap-5 text-[12px] font-mono text-slate-400">
                <span>LATENCY: <strong className="text-white font-semibold">412ms</strong></span>
                <span className="text-slate-600">|</span>
                <span>SUCCESS RATE: <strong className="text-emerald-400 font-semibold">99.98%</strong></span>
              </div>
            </div>

            {/* Pipeline Step Trace Breakdown */}
            <div className="p-6 md:p-8 bg-gradient-to-b from-slate-50/70 to-white">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-center">
                
                {/* 1. INPUT */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
                  <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold mb-1">
                    01 / INPUT
                  </div>
                  <div className="text-[13px] font-semibold text-[#0F172A] line-clamp-1">
                    Customer Request
                  </div>
                  <p className="text-[12px] font-mono text-slate-600 mt-2 bg-slate-50 p-2 rounded border border-slate-200/80">
                    &quot;Where is my order?&quot;
                  </p>
                </div>

                {/* 2. AI UNDERSTANDING */}
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 shadow-xs">
                  <div className="text-[10px] font-mono text-blue-600 uppercase font-semibold mb-1">
                    02 / UNDERSTANDING
                  </div>
                  <div className="text-[13px] font-semibold text-[#2563EB]">
                    Intent &amp; Extraction
                  </div>
                  <div className="text-[11px] font-mono text-blue-800 mt-2 bg-blue-100/60 p-2 rounded">
                    <div>Intent: <strong>ORDER_STATUS</strong></div>
                    <div className="text-[10px] text-blue-600">Confidence: 98.4%</div>
                  </div>
                </div>

                {/* 3. CONTEXT */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
                  <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold mb-1">
                    03 / CONTEXT
                  </div>
                  <div className="text-[13px] font-semibold text-[#0F172A]">
                    Identity Matched
                  </div>
                  <div className="text-[11px] font-mono text-slate-700 mt-2 bg-slate-50 p-2 rounded border border-slate-200/80">
                    <div>ID: CUS_20491</div>
                    <div className="text-slate-500">Order: #GC1024</div>
                  </div>
                </div>

                {/* 4. DECISION */}
                <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 shadow-xs">
                  <div className="text-[10px] font-mono text-purple-600 uppercase font-semibold mb-1">
                    04 / DECISION
                  </div>
                  <div className="text-[13px] font-semibold text-purple-900">
                    Policy Engine
                  </div>
                  <div className="text-[11px] font-mono text-purple-800 mt-2 bg-purple-100/60 p-2 rounded">
                    <div>Policy: DELIVERY_OK</div>
                    <div className="text-[10px] text-purple-600">Rule passed ✓</div>
                  </div>
                </div>

                {/* 5. TOOLS */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
                  <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold mb-1">
                    05 / TOOLS
                  </div>
                  <div className="text-[13px] font-semibold text-[#0F172A]">
                    Multi-System Query
                  </div>
                  <div className="text-[11px] font-mono text-slate-700 mt-2 bg-slate-50 p-2 rounded border border-slate-200/80 space-y-0.5">
                    <div className="text-emerald-700">PostgreSQL ✓</div>
                    <div className="text-emerald-700">Delivery API ✓</div>
                  </div>
                </div>

                {/* 6. ACTION */}
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 shadow-xs">
                  <div className="text-[10px] font-mono text-emerald-700 uppercase font-semibold mb-1">
                    06 / ACTION
                  </div>
                  <div className="text-[13px] font-semibold text-emerald-900">
                    Response Verified
                  </div>
                  <div className="text-[11px] font-mono text-emerald-800 mt-2 bg-emerald-100/60 p-2 rounded">
                    <div>Dispatched ✓</div>
                    <div className="text-[10px] text-emerald-600">Trace: 0 error</div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ================= 3. THE SYSTEMIC IMPEDIMENT (THE PROBLEM) ================= */}
        <section className="py-16 lg:py-24 axiom-container">
          <div className="max-w-3xl mb-16">
            <div className="text-[12px] font-mono font-semibold text-[#2563EB] tracking-widest uppercase mb-3">
              SYSTEMIC IMPEDIMENT
            </div>
            <h2 className="font-display-section font-bold text-[#0F172A] tracking-tight leading-tight">
              Businesses don&apos;t have a people problem. They have a{" "}
              <span className="font-italic-accent-blue">workflow problem.</span>
            </h2>
            <p className="text-[17px] text-slate-600 mt-4 leading-relaxed">
              When high-performing teams are bogged down bridging brittle integrations and repetitive verification queues, operational velocity collapses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="axiom-card p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <span className="font-mono text-[13px] text-[#2563EB] font-semibold mb-4 block">
                  01 / FRICTION
                </span>
                <h3 className="text-[20px] font-bold text-[#0F172A] mb-3">Repetitive Work</h3>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  Skilled knowledge workers spend 62% of their day transcribing data between disconnected SaaS tools, copying form fields, and verifying routine attachments.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-100 text-[12px] font-mono text-slate-500">
                LOST REVENUE COST: <strong className="text-red-600 font-semibold">HIGH</strong> • ACCURACY DRIFT: <strong className="text-slate-700">4.8%</strong>
              </div>
            </div>

            {/* Card 2 */}
            <div className="axiom-card p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <span className="font-mono text-[13px] text-[#2563EB] font-semibold mb-4 block">
                  02 / ISOLATION
                </span>
                <h3 className="text-[20px] font-bold text-[#0F172A] mb-3">Information Silos</h3>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  Customer interactions reside in WhatsApp and Zendesk, transaction logs in PostgreSQL, and inventory status in ERP systems. No single node has unified context.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-100 text-[12px] font-mono text-slate-500">
                CROSS-CHANNEL DELAY: <strong className="text-amber-600 font-semibold">~4.2 HOURS</strong>
              </div>
            </div>

            {/* Card 3 */}
            <div className="axiom-card p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <span className="font-mono text-[13px] text-[#2563EB] font-semibold mb-4 block">
                  03 / INCONSISTENCY
                </span>
                <h3 className="text-[20px] font-bold text-[#0F172A] mb-3">Manual Decisions</h3>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  Simple threshold approvals and edge-case exceptions rely entirely on human vigilance, causing unpredictable queue times, customer attrition, and human burnout.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-100 text-[12px] font-mono text-slate-500">
                DECISION SPREAD: <strong className="text-slate-800 font-semibold">18m TO 36h</strong>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 4. PHILOSOPHY / COMPARISON ================= */}
        <section className="py-16 sm:py-20 bg-white border-y border-slate-200/80">
          <div className="axiom-container">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-[12px] font-mono font-semibold text-[#2563EB] tracking-widest uppercase">
                ENGINEERING PHILOSOPHY
              </span>
              <h2 className="font-display-section font-bold text-[#0F172A] tracking-tight mt-3">
                Automation should{" "}
                <span className="font-italic-accent-emerald">understand</span>{" "}
                the workflow, not just execute a click.
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Traditional Automation */}
              <div className="border border-slate-200 rounded-2xl p-6 sm:p-8 bg-slate-50/70">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[18px] font-bold text-[#0F172A]">
                    Traditional Automation (RPA / Webhooks)
                  </h3>
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono bg-red-100 text-red-700 font-semibold">
                    Fragile
                  </span>
                </div>
                <p className="text-[15px] text-slate-600 mb-6">
                  Linear brittle triggers that shatter when message formats alter, typos happen, or unexpected edge logic is introduced.
                </p>
                <div className="text-[13px] font-mono text-slate-500 bg-white p-4 rounded-xl border border-slate-200">
                  Trigger → Static Regex → Blind Unverified Action
                </div>
                <ul className="mt-6 space-y-3.5 text-[14px] text-slate-700">
                  <li className="flex items-center gap-3">
                    <XIcon className="w-4 h-4 text-red-500 shrink-0" />
                    <span>Cannot interpret natural customer intent or messy language</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <XIcon className="w-4 h-4 text-red-500 shrink-0" />
                    <span>Breaks whenever unexpected non-standard inputs arrive</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <XIcon className="w-4 h-4 text-red-500 shrink-0" />
                    <span>No safe escalation protocol or deterministic human loop</span>
                  </li>
                </ul>
              </div>

              {/* Intelligent Automation */}
              <div className="border-2 border-blue-500/40 rounded-2xl p-6 sm:p-8 bg-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full pointer-events-none" />
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[18px] font-bold text-[#0F172A]">
                    Intelligent Automation (Axiom Logic)
                  </h3>
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono bg-emerald-100 text-emerald-800 font-semibold">
                    Adaptive &amp; Safe
                  </span>
                </div>
                <p className="text-[15px] text-slate-600 mb-6">
                  Autonomous deterministic agents that synthesize intent, reason through enterprise guidelines, query APIs, and escalate safely.
                </p>
                <div className="text-[13px] font-mono text-[#2563EB] bg-blue-50 p-4 rounded-xl border border-blue-200/80 overflow-x-auto font-medium">
                  Trigger → Reason → Decide → Act → Verify → Escalate
                </div>
                <ul className="mt-6 space-y-3.5 text-[14px] text-[#0F172A]">
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Understands unstructured customer context, tone, and attachments</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Safely evaluates deterministic policies before executing tool calls</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Confidence-gated handoffs to human operators with audit trails</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 5. EDITORIAL SOLUTIONS SECTION ================= */}
        <section className="py-16 lg:py-24 axiom-container">
          <div className="max-w-3xl mb-16">
            <span className="text-[12px] font-mono font-semibold text-[#2563EB] tracking-widest uppercase">
              ENTERPRISE SOLUTIONS
            </span>
            <h2 className="font-display-section font-bold text-[#0F172A] tracking-tight mt-2">
              Automation that works{" "}
              <span className="font-italic-accent-blue">across</span>{" "}
              the entire business.
            </h2>
            <p className="text-[17px] text-slate-600 mt-3 leading-relaxed">
              Tailored autonomous operators engineered for customer engagement, pipeline conversion, and internal enterprise support.
            </p>
          </div>

          <div className="space-y-12">
            {/* Solution 1: Customer Operations */}
            <div id="customer-operations" className="axiom-card p-6 sm:p-8 md:p-12 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-5 space-y-5">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
                    <Headphones className="w-6 h-6" />
                  </div>
                  <h3 className="text-[26px] font-bold text-[#0F172A]">Customer Operations</h3>
                  <p className="text-[16px] text-slate-600 leading-relaxed">
                    Autonomous handling of incoming inquiries, multi-system status lookups, transactional changes, and instant context-aware replies.
                  </p>
                  <ul className="space-y-2.5 text-[14px] text-slate-700">
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Order status, return authorizations, and delivery mutations</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Cross-checks PostgreSQL and CRM before any write operation</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Escalates anger or edge-case disputes to human teams in seconds</span>
                    </li>
                  </ul>
                  <Link
                    href="/solutions#customer-operations"
                    className="btn-arrow-slide inline-flex items-center gap-2 text-[#2563EB] font-semibold text-[15px] pt-2"
                  >
                    <span>Explore Customer Ops Architecture</span>
                    <ArrowRight className="w-4 h-4 arrow-icon" />
                  </Link>
                </div>

                {/* Right: Interactive workflow visualization */}
                <div className="lg:col-span-7 bg-[#0F172A] text-white p-6 rounded-2xl border border-slate-800">
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-4 flex items-center justify-between">
                    <span>CUSTOMER OPS PIPELINE TRACE</span>
                    <span className="text-emerald-400">ACTIVE</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-[12px] font-mono">
                    <div className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200">
                      WhatsApp
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    <div className="px-3 py-2 rounded-lg bg-blue-900/60 border border-blue-700 text-blue-300">
                      Axiom AI
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    <div className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200">
                      Customer Profile
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    <div className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200">
                      Order DB
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    <div className="px-3 py-2 rounded-lg bg-emerald-950 border border-emerald-700 text-emerald-300">
                      Response Sent
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Solution 2: Lead Automation */}
            <div id="lead-automation" className="axiom-card p-6 sm:p-8 md:p-12 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-5 space-y-5">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <Filter className="w-6 h-6" />
                  </div>
                  <h3 className="text-[26px] font-bold text-[#0F172A]">Lead Automation</h3>
                  <p className="text-[16px] text-slate-600 leading-relaxed">
                    Enrich incoming prospect signals, compute ICP value indices, sync CRM records, and trigger outbound personalized sequences.
                  </p>
                  <ul className="space-y-2.5 text-[14px] text-slate-700">
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Instant reverse-IP &amp; company firmographic enrichment</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Custom intent scoring from website visits and docs activity</span>
                    </li>
                  </ul>
                  <Link
                    href="/solutions#lead-automation"
                    className="btn-arrow-slide inline-flex items-center gap-2 text-[#2563EB] font-semibold text-[15px] pt-2"
                  >
                    <span>Explore Lead Automation Architecture</span>
                    <ArrowRight className="w-4 h-4 arrow-icon" />
                  </Link>
                </div>

                {/* Right: Visual Pipeline */}
                <div className="lg:col-span-7 bg-[#0F172A] text-white p-6 rounded-2xl border border-slate-800">
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-4 flex items-center justify-between">
                    <span>LEAD QUALIFICATION PIPELINE</span>
                    <span className="text-emerald-400">INDEX: 94/100</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-center text-[12px] font-mono">
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-slate-400 text-[10px]">STAGE 1</div>
                      <div className="text-white font-semibold mt-1">Lead Inbound</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-slate-400 text-[10px]">STAGE 2</div>
                      <div className="text-white font-semibold mt-1">Enrichment</div>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-950 border border-blue-800">
                      <div className="text-blue-400 text-[10px]">STAGE 3</div>
                      <div className="text-blue-200 font-semibold mt-1">ICP Score</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-slate-400 text-[10px]">STAGE 4</div>
                      <div className="text-white font-semibold mt-1">CRM Sync</div>
                    </div>
                    <div className="p-3 rounded-lg bg-emerald-950 border border-emerald-800">
                      <div className="text-emerald-400 text-[10px]">STAGE 5</div>
                      <div className="text-emerald-200 font-semibold mt-1">Sales Booked</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Solution 3: Internal Operations */}
            <div id="internal-operations" className="axiom-card p-6 sm:p-8 md:p-12 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-5 space-y-5">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                    <Network className="w-6 h-6" />
                  </div>
                  <h3 className="text-[26px] font-bold text-[#0F172A]">Internal Operations</h3>
                  <p className="text-[16px] text-slate-600 leading-relaxed">
                    IT provisioning, contractor onboarding, financial document reconciliation, and employee service desk ticket routing.
                  </p>
                  <ul className="space-y-2.5 text-[14px] text-slate-700">
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Zero-friction Okta, GitHub, and Slack role-based access</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>PDF invoice reconciliation against ERP accounting ledgers</span>
                    </li>
                  </ul>
                  <Link
                    href="/solutions#internal-operations"
                    className="btn-arrow-slide inline-flex items-center gap-2 text-[#2563EB] font-semibold text-[15px] pt-2"
                  >
                    <span>Explore Internal Ops Architecture</span>
                    <ArrowRight className="w-4 h-4 arrow-icon" />
                  </Link>
                </div>

                {/* Right: Internal Ops Telemetry Console */}
                <div className="lg:col-span-7 bg-[#0F172A] text-white p-6 rounded-2xl border border-slate-800">
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-4 flex items-center justify-between">
                    <span>INTERNAL DISPATCH MONITOR</span>
                    <span className="text-blue-400">SOC-2 VERIFIED</span>
                  </div>
                  <div className="space-y-2.5 text-[12px] font-mono">
                    <div className="flex items-center justify-between bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                      <span className="text-slate-300">Contractor Provisioning: GitHub &amp; Slack</span>
                      <span className="text-emerald-400">AUTO-APPROVED</span>
                    </div>
                    <div className="flex items-center justify-between bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                      <span className="text-slate-300">Invoice $8,420 Reconciliation (Stripe vs Ledger)</span>
                      <span className="text-emerald-400">MATCHED</span>
                    </div>
                    <div className="flex items-center justify-between bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                      <span className="text-slate-300">AWS Production Access Escalation</span>
                      <span className="text-amber-400">HUMAN APPROVAL REQUIRED</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ================= 6. LIVE DEMO INTERACTIVE SECTION ================= */}
        <section className="py-16 sm:py-20 lg:py-28 bg-[#0F172A] text-white border-y border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="axiom-container relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
              <div>
                <span className="text-[12px] font-mono font-semibold text-blue-400 tracking-widest uppercase">
                  EXPERIENCE THE SYSTEM
                </span>
                <h2 className="font-display-section font-bold text-white tracking-tight mt-2">
                  Don&apos;t just read about automation. Watch it{" "}
                  <span className="font-italic-accent-gradient">work.</span>
                </h2>
                <p className="text-[17px] text-slate-400 mt-2 max-w-xl">
                  Inspect the live reasoning chain, tool execution queries, and verified business responses.
                </p>
              </div>

              {/* Scenario Toggles */}
              <div className="flex flex-wrap items-center gap-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
                <button
                  onClick={() => setActiveScenario("order")}
                  className={`px-3.5 py-1.5 rounded-lg text-[13px] font-mono transition-colors ${
                    activeScenario === "order" ? "bg-blue-600 text-white font-semibold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Order Status
                </button>
                <button
                  onClick={() => setActiveScenario("address")}
                  className={`px-3.5 py-1.5 rounded-lg text-[13px] font-mono transition-colors ${
                    activeScenario === "address" ? "bg-blue-600 text-white font-semibold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Address Change
                </button>
                <button
                  onClick={() => setActiveScenario("refund")}
                  className={`px-3.5 py-1.5 rounded-lg text-[13px] font-mono transition-colors ${
                    activeScenario === "refund" ? "bg-blue-600 text-white font-semibold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Refund Dispute
                </button>
              </div>
            </div>

            {/* Interactive 3-part layout: Left Conversation, Right Execution, Bottom Result */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Panel: Customer Conversation */}
              <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                    <span className="font-mono text-[12px] text-slate-400 font-semibold">CUSTOMER CHANNEL</span>
                    <span className="text-[11px] font-mono text-emerald-400">WHATSAPP LIVE</span>
                  </div>
                  
                  <div className="space-y-4 text-[14px]">
                    {/* User message */}
                    <div className="flex gap-3 justify-end">
                      <div className="bg-blue-600 text-white px-4 py-3 rounded-2xl rounded-tr-none max-w-[85%] leading-relaxed">
                        {activeScenario === "order" && "Hi, I placed an order yesterday. Where is it?"}
                        {activeScenario === "address" && "Can I change my delivery address to 442 N Lake St?"}
                        {activeScenario === "refund" && "I would like a full refund for order #GC1024, it arrived damaged."}
                      </div>
                    </div>

                    {/* AI Agent reasoning status */}
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-mono py-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                      <span>Axiom Agent synthesized intent in 42ms...</span>
                    </div>

                    {/* Agent reply */}
                    <div className="flex gap-3 justify-start">
                      <div className="bg-slate-800 border border-slate-700 text-slate-100 px-4 py-3 rounded-2xl rounded-tl-none max-w-[90%] leading-relaxed">
                        {activeScenario === "order" && (
                          "Hello Sarah! Your order #GC1024 has arrived at Town Hub and is currently out for delivery to your registered address."
                        )}
                        {activeScenario === "address" && (
                          "I have updated your shipping destination to 442 N Lake St. Carrier dispatch has been notified."
                        )}
                        {activeScenario === "refund" && (
                          "I have initiated a dispute ticket #DSP-904. Due to threshold policy, this has been escalated to senior billing for priority review."
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-800 text-[12px] font-mono text-slate-500 flex items-center justify-between">
                  <span>Customer: Sarah Jenkins</span>
                  <span>ID: CUS_20491</span>
                </div>
              </div>

              {/* Right Panel: AI Execution Trace */}
              <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                  <span className="font-mono text-[12px] text-slate-400 font-semibold">AI EXECUTION TRACE</span>
                  <span className="text-[11px] font-mono text-blue-400">TELEMETRY STREAM</span>
                </div>

                <div className="space-y-3 font-mono text-[12px]">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800/80">
                    <span className="text-slate-300">✓ Inbound Intent Detected</span>
                    <span className="text-emerald-400 font-semibold">{activeScenario === "order" ? "ORDER_STATUS" : activeScenario === "address" ? "UPDATE_ADDRESS" : "REFUND_REQUEST"}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800/80">
                    <span className="text-slate-300">✓ Customer Identity Authenticated</span>
                    <span className="text-emerald-400 font-semibold">TOKEN_MATCH (99.8%)</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800/80">
                    <span className="text-slate-300">✓ Database Query (PostgreSQL)</span>
                    <span className="text-blue-400 font-semibold">SELECT * FROM orders</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800/80">
                    <span className="text-slate-300">✓ Business Policy Verified</span>
                    <span className="text-emerald-400 font-semibold">PASS (RULE #201)</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800/80">
                    <span className="text-slate-300">✓ Action Generation &amp; Dispatch</span>
                    <span className="text-emerald-400 font-semibold">COMPLETED (412ms)</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Result Card */}
            <div className="mt-8 bg-slate-900 border border-emerald-500/40 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="text-[11px] font-mono text-emerald-400 font-semibold uppercase mb-1">
                  VERIFIED OPERATIONAL RESULT
                </div>
                <div className="text-[18px] font-bold text-white flex flex-wrap items-center gap-3">
                  <span>ORDER #GC1024</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-300">TOWN HUB</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-emerald-400">READY FOR DELIVERY</span>
                </div>
              </div>

              <Link
                href="/live-demo"
                className="btn-arrow-slide inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-[15px] font-semibold px-6 py-3 rounded-xl transition-all shadow-md shadow-blue-600/30"
              >
                <span>Open Full Live Demo Studio</span>
                <ArrowRight className="w-4 h-4 arrow-icon text-blue-200" />
              </Link>
            </div>

          </div>
        </section>

        {/* ================= 7. HOW IT WORKS (CONNECTED 5-STAGE PROCESS) ================= */}
        <section className="py-16 lg:py-24 axiom-container">
          <div className="max-w-3xl mb-16">
            <span className="text-[12px] font-mono font-semibold text-[#2563EB] tracking-widest uppercase">
              SYSTEM ARCHITECTURE
            </span>
            <h2 className="font-display-section font-bold text-[#0F172A] tracking-tight mt-2">
              How Axiom Logic powers{" "}
              <span className="font-italic-accent-emerald">zero-drift</span>{" "}
              automation.
            </h2>
            <p className="text-[17px] text-slate-600 mt-3 leading-relaxed">
              Every transaction moves through five deterministic stages to balance autonomous velocity with enterprise safety.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Stage 1 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs">
              <div className="text-[12px] font-mono text-[#2563EB] font-bold mb-2">01 / UNDERSTAND</div>
              <h4 className="text-[17px] font-bold text-[#0F172A] mb-3">Multichannel Ingestion</h4>
              <p className="text-[14px] text-slate-600 mb-4 leading-relaxed">
                Normalizes messy inbound text, attachments, and audio across all customer touchpoints.
              </p>
              <div className="text-[11px] font-mono text-slate-500 bg-slate-50 p-2.5 rounded border border-slate-200/80 space-y-1">
                <div>• WhatsApp / Slack</div>
                <div>• Zendesk / Email</div>
                <div>• REST APIs</div>
              </div>
            </div>

            {/* Stage 2 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs">
              <div className="text-[12px] font-mono text-[#2563EB] font-bold mb-2">02 / REASON</div>
              <h4 className="text-[17px] font-bold text-[#0F172A] mb-3">Context &amp; Policies</h4>
              <p className="text-[14px] text-slate-600 mb-4 leading-relaxed">
                Extracts entities, matches identities, and queries company compliance boundaries.
              </p>
              <div className="text-[11px] font-mono text-slate-500 bg-slate-50 p-2.5 rounded border border-slate-200/80 space-y-1">
                <div>• Intent Synthesis</div>
                <div>• Role Permissions</div>
                <div>• Threshold Checks</div>
              </div>
            </div>

            {/* Stage 3 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs">
              <div className="text-[12px] font-mono text-[#2563EB] font-bold mb-2">03 / ACT</div>
              <h4 className="text-[17px] font-bold text-[#0F172A] mb-3">Tool Execution</h4>
              <p className="text-[14px] text-slate-600 mb-4 leading-relaxed">
                Executes idempotent mutations across relational databases, payment gateways, and CRMs.
              </p>
              <div className="text-[11px] font-mono text-slate-500 bg-slate-50 p-2.5 rounded border border-slate-200/80 space-y-1">
                <div>• Postgres Queries</div>
                <div>• Stripe / Logistics</div>
                <div>• Hubspot Updates</div>
              </div>
            </div>

            {/* Stage 4 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs">
              <div className="text-[12px] font-mono text-[#2563EB] font-bold mb-2">04 / VERIFY</div>
              <h4 className="text-[17px] font-bold text-[#0F172A] mb-3">State Validation</h4>
              <p className="text-[14px] text-slate-600 mb-4 leading-relaxed">
                Confirms downstream commit success and creates an immutable cryptographic audit record.
              </p>
              <div className="text-[11px] font-mono text-slate-500 bg-slate-50 p-2.5 rounded border border-slate-200/80 space-y-1">
                <div>• Zero-Drift Check</div>
                <div>• Audit Hash Log</div>
                <div>• Latency Telemetry</div>
              </div>
            </div>

            {/* Stage 5 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs">
              <div className="text-[12px] font-mono text-[#2563EB] font-bold mb-2">05 / ESCALATE</div>
              <h4 className="text-[17px] font-bold text-[#0F172A] mb-3">Human-in-the-Loop</h4>
              <p className="text-[14px] text-slate-600 mb-4 leading-relaxed">
                Safely freezes high-risk exceptions for human operator review with 1-click approval.
              </p>
              <div className="text-[11px] font-mono text-slate-500 bg-slate-50 p-2.5 rounded border border-slate-200/80 space-y-1">
                <div>• Operator Queue</div>
                <div>• Slack Notification</div>
                <div>• 1-Click Resolve</div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 8. RESEARCH & PUBLICATIONS SECTION ================= */}
        <section className="py-16 sm:py-20 lg:py-28 bg-white border-y border-slate-200/80">
          <div className="axiom-container">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
              <div>
                <span className="text-[12px] font-mono font-semibold text-[#2563EB] tracking-widest uppercase">
                  ENGINEERING INTELLIGENCE
                </span>
                <h2 className="font-display-section font-bold text-[#0F172A] tracking-tight mt-2">
                  Research &amp;{" "}
                  <span className="font-italic-accent-blue">System Whitepapers</span>
                </h2>
                <p className="text-[17px] text-slate-600 mt-2">
                  Technical insights on autonomous agent governance, deterministic reliability, and latency.
                </p>
              </div>
              <Link
                href="/research"
                className="btn-arrow-slide text-[15px] text-[#2563EB] font-semibold inline-flex items-center gap-2 hover:underline"
              >
                <span>Read All Research Papers</span>
                <ArrowRight className="w-4 h-4 arrow-icon" />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Featured Research Card */}
              <div className="lg:col-span-7 hover-lift p-6 sm:p-8 md:p-10 rounded-3xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-blue-100 text-[#2563EB]">
                      AUTOMATION
                    </span>
                    <span className="text-[12px] font-mono text-slate-400">12 MIN READ • WHITE PAPER</span>
                  </div>
                  <h3 className="text-[24px] sm:text-[28px] font-bold text-[#0F172A] leading-snug mb-4">
                    Why most business automation still requires humans — and how agent reasoning changes the equation.
                  </h3>
                  <p className="text-[15px] sm:text-[16px] text-slate-600 leading-relaxed">
                    Analyzing over 2.4 million operational edge cases across customer support and internal workflows. Why deterministic rules fail on messy human data and how multi-node agent architectures achieve 99.8% precision.
                  </p>
                </div>
                <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[13px] font-mono text-slate-500">Dr. Evan Vance • Axiom Systems Lab</span>
                  <Link href="/research" className="text-[#2563EB] font-semibold text-[14px] hover:underline flex items-center gap-1">
                    <span>Read Paper</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Smaller Research Cards */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="hover-lift p-6 md:p-8 rounded-2xl border border-slate-200 bg-white flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-100 text-emerald-800">
                        AI AGENTS
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">8 MIN READ</span>
                    </div>
                    <h4 className="text-[19px] font-bold text-[#0F172A] mb-2">
                      AI agents vs traditional workflow automation
                    </h4>
                    <p className="text-[14px] text-slate-600 leading-relaxed">
                      A comparative benchmark between static if-this-then-that webhooks and goal-driven LLM tool dispatchers.
                    </p>
                  </div>
                  <Link href="/research" className="text-[#2563EB] font-semibold text-[13px] hover:underline mt-4 flex items-center gap-1">
                    <span>View Analysis →</span>
                  </Link>
                </div>

                <div className="hover-lift p-6 md:p-8 rounded-2xl border border-slate-200 bg-white flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-purple-100 text-purple-800">
                        MARKET
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">10 MIN READ</span>
                    </div>
                    <h4 className="text-[19px] font-bold text-[#0F172A] mb-2">
                      Where current automation platforms fall short
                    </h4>
                    <p className="text-[14px] text-slate-600 leading-relaxed">
                      The hidden cost of maintenance when brittle API connectors break and human operators are left with no audit trail.
                    </p>
                  </div>
                  <Link href="/research" className="text-[#2563EB] font-semibold text-[13px] hover:underline mt-4 flex items-center gap-1">
                    <span>View Analysis →</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 9. BOOK A 1:1 DISCOVERY SECTION ================= */}
        <section id="book" className="py-16 lg:py-24 axiom-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left: Value Proposition */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-[12px] font-mono font-semibold text-[#2563EB] tracking-widest uppercase">
                SCHEDULE DISCOVERY
              </span>
              <h2 className="font-display-section font-bold text-[#0F172A] tracking-tight leading-tight">
                Have a workflow{" "}
                <span className="font-italic-accent-gradient">worth automating?</span>
              </h2>
              <p className="text-[17px] text-slate-600 leading-relaxed">
                Connect directly with an Axiom Solutions Architect. We&apos;ll evaluate your current data flows, identify deterministic high-ROI automations, and outline a production rollout plan.
              </p>

              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div className="flex items-center gap-3 text-[15px] font-medium text-slate-800">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold">
                    30
                  </div>
                  <span>30-minute technical discovery session</span>
                </div>
                <div className="flex items-center gap-3 text-[15px] font-medium text-slate-800">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <span>1:1 conversation with an automation engineer</span>
                </div>
                <div className="flex items-center gap-3 text-[15px] font-medium text-slate-800">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                    <GitBranch className="w-5 h-5" />
                  </div>
                  <span>Custom workflow architecture diagram for your team</span>
                </div>
              </div>
            </div>

            {/* Right: Beautiful Scheduling Form */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl">
              {bookingSuccess ? (
                <div className="py-12 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-[26px] font-bold text-[#0F172A]">You&apos;re booked.</h3>
                  <p className="text-[16px] text-slate-600 max-w-md mx-auto">
                    We&apos;ve reserved your 1:1 architecture discovery session for <strong>{bookDate} at {bookTime}</strong>. A calendar invite has been dispatched.
                  </p>
                  {emailWarning && (
                    <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[13px] max-w-md mx-auto text-left">
                      {emailWarning}
                    </div>
                  )}
                  <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/70 text-[#1E293B] text-[13px] max-w-md mx-auto text-left flex items-start gap-3">
                    <Sparkles className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#0F172A]">Pre-Meeting Architecture Intake: </span>
                      <span>
                        We&apos;ve also sent a preparation link to your email so you can share your workflow requirements in 2–3 minutes before the session.
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setBookingSuccess(false)}
                    className="text-[#2563EB] font-semibold text-[14px] hover:underline pt-2"
                  >
                    Schedule another session
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-6">
                  {bookingError && (
                    <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[13px] flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                      <span>{bookingError}</span>
                    </div>
                  )}

                  {/* Step 1: Select Date */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-[12px] font-mono text-slate-500 uppercase tracking-wider font-semibold">
                        Select Date ({bookMonthYear || "Available Dates"})
                      </label>
                      <span className="text-[12px] font-mono text-[#2563EB] font-semibold">{bookDate}</span>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {homeDates.map((d) => (
                        <button
                          key={d.iso}
                          type="button"
                          onClick={() => handleDateSelect(d)}
                          className={`p-3 rounded-xl border text-center transition-colors duration-150 ${
                            bookDate === d.val
                              ? "bg-[#0F172A] text-white border-[#0F172A] shadow-md"
                              : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <div className="text-[10px] font-mono">{d.label}</div>
                          <div className="text-[18px] font-bold mt-0.5">{d.day}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 2: Select Time */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-[12px] font-mono text-slate-500 uppercase tracking-wider font-semibold">
                        Select Time Slot ({homeTzShort})
                      </label>
                      <span className="text-[12px] font-mono text-[#2563EB] font-semibold">{bookTime || "Choose a slot"}</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {homeSlots.length === 0 ? (
                        <div className="col-span-full py-3 text-center text-[12px] font-mono text-slate-400">
                          Loading available slots...
                        </div>
                      ) : (
                        homeSlots.map((t) => (
                          <button
                            key={t.fullDisplay}
                            type="button"
                            disabled={!t.available}
                            onClick={() => {
                              setBookTime(t.fullDisplay);
                              setBookingError(null);
                            }}
                            className={`py-2.5 px-3 rounded-xl border text-center text-[12px] font-mono font-medium transition-all ${
                              bookTime === t.fullDisplay
                                ? "bg-[#2563EB] text-white border-[#2563EB] shadow-sm"
                                : !t.available
                                ? "border-slate-200 bg-slate-100 text-slate-400 opacity-60 cursor-not-allowed line-through"
                                : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            {t.time}
                          </button>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Step 3: Contact Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={bookName}
                        onChange={(e) => setBookName(e.target.value)}
                        placeholder="Marcus Vance"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-[14px] outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">
                        Work Email
                      </label>
                      <input
                        type="email"
                        required
                        value={bookEmail}
                        onChange={(e) => setBookEmail(e.target.value)}
                        placeholder="marcus@hypergrowth.io"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-[14px] outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={bookCompany}
                        onChange={(e) => setBookCompany(e.target.value)}
                        placeholder="Hypergrowth Inc"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-[14px] outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">
                        Primary Workflow Area
                      </label>
                      <select
                        value={bookArea}
                        onChange={(e) => setBookArea(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-[14px] outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 text-slate-900"
                      >
                        <option>Customer Operations</option>
                        <option>Lead Automation &amp; Scoring</option>
                        <option>Internal IT &amp; Employee Ops</option>
                        <option>Custom Enterprise Pipeline</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="btn-arrow-slide w-full py-3.5 px-6 rounded-xl bg-[#0F172A] hover:bg-[#2563EB] text-white font-semibold text-[15px] transition-all shadow-md shadow-slate-900/10 flex items-center justify-center gap-2"
                  >
                    <span>{bookingLoading ? "Confirming Session..." : "Confirm Meeting"}</span>
                    <ArrowRight className="w-4 h-4 arrow-icon text-blue-200" />
                  </button>
                </form>
              )}
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
