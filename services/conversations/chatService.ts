import prisma from "@/lib/prisma";
import { getAIProvider } from "../ai/provider";
import { MessageRole, ChannelType } from "@prisma/client";

export class ConversationService {
  private ai = getAIProvider();

  async sendMessage(params: {
    conversationId?: string;
    organizationId?: string;
    content: string;
    channel?: ChannelType;
    customerName?: string;
  }) {
    let orgId = params.organizationId;
    if (!orgId) {
      const defaultOrg = await prisma.organization.findFirst();
      orgId = defaultOrg?.id || "default-org";
    }

    let conversation = params.conversationId
      ? await prisma.conversation.findUnique({ where: { id: params.conversationId } })
      : null;

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          organizationId: orgId,
          customerName: params.customerName || "Website Visitor",
          channel: params.channel || ChannelType.WEB_CHAT,
          status: "ACTIVE",
        },
      });
    }

    // Save user message
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: MessageRole.USER,
        content: params.content,
      },
    });

    // Run intent classification & tool calling if appropriate
    const classification = await this.ai.classifyIntent(params.content);
    let toolCallRecord = null;
    let toolResult: Record<string, unknown> | null = null;

    if (classification.intent === "QUERY_ORDER_STATUS") {
      toolResult = await this.ai.executeToolCall("query_order_status", classification.entities);
    } else if (classification.intent === "MUTATE_SHIPPING_DESTINATION") {
      toolResult = await this.ai.executeToolCall("mutate_shipping_address", classification.entities);
    }

    // Generate assistant response
    const assistantReply = await this.ai.generateCompletion(params.content, {
      systemPrompt: "You are Axiom Assistant, an intelligent business automation expert. Help users understand workflows, AI agents, and how human escalation keeps operations resilient.",
    });

    const assistantMessage = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: MessageRole.ASSISTANT,
        content: assistantReply,
        metadata: toolResult ? JSON.stringify({ intent: classification.intent, entities: classification.entities }) : null,
      },
    });

    if (toolResult) {
      toolCallRecord = await prisma.toolCall.create({
        data: {
          messageId: assistantMessage.id,
          toolName: classification.intent.toLowerCase(),
          inputJson: JSON.stringify(classification.entities),
          outputJson: JSON.stringify(toolResult),
          status: "SUCCESS",
          durationMs: 82,
        },
      });
    }

    return {
      conversationId: conversation.id,
      messageId: assistantMessage.id,
      reply: assistantReply,
      toolCall: toolCallRecord,
      classification,
    };
  }

  async getConversation(conversationId: string) {
    return prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          include: { toolCalls: true },
          orderBy: { createdAt: "asc" },
        },
      },
    });
  }

  async listConversations(organizationId?: string) {
    return prisma.conversation.findMany({
      where: organizationId ? { organizationId } : undefined,
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
    });
  }
}

export const conversationService = new ConversationService();
