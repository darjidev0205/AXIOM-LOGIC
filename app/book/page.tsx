"use client";

import { useState, useEffect, useCallback } from "react";
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
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { DateOption, SlotOption } from "@/services/bookings/availabilityService";
import { buildAxiomPostBookingPayload, postBookingToAxiom } from "@/services/axiomPhase2";

export default function BookPage() {
  const [timezone, setTimezone] = useState<string>("America/New_York");
  const [detectedTzShort, setDetectedTzShort] = useState<string>("EST");
  const [dateOffset, setDateOffset] = useState<number>(0);

  const [dates, setDates] = useState<DateOption[]>([]);
  const [selectedDateIso, setSelectedDateIso] = useState<string>("");
  const [selectedDateFormatted, setSelectedDateFormatted] = useState<string>("");
  const [currentMonthYear, setCurrentMonthYear] = useState<string>("");

  const [slots, setSlots] = useState<SlotOption[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedSlotId, setSelectedSlotId] = useState<string>("");
  const [slotsLoading, setSlotsLoading] = useState<boolean>(true);
  const [isFullyBooked, setIsFullyBooked] = useState<boolean>(false);
  const [nextAvailableDateOption, setNextAvailableDateOption] = useState<DateOption | null>(null);

  // Custom Time Request State
  const [showCustomTime, setShowCustomTime] = useState<boolean>(false);
  const [customDate, setCustomDate] = useState<string>("");
  const [customTime, setCustomTime] = useState<string>("");

  // Form Inputs (Pre-filled with friendly enterprise defaults, editable)
  const [name, setName] = useState("Marcus Vance");
  const [email, setEmail] = useState("marcus@hypergrowth.io");
  const [company, setCompany] = useState("Hypergrowth Inc");
  const [workflowArea, setWorkflowArea] = useState("Customer Operations");
  const [description, setDescription] = useState(
    "We handle ~800 order change requests per week manually in Zendesk and Postgres. Looking to automate safe changes without customer churn."
  );

  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [conflictError, setConflictError] = useState<string | null>(null);
  const [emailWarning, setEmailWarning] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState<{
    id: string;
    date: string;
    timeSlot: string;
    name: string;
    company: string;
    status: string;
  } | null>(null);

  // Detect user browser timezone on mount
  useEffect(() => {
    try {
      const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York";
      setTimezone(userTz);

      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: userTz,
        timeZoneName: "short",
      }).formatToParts(new Date());

      const shortTz = parts.find((p) => p.type === "timeZoneName")?.value || "UTC";
      setDetectedTzShort(shortTz);
    } catch {
      // Fallback
      setTimezone("America/New_York");
      setDetectedTzShort("EST");
    }
  }, []);

  // Fetch dynamic availability
  const fetchAvailability = useCallback(
    async (dateIsoToFetch?: string, showLoader: boolean = true) => {
      if (showLoader) setSlotsLoading(true);

      try {
        const query = new URLSearchParams({
          timezone,
          offset: dateOffset.toString(),
        });
        if (dateIsoToFetch) query.set("date", dateIsoToFetch);

        const res = await fetch(`/api/bookings/availability?${query.toString()}`);
        if (!res.ok) throw new Error("Failed to load available slots");
        const data = await res.json();

        setDates(data.dates || []);
        const activeIso = data.selectedDate || data.dates[0]?.iso;
        setSelectedDateIso(activeIso);

        const matchedDate = data.dates.find((d: DateOption) => d.iso === activeIso);
        if (matchedDate) {
          setSelectedDateFormatted(matchedDate.val);
          setCurrentMonthYear(matchedDate.monthYear);
        }

        const activeSlots: SlotOption[] = data.availability?.slots || [];
        setSlots(activeSlots);
        setIsFullyBooked(data.availability?.isFullyBooked || false);

        if (data.nextAvailableDate) {
          const nextOpt = data.dates.find((d: DateOption) => d.iso === data.nextAvailableDate) || null;
          setNextAvailableDateOption(nextOpt);
        } else {
          setNextAvailableDateOption(null);
        }

        // Check if selected time is still valid
        setSelectedTime((prev) => {
          if (!prev) return "";
          const found = activeSlots.find(
            (s) => s.fullDisplay.toLowerCase() === prev.toLowerCase() && s.available
          );
          if (!found) {
            return "";
          }
          return prev;
        });
      } catch (err) {
        console.error("Error fetching availability:", err);
      } finally {
        if (showLoader) setSlotsLoading(false);
      }
    },
    [timezone, dateOffset]
  );

  // Load availability whenever timezone or dateOffset changes
  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  // Real-time synchronization via SSE & fallback polling
  useEffect(() => {
    let eventSource: EventSource | null = null;
    let reconnectTimeout: NodeJS.Timeout | null = null;

    const connectSSE = () => {
      try {
        eventSource = new EventSource("/api/bookings/events");

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === "slot_booked") {
              setSlots((prev) =>
                prev.map((slot) => {
                  if (
                    slot.fullDisplay.toLowerCase() === data.timeSlot?.toLowerCase() ||
                    slot.time.toLowerCase() === data.timeSlot?.toLowerCase() ||
                    slot.businessTime.toLowerCase() === data.timeSlot?.toLowerCase()
                  ) {
                    return { ...slot, available: false, status: "booked", reason: "booked" };
                  }
                  return slot;
                })
              );

              // If currently selected by this user, warn and deselect
              setSelectedTime((currentSelected) => {
                if (
                  currentSelected &&
                  (currentSelected.toLowerCase() === data.timeSlot?.toLowerCase() ||
                    currentSelected.toLowerCase() === data.timeSlot?.split(" ")[0]?.toLowerCase())
                ) {
                  setConflictError("That time was just booked. Please choose another available time.");
                  return "";
                }
                return currentSelected;
              });
            }
          } catch {
            // Ignore parse errors
          }
        };

        eventSource.onerror = () => {
          if (eventSource) {
            eventSource.close();
            eventSource = null;
          }
          reconnectTimeout = setTimeout(connectSSE, 5000);
        };
      } catch {
        // SSE not supported or blocked
      }
    };

    connectSSE();

    // Fallback periodic sync every 20s
    const pollTimer = setInterval(() => {
      if (selectedDateIso) {
        fetchAvailability(selectedDateIso, false);
      }
    }, 20000);

    return () => {
      if (eventSource) eventSource.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      clearInterval(pollTimer);
    };
  }, [selectedDateIso, fetchAvailability]);

  // Date change handler
  const handleDateChange = (dateIso: string) => {
    setSelectedDateIso(dateIso);
    const dateObj = dates.find((d) => d.iso === dateIso);
    if (dateObj) {
      setSelectedDateFormatted(dateObj.val);
      setCurrentMonthYear(dateObj.monthYear);
    }
    setSelectedTime("");
    setSelectedSlotId("");
    setConflictError(null);
    fetchAvailability(dateIso);
  };

  const handleNextDateOffset = () => {
    setDateOffset((prev) => prev + 6);
  };

  const handlePrevDateOffset = () => {
    setDateOffset((prev) => Math.max(0, prev - 6));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedEmail = (email || "").trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      setConflictError("Please enter a valid work email address (e.g. name@company.com).");
      return;
    }

    if (!name.trim()) {
      setConflictError("Please enter your full name.");
      return;
    }

    if (showCustomTime) {
      if (!customDate || !customTime) {
        setConflictError("Please select both a preferred date and time for your custom request.");
        return;
      }
    } else {
      if (!selectedTime) {
        setConflictError("Please select an available time slot before confirming.");
        return;
      }
      if (!selectedDateFormatted) {
        setConflictError("Please select a consultation date.");
        return;
      }
    }

    setLoading(true);
    setConflictError(null);
    setEmailWarning(null);

    const payload = showCustomTime
      ? {
          isCustomRequest: true,
          name: name.trim(),
          email: trimmedEmail,
          company: company.trim() || "Enterprise Operations",
          date: customDate,
          timeSlot: `${customTime} (${detectedTzShort})`,
          workflowType: workflowArea,
          description: `[Custom Request Window] ${description.trim()}`,
          timeZone: timezone,
        }
      : {
          name: name.trim(),
          email: trimmedEmail,
          company: company.trim() || "Enterprise Operations",
          date: selectedDateFormatted,
          timeSlot: selectedTime,
          workflowType: workflowArea,
          description: description.trim(),
          timeZone: timezone,
        };

    console.log("[Axiom Booking] Submitting booking request:", payload);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log(`[Axiom Booking] Response HTTP status: ${res.status}`);

      if (res.status === 409) {
        const conflictData = await res.json().catch(() => ({}));
        setConflictError(
          conflictData.error || "That time was just booked. Please choose another available time."
        );
        setSelectedTime("");
        await fetchAvailability(selectedDateIso);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to reserve architecture session");
      }

      const data = await res.json();
      console.log("[Axiom Booking] Booking response received:", data);

      if (data.n8nSuccess === false) {
        console.warn("[Axiom Booking] n8n confirmation delivery notice:", data.emailError);
        setEmailWarning(
          "Your architecture review is confirmed. We’re having trouble sending the confirmation email right now, but your booking is saved."
        );
      } else {
        console.log("[Axiom Booking] n8n confirmation email dispatched successfully.");
        setEmailWarning(null);
      }

      setBookingData({
        id: data.id || "AXIOM-ARCH-" + Math.floor(1000 + Math.random() * 9000),
        date: showCustomTime ? customDate : selectedDateFormatted,
        timeSlot: showCustomTime ? `${customTime} (${detectedTzShort} Requested)` : selectedTime,
        name: name.trim(),
        company: company.trim() || "Enterprise Operations",
        status: data.status || (showCustomTime ? "REQUESTED" : "CONFIRMED"),
      });
      setConfirmed(true);
      window.scrollTo({ top: 120, behavior: "smooth" });

      // Phase 2: Dispatch post-booking notification to n8n Pre-Meeting Intelligence workflow
      try {
        const p2Payload = buildAxiomPostBookingPayload({
          id: data.id || "AXIOM-ARCH-" + Date.now(),
          name: name.trim(),
          email: trimmedEmail,
          company: company.trim() || "Enterprise Operations",
          date: showCustomTime ? customDate : selectedDateFormatted,
          timeSlot: showCustomTime ? `${customTime} (${detectedTzShort} Requested)` : selectedTime,
          timeZone: timezone,
          workflowType: workflowArea,
          description: description.trim(),
        });
        postBookingToAxiom(p2Payload).catch((p2Err) => {
          console.warn("[Axiom Booking] Phase 2 post-booking background notice:", p2Err);
        });
      } catch (p2Err) {
        console.warn("[Axiom Booking] Phase 2 post-booking dispatch notice:", p2Err);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error creating booking";
      setConflictError(msg);
    } finally {
      setLoading(false);
    }
  };

  const todayIso = new Date().toISOString().split("T")[0];

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
                <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-semibold">
                      SESSION PROTOCOL
                    </span>
                    <span className="text-[11px] font-mono text-[#2563EB] font-bold">45 MINUTES</span>
                  </div>

                  <div className="space-y-4 text-[14px]">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-lg bg-blue-100 text-[#2563EB] flex items-center justify-center shrink-0 mt-0.5">
                        <GitFork className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-semibold text-[#0F172A]">Workflow Topology Audit</div>
                        <p className="text-[13px] text-slate-600 mt-0.5 leading-relaxed">
                          Analyze manual hops, webhook payloads, and retry failure rates across your tech stack.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-semibold text-[#0F172A]">HITL Security Boundaries</div>
                        <p className="text-[13px] text-slate-600 mt-0.5 leading-relaxed">
                          Define strict human-in-the-loop escalation thresholds for financial and database mutations.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Layers className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-semibold text-[#0F172A]">Deterministic Architecture Blueprint</div>
                        <p className="text-[13px] text-slate-600 mt-0.5 leading-relaxed">
                          Walk away with a concrete architectural blueprint for n8n or custom pipeline deployment.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Verification Notice */}
                <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3 shadow-lg">
                  <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>ZERO-COMPROMISE SECURITY POLICY</span>
                  </div>
                  <p className="text-[13px] text-slate-300 leading-relaxed font-normal">
                    All technical discussions are safeguarded under mutual non-disclosure. No production credentials or live access are ever requested during review sessions.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="px-2.5 py-1 rounded-md bg-slate-800 text-[10px] font-mono text-emerald-400">
                      SOC-2 TYPE II
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-slate-800 text-[10px] font-mono text-slate-300">
                      AUDIT READY
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-slate-800 text-[10px] font-mono text-blue-400">
                      SECURE DISCUSSION
                    </span>
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
                        <span className="text-[11px] font-mono text-slate-400 uppercase">
                          TIME ZONE: {timezone.toUpperCase()} ({detectedTzShort})
                        </span>
                      </div>
                    </div>
                    <span
                      className={`text-[11px] font-mono px-3 py-1 rounded-full border font-semibold flex items-center gap-1.5 ${
                        isFullyBooked
                          ? "text-amber-700 bg-amber-50 border-amber-200/80"
                          : "text-emerald-700 bg-emerald-50 border-emerald-200/80"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isFullyBooked ? "bg-amber-500" : "bg-emerald-500 animate-pulse"
                        }`}
                      />
                      {isFullyBooked ? "DAY FULL" : "SLOTS OPEN"}
                    </span>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-7">
                    {/* Date Selector Cards */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <label className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-bold">
                            1. SELECT DATE ({currentMonthYear ? currentMonthYear.toUpperCase() : "AVAILABLE DATES"})
                          </label>
                          {/* Date Navigation Controls */}
                          <div className="flex items-center gap-1 ml-1.5">
                            <button
                              type="button"
                              onClick={handlePrevDateOffset}
                              disabled={dateOffset === 0}
                              aria-label="Previous dates"
                              className="p-1 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={handleNextDateOffset}
                              aria-label="Next dates"
                              className="p-1 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-100 transition"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <span className="text-[12px] font-mono text-[#2563EB] font-semibold">
                          {selectedDateFormatted}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                        {dates.map((d) => {
                          const isSelected = selectedDateIso === d.iso;
                          return (
                            <button
                              key={d.iso}
                              type="button"
                              onClick={() => handleDateChange(d.iso)}
                              className={`py-3.5 px-2 rounded-xl text-center transition-colors duration-150 border relative overflow-hidden group ${
                                isSelected
                                  ? "bg-[#0F172A] text-white border-[#0F172A] shadow-md ring-2 ring-blue-500/40"
                                  : "bg-white text-slate-700 border-slate-200 hover:border-blue-400 hover:bg-slate-50"
                              }`}
                            >
                              <div
                                className={`text-[10px] font-mono uppercase tracking-wider ${
                                  isSelected ? "text-blue-300" : "text-slate-400"
                                }`}
                              >
                                {d.label}
                                {d.isToday ? " •" : ""}
                              </div>
                              <div className="text-[20px] font-bold tracking-tight mt-0.5">
                                {d.day}
                              </div>
                              {isSelected && (
                                <div className="absolute bottom-1.5 left-0 right-0 flex justify-center pointer-events-none">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                </div>
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
                          2. AVAILABLE TIME ({detectedTzShort})
                        </label>
                        <span className="text-[12px] font-mono text-[#2563EB] font-semibold">
                          {showCustomTime
                            ? customTime
                              ? `${customTime} (${detectedTzShort} Requested)`
                              : "Custom Time Selected"
                            : selectedTime || "Select a slot"}
                        </span>
                      </div>

                      {conflictError && (
                        <div className="mb-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[13px] flex items-center gap-2.5 animate-in fade-in duration-200">
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>{conflictError}</span>
                        </div>
                      )}

                      {!showCustomTime && isFullyBooked ? (
                        <div className="py-6 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50 space-y-2">
                          <p className="text-[13px] text-slate-600 font-medium">
                            All standard consultation slots for this date are fully reserved.
                          </p>
                          {nextAvailableDateOption && (
                            <button
                              type="button"
                              onClick={() => handleDateChange(nextAvailableDateOption.iso)}
                              className="text-[12px] font-mono text-[#2563EB] hover:underline font-semibold"
                            >
                              Jump to next available date ({nextAvailableDateOption.val}) →
                            </button>
                          )}
                        </div>
                      ) : !showCustomTime ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                          {slotsLoading && slots.length === 0 ? (
                            <div className="col-span-full py-6 text-center text-[12px] font-mono text-slate-400">
                              Loading live availability...
                            </div>
                          ) : (
                            slots.map((s) => {
                              const isSelected = selectedTime === s.fullDisplay;
                              const isAvailable = s.available;
                              return (
                                <button
                                  key={s.id}
                                  type="button"
                                  disabled={!isAvailable}
                                  onClick={() => {
                                    setSelectedTime(s.fullDisplay);
                                    setSelectedSlotId(s.id);
                                    setConflictError(null);
                                  }}
                                  className={`py-3 px-3.5 rounded-xl text-[13px] font-mono font-medium transition-all duration-200 border flex items-center justify-between group ${
                                    isSelected
                                      ? "bg-[#2563EB] text-white border-[#2563EB] shadow-sm shadow-blue-500/30"
                                      : !isAvailable
                                      ? "bg-slate-100 text-slate-400 border-slate-200 opacity-60 cursor-not-allowed line-through"
                                      : "bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50/50"
                                  }`}
                                >
                                  <span>{s.time}</span>
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      isSelected
                                        ? "bg-white"
                                        : !isAvailable
                                        ? "bg-slate-300"
                                        : "bg-emerald-400 group-hover:bg-blue-400"
                                    }`}
                                  />
                                </button>
                              );
                            })
                          )}
                        </div>
                      ) : null}

                      {/* Custom Time Option Toggle */}
                      <div className="mt-3 flex items-center justify-between pt-1">
                        <span className="text-[12px] text-slate-500">Need another time?</span>
                        <button
                          type="button"
                          onClick={() => {
                            setShowCustomTime(!showCustomTime);
                            setConflictError(null);
                          }}
                          className="text-[12px] font-mono text-[#2563EB] hover:underline font-semibold"
                        >
                          {showCustomTime ? "[ Use standard slots ]" : "[ Choose a custom time ]"}
                        </button>
                      </div>

                      {/* Custom Time Selection Form */}
                      {showCustomTime && (
                        <div className="mt-3 p-4 rounded-xl border border-blue-100 bg-blue-50/40 space-y-3 animate-in fade-in duration-200">
                          <div className="text-[12px] font-medium text-slate-700">
                            Specify your preferred date and time for an architect consultation:
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-mono text-slate-500 uppercase mb-1">
                                Preferred Date
                              </label>
                              <input
                                type="date"
                                min={todayIso}
                                value={customDate}
                                onChange={(e) => setCustomDate(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-[13px] text-slate-900 outline-none focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-mono text-slate-500 uppercase mb-1">
                                Preferred Time Window ({detectedTzShort})
                              </label>
                              <input
                                type="time"
                                value={customTime}
                                onChange={(e) => setCustomTime(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-[13px] text-slate-900 outline-none focus:border-blue-500"
                              />
                            </div>
                          </div>
                          <div className="text-[11px] font-mono text-slate-500">
                            Note: Custom time requests are dispatched to an engineering lead for direct confirmation.
                          </div>
                        </div>
                      )}
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
                      <span>
                        {loading
                          ? "Allocating Systems Engineer..."
                          : showCustomTime
                          ? "Submit Custom Time Request"
                          : "Confirm Architecture Session"}
                      </span>
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
                  {bookingData?.status === "REQUESTED"
                    ? "Custom Time Request Received"
                    : "Architecture Session Reserved"}
                </h2>

                <p className="text-[16px] text-slate-600 max-w-md mx-auto mb-8 leading-relaxed">
                  {bookingData?.status === "REQUESTED" ? (
                    <>
                      We have received your custom consultation request for{" "}
                      <strong className="text-[#0F172A] font-semibold">{bookingData?.date}</strong>. An AXIOM
                      systems specialist will review availability and confirm your calendar invite at{" "}
                      <strong className="text-[#0F172A] font-semibold">{email}</strong> within 2 hours.
                    </>
                  ) : (
                    <>
                      We have reserved your slot with an AXIOM systems specialist. A confirmation and calendar invite
                      have been sent to{" "}
                      <strong className="text-[#0F172A] font-semibold">{email}</strong>.
                    </>
                  )}
                </p>

                <div className="mb-6 p-4 rounded-xl bg-blue-50/70 border border-blue-200/70 text-[#1E293B] text-[13px] text-left max-w-md mx-auto flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#0F172A]">Pre-Meeting Architecture Intake: </span>
                    <span>
                      We&apos;ve also dispatched your preparation link to <strong className="font-semibold text-[#0F172A]">{email}</strong> so you can share your workflow context in 2–3 minutes before the session.
                    </span>
                  </div>
                </div>

                {emailWarning && (
                  <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[13px] flex items-center gap-3 text-left max-w-md mx-auto animate-in fade-in">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                    <span>{emailWarning}</span>
                  </div>
                )}

                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-left max-w-md mx-auto mb-8 space-y-3 font-mono text-[13px]">
                  <div className="flex justify-between pb-2 border-b border-slate-200">
                    <span className="text-slate-500">
                      {bookingData?.status === "REQUESTED" ? "REQUESTED DATE:" : "RESERVED DATE:"}
                    </span>
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
                    <span className="text-slate-500">STATUS:</span>
                    <span
                      className={`font-bold ${
                        bookingData?.status === "REQUESTED" ? "text-amber-600" : "text-emerald-600"
                      }`}
                    >
                      {bookingData?.status === "REQUESTED" ? "PENDING REVIEW" : "CONFIRMED"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/live-demo" className="btn-axiom-primary px-6 py-3 text-[14px] gap-2">
                    <span>Explore Live Simulator While You Wait</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => {
                      setConfirmed(false);
                      fetchAvailability(selectedDateIso);
                    }}
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
