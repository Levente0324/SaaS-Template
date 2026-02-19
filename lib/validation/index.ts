/**
 * lib/validation/index.ts
 * Zod schemas for validating all user-facing inputs.
 * Import these in Route Handlers and Server Actions.
 *
 * SECURITY: Never trust client input. Always validate before processing.
 */
import { z } from "zod";

/** AI tool execution request body */
export const AIRunSchema = z.object({
  toolName: z
    .string()
    .min(1, "toolName is required")
    .max(100, "toolName too long")
    .regex(/^[a-zA-Z0-9_-]+$/, "toolName contains invalid characters"),
  input: z
    .string()
    .min(1, "input is required")
    .max(10_000, "input too long (max 10,000 characters)"),
});

/** Stripe checkout request */
export const CheckoutSchema = z.object({
  priceId: z.string().optional(), // Server will use env.STRIPE_PRICE_ID if not provided
});

export type AIRunInput = z.infer<typeof AIRunSchema>;
export type CheckoutInput = z.infer<typeof CheckoutSchema>;
