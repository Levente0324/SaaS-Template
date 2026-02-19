/**
 * app/api/stripe/checkout/route.ts
 * Creates a Stripe Checkout Session for subscription purchase.
 *
 * SECURITY:
 * - Server-side auth check (requireUser)
 * - Customer lookup/creation happens server-side
 * - Client never handles Stripe secret key
 * - Redirect handled client-side from returned URL (not a server redirect,
 *   which prevents CSRF issues with session-based auth)
 */
import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/helpers";
import { getOrCreateStripeCustomer } from "@/lib/billing/helpers";
import { stripe } from "@/lib/stripe/client";
import { CheckoutSchema } from "@/lib/validation";
import { safeErrorResponse } from "@/lib/errors";
import { logBillingEvent, logError } from "@/lib/logging";
import { env } from "@/lib/env";

export async function POST(request: NextRequest) {
  try {
    // 1. Require authenticated user
    const user = await requireUser();

    // 2. Validate request body
    const body = await request.json().catch(() => ({}));
    const parsed = CheckoutSchema.safeParse(body);

    // Use provided priceId or fall back to the default from env
    const priceId =
      parsed.success && parsed.data.priceId
        ? parsed.data.priceId
        : env.STRIPE_PRICE_ID;

    if (!priceId) {
      return NextResponse.json(
        { success: false, error: "No price configured." },
        { status: 500 },
      );
    }

    // 3. Get or create Stripe customer (idempotent)
    const customerId = await getOrCreateStripeCustomer(
      user.id,
      user.email ?? "",
    );

    const appUrl = env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    // 4. Create Checkout Session
    const session = await stripe.checkout.sessions.create(
      {
        customer: customerId,
        mode: "subscription",
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${appUrl}/dashboard/billing?status=success`,
        cancel_url: `${appUrl}/dashboard/billing?status=canceled`,
        metadata: { userId: user.id }, // Mirror in invoice for webhook use
        subscription_data: {
          metadata: { userId: user.id },
        },
        allow_promotion_codes: true,
      },
      {
        // Idempotency key: prevents double-charging if client retries
        idempotencyKey: `checkout-${user.id}-${priceId}`,
      },
    );

    logBillingEvent({
      userId: user.id,
      action: "checkout_session_created",
      customerId,
    });

    return NextResponse.json({ success: true, url: session.url });
  } catch (error) {
    logError(error, { route: "/api/stripe/checkout" });
    const { status, body } = safeErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
