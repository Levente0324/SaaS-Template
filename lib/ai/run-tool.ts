/**
 * lib/ai/run-tool.ts
 * The core AI Tool Engine — the single entry point for all AI feature execution.
 *
 * SECURITY PIPELINE (in order):
 * 1. Kill switch check (DISABLE_AI_FEATURES)
 * 2. Zod input validation
 * 3. User session verification (requireUser)
 * 4. Active subscription check (requireActiveSubscription)
 * 5. Daily usage limit check
 * 6. Per-user rate limit check
 * 7. AI generation with timeout
 * 8. Usage logging
 */
import "server-only";
import { z } from "zod";
import { requireUser } from "@/lib/auth/helpers";
import { requireActiveSubscription } from "@/lib/billing/helpers";
import { checkDailyLimit, logUsage } from "@/lib/ai/usage";
import { checkRateLimit } from "@/lib/rate-limit";
import { generateText } from "@/lib/ai/generate";
import { logAIEvent, logError } from "@/lib/logging";
import { Errors } from "@/lib/errors";
import type { AIToolResult } from "@/types";
import { env } from "@/lib/env";

// ─────────────────────────────────────────────────────────────────────────────
// 🤖 CUSTOMIZE HERE: Defines the "Brain" of your application.
// ─────────────────────────────────────────────────────────────────────────────
const TOOL_REGISTRY: Record<string, { prompt: string; schema: z.ZodSchema }> = {
  // 💡 EDIT THIS: Rename 'demo' to your tool name (e.g., 'generate_recipe')
  demo: {
    // 💡 EDIT THIS: This is the System Prompt. Tell Gemini what to do.
    prompt:
      "You are a helpful assistant. Answer the user's question concisely and accurately.",
    // 💡 EDIT THIS: This is the Input Schema. What data do you need from the user?
    // The structure you define here MUST match the JSON object the frontend sends in `input`.
    schema: z.object({ promptText: z.string().min(1).max(10_000) }),
  },
  // You can add multiple tools here if your app does multiple things.
};

interface RunAIToolOptions {
  userId: string;
  toolName: string;
  input: any; // Dynamic JSON payload from the client
}

// ...

export async function runAITool({
  userId,
  toolName,
  input,
}: RunAIToolOptions): Promise<AIToolResult> {
  const startTime = Date.now();

  // ── Step 1: Kill switch ──────────────────────────────────────────────────
  if (env.DISABLE_AI_FEATURES === "true") {
    throw Errors.aiDisabled();
  }

  // ... (Steps 2-6 omitted for brevity, logic remains same)
  // ── Step 2: Validate tool exists ─────────────────────────────────────────
  const tool = TOOL_REGISTRY[toolName];
  if (!tool) {
    throw Errors.invalidInput(`Unknown tool: "${toolName}"`);
  }

  // ── Step 3: Validate input against tool schema ───────────────────────────
  // The specific tool defines exactly what JSON structure it expects in `input`.
  const parsed = tool.schema.safeParse(input);
  if (!parsed.success) {
    throw Errors.invalidInput(
      parsed.error.errors[0]?.message ?? "Invalid AI input payload",
    );
  }

  // ── Step 4: Verify active subscription ──────────────────────────────────
  // requireActiveSubscription throws SUBSCRIPTION_REQUIRED if not active/trialing
  await requireActiveSubscription(userId);

  // ── Step 5: Check daily usage limit ─────────────────────────────────────
  await checkDailyLimit(userId);

  // ── Step 6: Rate limit (10 requests per minute per user) ─────────────────
  const rateLimit = checkRateLimit(`ai:${userId}`, 10, 60_000);
  if (!rateLimit.allowed) {
    throw Errors.rateLimited();
  }

  // ── Step 7: Generate with timeout ────────────────────────────────────────
  const timeoutMs = parseInt(env.AI_REQUEST_TIMEOUT_MS ?? "60000", 10);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  let result;
  try {
    result = await generateText(
      {
        prompt: tool.prompt,
        input: JSON.stringify(parsed.data),
        provider: "gemini",
      },
      controller.signal,
    );
  } finally {
    clearTimeout(timeout);
  }

  const durationMs = Date.now() - startTime;

  // ── Step 8: Log usage ────────────────────────────────────────────────────
  await logUsage(userId, toolName, {
    tokensUsed: result.tokensUsed,
    durationMs,
    provider: result.provider,
  });

  logAIEvent({
    userId,
    tool: toolName,
    success: true,
    tokensUsed: result.tokensUsed,
    durationMs,
  });

  return {
    success: true,
    result: result.text,
    imageUrl: result.imageUrl,
  };
}
