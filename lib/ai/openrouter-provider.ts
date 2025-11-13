// OpenRouter Provider Implementation (Access to multiple models via one API)

import { BaseAIProvider } from './base-provider';
import {
  AIProvider,
  AIRequestOptions,
  AIResponse,
  AIModel,
} from '@/types/ai';

export class OpenRouterProvider extends BaseAIProvider {
  provider: AIProvider = 'openrouter';

  constructor(apiKey: string, defaultModel: string = 'anthropic/claude-3.5-sonnet') {
    super(apiKey, defaultModel, 'https://openrouter.ai/api/v1');
  }

  getAvailableModels(): AIModel[] {
    return [
      // Claude models via OpenRouter
      {
        provider: 'openrouter',
        model: 'anthropic/claude-3.5-sonnet',
        costPer1kTokens: { input: 0.003, output: 0.015 },
        maxTokens: 200000,
        supports: { streaming: true, functionCalling: true, vision: true },
      },
      {
        provider: 'openrouter',
        model: 'anthropic/claude-3.5-haiku',
        costPer1kTokens: { input: 0.0008, output: 0.004 },
        maxTokens: 200000,
        supports: { streaming: true, functionCalling: true, vision: false },
      },
      // OpenAI models via OpenRouter
      {
        provider: 'openrouter',
        model: 'openai/gpt-4o',
        costPer1kTokens: { input: 0.0025, output: 0.01 },
        maxTokens: 128000,
        supports: { streaming: true, functionCalling: true, vision: true },
      },
      {
        provider: 'openrouter',
        model: 'openai/gpt-4o-mini',
        costPer1kTokens: { input: 0.00015, output: 0.0006 },
        maxTokens: 128000,
        supports: { streaming: true, functionCalling: true, vision: true },
      },
      // Google Gemini via OpenRouter
      {
        provider: 'openrouter',
        model: 'google/gemini-pro-1.5',
        costPer1kTokens: { input: 0.00125, output: 0.005 },
        maxTokens: 1000000,
        supports: { streaming: true, functionCalling: true, vision: true },
      },
      {
        provider: 'openrouter',
        model: 'google/gemini-flash-1.5',
        costPer1kTokens: { input: 0.000075, output: 0.0003 },
        maxTokens: 1000000,
        supports: { streaming: true, functionCalling: true, vision: true },
      },
      // Meta Llama via OpenRouter
      {
        provider: 'openrouter',
        model: 'meta-llama/llama-3.1-405b-instruct',
        costPer1kTokens: { input: 0.003, output: 0.003 },
        maxTokens: 128000,
        supports: { streaming: true, functionCalling: false, vision: false },
      },
      {
        provider: 'openrouter',
        model: 'meta-llama/llama-3.1-70b-instruct',
        costPer1kTokens: { input: 0.0005, output: 0.0008 },
        maxTokens: 128000,
        supports: { streaming: true, functionCalling: false, vision: false },
      },
      // Mistral via OpenRouter
      {
        provider: 'openrouter',
        model: 'mistralai/mistral-large',
        costPer1kTokens: { input: 0.002, output: 0.006 },
        maxTokens: 128000,
        supports: { streaming: true, functionCalling: true, vision: false },
      },
    ];
  }

  async chat(options: AIRequestOptions): Promise<AIResponse> {
    const model = options.model || this.defaultModel;
    const maxTokens = options.maxTokens || 4096;
    const temperature = options.temperature || 0.7;

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
        'HTTP-Referer': 'https://codeforge.ai', // Required by OpenRouter
        'X-Title': 'CodeForge AI', // Optional
      },
      body: JSON.stringify({
        model,
        messages: options.messages,
        max_tokens: maxTokens,
        temperature,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenRouter API error: ${error}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const inputTokens = data.usage?.prompt_tokens || 0;
    const outputTokens = data.usage?.completion_tokens || 0;

    return {
      content,
      usage: {
        inputTokens,
        outputTokens,
        totalCost: this.estimateCost(inputTokens, outputTokens, model),
      },
      model,
      provider: this.provider,
    };
  }

  async *streamChat(options: AIRequestOptions): AsyncGenerator<string, void, unknown> {
    const model = options.model || this.defaultModel;
    const maxTokens = options.maxTokens || 4096;
    const temperature = options.temperature || 0.7;

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
        'HTTP-Referer': 'https://codeforge.ai',
        'X-Title': 'CodeForge AI',
      },
      body: JSON.stringify({
        model,
        messages: options.messages,
        max_tokens: maxTokens,
        temperature,
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenRouter API error: ${error}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('Response body is null');
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter((line) => line.trim() !== '');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices[0]?.delta?.content;
            if (content) {
              yield content;
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }
  }
}
