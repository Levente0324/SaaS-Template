/**
 * types/index.ts
 * Central type definitions shared across the entire application.
 * Customize these when building your specific SaaS product.
 */

export type Plan = "free" | "pro";
export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "unpaid"
  | "paused"
  | "incomplete"
  | "incomplete_expired"
  | null;

export interface Profile {
  id: string;
  email: string | null;
  plan: Plan;
  subscription_status: SubscriptionStatus;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface UsageLog {
  id: string;
  user_id: string;
  tool: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface AIToolResult {
  success: boolean;
  result?: string;
  imageUrl?: string; // Supports image generation AI modals (DALL-E, Nano Banana, Fal.ai)
  error?: string;
}

// End of types
