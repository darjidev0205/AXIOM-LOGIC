import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const organizations = await prisma.organization.findMany({
      include: {
        _count: {
          select: {
            workflows: true,
            agents: true,
            executions: true,
            memberships: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(organizations);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error fetching organizations";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const org = await prisma.organization.create({
      data: {
        name: body.name,
        slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        plan: body.plan || "Growth",
      },
    });
    return NextResponse.json(org, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error creating organization";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
