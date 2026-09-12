import prisma from "@/lib/prisma";
import { ApprovalStatus, ExecutionStatus } from "@prisma/client";

export class HumanApprovalService {
  async listApprovals(organizationId?: string, status?: ApprovalStatus) {
    return prisma.humanApproval.findMany({
      where: {
        ...(organizationId ? { organizationId } : {}),
        ...(status ? { status } : {}),
      },
      include: {
        execution: {
          include: {
            workflow: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getApprovalById(id: string) {
    return prisma.humanApproval.findUnique({
      where: { id },
      include: {
        execution: {
          include: {
            workflow: true,
            logs: { orderBy: { createdAt: "asc" } },
          },
        },
      },
    });
  }

  async resolveApproval(params: {
    id: string;
    decision: ApprovalStatus;
    reviewedBy: string;
    decisionNote?: string;
  }) {
    const approval = await prisma.humanApproval.findUnique({
      where: { id: params.id },
      include: { execution: true },
    });

    if (!approval) throw new Error("Approval record not found");

    const updatedApproval = await prisma.humanApproval.update({
      where: { id: params.id },
      data: {
        status: params.decision,
        reviewedBy: params.reviewedBy,
        decisionNote: params.decisionNote,
        updatedAt: new Date(),
      },
    });

    // Update execution status based on decision
    if (approval.executionId) {
      const newStatus =
        params.decision === ApprovalStatus.APPROVED
          ? ExecutionStatus.COMPLETED
          : params.decision === ApprovalStatus.REJECTED
          ? ExecutionStatus.CANCELLED
          : ExecutionStatus.WAITING_FOR_HUMAN;

      await prisma.workflowExecution.update({
        where: { id: approval.executionId },
        data: {
          status: newStatus,
          completedAt: newStatus === ExecutionStatus.COMPLETED || newStatus === ExecutionStatus.CANCELLED ? new Date() : undefined,
        },
      });

      await prisma.executionLog.create({
        data: {
          executionId: approval.executionId,
          stepName: "Human Decision Applied",
          level: params.decision === ApprovalStatus.APPROVED ? "INFO" : "WARN",
          message: `Supervisor ${params.reviewedBy} marked ${params.decision}. Note: ${params.decisionNote || "No note provided"}`,
          latencyMs: 12,
        },
      });
    }

    return updatedApproval;
  }
}

export const humanApprovalService = new HumanApprovalService();
