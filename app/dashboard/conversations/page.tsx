import prisma from "@/lib/prisma";
import { MessageSquare, Bot, User, Wrench, Clock, CheckCircle2 } from "lucide-react";

export const revalidate = 0;

export default async function ConversationsPage() {
  const conversations = await prisma.conversation.findMany({
    include: {
      messages: {
        include: { toolCalls: true },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <div className="text-[11px] font-mono text-[#737686] uppercase tracking-wider mb-1">
          CROSS-CHANNEL INGESTION
        </div>
        <h1 className="text-[26px] font-semibold text-[#0F172A] tracking-tight">
          Customer Conversations
        </h1>
        <p className="text-[14px] text-[#434655]">
          Audit multi-turn agent interactions, intent recognition records, and executed tool calls.
        </p>
      </div>

      <div className="space-y-6">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#eff4ff] text-[#2563EB] flex items-center justify-center font-semibold text-[12px]">
                  {conv.customerName?.slice(0, 2) || "CU"}
                </div>
                <div>
                  <div className="font-semibold text-[#0F172A] text-[14px]">
                    {conv.customerName || "Customer Inquiry"}
                  </div>
                  <div className="text-[11px] font-mono text-[#737686]">
                    CHANNEL: {conv.channel} • STATUS: {conv.status}
                  </div>
                </div>
              </div>

              <div className="text-[11px] font-mono text-[#737686]">
                {new Date(conv.createdAt).toLocaleString()}
              </div>
            </div>

            {/* Conversation Messages Thread */}
            <div className="space-y-3 bg-[#fafafa] p-4 rounded-xl border border-gray-200/80">
              {conv.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === "USER" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl p-3 text-[13px] leading-relaxed shadow-xs ${
                      msg.role === "USER"
                        ? "bg-[#2563EB] text-white"
                        : "bg-white border border-[#E2E8F0] text-[#0F172A]"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] font-mono font-semibold mb-1 opacity-80">
                      {msg.role === "USER" ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                      <span>{msg.role}</span>
                    </div>
                    <p>{msg.content}</p>

                    {msg.toolCalls.map((tc) => (
                      <div
                        key={tc.id}
                        className="mt-2 p-2 bg-[#eff4ff] rounded border border-blue-200 text-[11px] font-mono text-[#2563EB] space-y-0.5"
                      >
                        <div className="flex items-center gap-1 font-semibold">
                          <Wrench className="w-3 h-3" />
                          <span>Tool: {tc.toolName} ({tc.durationMs}ms)</span>
                        </div>
                        <div className="text-[#434655] text-[10px] truncate">
                          Output: {tc.outputJson}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
