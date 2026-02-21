/**
 * lib/stripe/client.ts
 * Server-side Stripe SDK instance.
 *
 * SECURITY: This file must NEVER be imported in client-side code.
 * The STRIPE_SECRET_KEY is a server-only secret.
 */
import "server-only";
import Stripe from "stripe";

import { env } from "@/lib/env";

// Use a dummy key during build phase to prevent Next.js static compilation crashes
export const stripe = new Stripe(env.STRIPE_SECRET_KEY || "sk_test_dummy", {
  apiVersion: "2023-10-16" as any,
  typescript: true,
  // Telemetry disabled for privacy
  telemetry: false,
});
