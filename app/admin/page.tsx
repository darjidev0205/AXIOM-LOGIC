import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  Users,
  MessageSquare,
  Calendar,
  FileText,
  Activity,
  LogOut,
  ShieldCheck,
  ChevronRight,
  CircleDot,
} from "lucide-react";
import { getSession, isAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPortalPage() {
  const session = await getSession();
  if (!session || !isAdmin(session)) redirect("/admin/login");

  // Fetch admin overview stats — all data accessible to admin
  const [
    totalBusinesses,
    activeBusinesses,
    totalUsers,
    totalConnections,
    totalBookings,
    recentAuditLogs,
    pendingApprovals,
    recentBusinesses,
  ] = await Promise.all([
    prisma.business.count(),
    prisma.business.count({ where: { status: "ACTIVE" } }),
    prisma.user.count(),
    prisma.connection.count(),
    prisma.booking.count(),
    prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.humanApproval.count({ where: { status: "PENDING" } }),
    prisma.business.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { businessUsers: { include: { user: true } } },
    }),
  ]);

  const stats = [
    { label: "BUSINESSES", value: totalBusinesses, sub: `${activeBusinesses} active`, color: "blue" },
    { label: "USERS", value: totalUsers, sub: "registered accounts", color: "emerald" },
    { label: "CONNECTIONS", value: totalConnections, sub: "active 1:1 channels", color: "blue" },
    { label: "BOOKINGS", value: totalBookings, sub: "total sessions", color: "emerald" },
    { label: "PENDING APPROVALS", value: pendingApprovals, sub: "require action", color: pendingApprovals > 0 ? "amber" : "slate" },
  ];

  return (
    <div className="min-h-screen bg-[#0A0F1A]">
      {/* Dark grid */}
      <div className="fixed inset-0 pointer-events-none">
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="admin-portal-grid" width="56" height="56" patternUnits="userSpaceOnUse">
              <path d="M 56 0 L 0 0 0 56" fill="none" stroke="#3B82F6" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#admin-portal-grid)" />
        </svg>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/8 bg-[#0A0F1A]/95 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#2563EB] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-[12px] font-bold text-white tracking-[0.1em] font-mono uppercase leading-none">AXIOM LOGIC</div>
              <div className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">Admin Portal</div>
            </div>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-1 text-[12px] font-mono">
            {[
              { label: "BUSINESSES", href: "/admin" },
              { label: "USERS", href: "/admin" },
              { label: "CONNECTIONS", href: "/admin" },
              { label: "BOOKINGS", href: "/admin" },
              { label: "AUDIT", href: "/admin" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="px-3 py-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-[12px] font-mono text-slate-500">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              {session.name}
            </div>
            <form action="/api/auth/logout" method="POST">
              <button
                id="admin-sign-out"
                type="submit"
                className="flex items-center gap-1.5 text-[12px] font-mono text-slate-600 hover:text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-950/30 transition-all border border-transparent hover:border-red-900/40"
              >
                <LogOut className="w-3.5 h-3.5" />
                SIGN OUT
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 max-w-[1400px] mx-auto px-6 py-10 space-y-8">

        {/* Title */}
        <section>
          <div className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-2">
            ADMIN PORTAL // {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </div>
          <h1 className="text-[26px] sm:text-[32px] font-bold text-white tracking-tight">
            AXIOM Control Center
          </h1>
          <p className="text-[14px] text-slate-500 mt-1">
            Manage businesses, users, connections, and operations.
          </p>
        </section>

        {/* Stats grid */}
        <section className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-[#111827] border border-white/6 rounded-xl p-4"
            >
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">{stat.label}</div>
              <div className={`text-[24px] font-bold ${
                stat.color === "blue" ? "text-[#2563EB]"
                : stat.color === "emerald" ? "text-emerald-400"
                : stat.color === "amber" ? "text-amber-400"
                : "text-slate-400"
              }`}>
                {stat.value}
              </div>
              <div className="text-[11px] text-slate-600 mt-0.5">{stat.sub}</div>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent Businesses */}
          <div className="lg:col-span-2 bg-[#111827] border border-white/6 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#2563EB]" />
                <h2 className="text-[14px] font-semibold text-white">Businesses</h2>
              </div>
              <span className="text-[11px] font-mono text-slate-600">{totalBusinesses} TOTAL</span>
            </div>

            {recentBusinesses.length > 0 ? (
              <div className="divide-y divide-white/4">
                {recentBusinesses.map((biz) => (
                  <div key={biz.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/2 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[#2563EB]/15 flex items-center justify-center shrink-0">
                        <Building2 className="w-4 h-4 text-[#2563EB]" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[14px] font-semibold text-white truncate">{biz.name}</div>
                        <div className="text-[12px] text-slate-500 font-mono">{biz.type} · {biz.businessUsers.length} user(s)</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-[11px] font-mono font-semibold px-2.5 py-1 rounded-lg ${
                        biz.status === "ACTIVE" ? "bg-emerald-900/40 text-emerald-400"
                        : biz.status === "PENDING" ? "bg-amber-900/40 text-amber-400"
                        : "bg-slate-800 text-slate-500"
                      }`}>
                        {biz.status}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-600" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-6 py-12 text-center text-slate-600">
                <Building2 className="w-8 h-8 mx-auto mb-3 opacity-40" />
                <p className="text-[14px]">No businesses yet.</p>
                <p className="text-[12px] mt-1">Create a business to get started.</p>
              </div>
            )}
          </div>

          {/* Audit Log */}
          <div className="bg-[#111827] border border-white/6 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/6 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#2563EB]" />
              <h2 className="text-[14px] font-semibold text-white">Audit Log</h2>
            </div>
            <div className="divide-y divide-white/4">
              {recentAuditLogs.length > 0 ? (
                recentAuditLogs.map((log) => (
                  <div key={log.id} className="px-5 py-3 flex items-start gap-3">
                    <CircleDot className="w-3.5 h-3.5 text-slate-600 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[12px] font-mono text-slate-300">{log.action}</div>
                      <div className="text-[11px] font-mono text-slate-600">
                        {new Date(log.createdAt).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-5 py-8 text-center text-slate-600">
                  <Activity className="w-6 h-6 mx-auto mb-2 opacity-40" />
                  <p className="text-[13px]">No audit events yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick links */}
        <section>
          <div className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-4">QUICK ACTIONS</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: Building2, label: "Manage Businesses", desc: "View & configure" },
              { icon: Users, label: "Manage Users", desc: "Access & roles" },
              { icon: MessageSquare, label: "Connections", desc: "1:1 channels" },
              { icon: Calendar, label: "Bookings", desc: "Sessions & meetings" },
              { icon: FileText, label: "Requests", desc: "Active & pending" },
              { icon: Activity, label: "Executions", desc: "Workflow runs", href: "/dashboard" },
              { icon: ShieldCheck, label: "Security", href: "/security" },
              { icon: LogOut, label: "Sign Out", isLogout: true },
            ].map((action, i) => {
              if (action.isLogout) {
                return (
                  <form key={i} action="/api/auth/logout" method="POST">
                    <button
                      type="submit"
                      className="w-full text-left bg-[#111827] border border-white/6 hover:border-red-900/40 rounded-xl p-4 transition-all hover:bg-red-950/20 group"
                    >
                      <action.icon className="w-4 h-4 text-red-500 mb-2" />
                      <div className="text-[13px] font-semibold text-slate-400 group-hover:text-red-400">{action.label}</div>
                    </button>
                  </form>
                );
              }
              return (
                <Link
                  key={i}
                  href={action.href ?? "/admin"}
                  className="bg-[#111827] border border-white/6 hover:border-[#2563EB]/30 rounded-xl p-4 transition-all hover:bg-[#2563EB]/5 group"
                >
                  <action.icon className="w-4 h-4 text-[#2563EB] mb-2" />
                  <div className="text-[13px] font-semibold text-white">{action.label}</div>
                  {action.desc && (
                    <div className="text-[11px] text-slate-600 mt-0.5">{action.desc}</div>
                  )}
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
