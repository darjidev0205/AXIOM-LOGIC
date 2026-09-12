import prisma from "@/lib/prisma";
import { Bot, Cpu, Plus, Wrench, Shield, CheckCircle2 } from "lucide-react";

export const revalidate = 0;

export default async function AgentsPage() {
  const agents = await prisma.agent.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono text-[#737686] uppercase tracking-wider mb-1">
            AUTONOMOUS OPERATORS
          </div>
          <h1 className="text-[26px] font-semibold text-[#0F172A] tracking-tight">
            AI Agent Fleet
          </h1>
          <p className="text-[14px] text-[#434655]">
            Configure instructions, tool permissions, temperature, and fallback behaviors for deployed agents.
          </p>
        </div>

        <button
          onClick={undefined}
          className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[13px] font-medium px-4 py-2 rounded-lg transition-all flex items-center gap-2 shadow-xs self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Deploy New Agent</span>
        </button>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => {
          let toolList: Array<{ name?: string; description?: string } | string> = [];
          try {
            toolList = JSON.parse(agent.tools);
          } catch {}

          return (
            <div
              key={agent.id}
              className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs flex flex-col justify-between hover:border-[#2563EB]/50 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#eff4ff] text-[#2563EB] flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#ecfdf5] text-[#065f46]">
                    {agent.status}
                  </span>
                </div>

                <h3 className="text-[17px] font-semibold text-[#0F172A]">{agent.name}</h3>
                <div className="text-[12px] text-[#2563EB] font-medium mb-3">{agent.role}</div>

                <p className="text-[13px] text-[#434655] leading-relaxed mb-4 line-clamp-3">
                  {agent.instructions}
                </p>

                {/* Model & Temp badge */}
                <div className="flex items-center gap-2 font-mono text-[11px] mb-4">
                  <span className="px-2 py-0.5 rounded bg-gray-100 text-[#0F172A] font-semibold">
                    {agent.model}
                  </span>
                  <span className="text-[#737686]">Temp: {agent.temperature}</span>
                </div>

                {/* Permitted Tools */}
                <div className="space-y-1.5 pt-3 border-t border-gray-100">
                  <div className="text-[10px] font-mono text-[#737686] uppercase">
                    AUTHORIZED TOOLS ({toolList.length})
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {toolList.map((t, idx) => {
                      const toolName = typeof t === "string" ? t : t?.name || "Tool";
                      const toolDesc = typeof t === "object" ? t?.description : undefined;
                      return (
                        <span
                          key={idx}
                          title={toolDesc}
                          className="px-2 py-0.5 rounded bg-[#eff4ff] text-[#2563EB] text-[10px] font-mono"
                        >
                          {toolName}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-gray-100 flex items-center justify-between text-[12px]">
                <span className="text-[#737686] font-mono text-[11px]">Zero-Drift Verified</span>
                <button className="text-[#2563EB] hover:underline font-medium">
                  Configure Agent →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
