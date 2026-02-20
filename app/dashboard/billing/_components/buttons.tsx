"use client";

import { useState } from "react";
import { CreditCard, ExternalLink, Loader2 } from "lucide-react";

export function ManageSubscriptionButton({ isPro }: { isPro: boolean }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const endpoint = isPro ? "/api/stripe/portal" : "/api/stripe/checkout";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (data.url) {
        window.location.assign(data.url);
        // Clear the loading state after 3 seconds in case the browser
        // forced it into a new tab (like IDE viewers do)
        setTimeout(() => setLoading(false), 3000);
      } else {
        alert(data.error || "An error occurred");
        setLoading(false);
      }
    } catch {
      alert("Failed to connect to billing service");
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`w-full inline-flex justify-center items-center rounded-lg px-4 py-2.5 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 transition-all
        ${
          isPro
            ? "bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            : "bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600"
        }`}
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : isPro ? (
        <ExternalLink className="mr-2 h-4 w-4" />
      ) : (
        <CreditCard className="mr-2 h-4 w-4" />
      )}
      {isPro ? "Manage Subscription" : "Upgrade to Pro"}
    </button>
  );
}
