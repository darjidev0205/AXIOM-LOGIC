"use client";

import { useState, useEffect } from "react";
import {
  AlertCircle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  FileText,
} from "lucide-react";

interface ApprovalItem {
  id: string;
  title: string;
  description: string;
  proposedAction: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "REQUEST_INFO";
  reviewedBy?: string;
  decisionNote?: string;
  createdAt: string;
  execution?: {
    id: string;
    status: string;
    workflow?: {
      name: string;
    };
  };
}

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/approvals");
      if (res.ok) {
        const data = await res.json();
        setApprovals(data);
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleDecision = async (
    id: string,
    decision: "APPROVED" | "REJECTED" | "REQUEST_INFO",
    note?: string
  ) => {
    try {
      setActionLoading(id);
      const res = await fetch(`/api/approvals/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decision,
          reviewedBy: "Marcus Vance (Supervisor)",
          decisionNote: note || `Action ${decision.toLowerCase()} by supervisor`,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit decision");
      await fetchApprovals();
    } catch {
      alert("Failed to update approval status. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const pendingList = approvals.filter((a) => a.status === "PENDING");
  const resolvedList = approvals.filter((a) => a.status !== "PENDING");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono text-[#737686] uppercase tracking-wider mb-1">
            HUMAN-IN-THE-LOOP GOVERNANCE
          </div>
          <h1 className="text-[26px] font-semibold text-[#0F172A] tracking-tight">
            Escalation &amp; Approval Queue
          </h1>
          <p className="text-[14px] text-[#434655]">
            Intervene when human judgment, financial authorizations, or exceptions are required.
          </p>
        </div>

        <button
          onClick={fetchApprovals}
          className="self-start sm:self-center bg-white border border-[#E2E8F0] hover:bg-gray-50 text-[#0F172A] px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors flex items-center gap-2 shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#2563EB] ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Active Pending Escalations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
            <h2 className="text-[16px] font-semibold text-[#0F172A]">
              Pending Supervisor Review ({pendingList.length})
            </h2>
          </div>
          <span className="text-[11px] font-mono text-[#737686]">SLA GUARANTEE: &lt; 2 HOURS</span>
        </div>

        {pendingList.length === 0 && !loading && (
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-12 text-center">
            <CheckCircle2 className="w-10 h-10 text-[#10b981] mx-auto mb-3" />
            <h3 className="text-[16px] font-semibold text-[#0F172A]">All Escalations Resolved</h3>
            <p className="text-[13px] text-[#434655] mt-1 max-w-sm mx-auto">
              Autonomous pipelines are running with 100% policy compliance. No manual intervention required right now.
            </p>
          </div>
        )}

        {pendingList.map((item) => (
          <div
            key={item.id}
            className="bg-white border-2 border-blue-200 rounded-xl p-6 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 pb-4 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-100 text-amber-800">
                    ATTENTION REQUIRED
                  </span>
                  <span className="text-[11px] font-mono text-[#737686]">
                    PIPELINE: {item.execution?.workflow?.name || "Customer Operations"}
                  </span>
                </div>
                <h3 className="text-[18px] font-semibold text-[#0F172A]">{item.title}</h3>
                <p className="text-[13px] text-[#434655] mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="text-[11px] font-mono text-[#737686] shrink-0 text-right">
                <div>Escalated: {new Date(item.createdAt).toLocaleTimeString()}</div>
                <div className="text-amber-700 font-semibold mt-0.5">SLA: 54m Remaining</div>
              </div>
            </div>

            {/* Proposed Action Box */}
            <div className="p-3.5 bg-[#eff4ff] rounded-lg border border-blue-200 space-y-1">
              <div className="text-[11px] font-mono text-[#2563EB] font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>PROPOSED AI ACTION (PENDING YOUR AUTHORIZATION):</span>
              </div>
              <p className="text-[13px] text-[#0F172A] font-sans font-medium">
                {item.proposedAction}
              </p>
            </div>

            {/* Decision Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="text-[11px] font-mono text-[#737686]">
                Reviewer: <strong className="text-[#0F172A]">Marcus Vance (Owner)</strong>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleDecision(
                      item.id,
                      "REQUEST_INFO",
                      "Requesting courier inspection photos before final refund release."
                    )
                  }
                  disabled={actionLoading === item.id}
                  className="bg-white hover:bg-gray-50 border border-[#E2E8F0] text-[#434655] px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors flex items-center gap-1.5"
                >
                  <HelpCircle className="w-4 h-4 text-[#737686]" />
                  <span>Request More Info</span>
                </button>

                <button
                  onClick={() =>
                    handleDecision(
                      item.id,
                      "REJECTED",
                      "Refund rejected due to package already dispatched to local delivery unit."
                    )
                  }
                  disabled={actionLoading === item.id}
                  className="bg-white hover:bg-red-50 border border-red-200 text-red-700 px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors flex items-center gap-1.5"
                >
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span>Reject Action</span>
                </button>

                <button
                  onClick={() =>
                    handleDecision(
                      item.id,
                      "APPROVED",
                      "Authorized Stripe customer refund of ₹1,499 ($340.00)."
                    )
                  }
                  disabled={actionLoading === item.id}
                  className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>{actionLoading === item.id ? "Applying..." : "Approve & Resume Flow"}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Historical Resolved Escalations */}
      {resolvedList.length > 0 && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-xs">
          <div className="p-4 px-6 border-b border-[#E2E8F0] bg-[#fafafa]">
            <h3 className="text-[14px] font-semibold text-[#0F172A]">
              Historical Decisions &amp; Supervisor Audit Trail
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {resolvedList.map((item) => (
              <div key={item.id} className="p-4 px-6 flex items-center justify-between text-[13px]">
                <div>
                  <div className="font-semibold text-[#0F172A]">{item.title}</div>
                  <div className="text-[12px] text-[#434655] mt-0.5">
                    {item.decisionNote || "Decision recorded"}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-[12px]">
                  <span
                    className={`font-mono text-[11px] px-2 py-0.5 rounded font-semibold ${
                      item.status === "APPROVED"
                        ? "bg-[#ecfdf5] text-[#065f46]"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {item.status}
                  </span>
                  <span className="text-[#737686]">{item.reviewedBy || "Supervisor"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
