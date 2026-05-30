export type Provider = "cerebras" | "anthropic" | "openai";

export type RiskLevel = "low" | "medium" | "high" | "critical";

export type TaskType =
  | "sermon_draft"
  | "sermon_verify"
  | "qa_draft"
  | "qa_verify"
  | "doctrine_gate"
  | "apologetics_draft"
  | "apologetics_verify"
  | "prayer"
  | "crisis"
  | "summarize"
  | "caption"
  | "schedule"
  | "engagement_draft"
  | "engagement_classify"
  | "greek_hebrew"
  | "image_prompt"
  | "video_script";

export type ServiceClass =
  | "sermons"
  | "chat"
  | "live"
  | "phone"
  | "background";

export type AgentRequest = {
  taskType: TaskType;
  agentName: string;
  systemPrompt: string;
  userInput: string;
  context?: string;
  risk?: RiskLevel;
  serviceClass?: ServiceClass;
  temperature?: number;
  maxTokens?: number;
  responseSchema?: Record<string, unknown>;
};

export type AgentResponse = {
  text: string;
  provider: Provider;
  model: string;
  tokensIn: number;
  tokensOut: number;
  latencyMs: number;
  raw?: unknown;
};

export class RateLimited extends Error {
  public readonly provider: Provider;
  public readonly key?: string;
  constructor(provider: Provider, key?: string) {
    super(`Provider ${provider} rate limited`);
    this.name = "RateLimited";
    this.provider = provider;
    this.key = key;
  }
}

export class ProviderUnavailable extends Error {
  public readonly provider: Provider;
  public readonly reason: string;
  constructor(provider: Provider, reason: string) {
    super(`Provider ${provider} unavailable: ${reason}`);
    this.name = "ProviderUnavailable";
    this.provider = provider;
    this.reason = reason;
  }
}
