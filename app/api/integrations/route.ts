import { NextResponse } from "next/server";
import { integrationService } from "@/services/integrations/registry";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orgId = searchParams.get("organizationId") || undefined;
    const integrations = await integrationService.listIntegrations(orgId);
    return NextResponse.json(integrations);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error fetching integrations";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.action === "trigger_n8n") {
      const result = await integrationService.triggerN8nWebhook({
        webhookUrl: body.webhookUrl,
        workflowName: body.workflowName || "Customer Triage",
        payload: body.payload || {},
      });
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Invalid integration action" }, { status: 400 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error dispatching integration";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
