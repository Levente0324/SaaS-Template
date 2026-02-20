/**
 * lib/billing/helpers.ts
 * Billing helper functions: customer management and subscription validation.
 *
 * SECURITY: All functions are server-only. They read from the database
 * and interact with Stripe — no client can bypass these checks.
 */
import "server-only";
import { stripe } from "@/lib/stripe/client";
import { createAdminClient } from "@/lib/supabase/server";
import { Errors } from "@/lib/errors";
import { logBillingEvent } from "@/lib/logging";
import type { Profile, SubscriptionStatus } from "@/types";

// Subscription statuses considered "active" for feature access
const ACTIVE_STATUSES: SubscriptionStatus[] = ["active", "trialing"];

/**
 * Returns an existing Stripe customer or creates a new one.
 * Idempotent: checks DB first before creating in Stripe.
 */
export async function getOrCreateStripeCustomer(
  userId: string,
  email: string,
): Promise<string> {
  const supabase = await createAdminClient();

  // Check if user already has a Stripe customer ID
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", userId)
    .single();

  if (profile?.stripe_customer_id) {
    return profile.stripe_customer_id;
  }

  // Create a new Stripe customer
  const customer = await stripe.customers.create({
    email,
    metadata: { userId }, // Link Stripe customer back to our user
  });

  // Store the customer ID in our DB
  await supabase
    .from("profiles")
    .update({ stripe_customer_id: customer.id })
    .eq("id", userId);

  logBillingEvent({
    userId,
    customerId: customer.id,
    action: "customer_created",
  });

  return customer.id;
}

/**
 * requireActiveSubscription
 * Throws SUBSCRIPTION_REQUIRED if the user does not have an active plan.
 * Call this at the top of any premium feature handler.
 *
 * SECURITY: This runs server-side only. Never trust client claims about plan.
 */
export async function requireActiveSubscription(
  userId: string,
): Promise<Profile> {
  const supabase = await createAdminClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !profile) {
    throw Errors.unauthorized();
  }

  const isActive = ACTIVE_STATUSES.includes(
    profile.subscription_status as SubscriptionStatus,
  );

  if (!isActive) {
    throw Errors.subscriptionRequired();
  }

  return profile as Profile;
}

/**
 * updateProfileFromSubscription
 * Syncs Stripe subscription state to the profiles table.
 * Called by the webhook handler — this is the single source of truth.
 */
export async function updateProfileFromSubscription(
  customerId: string,
  subscriptionId: string,
  status: string,
  currentPeriodEnd: number,
  priceId?: string,
): Promise<void> {
  const supabase = await createAdminClient();

  // Determine plan tier from price ID
  const plan = priceId === process.env.STRIPE_PRICE_ID ? "pro" : "free";

  const { error } = await supabase
    .from("profiles")
    .update({
      stripe_subscription_id: subscriptionId,
      subscription_status: status,
      current_period_end: currentPeriodEnd
        ? new Date(currentPeriodEnd * 1000).toISOString()
        : new Date().toISOString(),
      plan: ACTIVE_STATUSES.includes(status as SubscriptionStatus)
        ? plan
        : "free",
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_customer_id", customerId);

  if (error) {
    throw new Error(
      `Failed to update profile for customer ${customerId}: ${error.message}`,
    );
  }

  logBillingEvent({
    customerId,
    subscriptionId,
    status,
    plan,
    action: "subscription_synced",
  });
}

/**
 * downgradeUser
 * Downgrades user to free plan when subscription is canceled/expired.
 */
export async function downgradeUser(
  customerId: string,
  reason: string,
): Promise<void> {
  const supabase = await createAdminClient();

  await supabase
    .from("profiles")
    .update({
      plan: "free",
      subscription_status: reason,
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_customer_id", customerId);

  logBillingEvent({ customerId, action: `downgraded_to_free:${reason}` });
}
