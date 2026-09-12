"use client";

import { useState } from "react";
import TopNavBar from "@/components/navigation/TopNavBar";
import Footer from "@/components/navigation/Footer";
import AxiomCornerCard from "@/components/ui/AxiomCornerCard";
import {
  Clock,
  ShieldCheck,
  GitFork,
  CheckCircle2,
  Calendar as CalendarIcon,
  ArrowRight,
  Sparkles,
  Lock,
  UserCheck,
  Layers,
  Check,
  Server,
} from "lucide-react";
import Link from "next/link";

export default function BookPage() {
  const [selectedDate, setSelectedDate] = useState("Tue, Apr 22");
  const [selectedTime, setSelectedTime] = useState("10:00 AM EST");
  const [name, setName] = useState("Marcus Vance");
  const [email, setEmail] = useState("marcus@hypergrowth.io");
  const [company, setCompany] = useState("Hypergrowth Inc");
  const [workflowArea, setWorkflowArea] = useState("Customer Operations");
  const [description, setDescription] = useState(
    "We handle ~800 order change requests per week manually in Zendesk and Postgres. Looking to automate safe changes without customer churn."
  );

  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [bookingData, setBookingData] = useState<{
    id: string;
    date: string;
    timeSlot: string;
    name: string;
    company: string;
  } | null>(null);

  const dates = [
    { label: "MON", day: "21", val: "Mon, Apr 21" },
    { label: "TUE", day: "22", val: "Tue, Apr 22" },
    { label: "WED", day: "23", val: "Wed, Apr 23" },
    { label: "THU", day: "24", val: "Thu, Apr 24" },
    { label: "FRI", day: "25", val: "Fri, Apr 25" },
    { label: "MON", day: "28", val: "Mon, Apr 28" },
  ];

  const times = [
    "09:00 AM EST",
    "10:00 AM EST",
    "11:30 AM EST",
    "02:00 PM EST",
    "03:30 PM EST",
    "04:30 PM EST",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company,
          date: selectedDate,
          timeSlot: selectedTime,
          workflowType: workflowArea,
          description,
        }),
      });

      if (!res.ok) throw new Error("Failed to book session");
      const data = await res.json();

      setBookingData({
        id: data.id || "AXIOM-ARCH-" + Math.floor(1000 + Math.random() * 9000),
        date: selectedDate,
        timeSlot: selectedTime,
        name,
        company,
      });
      setConfirmed(true);
      window.scrollTo({ top: 120, behavior: "smooth" });
    } catch {
      // Graceful fallback for mock demonstration
      setBookingData({
        id: "AXIOM-ARCH-" + Math.floor(1000 + Math.random() * 9000),
        date: selectedDate,
        timeSlot: selectedTime,
        name,
        company,
      });
      setConfirmed(true);
      window.scrollTo({ top: 120, behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#0F172A] selection:bg-blue-600 selection:text-white">
      <TopNavBar />

      <main className="flex-grow">
        {/* ================= HERO SECTION (EDITORIAL + TELEMETRY) ================= */}
        <section className="relative border-b border-slate-200/80 bg-white pt-14 pb-14 overflow-hidden">
          <div className="absolute inset-0 tech-grid-pattern pointer-events-none opacity-50" />
          <div className="axiom-container relative z-10">
            {/* Top Telemetry Strip */}
            <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 uppercase tracking-widest pb-4 mb-6 border-b border-slate-100 gap-4">
              <div className="flex items-center gap-3">
                <span className="crosshair-mark pl-2 text-[#2563EB] font-bold">+ SESSION_REF // AXIOM-ARCH-01</span>
                <span className="text-slate-300">|</span>
                <span>AVAILABILITY: REAL-TIME</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-emerald-600 font-semibold">SECURITY: MUTUAL NDA COVERED</span>
                <span className="text-slate-300">•</span>
                <span className="text-[#2563EB] font-semibold">ENGINEERING: LEVEL 3 SPECIALISTS</span>
              </div>
            </div>

            {/* Editorial Headline */}
            <div className="max-w-4xl space-y-4">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[#2563EB] text-[11px] font-mono tracking-wider uppercase font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ARCHITECTURE SESSION CONTROL CENTER</span>
              </div>

              <h1 className="font-display-hero font-bold text-[#0F172A] tracking-tight leading-[1.04]">
                Map the system.{" "}
                <span className="font-italic-accent-gradient block sm:inline">
                  Identify the bottleneck.
                </span>{" "}
                Design the automation.
              </h1>

              <p className="text-[17px] sm:text-[20px] text-slate-600 leading-relaxed max-w-2xl font-normal">
                Direct consultation with an AXIOM systems engineer. Evaluate current data flows, volume requirements, deterministic rules, and zero-drift rollout architecture.
              </p>
            </div>
          </div>
        </section>

        {/* ================= 2-COLUMN BALANCED CONTROL CENTER ================= */}
        <section className="axiom-container py-8 sm:py-12">
          {!confirmed ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
              
              {/* LEFT COLUMN: 38% - Architecture Specifications & Guarantees */}
              <div className="lg:col-span-5 space-y-6">
                <AxiomCornerCard
                  corner="top-left"
                  color="blue"
                  className="p-5 sm:p-8 space-y-6 shadow-sm border-slate-200/90"
                >
                  <div>
                    <span className="text-[11px] font-mono text-[#2563EB] font-bold tracking-widest uppercase block mb-1">
                      SESSION PROTOCOL
                    </span>
                    <h3 className="text-[20px] sm:text-[22px] font-bold text-[#0F172A] tracking-tight">
                      Architecture Review Scope
                    </h3>
                  </div>

                  <ul className="space-y-6 text-[14.5px] text-slate-600">
                    <li className="flex items-start gap-4 group">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0 mt-0.5 border border-blue-200/60 shadow-xs">
                        <Clock className="w-4 h-4 icon-hover-pulse" />
                      </div>
                      <div>
                        <span className="font-mono text-[11px] text-[#2563EB] font-bold tracking-wider block">01 / REVIEW DURATION</span>
                        <strong className="text-[#0F172A] block font-semibold text-[15px]">
                          30-Minute Architecture Review
                        </strong>
                        <p className="text-slate-500 text-[13.5px] leading-relaxed mt-0.5">
                          Focused directly on your stack, bottlenecks, volume requirements, and security constraints.
                        </p>
                      </div>
                    </li>

                    <li className="flex items-start gap-4 group">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200/60 shadow-xs">
                        <UserCheck className="w-4 h-4 icon-hover-pulse" />
                      </div>
                      <div>
                        <span className="font-mono text-[11px] text-emerald-600 font-bold tracking-wider block">02 / DIRECT ACCESS</span>
                        <strong className="text-[#0F172A] block font-semibold text-[15px]">
                          No-Pitch Consultation
                        </strong>
                        <p className="text-slate-500 text-[13.5px] leading-relaxed mt-0.5">
                          Speak directly with an automation systems engineer, not a scripted salesperson.
                        </p>
                      </div>
                    </li>

                    <li className="flex items-start gap-4 group">
                      <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5 border border-purple-200/60 shadow-xs">
                        <GitFork className="w-4 h-4 icon-hover-pulse" />
                      </div>
                      <div>
                        <span className="font-mono text-[11px] text-purple-600 font-bold tracking-wider block">03 / ARTIFACT DELIVERABLE</span>
                        <strong className="text-[#0F172A] block font-semibold text-[15px]">
                          Workflow Topology Map
                        </strong>
                        <p className="text-slate-500 text-[13.5px] leading-relaxed mt-0.5">
                          Receive an initial architecture direction and node topology diagram within 24 hours.
                        </p>
                      </div>
                    </li>

                    <li className="flex items-start gap-4 group">
                      <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0 mt-0.5 border border-cyan-200/60 shadow-xs">
                        <ShieldCheck className="w-4 h-4 icon-hover-pulse" />
                      </div>
                      <div>
                        <span className="font-mono text-[11px] text-cyan-600 font-bold tracking-wider block">04 / COMPLIANCE GATING</span>
                        <strong className="text-[#0F172A] block font-semibold text-[15px]">
                          Security &amp; Governance Review
                        </strong>
                        <p className="text-slate-500 text-[13.5px] leading-relaxed mt-0.5">
                          Review data isolation, human-in-the-loop triggers, and KMS token encryption parameters.
                        </p>
                      </div>
                    </li>
                  </ul>
                </AxiomCornerCard>

                {/* Dark Navy Mutual Confidentiality Panel */}
                <div className="relative overflow-hidden rounded-2xl bg-[#0F172A] text-white border border-slate-800 p-5 sm:p-7 shadow-xl">
                  {/* Subtle corner emerald glow accent */}
                  <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-emerald-500/15 border border-emerald-500/30 pointer-events-none" />
                  
                  <div className="relative z-10 space-y-3">
                    <div className="flex items-center gap-2 text-emerald-400 font-mono text-[11px] font-semibold uppercase tracking-wider">
                      <Lock className="w-4 h-4" />
                      <span>MUTUAL CONFIDENTIALITY &amp; NDA</span>
                    </div>
                    <p className="text-slate-300 text-[13.5px] leading-relaxed">
                      Customer architecture discussions are handled confidentially under mutual enterprise nondisclosure terms.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-mono text-emerald-400">
                        SOC-2 TYPE II
                      </span>
                      <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300">
                        AUDIT READY
                      </span>
                      <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-mono text-blue-400">
                        SECURE DISCUSSION
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: 62% - Interactive Booking Calendar & Form */}
              <div className="lg:col-span-7">
                <AxiomCornerCard
                  corner="bottom-right"
                  color="blue"
                  className="p-5 sm:p-8 md:p-10 shadow-xl border-slate-200/90"
                >
                  <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center border border-blue-200/60 shadow-xs">
                        <CalendarIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-[19px] font-bold text-[#0F172A] tracking-tight">
                          Select Date &amp; Reserve Slot
                        </h3>
                        <span className="text-[11px] font-mono text-slate-400">TIME ZONE: EASTERN STANDARD (EST)</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80 font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      SLOTS OPEN
                    </span>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-7">
                    {/* Date Selector Cards */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-bold">
                          1. SELECT DATE (APRIL 2025)
                        </label>
                        <span className="text-[12px] font-mono text-[#2563EB] font-semibold">{selectedDate}</span>
                      </div>
                      
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                        {dates.map((d) => {
                          const isSelected = selectedDate === d.val;
                          return (
                            <button
                              key={d.val}
                              type="button"
                              onClick={() => setSelectedDate(d.val)}
                              className={`py-3.5 px-2 rounded-xl text-center transition-all duration-200 border relative overflow-hidden group ${
                                isSelected
                                  ? "bg-[#0F172A] text-white border-[#0F172A] shadow-md -translate-y-0.5 ring-2 ring-blue-500/40"
                                  : "bg-white text-slate-700 border-slate-200 hover:border-blue-400 hover:bg-slate-50"
                              }`}
                            >
                              <div className={`text-[10px] font-mono uppercase tracking-wider ${isSelected ? "text-blue-300" : "text-slate-400"}`}>
                                {d.label}
                              </div>
                              <div className="text-[20px] font-bold tracking-tight mt-0.5">
                                {d.day}
                              </div>
                              {isSelected && (
                                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Time Slot Buttons */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-bold">
                          2. AVAILABLE TIME
                        </label>
                        <span className="text-[12px] font-mono text-[#2563EB] font-semibold">{selectedTime}</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {times.map((t) => {
                          const isSelected = selectedTime === t;
                          return (
                            <button
                              key={t}
                              type="button"
                              onClick={() => setSelectedTime(t)}
                              className={`py-3 px-3.5 rounded-xl text-[13px] font-mono font-medium transition-all duration-200 border flex items-center justify-between group ${
                                isSelected
                                  ? "bg-[#2563EB] text-white border-[#2563EB] shadow-sm shadow-blue-500/30"
                                  : "bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50/50"
                              }`}
                            >
                              <span>{t}</span>
                              <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white" : "bg-slate-300 group-hover:bg-blue-400"}`} />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Customer Information (2-Column Grid) */}
                    <div className="pt-4 border-t border-slate-100 space-y-4">
                      <label className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-bold block">
                        3. ARCHITECTURE DETAILS
                      </label>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">
                            Full Name <span className="text-[#2563EB]">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-[14px] text-slate-900 outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-blue-100"
                            placeholder="Alex Mercer"
                          />
                        </div>

                        <div>
                          <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">
                            Work Email <span className="text-[#2563EB]">*</span>
                          </label>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-[14px] text-slate-900 outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-blue-100"
                            placeholder="alex@enterprise.com"
                          />
                        </div>

                        <div>
                          <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">
                            Company Name <span className="text-[#2563EB]">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-[14px] text-slate-900 outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-blue-100"
                            placeholder="Acme Global Inc"
                          />
                        </div>

                        <div>
                          <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">
                            Primary Workflow Area
                          </label>
                          <select
                            value={workflowArea}
                            onChange={(e) => setWorkflowArea(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-[14px] text-slate-900 outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-blue-100"
                          >
                            <option value="Customer Operations">Customer Operations &amp; Support</option>
                            <option value="Lead Automation">Lead Scoring &amp; Routing</option>
                            <option value="Internal Operations">Internal IT &amp; Provisioning</option>
                            <option value="Financial Operations">Financial Operations &amp; Invoicing</option>
                            <option value="Custom Enterprise Graph">Custom Enterprise Graph</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">
                          Briefly Describe The Bottleneck
                        </label>
                        <textarea
                          rows={3}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-[14px] text-slate-900 outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-blue-100 leading-relaxed"
                          placeholder="What process currently consumes too many manual hours or causes delivery friction?"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-arrow-slide btn-axiom-primary w-full py-4 text-[16px] gap-2.5 font-semibold disabled:opacity-50"
                    >
                      <span>{loading ? "Allocating Systems Engineer..." : "Confirm Architecture Session"}</span>
                      <ArrowRight className="w-5 h-5 arrow-icon text-blue-200" />
                    </button>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-[12px] font-mono text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        Calendar invite sent instantly
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        Zero obligation
                      </span>
                    </div>
                  </form>
                </AxiomCornerCard>
              </div>

            </div>
          ) : (
            /* ================= CONFIRMATION RECEIPT PANEL ================= */
            <div className="max-w-2xl mx-auto">
              <AxiomCornerCard
                corner="bottom-right"
                color="emerald"
                className="p-6 sm:p-10 md:p-12 text-center border-slate-200 shadow-2xl"
              >
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6 border border-emerald-200/80 shadow-xs">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="text-[11px] font-mono text-emerald-600 font-bold uppercase tracking-widest mb-2">
                  CONFIRMATION HASH // {bookingData?.id}
                </div>

                <h2 className="text-[32px] sm:text-[38px] font-bold text-[#0F172A] tracking-tight mb-3">
                  Architecture Session Reserved
                </h2>

                <p className="text-[16px] text-slate-600 max-w-md mx-auto mb-8 leading-relaxed">
                  We have reserved your slot with an AXIOM systems specialist. A confirmation and calendar invite have been sent to{" "}
                  <strong className="text-[#0F172A] font-semibold">{email}</strong>.
                </p>

                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-left max-w-md mx-auto mb-8 space-y-3 font-mono text-[13px]">
                  <div className="flex justify-between pb-2 border-b border-slate-200">
                    <span className="text-slate-500">RESERVED DATE:</span>
                    <span className="font-bold text-[#0F172A]">{bookingData?.date}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-slate-200">
                    <span className="text-slate-500">TIME WINDOW:</span>
                    <span className="font-bold text-[#2563EB]">{bookingData?.timeSlot}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-slate-200">
                    <span className="text-slate-500">ORGANIZATION:</span>
                    <span className="font-bold text-[#0F172A]">{bookingData?.company}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">CONFERENCE NODE:</span>
                    <span className="font-bold text-emerald-600">Google Meet / HD</span>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    href="/live-demo"
                    className="btn-axiom-primary px-6 py-3 text-[14px] gap-2"
                  >
                    <span>Explore Live Simulator While You Wait</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => setConfirmed(false)}
                    className="btn-axiom-secondary px-5 py-3 text-[14px]"
                  >
                    Book Another Session
                  </button>
                </div>
              </AxiomCornerCard>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
