import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orgId = searchParams.get("organizationId");

    const agents = await prisma.agent.findMany({
      where: orgId ? { organizationId: orgId } : undefined,
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(agents);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error fetching agents";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let orgId = body.organizationId;
    if (!orgId) {
      const firstOrg = await prisma.organization.findFirst();
      orgId = firstOrg?.id;
    }

    const agent = await prisma.agent.create({
      data: {
        organizationId: orgId,
        name: body.name,
        role: body.role,
        model: body.model || "gpt-4o",
        temperature: body.temperature ?? 0.2,
        instructions: body.instructions || "You are an autonomous AI specialist.",
        tools: JSON.stringify(body.tools || []),
        status: body.status || "ACTIVE",
      },
    });
    return NextResponse.json(agent, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error creating agent";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
