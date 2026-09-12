import { BarChart3, TrendingUp, Clock, ShieldCheck, Activity } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="text-[11px] font-mono text-[#737686] uppercase tracking-wider mb-1">
          PERFORMANCE METRICS
        </div>
        <h1 className="text-[26px] font-semibold text-[#0F172A] tracking-tight">
          System Telemetry &amp; Analytics
        </h1>
        <p className="text-[14px] text-[#434655]">
          Throughput, decision latency distributions, autonomous resolution rates, and human escalation trends.
        </p>
      </div>

      {/* Top Stat Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs">
          <div className="text-[11px] font-mono text-[#737686] uppercase mb-1">AVERAGE LATENCY</div>
          <div className="text-[26px] font-semibold text-[#2563EB] font-mono">384ms</div>
          <div className="text-[11px] text-[#006c49] font-medium mt-1">42% faster than target</div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs">
          <div className="text-[11px] font-mono text-[#737686] uppercase mb-1">AUTONOMOUS COMPLETION</div>
          <div className="text-[26px] font-semibold text-[#006c49] font-mono">99.2%</div>
          <div className="text-[11px] text-[#006c49] font-medium mt-1">Under strict policy bounds</div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs">
          <div className="text-[11px] font-mono text-[#737686] uppercase mb-1">HUMAN ESCALATION RATE</div>
          <div className="text-[26px] font-semibold text-[#0F172A] font-mono">0.8%</div>
          <div className="text-[11px] text-[#737686] mt-1">All resolved within SLA</div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs">
          <div className="text-[11px] font-mono text-[#737686] uppercase mb-1">MONTHLY THROUGHPUT</div>
          <div className="text-[26px] font-semibold text-[#0F172A] font-mono">14,820</div>
          <div className="text-[11px] text-[#2563EB] font-medium mt-1">Active enterprise nodes</div>
        </div>
      </div>

      {/* Latency & Distribution Visuals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="text-[15px] font-semibold text-[#0F172A]">
              Latency Distribution by Pipeline Stage
            </h3>
            <span className="text-[11px] font-mono text-[#737686]">P95 METRICS</span>
          </div>

          <div className="space-y-3 font-mono text-[12px]">
            <div>
              <div className="flex justify-between text-[#434655] mb-1">
                <span>1. Request Ingestion</span>
                <span className="text-[#0F172A] font-semibold">14ms</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: "12%" }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#434655] mb-1">
                <span>2. AI Intent &amp; Entity Reasoning</span>
                <span className="text-[#0F172A] font-semibold">118ms</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#2563EB] h-full rounded-full" style={{ width: "48%" }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#434655] mb-1">
                <span>3. Business Policy Matrix Check</span>
                <span className="text-[#0F172A] font-semibold">32ms</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: "20%" }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#434655] mb-1">
                <span>4. Database &amp; Tool API Mutation</span>
                <span className="text-[#0F172A] font-semibold">88ms</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: "35%" }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#434655] mb-1">
                <span>5. Dispatch Customer Reply</span>
                <span className="text-[#0F172A] font-semibold">42ms</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-teal-600 h-full rounded-full" style={{ width: "22%" }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="text-[15px] font-semibold text-[#0F172A]">
              Operational Quality Indicators
            </h3>
            <span className="text-[11px] font-mono text-[#065f46] font-semibold bg-[#ecfdf5] px-2 py-0.5 rounded">
              OPTIMAL
            </span>
          </div>

          <div className="space-y-4 text-[13px]">
            <div className="p-3.5 bg-[#fafafa] rounded-lg border border-gray-100 flex items-center justify-between">
              <div>
                <div className="font-semibold text-[#0F172A]">Zero Hallucination Tolerance</div>
                <div className="text-[12px] text-[#434655]">Strict schema enforcement on all model outputs</div>
              </div>
              <span className="font-mono text-[12px] font-bold text-[#006c49]">100%</span>
            </div>

            <div className="p-3.5 bg-[#fafafa] rounded-lg border border-gray-100 flex items-center justify-between">
              <div>
                <div className="font-semibold text-[#0F172A]">Human Escalation SLA Compliance</div>
                <div className="text-[12px] text-[#434655]">Average supervisor review turn: 18 minutes</div>
              </div>
              <span className="font-mono text-[12px] font-bold text-[#2563EB]">99.8%</span>
            </div>

            <div className="p-3.5 bg-[#fafafa] rounded-lg border border-gray-100 flex items-center justify-between">
              <div>
                <div className="font-semibold text-[#0F172A]">API Uptime &amp; Connector Health</div>
                <div className="text-[12px] text-[#434655]">Zero dropped webhooks in last 30 days</div>
              </div>
              <span className="font-mono text-[12px] font-bold text-[#006c49]">99.98%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
