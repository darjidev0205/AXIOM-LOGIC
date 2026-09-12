import { NextResponse } from "next/server";
import { conversationService } from "@/services/conversations/chatService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const content = body.content || body.message;

    if (!content || typeof content !== "string") {
      return NextResponse.json({ error: "Message content is required" }, { status: 400 });
    }

    const result = await conversationService.sendMessage({
      conversationId: body.conversationId,
      organizationId: body.organizationId,
      content,
      customerName: body.customerName,
    });

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error processing chat";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orgId = searchParams.get("organizationId") || undefined;
    const conversationId = searchParams.get("conversationId");

    if (conversationId) {
      const conv = await conversationService.getConversation(conversationId);
      return NextResponse.json(conv);
    }

    const list = await conversationService.listConversations(orgId);
    return NextResponse.json(list);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error fetching conversations";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
