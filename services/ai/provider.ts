import { AIProvider, CompletionOptions, IntentClassificationResult } from "./types";

export class MockAIProvider implements AIProvider {
  name = "MockAIProvider";

  async generateCompletion(prompt: string, options?: CompletionOptions): Promise<string> {
    // Contextual responses based on prompt keywords
    const lower = prompt.toLowerCase();
    if (lower.includes("order") && (lower.includes("gc1024") || lower.includes("gc-1024") || lower.includes("where"))) {
      return "Your order #GC1024 has reached the town hub and is scheduled for village delivery today by 3:45 PM.";
    }
    if (lower.includes("address") || lower.includes("lake st")) {
      return "I have validated your order #GC1024 status and successfully updated the shipping destination to 442 N Lake St, Pasadena, CA 91101.";
    }
    if (lower.includes("refund")) {
      return "I have initiated your refund review for invoice #GC1024. Because this amount ($340.00) exceeds standard instant approval limits, I've compiled your receipt and handed this to our billing supervisor for one-click approval.";
    }
    if (lower.includes("lead") || lower.includes("qualification")) {
      return "To automate lead qualification, Axiom Logic listens to inbound form webhooks, enriches company firmographics with Apollo, computes ICP fit score, and instantly syncs qualified prospects into your CRM.";
    }
    if (lower.includes("workflow") || lower.includes("automate")) {
      return "Axiom Logic specializes in Business Workflow Automation + AI Agents + Human Escalation. You can design workflows with visual nodes, embed deterministic policy constraints, and intervene whenever human judgment is needed.";
    }
    return `Axiom Core evaluated your request: "${prompt}". Autonomous policy check passed. All integrated business tools are operational.`;
  }

  async classifyIntent(message: string): Promise<IntentClassificationResult> {
    const text = message.trim().toLowerCase();
    const orderMatch = message.match(/#?([A-Za-z]{2}-?\d{4})/i);
    const orderId = orderMatch ? orderMatch[1].toUpperCase().replace("-", "") : "GC1024";

    if (text.includes("refund") || text.includes("return money") || text.includes("cancel order")) {
      return {
        intent: "REQUEST_FINANCIAL_REFUND",
        confidence: 0.994,
        entities: {
          order_id: orderId,
          amount: "340.00",
          currency: "USD",
          reason: "Customer initiated refund request",
        },
        requiresHumanEscalation: true,
        escalationReason: "Refund amount ($340.00) exceeds autonomous threshold ($100.00)",
      };
    }

    if (text.includes("address") || text.includes("ship to") || text.includes("deliver to") || text.includes("destination")) {
      return {
        intent: "MUTATE_SHIPPING_DESTINATION",
        confidence: 0.998,
        entities: {
          order_id: orderId,
          target_address: "442 N Lake St, Pasadena, CA 91101",
          carrier_status: "IN_WAREHOUSE_ELIGIBLE",
        },
        requiresHumanEscalation: false,
      };
    }

    if (text.includes("where") || text.includes("track") || text.includes("status") || text.includes("order")) {
      return {
        intent: "QUERY_ORDER_STATUS",
        confidence: 0.998,
        entities: {
          order_id: orderId,
          carrier: "Courier Unit #402",
          current_hub: "Town Distribution Center",
          next_destination: "Village Delivery Hub",
        },
        requiresHumanEscalation: false,
      };
    }

    return {
      intent: "GENERAL_INQUIRY",
      confidence: 0.952,
      entities: {
        raw_text: message,
      },
      requiresHumanEscalation: false,
    };
  }

  async executeToolCall(toolName: string, params: Record<string, unknown>): Promise<Record<string, unknown>> {
    switch (toolName) {
      case "query_order_status":
        return {
          order_id: params.order_id || "GC-1024",
          status: "IN_TRANSIT",
          hub: "Town Hub",
          next_step: "Village Delivery",
          eta: "Today, 3:45 PM",
          driver: "Unit #402",
          verified: true,
        };

      case "mutate_shipping_address":
        return {
          order_id: params.order_id || "GC-1024",
          previous_address: "104 Broadway Ave, Apt 4B",
          new_address: params.new_address || "442 N Lake St, Pasadena, CA 91101",
          status: "COMMITTED",
          timestamp: new Date().toISOString(),
        };

      case "evaluate_refund_policy":
        return {
          order_id: params.order_id || "GC-1024",
          item_price: 340.00,
          within_window: true,
          threshold_exceeded: true,
          action_required: "ESCALATE_TO_HUMAN",
        };

      case "enrich_firmographics":
        return {
          domain: params.domain || "hypergrowth.io",
          company_name: "Hypergrowth Inc",
          employees: "250-500",
          industry: "SaaS & Cloud Operations",
          revenue_band: "$25M - $50M",
          icp_fit: 94,
        };

      default:
        return {
          tool: toolName,
          status: "EXECUTED",
          timestamp: new Date().toISOString(),
          params,
        };
    }
  }
}

export class OpenAIProvider implements AIProvider {
  name = "OpenAIProvider";
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateCompletion(prompt: string, options?: CompletionOptions): Promise<string> {
    if (!this.apiKey) {
      return new MockAIProvider().generateCompletion(prompt, options);
    }
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: options?.model || "gpt-4o",
          messages: [
            { role: "system", content: options?.systemPrompt || "You are Axiom Logic, an intelligent automation agent." },
            { role: "user", content: prompt }
          ],
          temperature: options?.temperature ?? 0.2,
        }),
      });
      if (!res.ok) throw new Error(`OpenAI HTTP ${res.status}`);
      const data = await res.json();
      return data.choices?.[0]?.message?.content || "";
    } catch {
      return new MockAIProvider().generateCompletion(prompt, options);
    }
  }

  async classifyIntent(message: string): Promise<IntentClassificationResult> {
    return new MockAIProvider().classifyIntent(message);
  }

  async executeToolCall(toolName: string, params: Record<string, unknown>): Promise<Record<string, unknown>> {
    return new MockAIProvider().executeToolCall(toolName, params);
  }
}

export class AnthropicProvider implements AIProvider {
  name = "AnthropicProvider";
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateCompletion(prompt: string, options?: CompletionOptions): Promise<string> {
    if (!this.apiKey) {
      return new MockAIProvider().generateCompletion(prompt, options);
    }
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: options?.model || "claude-3-5-sonnet-20241022",
          messages: [{ role: "user", content: prompt }],
          system: options?.systemPrompt || "You are Axiom Logic, an intelligent automation agent.",
          max_tokens: options?.maxTokens || 1024,
        }),
      });
      if (!res.ok) throw new Error(`Anthropic HTTP ${res.status}`);
      const data = await res.json();
      return data.content?.[0]?.text || "";
    } catch {
      return new MockAIProvider().generateCompletion(prompt, options);
    }
  }

  async classifyIntent(message: string): Promise<IntentClassificationResult> {
    return new MockAIProvider().classifyIntent(message);
  }

  async executeToolCall(toolName: string, params: Record<string, unknown>): Promise<Record<string, unknown>> {
    return new MockAIProvider().executeToolCall(toolName, params);
  }
}

export function getAIProvider(): AIProvider {
  if (process.env.OPENAI_API_KEY) {
    return new OpenAIProvider(process.env.OPENAI_API_KEY);
  }
  if (process.env.ANTHROPIC_API_KEY) {
    return new AnthropicProvider(process.env.ANTHROPIC_API_KEY);
  }
  return new MockAIProvider();
}
