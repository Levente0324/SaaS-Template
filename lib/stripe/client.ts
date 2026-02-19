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

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16" as any,
  typescript: true,
  // Telemetry disabled for privacy
  telemetry: false,
});
