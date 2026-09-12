import { NextResponse } from "next/server";
import { workflowEngine } from "@/services/workflows/engine";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const message = body.message || "Where is my order #GC1024?";

    const result = await workflowEngine.run({
      workflowId: id,
      organizationId: body.organizationId,
      message,
      channel: body.channel || "DASHBOARD_TEST",
    });

    return NextResponse.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Execution failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
