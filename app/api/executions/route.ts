import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ExecutionStatus } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orgId = searchParams.get("organizationId");
    const statusParam = searchParams.get("status");

    const executions = await prisma.workflowExecution.findMany({
      where: {
        ...(orgId ? { organizationId: orgId } : {}),
        ...(statusParam ? { status: statusParam as ExecutionStatus } : {}),
      },
      include: {
        workflow: {
          select: { name: true },
        },
        _count: {
          select: { logs: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json(executions);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error fetching executions";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
