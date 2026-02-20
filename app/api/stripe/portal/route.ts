/**
 * app/api/stripe/portal/route.ts
 * Creates a Stripe Billing Portal session for subscription management.
 *
 * SECURITY: Requires active subscription — users without a subscription
 * cannot access the portal.
 */
import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/helpers";
import { requireActiveSubscription } from "@/lib/billing/helpers";
import { stripe } from "@/lib/stripe/client";
import { safeErrorResponse } from "@/lib/errors";
import { logBillingEvent, logError } from "@/lib/logging";

export const dynamic = "force-dynamic";

export async function POST(_request: NextRequest) {
  try {
    // 1. Require authenticated user
    const user = await requireUser();

    // 2. Require active subscription (also returns the profile with Stripe IDs)
    const profile = await requireActiveSubscription(user.id);

    if (!profile.stripe_customer_id) {
      return NextResponse.json(
        { success: false, error: "No billing account found." },
        { status: 400 },
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const cleanAppUrl = appUrl.endsWith("/") ? appUrl.slice(0, -1) : appUrl;

    // 3. Create Billing Portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${cleanAppUrl}/dashboard/billing`,
    });

    logBillingEvent({
      userId: user.id,
      customerId: profile.stripe_customer_id,
      action: "portal_session_created",
    });

    return NextResponse.json({ success: true, url: portalSession.url });
  } catch (error) {
    logError(error, { route: "/api/stripe/portal" });
    const { status, body } = safeErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
