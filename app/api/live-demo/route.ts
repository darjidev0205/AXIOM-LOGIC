import { NextResponse } from "next/server";
import { workflowEngine } from "@/services/workflows/engine";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = body.message || "Where is my order #GC1024?";

    const result = await workflowEngine.run({
      message,
      channel: "LIVE_DEMO_SANDBOX",
    });

    return NextResponse.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Live demo execution failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
