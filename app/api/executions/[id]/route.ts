import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const execution = await prisma.workflowExecution.findUnique({
      where: { id },
      include: {
        workflow: true,
        logs: { orderBy: { createdAt: "asc" } },
        approvals: true,
      },
    });

    if (!execution) {
      return NextResponse.json({ error: "Execution not found" }, { status: 404 });
    }

    return NextResponse.json(execution);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error fetching execution";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
