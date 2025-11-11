// Claude AI Provider Implementation

import Anthropic from '@anthropic-ai/sdk';
import { BaseAIProvider } from './base-provider';
import {
  AIProvider,
  AIRequestOptions,
  AIResponse,
  AIModel,
  AIMessage,
} from '@/types/ai';

export class ClaudeProvider extends BaseAIProvider {
  provider: AIProvider = 'claude';
  private client: Anthropic;

  constructor(apiKey: string, defaultModel: string = 'claude-sonnet-4-5-20250929') {
    super(apiKey, defaultModel);
    this.client = new Anthropic({ apiKey });
  }

  getAvailableModels(): AIModel[] {
    return [
      {
        provider: 'claude',
        model: 'claude-sonnet-4-5-20250929',
        costPer1kTokens: { input: 0.003, output: 0.015 },
        maxTokens: 200000,
        supports: {
          streaming: true,
          functionCalling: true,
          vision: true,
        },
      },
      {
        provider: 'claude',
        model: 'claude-3-5-sonnet-20241022',
        costPer1kTokens: { input: 0.003, output: 0.015 },
        maxTokens: 200000,
        supports: {
          streaming: true,
          functionCalling: true,
          vision: true,
        },
      },
      {
        provider: 'claude',
        model: 'claude-3-5-haiku-20241022',
        costPer1kTokens: { input: 0.0008, output: 0.004 },
        maxTokens: 200000,
        supports: {
          streaming: true,
          functionCalling: true,
          vision: false,
        },
      },
      {
        provider: 'claude',
        model: 'claude-3-opus-20240229',
        costPer1kTokens: { input: 0.015, output: 0.075 },
        maxTokens: 200000,
        supports: {
          streaming: true,
          functionCalling: true,
          vision: true,
        },
      },
    ];
  }

  async chat(options: AIRequestOptions): Promise<AIResponse> {
    const model = options.model || this.defaultModel;
    const maxTokens = options.maxTokens || 4096;
    const temperature = options.temperature || 0.7;

    // Separate system message from user/assistant messages
    const systemMessage = options.messages.find((m) => m.role === 'system');
    const messages = options.messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

    const response = await this.client.messages.create({
      model,
      max_tokens: maxTokens,
      temperature,
      system: systemMessage?.content,
      messages,
    });

    const content = response.content[0].type === 'text' ? response.content[0].text : '';
    const inputTokens = response.usage.input_tokens;
    const outputTokens = response.usage.output_tokens;

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

    const systemMessage = options.messages.find((m) => m.role === 'system');
    const messages = options.messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

    const stream = await this.client.messages.create({
      model,
      max_tokens: maxTokens,
      temperature,
      system: systemMessage?.content,
      messages,
      stream: true,
    });

    for await (const event of stream) {
      if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta'
      ) {
        yield event.delta.text;
      }
    }
  }
}
