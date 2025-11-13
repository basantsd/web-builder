// OpenAI Provider Implementation

import { BaseAIProvider } from './base-provider';
import {
  AIProvider,
  AIRequestOptions,
  AIResponse,
  AIModel,
} from '@/types/ai';

export class OpenAIProvider extends BaseAIProvider {
  provider: AIProvider = 'openai';

  constructor(apiKey: string, defaultModel: string = 'gpt-4o') {
    super(apiKey, defaultModel, 'https://api.openai.com/v1');
  }

  getAvailableModels(): AIModel[] {
    return [
      {
        provider: 'openai',
        model: 'gpt-4o',
        costPer1kTokens: { input: 0.0025, output: 0.01 },
        maxTokens: 128000,
        supports: {
          streaming: true,
          functionCalling: true,
          vision: true,
        },
      },
      {
        provider: 'openai',
        model: 'gpt-4o-mini',
        costPer1kTokens: { input: 0.00015, output: 0.0006 },
        maxTokens: 128000,
        supports: {
          streaming: true,
          functionCalling: true,
          vision: true,
        },
      },
      {
        provider: 'openai',
        model: 'gpt-4-turbo',
        costPer1kTokens: { input: 0.01, output: 0.03 },
        maxTokens: 128000,
        supports: {
          streaming: true,
          functionCalling: true,
          vision: true,
        },
      },
      {
        provider: 'openai',
        model: 'gpt-3.5-turbo',
        costPer1kTokens: { input: 0.0005, output: 0.0015 },
        maxTokens: 16385,
        supports: {
          streaming: true,
          functionCalling: true,
          vision: false,
        },
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
      },
      body: JSON.stringify({
        model,
        messages: options.messages,
        max_tokens: maxTokens,
        temperature,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const inputTokens = data.usage.prompt_tokens;
    const outputTokens = data.usage.completion_tokens;

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
      throw new Error(`OpenAI API error: ${response.statusText}`);
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
