/**
 * lib/ai/providers/gemini.ts
 * Google Gemini AI provider implementation.
 *
 * SECURITY: GEMINI_API_KEY is read server-side only. This file
 * must never be bundled into client-side code.
 */
import "server-only";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type {
  AIProvider,
  AIGenerateOptions,
  AIGenerateResult,
} from "@/lib/ai/types";
import { Errors } from "@/lib/errors";

// ─────────────────────────────────────────────────────────────
// CUSTOMIZE: Change the model name here when a new model ships
// ─────────────────────────────────────────────────────────────
const GEMINI_MODEL = "gemini-2.5-flash";

export class GeminiProvider implements AIProvider {
  private client: GoogleGenerativeAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set.");
    }
    this.client = new GoogleGenerativeAI(apiKey);
  }

  async generate(
    options: AIGenerateOptions,
    signal?: AbortSignal,
  ): Promise<AIGenerateResult> {
    const startTime = Date.now();

    try {
      const model = this.client.getGenerativeModel({ model: GEMINI_MODEL });

      // Combine system prompt + user input
      const fullPrompt = `${options.prompt}\n\n---\n\nUser Input:\n${options.input}`;

      // Check if request was aborted before making the call
      if (signal?.aborted) {
        throw Errors.internal("Request cancelled before AI call");
      }

      const result = await model.generateContent(fullPrompt);
      const response = result.response;

      // Check abort after response
      if (signal?.aborted) {
        throw Errors.internal("Request cancelled after AI response");
      }

      const text = response.text();
      const tokensUsed = response.usageMetadata?.totalTokenCount ?? undefined;

      return {
        text,
        tokensUsed,
        provider: "gemini",
        durationMs: Date.now() - startTime,
      };
    } catch (error) {
      // Re-throw AppErrors as-is
      if ((error as { code?: string }).code) throw error;

      // Wrap unknown Gemini API errors
      const message =
        error instanceof Error ? error.message : "Unknown Gemini error";
      throw Errors.internal(`Gemini API error: ${message}`);
    }
  }
}

// Singleton instance — avoids re-initializing on every request
export const geminiProvider = new GeminiProvider();
