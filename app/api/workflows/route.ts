import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orgId = searchParams.get("organizationId");

    const workflows = await prisma.workflow.findMany({
      where: orgId ? { organizationId: orgId } : undefined,
      include: {
        _count: {
          select: { executions: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(workflows);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error fetching workflows";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let orgId = body.organizationId;
    if (!orgId) {
      const defaultOrg = await prisma.organization.findFirst();
      orgId = defaultOrg?.id;
    }

    const workflow = await prisma.workflow.create({
      data: {
        organizationId: orgId,
        name: body.name,
        description: body.description,
        status: body.status || WorkflowStatus.ACTIVE,
        triggerType: body.triggerType || "WEBHOOK",
        definitionJson: JSON.stringify(body.definition || {
          nodes: [
            { id: "1", type: "Trigger", label: "Webhook Ingestion", position: { x: 50, y: 150 } },
            { id: "2", type: "AI Agent", label: "Intent Reasoning", position: { x: 300, y: 150 } },
            { id: "3", type: "Response", label: "Dispatched Output", position: { x: 600, y: 150 } }
          ],
          connections: [
            { from: "1", to: "2" },
            { from: "2", to: "3" }
          ]
        }),
      },
    });
    return NextResponse.json(workflow, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error creating workflow";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
