import { NextResponse } from "next/server";
import { humanApprovalService } from "@/services/human-approval/approvalService";
import { ApprovalStatus } from "@prisma/client";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const decision = body.decision as ApprovalStatus;
    if (!decision || !Object.values(ApprovalStatus).includes(decision)) {
      return NextResponse.json({ error: "Invalid approval decision" }, { status: 400 });
    }

    const updated = await humanApprovalService.resolveApproval({
      id,
      decision,
      reviewedBy: body.reviewedBy || "Supervisor Admin",
      decisionNote: body.decisionNote,
    });

    return NextResponse.json(updated);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error updating approval";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
