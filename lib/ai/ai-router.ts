// Smart AI Router - Intelligently routes requests to best provider/model

import { ClaudeProvider } from './claude-provider';
import { OpenAIProvider } from './openai-provider';
import { OpenRouterProvider } from './openrouter-provider';
import {
  IAIProvider,
  AIProvider,
  TaskType,
  TaskConfig,
  RoutingDecision,
  AIRequestOptions,
  AIResponse,
} from '@/types/ai';

export class AIRouter {
  private providers: Map<AIProvider, IAIProvider> = new Map();
  private usageStats: Map<string, number> = new Map();

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders() {
    // Initialize Claude
    const claudeKey = process.env.ANTHROPIC_API_KEY;
    if (claudeKey) {
      this.providers.set('claude', new ClaudeProvider(claudeKey));
    }

    // Initialize OpenAI
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      this.providers.set('openai', new OpenAIProvider(openaiKey));
    }

    // Initialize OpenRouter
    const openrouterKey = process.env.OPENROUTER_API_KEY;
    if (openrouterKey) {
      this.providers.set('openrouter', new OpenRouterProvider(openrouterKey));
    }
  }

  getAvailableProviders(): AIProvider[] {
    return Array.from(this.providers.keys()).filter((provider) =>
      this.providers.get(provider)?.isConfigured()
    );
  }

  async routeTask(taskConfig: TaskConfig): Promise<RoutingDecision> {
    const availableProviders = this.getAvailableProviders();

    if (availableProviders.length === 0) {
      throw new Error('No AI providers configured. Please add API keys.');
    }

    // If user specified a provider, use it
    if (taskConfig.preferredProvider && taskConfig.preferredModel) {
      const provider = this.providers.get(taskConfig.preferredProvider);
      if (provider?.isConfigured()) {
        return {
          provider: taskConfig.preferredProvider,
          model: taskConfig.preferredModel,
          estimatedCost: 0,
          estimatedLatency: 5000,
          confidence: 1.0,
          reason: 'User-specified provider and model',
        };
      }
    }

    // Smart routing based on task type and quality level
    return this.selectBestModel(taskConfig, availableProviders);
  }

  private selectBestModel(
    taskConfig: TaskConfig,
    availableProviders: AIProvider[]
  ): RoutingDecision {
    const { type, qualityLevel, maxCost, maxLatency } = taskConfig;

    // Define model preferences based on task type and quality
    const modelPreferences = this.getModelPreferences(type, qualityLevel);

    // Find the best match from available providers
    for (const pref of modelPreferences) {
      if (availableProviders.includes(pref.provider)) {
        const provider = this.providers.get(pref.provider);
        const models = provider?.getAvailableModels() || [];
        const model = models.find((m) => m.model === pref.model);

        if (model) {
          const estimatedCost = model.costPer1kTokens.input * 2; // Rough estimate
          const estimatedLatency = pref.latency;

          // Check constraints
          if (maxCost && estimatedCost > maxCost) continue;
          if (maxLatency && estimatedLatency > maxLatency) continue;

          return {
            provider: pref.provider,
            model: pref.model,
            estimatedCost,
            estimatedLatency,
            confidence: pref.confidence,
            reason: pref.reason,
          };
        }
      }
    }

    // Fallback to first available provider
    const fallbackProvider = availableProviders[0];
    const provider = this.providers.get(fallbackProvider)!;
    const models = provider.getAvailableModels();

    return {
      provider: fallbackProvider,
      model: models[0].model,
      estimatedCost: models[0].costPer1kTokens.input * 2,
      estimatedLatency: 5000,
      confidence: 0.5,
      reason: 'Fallback to first available provider',
    };
  }

  private getModelPreferences(
    type: TaskType,
    quality: 'low' | 'standard' | 'high' | 'premium'
  ) {
    const preferences = {
      // Simple queries - use cheapest, fastest models
      simple_query: {
        low: [
          { provider: 'openrouter' as AIProvider, model: 'google/gemini-flash-1.5', latency: 2000, confidence: 0.9, reason: 'Cheapest and fastest for simple queries' },
          { provider: 'openai' as AIProvider, model: 'gpt-4o-mini', latency: 2500, confidence: 0.85, reason: 'Good balance of speed and cost' },
          { provider: 'claude' as AIProvider, model: 'claude-3-5-haiku-20241022', latency: 2500, confidence: 0.85, reason: 'Fast Claude model' },
        ],
        standard: [
          { provider: 'openai' as AIProvider, model: 'gpt-4o-mini', latency: 2500, confidence: 0.9, reason: 'Reliable for standard queries' },
          { provider: 'claude' as AIProvider, model: 'claude-3-5-haiku-20241022', latency: 2500, confidence: 0.85, reason: 'Fast and accurate' },
        ],
        high: [
          { provider: 'claude' as AIProvider, model: 'claude-3-5-sonnet-20241022', latency: 4000, confidence: 0.95, reason: 'Best quality' },
          { provider: 'openai' as AIProvider, model: 'gpt-4o', latency: 4000, confidence: 0.9, reason: 'Excellent reasoning' },
        ],
        premium: [
          { provider: 'claude' as AIProvider, model: 'claude-sonnet-4-5-20250929', latency: 5000, confidence: 1.0, reason: 'Latest and most capable' },
          { provider: 'claude' as AIProvider, model: 'claude-3-opus-20240229', latency: 6000, confidence: 0.95, reason: 'Maximum capability' },
        ],
      },

      // Code generation - prioritize quality and accuracy
      code_generation: {
        low: [
          { provider: 'openai' as AIProvider, model: 'gpt-4o-mini', latency: 3000, confidence: 0.8, reason: 'Fast code generation' },
          { provider: 'openrouter' as AIProvider, model: 'meta-llama/llama-3.1-70b-instruct', latency: 3500, confidence: 0.75, reason: 'Good for simple code' },
        ],
        standard: [
          { provider: 'claude' as AIProvider, model: 'claude-3-5-sonnet-20241022', latency: 5000, confidence: 0.9, reason: 'Excellent at coding' },
          { provider: 'openai' as AIProvider, model: 'gpt-4o', latency: 5000, confidence: 0.85, reason: 'Reliable code quality' },
        ],
        high: [
          { provider: 'claude' as AIProvider, model: 'claude-sonnet-4-5-20250929', latency: 6000, confidence: 0.95, reason: 'Best coding capabilities' },
          { provider: 'claude' as AIProvider, model: 'claude-3-5-sonnet-20241022', latency: 5000, confidence: 0.9, reason: 'Proven coding model' },
        ],
        premium: [
          { provider: 'claude' as AIProvider, model: 'claude-sonnet-4-5-20250929', latency: 6000, confidence: 1.0, reason: 'Cutting-edge coding AI' },
          { provider: 'claude' as AIProvider, model: 'claude-3-opus-20240229', latency: 7000, confidence: 0.95, reason: 'Maximum quality code' },
        ],
      },

      // Complex reasoning - use most capable models
      complex_reasoning: {
        low: [
          { provider: 'openai' as AIProvider, model: 'gpt-4o-mini', latency: 4000, confidence: 0.7, reason: 'Basic reasoning capability' },
          { provider: 'claude' as AIProvider, model: 'claude-3-5-haiku-20241022', latency: 3500, confidence: 0.75, reason: 'Fast reasoning' },
        ],
        standard: [
          { provider: 'claude' as AIProvider, model: 'claude-3-5-sonnet-20241022', latency: 6000, confidence: 0.9, reason: 'Strong reasoning' },
          { provider: 'openai' as AIProvider, model: 'gpt-4o', latency: 6000, confidence: 0.85, reason: 'Excellent reasoning' },
        ],
        high: [
          { provider: 'claude' as AIProvider, model: 'claude-sonnet-4-5-20250929', latency: 7000, confidence: 0.95, reason: 'Superior reasoning' },
          { provider: 'claude' as AIProvider, model: 'claude-3-opus-20240229', latency: 8000, confidence: 0.93, reason: 'Deep reasoning' },
        ],
        premium: [
          { provider: 'claude' as AIProvider, model: 'claude-sonnet-4-5-20250929', latency: 7000, confidence: 1.0, reason: 'Best reasoning model' },
          { provider: 'claude' as AIProvider, model: 'claude-3-opus-20240229', latency: 8000, confidence: 0.98, reason: 'Maximum intelligence' },
        ],
      },
    };

    // Return preferences or default to code_generation
    const taskPrefs = preferences[type] || preferences.code_generation;
    return taskPrefs[quality] || taskPrefs.standard;
  }

  async chat(
    taskConfig: TaskConfig,
    options: AIRequestOptions
  ): Promise<AIResponse> {
    const decision = await this.routeTask(taskConfig);
    const provider = this.providers.get(decision.provider);

    if (!provider) {
      throw new Error(`Provider ${decision.provider} not found`);
    }

    // Add routing info to options
    options.provider = decision.provider;
    options.model = decision.model;

    const response = await provider.chat(options);

    // Track usage
    this.trackUsage(decision.provider, decision.model, response.usage.totalCost);

    return response;
  }

  async *streamChat(
    taskConfig: TaskConfig,
    options: AIRequestOptions
  ): AsyncGenerator<string, void, unknown> {
    const decision = await this.routeTask(taskConfig);
    const provider = this.providers.get(decision.provider);

    if (!provider) {
      throw new Error(`Provider ${decision.provider} not found`);
    }

    options.provider = decision.provider;
    options.model = decision.model;

    yield* provider.streamChat(options);
  }

  private trackUsage(provider: AIProvider, model: string, cost: number) {
    const key = `${provider}:${model}`;
    const currentUsage = this.usageStats.get(key) || 0;
    this.usageStats.set(key, currentUsage + cost);
  }

  getUsageStats(): Record<string, number> {
    return Object.fromEntries(this.usageStats);
  }

  getTotalCost(): number {
    return Array.from(this.usageStats.values()).reduce((sum, cost) => sum + cost, 0);
  }
}

// Singleton instance
export const aiRouter = new AIRouter();
