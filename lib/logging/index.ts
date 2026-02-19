/**
 * lib/logging/index.ts
 * Centralized logging utilities for AI events, billing events, and errors.
 *
 * Currently outputs structured JSON to console.
 * Replace the console.log calls with your external service
 * (e.g. Datadog, Sentry, Axiom, Logtail) without changing call sites.
 */

interface AIEventData {
  userId: string;
  tool: string;
  success: boolean;
  tokensUsed?: number;
  durationMs?: number;
  error?: string;
}

interface BillingEventData {
  userId?: string;
  stripeEventId?: string;
  stripeEventType?: string;
  customerId?: string;
  subscriptionId?: string;
  plan?: string;
  status?: string;
  action: string;
}

interface ErrorData {
  message: string;
  code?: string;
  context?: Record<string, unknown>;
  stack?: string;
}

function formatLog(
  level: string,
  category: string,
  data: Record<string, unknown>,
) {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    category,
    ...data,
  });
}

/** Log AI generation events (usage tracking, cost monitoring) */
export function logAIEvent(data: AIEventData): void {
  const level = data.success ? "info" : "warn";
  console.log(
    formatLog(level, "AI_EVENT", data as unknown as Record<string, unknown>),
  );
}

/** Log billing/subscription events (Stripe webhooks, plan changes) */
export function logBillingEvent(data: BillingEventData): void {
  console.log(
    formatLog(
      "info",
      "BILLING_EVENT",
      data as unknown as Record<string, unknown>,
    ),
  );
}

/** Log application errors (never include user PII in stack traces) */
export function logError(
  error: unknown,
  context?: Record<string, unknown>,
): void {
  const errorData: ErrorData = {
    message: error instanceof Error ? error.message : String(error),
    code: (error as { code?: string }).code,
    context,
    // Only include stack in development
    stack:
      process.env.NODE_ENV === "development" && error instanceof Error
        ? error.stack
        : undefined,
  };
  console.error(
    formatLog(
      "error",
      "APP_ERROR",
      errorData as unknown as Record<string, unknown>,
    ),
  );
}
