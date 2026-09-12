"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GitBranch,
  Activity,
  AlertCircle,
  Bot,
  Plug,
  MessageSquare,
  BarChart2,
  Settings,
  ArrowUpRight,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";
import AxiomSymbol from "@/components/brand/AxiomSymbol";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [activeOrg, setActiveOrg] = useState("Acme Operations");

  const navItems = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Workflows", href: "/dashboard/workflows", icon: GitBranch },
    { label: "Executions", href: "/dashboard/executions", icon: Activity },
    {
      label: "Approvals",
      href: "/dashboard/approvals",
      icon: AlertCircle,
      badge: "2",
      badgeColor: "bg-blue-100 text-blue-800",
    },
    { label: "AI Agents", href: "/dashboard/agents", icon: Bot },
    { label: "Integrations", href: "/dashboard/integrations", icon: Plug },
    { label: "Conversations", href: "/dashboard/conversations", icon: MessageSquare },
    { label: "Analytics", href: "/dashboard/analytics", icon: BarChart2 },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-[#f8f9ff] text-[#0F172A]">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-[#E2E8F0] flex flex-col shrink-0 hidden md:flex">
        {/* Top Org Switcher */}
        <div className="p-4 border-b border-[#E2E8F0]">
          <Link href="/" className="flex items-center gap-2.5 mb-3 group">
            <AxiomSymbol size={26} theme="light" />
            <div className="flex flex-col leading-none">
              <span className="font-bold text-[15px] tracking-tight text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                AXIOM Logic
              </span>
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest mt-0.5">
                CONSOLE
              </span>
            </div>
          </Link>

          <div className="bg-[#eff4ff] border border-blue-200 rounded-lg p-2.5 flex items-center justify-between cursor-pointer hover:bg-blue-100/50 transition-colors">
            <div className="truncate">
              <div className="text-[12px] font-semibold text-[#0F172A] truncate">{activeOrg}</div>
              <div className="text-[10px] font-mono text-[#2563EB]">Enterprise Scale</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#737686]" />
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
                  isActive
                    ? "bg-[#eff4ff] text-[#2563EB] font-semibold"
                    : "text-[#434655] hover:bg-gray-100 hover:text-[#0F172A]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#2563EB]" : "text-[#737686]"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom User & Live Demo Link */}
        <div className="p-4 border-t border-[#E2E8F0] space-y-3">
          <Link
            href="/live-demo"
            className="flex items-center justify-between p-2 rounded-lg bg-[#fafafa] border border-[#E2E8F0] hover:bg-gray-100 text-[12px] font-medium text-[#434655] transition-colors"
          >
            <span>Live Trace Sandbox</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#2563EB]" />
          </Link>

          <div className="flex items-center gap-2.5 pt-1">
            <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-semibold text-[12px]">
              MV
            </div>
            <div className="truncate">
              <div className="text-[12px] font-semibold text-[#0F172A] truncate">Marcus Vance</div>
              <div className="text-[10px] font-mono text-[#737686]">Organization Owner</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Mobile Header Bar */}
        <div className="md:hidden bg-white border-b border-[#E2E8F0] p-3 px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <AxiomSymbol size={22} theme="light" />
            <span className="font-bold text-[14px] text-[#0F172A]">AXIOM Logic</span>
          </Link>
          <div className="flex items-center gap-2 overflow-x-auto text-[12px]">
            <Link href="/dashboard" className="px-2 py-1 bg-[#eff4ff] text-[#2563EB] rounded font-medium">
              Overview
            </Link>
            <Link href="/dashboard/approvals" className="px-2 py-1 text-[#434655] rounded">
              Approvals (2)
            </Link>
            <Link href="/dashboard/workflows" className="px-2 py-1 text-[#434655] rounded">
              Workflows
            </Link>
          </div>
        </div>

        {/* Dynamic Page Container */}
        <main className="flex-1 p-6 lg:p-8 max-w-[1440px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
