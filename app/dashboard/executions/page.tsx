import prisma from "@/lib/prisma";
import Link from "next/link";
import { Activity, CheckCircle2, AlertCircle, Clock, XCircle, ArrowRight } from "lucide-react";

export const revalidate = 0;

export default async function ExecutionsPage() {
  const executions = await prisma.workflowExecution.findMany({
    include: {
      workflow: true,
      _count: { select: { logs: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 40,
  });

  return (
    <div className="space-y-8">
      <div>
        <div className="text-[11px] font-mono text-[#737686] uppercase tracking-wider mb-1">
          OPERATIONAL TELEMETRY
        </div>
        <h1 className="text-[26px] font-semibold text-[#0F172A] tracking-tight">
          Execution Ledger
        </h1>
        <p className="text-[14px] text-[#434655]">
          Inspect real-time execution logs, microsecond step latencies, and payload mutations.
        </p>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="bg-[#fafafa] border-b border-[#E2E8F0] text-[11px] font-mono text-[#737686] uppercase">
                <th className="py-3 px-6">Execution ID</th>
                <th className="py-3 px-4">Workflow</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Logs Count</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-6 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-sans">
              {executions.map((exec) => {
                const isDone = exec.status === "COMPLETED";
                const isWait = exec.status === "WAITING_FOR_HUMAN";
                const isFail = exec.status === "FAILED";

                return (
                  <tr key={exec.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-6 font-mono text-[12px] text-[#0F172A]">
                      {exec.id.slice(0, 10)}...
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#0F172A]">
                      {exec.workflow?.name || "Pipeline Trace"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-medium ${
                          isDone
                            ? "bg-[#ecfdf5] text-[#065f46]"
                            : isWait
                            ? "bg-[#eff4ff] text-[#2563EB]"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isDone ? "bg-[#10b981]" : isWait ? "bg-[#2563EB]" : "bg-red-500"
                          }`}
                        ></span>
                        {exec.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[12px] text-[#0F172A]">
                      {exec.durationMs > 0 ? `${exec.durationMs}ms` : "--"}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[12px] text-[#737686]">
                      {exec._count.logs} Steps
                    </td>
                    <td className="py-3.5 px-4 text-[#737686] text-[12px]">
                      {new Date(exec.startedAt).toLocaleString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <Link
                        href={`/dashboard/executions/${exec.id}`}
                        className="text-[#2563EB] hover:underline font-medium text-[12px] inline-flex items-center gap-1"
                      >
                        <span>Trace</span>
                        <ArrowRight className="w-3.5 h-3.5" />
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
