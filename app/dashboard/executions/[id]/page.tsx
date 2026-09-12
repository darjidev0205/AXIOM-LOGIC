import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, CheckCircle2, AlertCircle, Terminal, Layers } from "lucide-react";

export const revalidate = 0;

export default async function ExecutionDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const execution = await prisma.workflowExecution.findUnique({
    where: { id },
    include: {
      workflow: true,
      logs: { orderBy: { createdAt: "asc" } },
      approvals: true,
    },
  });

  if (!execution) {
    notFound();
  }

  const isDone = execution.status === "COMPLETED";
  const isWait = execution.status === "WAITING_FOR_HUMAN";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/executions"
          className="p-1.5 rounded-lg border border-[#E2E8F0] hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#434655]" />
        </Link>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                isDone
                  ? "bg-[#ecfdf5] text-[#065f46]"
                  : isWait
                  ? "bg-[#eff4ff] text-[#2563EB]"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {execution.status}
            </span>
            <span className="text-[11px] font-mono text-[#737686]">
              EXECUTION ID: {execution.id}
            </span>
          </div>
          <h1 className="text-[22px] font-semibold text-[#0F172A]">
            {execution.workflow?.name || "Pipeline Trace"}
          </h1>
        </div>
      </div>

      {/* Metadata Overview Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4">
          <div className="text-[10px] font-mono text-[#737686] uppercase mb-1">TOTAL DURATION</div>
          <div className="text-[18px] font-semibold text-[#0F172A] font-mono">
            {execution.durationMs > 0 ? `${execution.durationMs}ms` : "--"}
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4">
          <div className="text-[10px] font-mono text-[#737686] uppercase mb-1">RECORDED STEPS</div>
          <div className="text-[18px] font-semibold text-[#0F172A] font-mono">
            {execution.logs.length} Nodes
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4">
          <div className="text-[10px] font-mono text-[#737686] uppercase mb-1">STARTED AT</div>
          <div className="text-[13px] font-medium text-[#0F172A]">
            {new Date(execution.startedAt).toLocaleTimeString()}
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4">
          <div className="text-[10px] font-mono text-[#737686] uppercase mb-1">HUMAN ESCALATION</div>
          <div className="text-[13px] font-medium text-[#2563EB]">
            {execution.approvals.length > 0 ? "Flagged for Review" : "Autonomous Passed"}
          </div>
        </div>
      </div>

      {/* Execution Trace Timeline */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-2 text-[14px] font-semibold text-[#0F172A] pb-3 border-b border-gray-100">
          <Layers className="w-4 h-4 text-[#2563EB]" />
          <span>Step-by-Step Telemetry Trace</span>
        </div>

        <div className="space-y-4">
          {execution.logs.map((log, idx) => (
            <div key={log.id} className="flex items-start gap-4">
              <div className="w-7 h-7 rounded-full bg-[#eff4ff] text-[#2563EB] flex items-center justify-center font-mono text-[11px] font-semibold shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <div className="flex-1 p-4 rounded-xl border border-[#E2E8F0] bg-[#fafafa]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-[#0F172A] text-[13px]">{log.stepName}</span>
                  <span className="font-mono text-[11px] text-[#065f46] font-semibold bg-[#ecfdf5] px-2 py-0.5 rounded">
                    +{log.latencyMs}ms
                  </span>
                </div>
                <p className="text-[13px] text-[#434655] font-sans">{log.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input & Output Raw Payloads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs font-mono text-[12px]">
          <div className="text-[11px] font-semibold text-[#737686] uppercase mb-2">
            INBOUND PAYLOAD (INPUT)
          </div>
          <pre className="p-3 bg-[#fafafa] rounded border border-gray-200 overflow-x-auto text-[#0F172A] whitespace-pre-wrap">
            {execution.inputData || "{}"}
          </pre>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs font-mono text-[12px]">
          <div className="text-[11px] font-semibold text-[#737686] uppercase mb-2">
            MUTATED OUTCOME (OUTPUT)
          </div>
          <pre className="p-3 bg-[#fafafa] rounded border border-gray-200 overflow-x-auto text-[#2563EB] whitespace-pre-wrap">
            {execution.outputData || "{}"}
          </pre>
        </div>
      </div>
    </div>
  );
}
