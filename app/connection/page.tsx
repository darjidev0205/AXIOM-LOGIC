import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import {
  MessageSquare,
  FileText,
  Calendar,
  LogOut,
  ShieldCheck,
  ChevronRight,
  Building2,
  Sparkles,
} from "lucide-react";
import AxiomLogo from "@/components/brand/AxiomLogo";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ConnectionPage() {
  const session = await getSession();
  if (!session) redirect("/sign-in");

  // Fetch the user's business relationship
  const businessUser = await prisma.businessUser.findFirst({
    where: { userId: session.userId },
    include: {
      business: {
        include: {
          connections: {
            include: {
              messages: {
                orderBy: { createdAt: "desc" },
                take: 5,
              },
            },
          },
          requests: {
            orderBy: { createdAt: "desc" },
            take: 5,
          },
        },
      },
    },
  });

  const business = businessUser?.business ?? null;
  const connection = business?.connections[0] ?? null;
  const messages = connection?.messages ?? [];
  const requests = business?.requests ?? [];

  // Upcoming bookings for this email
  const upcomingBookings = await prisma.booking.findMany({
    where: { email: session.email },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Technical grid background */}
      <div className="fixed inset-0 pointer-events-none select-none">
        <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="conn-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#0F172A" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#conn-grid)" />
        </svg>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)]">
        <div className="axiom-container flex items-center justify-between h-16">
          <Link href="/" aria-label="AXIOM Logic Home">
            <AxiomLogo variant="compact" theme="light" height={34} />
          </Link>

          <div className="flex items-center gap-2 text-[12px] font-mono text-slate-500 hidden sm:flex">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            PRIVATE CONNECTION ACTIVE
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[13px] text-slate-600 hidden sm:block">{session.name}</span>
            <form action="/api/auth/logout" method="POST">
              <button
                id="connection-sign-out"
                type="submit"
                className="flex items-center gap-1.5 text-[13px] font-medium text-slate-500 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 axiom-container py-10 space-y-8">

        {/* Identity & greeting */}
        <section>
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-widest mb-2">
            PRIVATE CONNECTION // {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-0 justify-between">
            <div>
              <h1 className="text-[28px] sm:text-[34px] font-bold text-[#0F172A] tracking-tight leading-tight">
                {greeting},{" "}
                <span className="text-[#2563EB]">
                  {business ? business.name : session.name}
                </span>
              </h1>
              <p className="text-[14px] text-slate-500 mt-1.5">
                You are securely connected with AXIOM.
              </p>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-700">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-[12px] font-mono font-semibold uppercase tracking-wider">SECURE CHANNEL</span>
            </div>
          </div>
        </section>

        {/* AXIOM Contact card */}
        <section className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-[0_2px_16px_-4px_rgba(15,23,42,0.06)]">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-[#2563EB]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-widest mb-1">YOUR AXIOM CONTACT</div>
              <div className="text-[16px] font-semibold text-[#0F172A]">AXIOM Solutions Team</div>
              <div className="text-[13px] text-slate-500 mt-0.5">Dedicated 1:1 relationship partner</div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  href="/book"
                  className="inline-flex items-center gap-1.5 text-[13px] font-medium text-white bg-[#2563EB] hover:bg-[#1D4ED8] px-3.5 py-2 rounded-lg transition-all shadow-sm"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Schedule Session
                </Link>
                <Link
                  href="#messages"
                  className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#2563EB] bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-lg transition-all border border-blue-100"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Send Message
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Business info — if linked */}
        {business && (
          <section className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-[0_2px_16px_-4px_rgba(15,23,42,0.06)]">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-4 h-4 text-slate-400" />
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">YOUR ORGANIZATION</div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-0.5">NAME</div>
                <div className="text-[14px] font-semibold text-[#0F172A]">{business.name}</div>
              </div>
              <div>
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-0.5">TYPE</div>
                <div className="text-[14px] font-semibold text-[#0F172A]">{business.type}</div>
              </div>
              <div>
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-0.5">STATUS</div>
                <span className={`inline-flex items-center gap-1 text-[12px] font-mono font-semibold px-2 py-0.5 rounded ${
                  business.status === "ACTIVE"
                    ? "bg-emerald-50 text-emerald-700"
                    : business.status === "PENDING"
                    ? "bg-amber-50 text-amber-700"
                    : "bg-slate-100 text-slate-600"
                }`}>
                  {business.status}
                </span>
              </div>
            </div>
          </section>
        )}

        {/* Messages */}
        <section id="messages" className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-[0_2px_16px_-4px_rgba(15,23,42,0.06)]">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#2563EB]" />
              <h2 className="text-[15px] font-semibold text-[#0F172A]">Messages</h2>
              {messages.length > 0 && (
                <span className="ml-1 text-[11px] font-mono bg-blue-50 text-[#2563EB] px-2 py-0.5 rounded-full">
                  {messages.length}
                </span>
              )}
            </div>
          </div>
          <div className="p-6">
            {messages.length > 0 ? (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-xl text-[14px] leading-relaxed ${
                      msg.senderRole === "AXIOM"
                        ? "bg-blue-50 border border-blue-100 text-[#0F172A]"
                        : "bg-slate-50 border border-slate-200/80 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                        {msg.senderRole === "AXIOM" ? "AXIOM" : "YOU"}
                      </span>
                      <span className="text-slate-300 text-[10px]">·</span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {new Date(msg.createdAt).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    {msg.body}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-slate-400">
                <MessageSquare className="w-8 h-8 mx-auto mb-3 opacity-40" />
                <p className="text-[14px]">No messages yet.</p>
                <p className="text-[12px] mt-1">Your AXIOM team will reach out here.</p>
              </div>
            )}
          </div>
        </section>

        {/* Requests */}
        <section className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-[0_2px_16px_-4px_rgba(15,23,42,0.06)]">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#2563EB]" />
            <h2 className="text-[15px] font-semibold text-[#0F172A]">Your Requests</h2>
          </div>
          <div className="p-6">
            {requests.length > 0 ? (
              <div className="space-y-3">
                {requests.map((req) => (
                  <div key={req.id} className="flex items-start justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="min-w-0">
                      <div className="text-[14px] font-semibold text-[#0F172A] truncate">{req.title}</div>
                      <div className="text-[12px] text-slate-500 mt-0.5 line-clamp-2">{req.body}</div>
                      <div className="text-[11px] font-mono text-slate-400 mt-1">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <span className={`shrink-0 text-[11px] font-mono font-semibold px-2.5 py-1 rounded-lg ${
                      req.status === "RESOLVED"
                        ? "bg-emerald-50 text-emerald-700"
                        : req.status === "IN_PROGRESS"
                        ? "bg-blue-50 text-[#2563EB]"
                        : req.status === "NEW"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-slate-100 text-slate-500"
                    }`}>
                      {req.status.replace("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-slate-400">
                <FileText className="w-8 h-8 mx-auto mb-3 opacity-40" />
                <p className="text-[14px]">No requests yet.</p>
                <p className="text-[12px] mt-1 mb-4">Your AXIOM team handles these on your behalf.</p>
                <Link
                  href="/book"
                  className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#2563EB] bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-all border border-blue-100"
                >
                  Schedule a session to get started
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Upcoming sessions */}
        <section className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-[0_2px_16px_-4px_rgba(15,23,42,0.06)]">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#2563EB]" />
            <h2 className="text-[15px] font-semibold text-[#0F172A]">Upcoming Sessions</h2>
          </div>
          <div className="p-6">
            {upcomingBookings.length > 0 ? (
              <div className="space-y-3">
                {upcomingBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center gap-4 p-4 rounded-xl bg-blue-50/60 border border-blue-100">
                    <div className="w-10 h-10 rounded-xl bg-[#2563EB]/15 flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5 text-[#2563EB]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-semibold text-[#0F172A]">{booking.workflowType} Review</div>
                      <div className="text-[12px] font-mono text-slate-500 mt-0.5">{booking.date} · {booking.timeSlot}</div>
                    </div>
                    <span className="shrink-0 text-[11px] font-mono font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700">
                      {booking.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-slate-400">
                <Calendar className="w-8 h-8 mx-auto mb-3 opacity-40" />
                <p className="text-[14px]">No upcoming sessions.</p>
                <p className="text-[12px] mt-1 mb-4">Schedule an architecture review with your AXIOM specialist.</p>
                <Link
                  href="/book"
                  className="inline-flex items-center gap-1.5 text-[13px] font-medium text-white bg-[#2563EB] hover:bg-[#1D4ED8] px-4 py-2.5 rounded-lg transition-all shadow-sm"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Schedule Architecture Review
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Footer actions */}
        <section className="flex flex-col sm:flex-row items-center gap-3 pt-2 pb-8">
          <div className="flex-1 text-[11px] font-mono text-slate-400 uppercase tracking-widest">
            AXIOM PRIVATE CHANNEL · ENCRYPTED · {new Date().getFullYear()}
          </div>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-1.5 text-[13px] font-medium text-slate-500 hover:text-red-600 px-4 py-2 rounded-lg border border-slate-200 hover:border-red-200 hover:bg-red-50 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
