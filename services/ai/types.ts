export interface CompletionOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
  tools?: ToolDefinition[];
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters?: Record<string, unknown>;
}

export interface IntentClassificationResult {
  intent: string;
  confidence: number;
  entities: Record<string, string>;
  requiresHumanEscalation: boolean;
  escalationReason?: string;
}

export interface AIProvider {
  name: string;
  generateCompletion(prompt: string, options?: CompletionOptions): Promise<string>;
  classifyIntent(message: string): Promise<IntentClassificationResult>;
  executeToolCall(toolName: string, params: Record<string, unknown>): Promise<Record<string, unknown>>;
}
