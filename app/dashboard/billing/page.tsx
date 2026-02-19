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
        <h2 className="text-3xl font-bold tracking-tight">
          Billing & Subscription
        </h2>
        <p className="text-gray-500">
          Manage your subscription and billing details.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Current Plan Card */}
        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          <div className="p-6 border-b bg-gray-50/50">
            <h3 className="font-semibold text-lg flex items-center">
              Current Plan
              {isPro && (
                <span className="ml-3 inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                  Pro Active
                </span>
              )}
            </h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-bold tracking-tight text-gray-900">
                {isPro ? "$19" : "$0"}
              </span>
              <span className="text-gray-500">/month</span>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                Status:{" "}
                <span className="font-medium text-gray-900 capitalize">
                  {status || "Free"}
                </span>
              </p>
              {periodEnd && (
                <p className="text-sm text-gray-500">
                  {isCanceled ? "Expires on" : "Renews on"}:{" "}
                  <span className="font-medium text-gray-900">{periodEnd}</span>
                </p>
              )}
            </div>

            <ManageSubscriptionButton isPro={isPro} />
          </div>
        </div>

        {/* Features List */}
        <div className="rounded-xl border bg-slate-900 text-white shadow-sm p-8">
          <h3 className="font-semibold text-lg mb-6">Pro Features</h3>
          <ul className="space-y-4">
            <li className="flex items-center space-x-3">
              <Check className="h-5 w-5 text-indigo-400 flex-shrink-0" />
              <span>Unlimited AI Generations</span>
            </li>
            <li className="flex items-center space-x-3">
              <Check className="h-5 w-5 text-indigo-400 flex-shrink-0" />
              <span>Priority Support</span>
            </li>
            <li className="flex items-center space-x-3">
              <Check className="h-5 w-5 text-indigo-400 flex-shrink-0" />
              <span>Advanced Analytics</span>
            </li>
            <li className="flex items-center space-x-3">
              <Check className="h-5 w-5 text-indigo-400 flex-shrink-0" />
              <span>Early Access to New Features</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Client component for the button to handle the API call
import { ManageSubscriptionButton } from "./_components/buttons";
