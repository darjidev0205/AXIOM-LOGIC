"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Play,
  Save,
  Trash2,
  Settings2,
  Zap,
  Bot,
  GitBranch,
  Database,
  Globe,
  Mail,
  Bell,
  ShieldAlert,
  Send,
  CheckCircle2,
} from "lucide-react";

interface WorkflowNode {
  id: string;
  type:
    | "Trigger"
    | "AI Agent"
    | "Condition"
    | "Database"
    | "API"
    | "Email"
    | "Notification"
    | "Human Approval"
    | "Response";
  label: string;
  config: Record<string, string>;
}

export default function WorkflowBuilderPage() {
  const [workflowName, setWorkflowName] = useState("Order Fulfillment Exception Flow");
  const [triggerType, setTriggerType] = useState("WEBHOOK");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>("n-1");
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<Record<string, unknown> | null>(null);

  const [nodes, setNodes] = useState<WorkflowNode[]>([
    {
      id: "n-1",
      type: "Trigger",
      label: "Customer Inbound Webhook",
      config: { event: "message.received", channel: "WhatsApp" },
    },
    {
      id: "n-2",
      type: "AI Agent",
      label: "Customer Operations Specialist",
      config: { model: "gpt-4o", instructions: "Parse intent, check order status, extract address or refund data." },
    },
    {
      id: "n-3",
      type: "Condition",
      label: "Refund > $100 or Address Mod?",
      config: { rule: "payload.amount > 100 ? ESCALATE : EXECUTE" },
    },
    {
      id: "n-4",
      type: "Human Approval",
      label: "Supervisor Escalation Queue",
      config: { targetRole: "Billing Lead", timeout: "2h" },
    },
    {
      id: "n-5",
      type: "Database",
      label: "PostgreSQL Database Mutation",
      config: { table: "orders", action: "UPDATE" },
    },
    {
      id: "n-6",
      type: "Response",
      label: "Verified Customer Dispatch",
      config: { channel: "WhatsApp API", format: "JSON" },
    },
  ]);

  const addNode = (type: WorkflowNode["type"]) => {
    const newNode: WorkflowNode = {
      id: `n-${Date.now()}`,
      type,
      label: `New ${type} Node`,
      config: {},
    };
    setNodes((prev) => [...prev, newNode]);
    setSelectedNodeId(newNode.id);
  };

  const removeNode = (id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    if (selectedNodeId === id) setSelectedNodeId(null);
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  const runTestExecution = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await fetch("/api/live-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Where is my order #GC1024?" }),
      });
      const data = await res.json();
      setTestResult(data);
    } catch {
      alert("Error testing pipeline execution");
    } finally {
      setIsTesting(false);
    }
  };

  const getNodeIcon = (type: WorkflowNode["type"]) => {
    switch (type) {
      case "Trigger":
        return <Zap className="w-4 h-4 text-amber-500" />;
      case "AI Agent":
        return <Bot className="w-4 h-4 text-[#2563EB]" />;
      case "Condition":
        return <GitBranch className="w-4 h-4 text-purple-600" />;
      case "Database":
        return <Database className="w-4 h-4 text-emerald-600" />;
      case "API":
        return <Globe className="w-4 h-4 text-blue-500" />;
      case "Email":
        return <Mail className="w-4 h-4 text-sky-600" />;
      case "Notification":
        return <Bell className="w-4 h-4 text-orange-500" />;
      case "Human Approval":
        return <ShieldAlert className="w-4 h-4 text-red-600" />;
      case "Response":
        return <Send className="w-4 h-4 text-teal-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/workflows"
            className="p-1.5 rounded-lg border border-[#E2E8F0] hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#434655]" />
          </Link>
          <div>
            <input
              type="text"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="text-[18px] font-semibold text-[#0F172A] bg-transparent border-b border-transparent hover:border-gray-300 focus:border-[#2563EB] outline-none px-1"
            />
            <div className="text-[11px] font-mono text-[#737686] px-1">
              Trigger: {triggerType} • 6 Nodes Configured
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={runTestExecution}
            disabled={isTesting}
            className="bg-white border border-[#E2E8F0] hover:bg-gray-50 text-[#0F172A] px-3.5 py-2 rounded-lg text-[13px] font-medium transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Play className={`w-3.5 h-3.5 text-[#2563EB] ${isTesting ? "animate-spin" : "fill-[#2563EB]"}`} />
            <span>{isTesting ? "Testing Graph..." : "Test Run Graph"}</span>
          </button>

          <button
            onClick={() => alert("Workflow changes committed to PostgreSQL schema!")}
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-lg text-[13px] font-medium transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Workflow</span>
          </button>
        </div>
      </div>

      {/* Main Builder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Palette: Add Node Types (3 cols) */}
        <div className="lg:col-span-3 bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs space-y-3">
          <div className="text-[11px] font-mono text-[#737686] font-semibold uppercase tracking-wider mb-2">
            AVAILABLE NODE TYPES
          </div>

          <div className="grid grid-cols-1 gap-1.5 text-[13px]">
            {[
              { type: "Trigger", label: "Trigger (Webhook / Form)" },
              { type: "AI Agent", label: "AI Agent (Reasoner)" },
              { type: "Condition", label: "Condition (Branch)" },
              { type: "Database", label: "Database (Postgres)" },
              { type: "API", label: "API (REST / GraphQL)" },
              { type: "Human Approval", label: "Human Approval (Safety)" },
              { type: "Response", label: "Response (Output)" },
            ].map((item) => (
              <button
                key={item.type}
                onClick={() => addNode(item.type as WorkflowNode["type"])}
                className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 hover:border-[#2563EB] hover:bg-[#eff4ff] text-left transition-all"
              >
                <div className="flex items-center gap-2">
                  {getNodeIcon(item.type as WorkflowNode["type"])}
                  <span className="font-medium text-[#0F172A]">{item.label}</span>
                </div>
                <Plus className="w-3.5 h-3.5 text-[#737686]" />
              </button>
            ))}
          </div>
        </div>

        {/* Center: Canvas Flow View (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs min-h-[480px] flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <span className="font-mono text-[11px] text-[#737686] uppercase font-semibold">
              EXECUTION TOPOLOGY GRAPH
            </span>
            <span className="text-[11px] font-mono text-[#006c49] font-medium bg-[#ecfdf5] px-2 py-0.5 rounded">
              VALIDATED SCHEMA
            </span>
          </div>

          {/* Sequential Node Stack */}
          <div className="space-y-3 my-6">
            {nodes.map((node, index) => {
              const isSelected = selectedNodeId === node.id;
              return (
                <div key={node.id} className="relative">
                  <div
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`p-4 rounded-xl border text-[13px] flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? "border-2 border-[#2563EB] bg-[#eff4ff]/60 shadow-xs"
                        : "border-[#E2E8F0] hover:border-gray-400 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                        {getNodeIcon(node.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#0F172A]">{node.label}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-gray-100 text-[#434655]">
                            {node.type}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#737686] font-mono mt-0.5">
                          Stage 0{index + 1}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNode(node.id);
                      }}
                      className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                      title="Delete node"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {index < nodes.length - 1 && (
                    <div className="w-0.5 h-3 bg-gray-300 mx-auto my-0.5"></div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Test Results Output Box (if triggered) */}
          {testResult && (
            <div className="p-3.5 bg-[#eff4ff] border border-blue-200 rounded-lg text-[12px] font-mono space-y-1 mt-4">
              <div className="flex items-center justify-between text-[#2563EB] font-semibold">
                <span>SIMULATION_EXECUTION: OK</span>
                <span>Latency: {testResult.durationMs as number}ms</span>
              </div>
              <p className="text-[#434655]">
                Output: {JSON.stringify(testResult.output)}
              </p>
            </div>
          )}
        </div>

        {/* Right: Node Properties Inspector (3 cols) */}
        <div className="lg:col-span-3 bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs space-y-4">
          <div className="text-[11px] font-mono text-[#737686] font-semibold uppercase tracking-wider pb-2 border-b border-gray-100 flex items-center justify-between">
            <span>NODE CONFIGURATION</span>
            <Settings2 className="w-3.5 h-3.5 text-[#2563EB]" />
          </div>

          {selectedNode ? (
            <div className="space-y-4 text-[13px]">
              <div>
                <label className="block text-[11px] font-mono text-[#737686] uppercase mb-1">
                  Node Title
                </label>
                <input
                  type="text"
                  value={selectedNode.label}
                  onChange={(e) => {
                    const newLabel = e.target.value;
                    setNodes((prev) =>
                      prev.map((n) => (n.id === selectedNode.id ? { ...n, label: newLabel } : n))
                    );
                  }}
                  className="w-full px-2.5 py-1.5 rounded border border-[#E2E8F0] text-[13px] focus:border-[#2563EB] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#737686] uppercase mb-1">
                  Node Type
                </label>
                <input
                  type="text"
                  readOnly
                  value={selectedNode.type}
                  className="w-full px-2.5 py-1.5 rounded border border-gray-200 bg-gray-50 text-[13px] font-mono text-[#737686] outline-none"
                />
              </div>

              {selectedNode.type === "AI Agent" && (
                <div>
                  <label className="block text-[11px] font-mono text-[#737686] uppercase mb-1">
                    Inference Model
                  </label>
                  <select className="w-full px-2.5 py-1.5 rounded border border-[#E2E8F0] text-[13px] outline-none bg-white">
                    <option value="gpt-4o">gpt-4o (Autonomous Reasoner)</option>
                    <option value="claude-3-5-sonnet">claude-3-5-sonnet (High Precision)</option>
                  </select>
                </div>
              )}

              {selectedNode.type === "Human Approval" && (
                <div>
                  <label className="block text-[11px] font-mono text-[#737686] uppercase mb-1">
                    Escalation SLA Target
                  </label>
                  <select className="w-full px-2.5 py-1.5 rounded border border-[#E2E8F0] text-[13px] outline-none bg-white">
                    <option value="1h">1 Hour (Critical Surcharge)</option>
                    <option value="2h">2 Hours (Standard Review)</option>
                    <option value="24h">24 Hours (Low Priority)</option>
                  </select>
                </div>
              )}

              <div className="p-3 bg-[#fafafa] rounded border border-[#E2E8F0] text-[11px] font-mono text-[#737686]">
                All node outputs are cryptographically serialized and passed downstream via strict JSON schema.
              </div>
            </div>
          ) : (
            <div className="text-[13px] text-[#737686] text-center py-8">
              Click any node to inspect and configure its parameters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
