"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth/auth-client";

import { SubscribeCards } from "./components/subscribe-card";

const SubscriptionPage = () => {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const handleSubscribe = async (planId: "1month" | "4month" | "1year") => {
    if (!session?.user) {
      toast.error("Please log in or register to subscribe");
      return;
    }

    try {
      const res = await fetch("/api/stripe/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planId }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Something went wrong. Try again.");
        return;
      }

      // If using Stripe Subscription Schedule (no checkout redirect needed)
      // toast.success("Subscription scheduled successfully!");

      // If using Stripe Checkout session
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.success("Subscription scheduled successfully!");
        router.push("/dashboard"); // optional, depending on UX
      }
    } catch (error) {
      console.error("Subscribe error:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <div className="flex  w-full flex-col items-center justify-center gap-6 p-6">
      <h1 className="mt-12 text-3xl">Choose your subscription plan</h1>
      <SubscribeCards
        onSubscribe={handleSubscribe}
        isLoggedIn={!!session?.user}
      />
    </div>
  );
};

export default SubscriptionPage;
