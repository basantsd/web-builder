// AI Provider Types and Interfaces

export type AIProvider = 'claude' | 'openai' | 'openrouter' | 'custom';

export type AIModel = {
  provider: AIProvider;
  model: string;
  costPer1kTokens: {
    input: number;
    output: number;
  };
  maxTokens: number;
  supports: {
    streaming: boolean;
    functionCalling: boolean;
    vision: boolean;
  };
};

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIRequestOptions {
  messages: AIMessage[];
  model?: string;
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
  provider?: AIProvider;
}

export interface AIResponse {
  content: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
    totalCost: number;
  };
  model: string;
  provider: AIProvider;
}

export interface AIProviderConfig {
  name: AIProvider;
  apiKey: string;
  baseUrl?: string;
  defaultModel: string;
  enabled: boolean;
}

// Abstract AI Provider Interface
export interface IAIProvider {
  provider: AIProvider;
  isConfigured(): boolean;
  chat(options: AIRequestOptions): Promise<AIResponse>;
  streamChat(options: AIRequestOptions): AsyncGenerator<string, void, unknown>;
  getAvailableModels(): AIModel[];
  estimateCost(inputTokens: number, outputTokens: number, model: string): number;
}

// Task-based model selection
export type TaskType =
  | 'code_generation'
  | 'code_review'
  | 'test_generation'
  | 'documentation'
  | 'bug_fix'
  | 'optimization'
  | 'simple_query'
  | 'complex_reasoning';

export interface TaskConfig {
  type: TaskType;
  preferredProvider?: AIProvider;
  preferredModel?: string;
  qualityLevel: 'low' | 'standard' | 'high' | 'premium';
  maxCost?: number;
  maxLatency?: number; // in ms
}

// Smart routing decision
export interface RoutingDecision {
  provider: AIProvider;
  model: string;
  estimatedCost: number;
  estimatedLatency: number;
  confidence: number;
  reason: string;
}
