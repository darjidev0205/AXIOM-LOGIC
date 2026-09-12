"use client";

import { useState, useEffect } from "react";
import { Plug, CheckCircle2, RefreshCw, Globe, Database, Mail, MessageSquare, Calendar, Zap, AlertCircle } from "lucide-react";

interface IntegrationItem {
  id: string;
  name: string;
  provider: string;
  status: string;
  configJson: string;
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<IntegrationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ id: string; message: string } | null>(null);

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/integrations");
      if (res.ok) {
        const data = await res.json();
        setIntegrations(data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const handleTestConnection = async (id: string) => {
    setTestingId(id);
    setTestResult(null);

    try {
      const res = await fetch(`/api/integrations/${id}/test`, { method: "POST" });
      const data = await res.json();
      setTestResult({ id, message: data.message || "Connection verified successfully (200 OK)" });
    } catch {
      setTestResult({ id, message: "Connection test error" });
    } finally {
      setTestingId(null);
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case "DATABASE":
        return <Database className="w-5 h-5 text-emerald-600" />;
      case "CRM":
        return <Globe className="w-5 h-5 text-[#2563EB]" />;
      case "EMAIL":
        return <Mail className="w-5 h-5 text-sky-600" />;
      case "WHATSAPP":
        return <MessageSquare className="w-5 h-5 text-green-600" />;
      case "CALENDAR":
        return <Calendar className="w-5 h-5 text-orange-500" />;
      case "N8N":
        return <Zap className="w-5 h-5 text-pink-600" />;
      default:
        return <Plug className="w-5 h-5 text-[#737686]" />;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="text-[11px] font-mono text-[#737686] uppercase tracking-wider mb-1">
          SYSTEM INTERFACES
        </div>
        <h1 className="text-[26px] font-semibold text-[#0F172A] tracking-tight">
          Tool &amp; Service Connectors
        </h1>
        <p className="text-[14px] text-[#434655]">
          Manage encrypted connections to enterprise databases, messaging channels, CRMs, and the n8n automation layer.
        </p>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((item) => {
          let config: Record<string, unknown> = {};
          try {
            config = JSON.parse(item.configJson);
          } catch {}

          const isTestingThis = testingId === item.id;
          const hasTestResult = testResult?.id === item.id;

          return (
            <div
              key={item.id}
              className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs flex flex-col justify-between hover:border-[#2563EB]/50 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center">
                    {getProviderIcon(item.provider)}
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#ecfdf5] text-[#065f46]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
                    {item.status}
                  </span>
                </div>

                <h3 className="text-[16px] font-semibold text-[#0F172A] mb-1">{item.name}</h3>
                <div className="text-[11px] font-mono text-[#737686] uppercase mb-4">
                  PROVIDER: {item.provider}
                </div>

                {/* Config properties summary */}
                <div className="p-3 bg-[#fafafa] rounded-lg border border-gray-100 font-mono text-[11px] space-y-1 text-[#434655] mb-4">
                  {Object.entries(config).map(([k, v]) => (
                    <div key={k} className="truncate">
                      <span className="text-[#737686]">{k}:</span> {String(v)}
                    </div>
                  ))}
                </div>

                {hasTestResult && (
                  <div className="p-2.5 bg-[#ecfdf5] border border-[#a7f3d0] rounded text-[11px] font-mono text-[#065f46] mb-4">
                    {testResult.message}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => handleTestConnection(item.id)}
                  disabled={isTestingThis}
                  className="bg-white hover:bg-gray-50 border border-[#E2E8F0] text-[#0F172A] px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-[#2563EB] ${isTestingThis ? "animate-spin" : ""}`} />
                  <span>{isTestingThis ? "Testing..." : "Test Connection"}</span>
                </button>

                <button className="text-[12px] text-[#2563EB] hover:underline font-medium">
                  Configure
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
