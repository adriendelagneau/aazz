"use client";
import React from "react";
import { toast } from "sonner"; // or your toast library

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

type Plan = "1month" | "4month" | "1year";

interface PlanInfo {
  id: Plan;
  title: string;
  price: string;
  description: string;
  iterations: number;
}

const plans: PlanInfo[] = [
  {
    id: "1month",
    title: "1 Month Plan",
    price: "$1 / month",
    description: "Billed monthly for 1 month",
    iterations: 1,
  },
  {
    id: "4month",
    title: "4 Months Plan",
    price: "$0.75 / month",
    description: "Billed monthly for 4 months",
    iterations: 4,
  },
  {
    id: "1year",
    title: "1 Year Plan",
    price: "$0.50 / month",
    description: "Billed monthly for 12 months",
    iterations: 12,
  },
];

// Common benefits for all plans
const baseBenefits = [
  "Unlimited reading",
  "Bookmark articles",
  "Speech synthesis",
  "No automatic renewal",
];

interface SubscribeCardsProps {
  onSubscribe: (planId: Plan) => void;
  isLoggedIn: boolean;
}
export const SubscribeCards: React.FC<SubscribeCardsProps> = ({
  onSubscribe,
  isLoggedIn,
}) => {
  return (
    <div className="flex justify-center gap-6">
      {plans.map(({ id, title, price, description }) => {
        const benefits = baseBenefits; // same for all now

        return (
          <Card key={id} className="flex h-96 w-72 flex-col justify-between">
            <CardHeader>
              <CardTitle className="text-3xl">{title}</CardTitle>
              <CardDescription className="text-md">
                {description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col justify-between">
              {/* Benefits list */}
              <ul className="mb-6 space-y-2">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-2">
                    <svg
                      className="h-5 w-5 flex-shrink-0 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {benefit}
                  </li>
                ))}
              </ul>
              <p className="mb-4 text-xl font-semibold">{price}</p>
              <Button
                disabled={!isLoggedIn}
                onClick={() => {
                  if (!isLoggedIn) {
                    toast.error("Please register or log in to subscribe");
                    return;
                  }
                  onSubscribe(id);
                }}
                className="w-full cursor-pointer text-lg font-medium"
              >
                Subscribe
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
