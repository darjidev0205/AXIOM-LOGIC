import prisma from "@/lib/prisma";
import Link from "next/link";
import { GitBranch, Plus, Play, MoreVertical, ArrowRight } from "lucide-react";

export const revalidate = 0;

export default async function WorkflowsPage() {
  const workflows = await prisma.workflow.findMany({
    include: {
      _count: {
        select: { executions: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono text-[#737686] uppercase tracking-wider mb-1">
            PIPELINE ORCHESTRATION
          </div>
          <h1 className="text-[26px] font-semibold text-[#0F172A] tracking-tight">
            Automated Workflows
          </h1>
          <p className="text-[14px] text-[#434655]">
            Design, deploy, and inspect goal-seeking agent workflows with deterministic constraints.
          </p>
        </div>

        <Link
          href="/dashboard/workflows/new"
          className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[13px] font-medium px-4 py-2 rounded-lg transition-all flex items-center gap-2 shadow-xs self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Workflow</span>
        </Link>
      </div>

      {/* Workflows Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workflows.map((wf) => {
          let nodeCount = 5;
          try {
            const def = JSON.parse(wf.definitionJson);
            if (def.nodes) nodeCount = def.nodes.length;
          } catch {}

          return (
            <div
              key={wf.id}
              className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs flex flex-col justify-between hover:border-[#2563EB]/50 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#ecfdf5] text-[#065f46]">
                    {wf.status}
                  </span>
                  <span className="text-[11px] font-mono text-[#737686]">
                    {wf.triggerType}
                  </span>
                </div>

                <h3 className="text-[16px] font-semibold text-[#0F172A] mb-2">{wf.name}</h3>
                <p className="text-[13px] text-[#434655] line-clamp-2 mb-6">
                  {wf.description || "Production workflow pipeline with deterministic policies."}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-[12px]">
                <div className="flex items-center gap-3 text-[#737686] font-mono">
                  <span>{nodeCount} Nodes</span>
                  <span>•</span>
                  <span>{wf._count.executions} Runs</span>
                </div>

                <Link
                  href={`/dashboard/workflows/new?id=${wf.id}`}
                  className="text-[#2563EB] hover:underline font-medium inline-flex items-center gap-1"
                >
                  <span>Builder</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
