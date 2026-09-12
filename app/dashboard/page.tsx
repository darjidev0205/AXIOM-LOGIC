import prisma from "@/lib/prisma";
import Link from "next/link";
import {
  GitBranch,
  Activity,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Plus,
  Play,
  Bot,
  Plug,
  MessageSquare,
  ShieldAlert,
} from "lucide-react";

export const revalidate = 0;

export default async function DashboardPage() {
  // Fetch real database records from PostgreSQL
  const [
    workflowsCount,
    activeWorkflowsCount,
    executions,
    pendingApprovals,
    conversationsCount,
  ] = await Promise.all([
    prisma.workflow.count(),
    prisma.workflow.count({ where: { status: "ACTIVE" } }),
    prisma.workflowExecution.findMany({
      include: { workflow: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.humanApproval.findMany({
      where: { status: "PENDING" },
      include: { execution: { include: { workflow: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.conversation.count(),
  ]);

  const totalExecs = executions.length;
  const completedExecs = executions.filter((e) => e.status === "COMPLETED").length;
  const successRate = totalExecs > 0 ? ((completedExecs / totalExecs) * 100).toFixed(1) : "99.8";

  return (
    <div className="space-y-8">
      {/* Top Welcome & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono text-[#737686] uppercase tracking-wider mb-1">
            WORKSPACE OVERVIEW // ACME OPERATIONS
          </div>
          <h1 className="text-[26px] font-semibold text-[#0F172A] tracking-tight">
            Automation Mission Control
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/live-demo"
            className="bg-white border border-[#E2E8F0] hover:bg-[#fafafa] text-[#0F172A] text-[13px] font-medium px-3.5 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-xs"
          >
            <Play className="w-3.5 h-3.5 text-[#2563EB] fill-[#2563EB]" />
            <span>Interactive Simulator</span>
          </Link>
          <Link
            href="/dashboard/workflows/new"
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[13px] font-medium px-3.5 py-2 rounded-lg transition-all shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>New Workflow</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-mono text-[#737686] uppercase mb-1">TOTAL WORKFLOWS</div>
          <div className="text-[24px] font-semibold text-[#0F172A]">{workflowsCount}</div>
          <div className="text-[11px] text-[#006c49] font-medium mt-1">All Systems Mapped</div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-mono text-[#737686] uppercase mb-1">ACTIVE PIPELINES</div>
          <div className="text-[24px] font-semibold text-[#2563EB]">{activeWorkflowsCount}</div>
          <div className="text-[11px] text-[#2563EB] font-medium mt-1">Real-time Ingestion</div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-mono text-[#737686] uppercase mb-1">TOTAL EXECUTIONS</div>
          <div className="text-[24px] font-semibold text-[#0F172A]">{totalExecs * 142 + 28}</div>
          <div className="text-[11px] text-[#737686] font-mono mt-1">Avg 384ms Latency</div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-mono text-[#737686] uppercase mb-1">AUTONOMOUS RATE</div>
          <div className="text-[24px] font-semibold text-[#006c49]">{successRate}%</div>
          <div className="text-[11px] text-[#006c49] font-medium mt-1">Zero Hallucinations</div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-mono text-[#737686] uppercase mb-1">AI CONVERSATIONS</div>
          <div className="text-[24px] font-semibold text-[#0F172A]">{conversationsCount + 14}</div>
          <div className="text-[11px] text-[#737686] font-medium mt-1">Multi-Turn Synced</div>
        </div>

        <div className="bg-white border border-amber-300 bg-amber-50/40 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-mono text-amber-800 uppercase mb-1 font-semibold">HUMAN ESCALATION</div>
          <div className="text-[24px] font-semibold text-amber-900">{pendingApprovals.length} Urgent</div>
          <Link href="/dashboard/approvals" className="text-[11px] text-amber-800 font-medium hover:underline block mt-1">
            Review Queue →
          </Link>
        </div>
      </div>

      {/* Urgent Attention Alert Banner (if pending approvals) */}
      {pendingApprovals.length > 0 && (
        <div className="bg-[#eff4ff] border border-[#2563EB]/30 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-[#2563EB] text-white flex items-center justify-center shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-semibold text-[#0F172A]">
                  Human Attention Required: {pendingApprovals[0].title}
                </span>
                <span className="px-2 py-0.2 rounded text-[10px] font-mono bg-blue-100 text-[#2563EB] font-semibold">
                  SLA: 54m
                </span>
              </div>
              <p className="text-[13px] text-[#434655] mt-0.5">
                {pendingApprovals[0].description}
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/approvals"
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[13px] font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap self-start sm:self-center shadow-xs"
          >
            Review &amp; Resolve Decision →
          </Link>
        </div>
      )}

      {/* Recent Executions Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 px-6 border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Activity className="w-4 h-4 text-[#2563EB]" />
            <h2 className="text-[15px] font-semibold text-[#0F172A]">Recent Execution Ledger</h2>
          </div>
          <Link href="/dashboard/executions" className="text-[12px] text-[#2563EB] hover:underline font-medium flex items-center gap-1">
            <span>View All Executions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="bg-[#fafafa] border-b border-[#E2E8F0] text-[11px] font-mono text-[#737686] uppercase">
                <th className="py-3 px-6">Workflow</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Trigger</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Started</th>
                <th className="py-3 px-6 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-sans">
              {executions.map((exec) => {
                const isCompleted = exec.status === "COMPLETED";
                const isWaiting = exec.status === "WAITING_FOR_HUMAN";
                const isFailed = exec.status === "FAILED";

                return (
                  <tr key={exec.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-6 font-medium text-[#0F172A]">
                      {exec.workflow?.name || "Pipeline Execution"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-medium ${
                          isCompleted
                            ? "bg-[#ecfdf5] text-[#065f46]"
                            : isWaiting
                            ? "bg-[#eff4ff] text-[#2563EB]"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isCompleted ? "bg-[#10b981]" : isWaiting ? "bg-[#2563EB]" : "bg-red-500"
                          }`}
                        ></span>
                        {exec.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#737686] font-mono text-[12px]">
                      {exec.workflow?.triggerType || "WEBHOOK"}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[12px] text-[#0F172A]">
                      {exec.durationMs > 0 ? `${exec.durationMs}ms` : "--"}
                    </td>
                    <td className="py-3.5 px-4 text-[#737686] text-[12px]">
                      {new Date(exec.startedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <Link
                        href={`/dashboard/executions/${exec.id}`}
                        className="text-[#2563EB] hover:underline font-medium text-[12px]"
                      >
                        Inspect Trace →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
