/**
 * app/api/stripe/webhook/route.ts
 * Stripe Webhook Handler.
 *
 * Responsibilities:
 * 1. Verify Stripe signature (security).
 * 2. Idempotency check via webhook_events table.
 * 3. Handle subscription lifecycle events.
 * 4. Update local database state.
 */
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";
import { createAdminClient } from "@/lib/supabase/server";
import {
  updateProfileFromSubscription,
  downgradeUser,
} from "@/lib/billing/helpers";
import { logBillingEvent, logError } from "@/lib/logging";
import { Errors, safeErrorResponse } from "@/lib/errors";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get("Stripe-Signature") as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  // 1. Verify Signature
  try {
    if (!webhookSecret) throw new Error("Missing STRIPE_WEBHOOK_SECRET");
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error(`⚠️  Webhook signature verification failed.`, err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // 2. Idempotency Check
  const supabase = await createAdminClient();
  const { data: existingEvent } = await supabase
    .from("webhook_events")
    .select("id")
    .eq("id", event.id)
    .single();

  if (existingEvent) {
    return NextResponse.json({ received: true, processing: "skipped" });
  }

  // Record event as processing
  await supabase.from("webhook_events").insert({
    id: event.id,
    type: event.type,
  });

  try {
    // 3. Handle Events
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        const subscriptionId = session.subscription as string;

        if (userId && subscriptionId) {
          // Fetch subscription details to get status and period end
          const subscription =
            await stripe.subscriptions.retrieve(subscriptionId);
          await updateProfileFromSubscription(
            session.customer as string,
            subscription.id,
            subscription.status,
            subscription.current_period_end,
            undefined, // Price ID inferred from status for now, or fetch if needed
          );
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
      case "customer.subscription.paused":
      case "customer.subscription.resumed": {
        const subscription = event.data.object;
        await updateProfileFromSubscription(
          subscription.customer as string,
          subscription.id,
          subscription.status,
          subscription.current_period_end,
          subscription.items.data[0]?.price.id,
        );
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const customerId = invoice.customer as string;
        // Optional: Notify user via email here
        // LOG AS ERROR to ensure visibility in monitoring
        console.error(
          JSON.stringify({
            level: "error",
            category: "BILLING_EVENT",
            action: "invoice_payment_failed",
            customerId,
            invoiceId: invoice.id,
            amount: invoice.amount_due,
          }),
        );
        break;
      }

      default:
        // Unhandled event type
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    logError(error, { route: "/api/stripe/webhook", eventId: event.id });
    // Return 200 even on error to prevent Stripe from retrying indefinitely
    // (unless it's a transient error we want to retry)
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 },
    );
  }
}
