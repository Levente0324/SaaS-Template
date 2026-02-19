/**
 * lib/ai/types.ts
 * AI provider interface and types.
 * Designed for provider-swappability (Gemini → OpenAI → etc.)
 */

export type AIProviderName = "gemini" | "openai";

export interface AIGenerateOptions {
  provider?: AIProviderName;
  prompt: string; // System/context prompt (what the AI should do)
  input: string; // User-provided input content
  options?: {
    maxTokens?: number;
    temperature?: number;
    timeoutMs?: number;
  };
}

export interface AIGenerateResult {
  text: string;
  tokensUsed?: number; // Prompt + completion tokens if available
  provider: AIProviderName;
  durationMs: number;
}

/** Interface that every AI provider must implement */
export interface AIProvider {
  generate(
    options: AIGenerateOptions,
    signal?: AbortSignal,
  ): Promise<AIGenerateResult>;
}
