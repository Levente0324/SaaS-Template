/**
 * lib/ai/generate.ts
 * Provider-agnostic AI text generation function.
 *
 * To add a new provider (e.g., OpenAI):
 * 1. Create lib/ai/providers/openai.ts implementing AIProvider
 * 2. Add it to the providers map below
 * 3. Change AIGenerateOptions.provider to "openai"
 */
import "server-only";
import type {
  AIGenerateOptions,
  AIGenerateResult,
  AIProviderName,
  AIProvider,
} from "@/lib/ai/types";
import { GeminiProvider } from "@/lib/ai/providers/gemini";

// Provider registry — extend this map to add more providers
const providers: Partial<Record<AIProviderName, AIProvider>> = {
  gemini: new GeminiProvider(),
  // openai: openaiProvider,  // Uncomment when OpenAI provider is implemented
};

/**
 * generateText
 * Routes AI generation to the correct provider based on the `provider` field.
 * Supports AbortSignal for timeout cancellation.
 *
 * @param options - Generation options including provider, prompt, and input
 * @param signal  - AbortSignal for timeout/cancellation support
 */
export async function generateText(
  options: AIGenerateOptions,
  signal?: AbortSignal,
): Promise<AIGenerateResult> {
  const providerName = options.provider ?? "gemini";
  const provider = providers[providerName];

  if (!provider) {
    throw new Error(`Unknown AI provider: ${providerName}`);
  }

  return provider.generate(options, signal);
}
