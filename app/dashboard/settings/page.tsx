import prisma from "@/lib/prisma";
import { Settings, Users, Key, ShieldCheck, Building } from "lucide-react";

export const revalidate = 0;

export default async function SettingsPage() {
  const org = await prisma.organization.findFirst({
    include: {
      memberships: {
        include: { user: true },
      },
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <div className="text-[11px] font-mono text-[#737686] uppercase tracking-wider mb-1">
          ORGANIZATION MANAGEMENT
        </div>
        <h1 className="text-[26px] font-semibold text-[#0F172A] tracking-tight">
          Workspace Settings
        </h1>
        <p className="text-[14px] text-[#434655]">
          Manage multi-tenant workspace credentials, team roles, and API secret keys.
        </p>
      </div>

      <div className="space-y-6">
        {/* Org Profile Card */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100 font-semibold text-[15px] text-[#0F172A]">
            <Building className="w-4 h-4 text-[#2563EB]" />
            <span>Organization Profile</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[13px]">
            <div>
              <label className="block text-[11px] font-mono text-[#737686] uppercase mb-1">
                Workspace Name
              </label>
              <input
                type="text"
                readOnly
                value={org?.name || "Acme Operations"}
                className="w-full px-3 py-1.5 rounded border border-gray-200 bg-gray-50 text-[#0F172A] font-medium outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-[#737686] uppercase mb-1">
                Workspace Slug
              </label>
              <input
                type="text"
                readOnly
                value={org?.slug || "acme-ops"}
                className="w-full px-3 py-1.5 rounded border border-gray-200 bg-gray-50 text-[#0F172A] font-mono outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-[#737686] uppercase mb-1">
                Subscription Plan
              </label>
              <input
                type="text"
                readOnly
                value={org?.plan || "Enterprise Scale"}
                className="w-full px-3 py-1.5 rounded border border-gray-200 bg-[#eff4ff] text-[#2563EB] font-semibold outline-none"
              />
            </div>
          </div>
        </div>

        {/* Team Members Card */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2 font-semibold text-[15px] text-[#0F172A]">
              <Users className="w-4 h-4 text-[#2563EB]" />
              <span>Team Members &amp; RBAC Roles</span>
            </div>
            <button className="text-[12px] text-[#2563EB] font-medium hover:underline">
              + Invite Member
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            {org?.memberships.map((m) => (
              <div key={m.id} className="py-3 flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#eff4ff] text-[#2563EB] font-semibold flex items-center justify-center text-[12px]">
                    {m.user.name.slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-semibold text-[#0F172A]">{m.user.name}</div>
                    <div className="text-[11px] text-[#737686]">{m.user.email}</div>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                    m.role === "OWNER"
                      ? "bg-[#0F172A] text-white"
                      : m.role === "ADMIN"
                      ? "bg-[#eff4ff] text-[#2563EB]"
                      : "bg-gray-100 text-[#434655]"
                  }`}
                >
                  {m.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* API Keys Card */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2 font-semibold text-[15px] text-[#0F172A]">
              <Key className="w-4 h-4 text-[#2563EB]" />
              <span>API Keys &amp; Webhook Credentials</span>
            </div>
            <button className="text-[12px] text-[#2563EB] font-medium hover:underline">
              Generate New Key
            </button>
          </div>

          <div className="space-y-3 font-mono text-[12px]">
            <div className="p-3 bg-[#fafafa] rounded border border-gray-200 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-[#737686] uppercase">PRODUCTION INGESTION TOKEN</div>
                <div className="text-[#0F172A] font-semibold mt-0.5">ax_live_89f02931****9824</div>
              </div>
              <span className="text-[#006c49] text-[11px] font-semibold">ACTIVE</span>
            </div>

            <div className="p-3 bg-[#fafafa] rounded border border-gray-200 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-[#737686] uppercase">N8N WEBHOOK SECRET</div>
                <div className="text-[#0F172A] font-semibold mt-0.5">whsec_n8n_cluster_39201****</div>
              </div>
              <span className="text-[#006c49] text-[11px] font-semibold">ACTIVE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
