/**
 * lib/errors.ts
 * Centralized error handling utilities.
 *
 * SECURITY: Never expose internal errors or stack traces to clients.
 * All error responses are sanitized through safeErrorResponse().
 */

export type ErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "USAGE_LIMIT_EXCEEDED"
  | "RATE_LIMITED"
  | "AI_DISABLED"
  | "SUBSCRIPTION_REQUIRED"
  | "INVALID_INPUT"
  | "INTERNAL_ERROR"
  | "WEBHOOK_DUPLICATE"
  | "PAYMENT_FAILED";

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;

  constructor(code: ErrorCode, message: string, statusCode: number = 500) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

// Map error codes to HTTP status codes and safe user-facing messages
const ERROR_MAP: Record<ErrorCode, { status: number; message: string }> = {
  UNAUTHORIZED: { status: 401, message: "Authentication required." },
  FORBIDDEN: {
    status: 403,
    message: "You do not have permission to perform this action.",
  },
  USAGE_LIMIT_EXCEEDED: {
    status: 429,
    message: "Daily usage limit reached. Try again tomorrow.",
  },
  RATE_LIMITED: {
    status: 429,
    message: "Too many requests. Please slow down.",
  },
  AI_DISABLED: {
    status: 503,
    message: "AI features are temporarily unavailable.",
  },
  SUBSCRIPTION_REQUIRED: {
    status: 403,
    message: "An active subscription is required for this action.",
  },
  INVALID_INPUT: { status: 400, message: "Invalid input provided." },
  INTERNAL_ERROR: {
    status: 500,
    message: "An unexpected error occurred. Please try again.",
  },
  WEBHOOK_DUPLICATE: { status: 200, message: "Event already processed." },
  PAYMENT_FAILED: {
    status: 402,
    message: "Payment failed. Please update your payment method.",
  },
};

/**
 * Converts any error into a safe, client-facing response.
 * Stack traces and internal details are never returned.
 */
export function safeErrorResponse(error: unknown): {
  status: number;
  body: { success: false; error: string; code: string };
} {
  if (error instanceof AppError) {
    const mapped = ERROR_MAP[error.code];
    return {
      status: mapped.status,
      body: { success: false, error: mapped.message, code: error.code },
    };
  }

  // Unknown/unexpected errors: log internally but return generic message
  console.error("[AppError] Unhandled error:", error);
  return {
    status: 500,
    body: {
      success: false,
      error: ERROR_MAP.INTERNAL_ERROR.message,
      code: "INTERNAL_ERROR",
    },
  };
}

/** Convenience factories */
export const Errors = {
  unauthorized: () => new AppError("UNAUTHORIZED", "Not authenticated", 401),
  forbidden: () => new AppError("FORBIDDEN", "Access denied", 403),
  subscriptionRequired: () =>
    new AppError("SUBSCRIPTION_REQUIRED", "Active subscription required", 403),
  usageLimitExceeded: () =>
    new AppError("USAGE_LIMIT_EXCEEDED", "Daily limit exceeded", 429),
  rateLimited: () => new AppError("RATE_LIMITED", "Rate limit exceeded", 429),
  aiDisabled: () => new AppError("AI_DISABLED", "AI features disabled", 503),
  invalidInput: (msg: string) => new AppError("INVALID_INPUT", msg, 400),
  internal: (msg?: string) =>
    new AppError("INTERNAL_ERROR", msg ?? "Internal error", 500),
};
