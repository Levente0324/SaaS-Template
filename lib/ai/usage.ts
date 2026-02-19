/**
 * lib/ai/usage.ts
 * Daily usage limit tracking and usage logging.
 *
 * SECURITY: Uses service role admin client to bypass RLS for server-side
 * operations. Never expose this to clients.
 */
import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import { logAIEvent } from "@/lib/logging";
import { Errors } from "@/lib/errors";
import { env } from "@/lib/env";

/**
 * checkDailyLimit
 * Counts AI tool executions for a user in the last 24 hours.
 * Throws USAGE_LIMIT_EXCEEDED if the limit is reached.
 */
export async function checkDailyLimit(userId: string): Promise<void> {
  const maxUsage = parseInt(env.MAX_DAILY_USAGE_PER_USER ?? "10", 10);

  const supabase = await createAdminClient();
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { count, error } = await supabase
    .from("usage_logs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", since);

  if (error) {
    // Fail open on DB errors to avoid blocking users due to infra issues
    console.error("[checkDailyLimit] DB error — failing open:", error);
    return;
  }

  if ((count ?? 0) >= maxUsage) {
    throw Errors.usageLimitExceeded();
  }
}

/**
 * logUsage
 * Inserts a usage_log entry after a successful AI tool execution.
 */
export async function logUsage(
  userId: string,
  tool: string,
  metadata?: Record<string, unknown>,
): Promise<void> {
  const supabase = await createAdminClient();

  const { error } = await supabase.from("usage_logs").insert({
    user_id: userId,
    tool,
    metadata: metadata ?? null,
  });

  if (error) {
    // Non-fatal: log the error but don't crash the request
    logAIEvent({
      userId,
      tool,
      success: false,
      error: `Failed to log usage: ${error.message}`,
    });
  }
}
