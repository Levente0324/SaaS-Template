import { redirect } from "next/navigation";
import { getCurrentUser, getUserProfile } from "@/lib/auth/helpers";
import { Check, CreditCard, ExternalLink } from "lucide-react";

export default async function BillingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const profile = await getUserProfile(user.id);
  const isPro = profile?.plan === "pro";
  const status = profile?.subscription_status;
  const isCanceled = status === "canceled";

  // Format the renewal/expiry date
  const periodEnd = profile?.current_period_end
    ? new Date(profile.current_period_end).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          Billing & Subscription
        </h2>
        <p className="text-foreground/60">
          Manage your subscription and billing details.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Current Plan Card */}
        <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden transition-colors duration-300">
          <div className="p-6 border-b border-border/50 bg-muted/20">
            <h3 className="font-semibold text-lg flex items-center text-foreground">
              Current Plan
              {isPro && (
                <span className="ml-3 inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                  Pro Active
                </span>
              )}
            </h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-bold tracking-tight text-foreground">
                {isPro ? "$19" : "$0"}
              </span>
              <span className="text-foreground/60">/month</span>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-foreground/60">
                Status:{" "}
                <span className="font-medium text-foreground capitalize">
                  {status || "Free"}
                </span>
              </p>
              {periodEnd && (
                <p className="text-sm text-foreground/60">
                  {isCanceled ? "Expires on" : "Renews on"}:{" "}
                  <span className="font-medium text-foreground">
                    {periodEnd}
                  </span>
                </p>
              )}
            </div>

            <ManageSubscriptionButton isPro={isPro} />
          </div>
        </div>

        {/* Features List */}
        <div className="rounded-xl border border-border/50 bg-primary text-primary-foreground shadow-sm p-8 transition-colors duration-300">
          <h3 className="font-semibold text-lg mb-6 text-primary-foreground">
            Pro Features
          </h3>
          <ul className="space-y-4">
            <li className="flex items-center space-x-3">
              <Check className="h-5 w-5 text-primary-foreground/70 flex-shrink-0" />
              <span className="text-primary-foreground/90">
                Unlimited AI Generations
              </span>
            </li>
            <li className="flex items-center space-x-3">
              <Check className="h-5 w-5 text-primary-foreground/70 flex-shrink-0" />
              <span className="text-primary-foreground/90">
                Priority Support
              </span>
            </li>
            <li className="flex items-center space-x-3">
              <Check className="h-5 w-5 text-primary-foreground/70 flex-shrink-0" />
              <span className="text-primary-foreground/90">
                Advanced Analytics
              </span>
            </li>
            <li className="flex items-center space-x-3">
              <Check className="h-5 w-5 text-primary-foreground/70 flex-shrink-0" />
              <span className="text-primary-foreground/90">
                Early Access to New Features
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Client component for the button to handle the API call
import { ManageSubscriptionButton } from "./_components/buttons";
