import { NextResponse } from "next/server";
import { humanApprovalService } from "@/services/human-approval/approvalService";
import { ApprovalStatus } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orgId = searchParams.get("organizationId") || undefined;
    const status = (searchParams.get("status") as ApprovalStatus) || undefined;

    const approvals = await humanApprovalService.listApprovals(orgId, status);
    return NextResponse.json(approvals);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error listing approvals";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
