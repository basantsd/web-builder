// Base AI Provider Abstract Class

import {
  IAIProvider,
  AIProvider,
  AIRequestOptions,
  AIResponse,
  AIModel,
} from '@/types/ai';

export abstract class BaseAIProvider implements IAIProvider {
  abstract provider: AIProvider;
  protected apiKey: string;
  protected baseUrl?: string;
  protected defaultModel: string;

  constructor(apiKey: string, defaultModel: string, baseUrl?: string) {
    this.apiKey = apiKey;
    this.defaultModel = defaultModel;
    this.baseUrl = baseUrl;
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.length > 0);
  }

  abstract chat(options: AIRequestOptions): Promise<AIResponse>;

  abstract streamChat(
    options: AIRequestOptions
  ): AsyncGenerator<string, void, unknown>;

  abstract getAvailableModels(): AIModel[];

  estimateCost(inputTokens: number, outputTokens: number, model: string): number {
    const models = this.getAvailableModels();
    const modelConfig = models.find((m) => m.model === model);

    if (!modelConfig) {
      return 0;
    }

    const inputCost = (inputTokens / 1000) * modelConfig.costPer1kTokens.input;
    const outputCost = (outputTokens / 1000) * modelConfig.costPer1kTokens.output;

    return inputCost + outputCost;
  }

  protected countTokens(text: string): number {
    // Rough estimation: 1 token ≈ 4 characters for English
    // More accurate tokenization would require model-specific tokenizers
    return Math.ceil(text.length / 4);
  }
}
