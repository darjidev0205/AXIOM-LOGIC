import { NextResponse } from "next/server";
import { integrationService } from "@/services/integrations/registry";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const testResult = await integrationService.testConnection(id);
    return NextResponse.json(testResult);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Integration connection test failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
