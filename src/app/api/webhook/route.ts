/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { PrismaClient } from "@/generated/prisma";
import { stripe } from "@/lib/stripe";

const prisma = new PrismaClient();
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

const PLAN_CONFIG = {
  "1month": { priceId: "price_1RnM3eBFIZwhMZd1ROS5Wcfc", iterations: 1 },
  "4month": { priceId: "price_1RnM4XBFIZwhMZd1hBQXEjmA", iterations: 4 },
  "1year": { priceId: "price_1RnM5yBFIZwhMZd13El8nfQ9", iterations: 12 },
} as const;

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err: any) {
    console.error("⚠️ Webhook signature verification failed.", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const userId = session.metadata?.userId;
      const planId = session.metadata?.planId;
      const subscriptionId = session.subscription as string;
      const customerId = session.customer as string;

      if (!userId || !planId || !subscriptionId || !customerId) {
        console.error("Missing required metadata or session fields:", session.metadata);
        return NextResponse.json({ error: "Missing metadata or session fields" }, { status: 400 });
      }

      const planConfig = PLAN_CONFIG[planId as keyof typeof PLAN_CONFIG];
      if (!planConfig) {
        console.error("Invalid planId in metadata:", planId);
        return NextResponse.json({ error: "Invalid planId in metadata" }, { status: 400 });
      }

      // Create subscription schedule
      const schedule = await stripe.subscriptionSchedules.create({
        from_subscription: subscriptionId,
      });
      console.log(`✅ Schedule created: ${schedule.id}`);

      const phases: Stripe.SubscriptionScheduleUpdateParams.Phase[] = schedule.phases.map((phase) => ({
        start_date: phase.start_date,
        end_date: phase.end_date,
        items: phase.items.map((item) => ({
          price: typeof item.price === "string" ? item.price : item.price?.id,
          quantity: item.quantity,
          billing_thresholds:
            item.billing_thresholds && typeof item.billing_thresholds.usage_gte === "number"
              ? { usage_gte: item.billing_thresholds.usage_gte }
              : undefined,
          tax_rates: item.tax_rates?.map((rate) => (typeof rate === "string" ? rate : rate.id)),
        })),
      }));

      const lastPhase = schedule.phases.at(-1);
      if (!lastPhase?.end_date) {
        throw new Error("Last phase missing end_date");
      }

      const updatedSchedule = await stripe.subscriptionSchedules.update(schedule.id, {
        end_behavior: "cancel",
        phases: [
          ...phases,
          {
            start_date: lastPhase.end_date,
            items: [{ price: planConfig.priceId, quantity: 1 }],
            iterations: planConfig.iterations,
          },
        ],
      });

      console.log("✅ Updated schedule phases:", updatedSchedule.phases);

      // Retrieve full subscription
      const subscription = await stripe.subscriptions.retrieve(subscriptionId) as any;
      if (!subscription.current_period_end) {
        throw new Error("Missing current_period_end from subscription");
      }

      // Upsert subscription in your DB
      await prisma.subscription.upsert({
        where: { id: subscriptionId },
        update: {
          status: subscription.status,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
        create: {
          id: subscriptionId,
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId,
          status: subscription.status,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          userId,
        },
      });

      // Update user record with Stripe customer ID
      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customerId },
      });

      console.log(`🎉 User ${userId} subscribed to ${planId}`);
    } catch (err) {
      console.error("❌ Error handling checkout.session.completed:", err);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }

  if (event.type === "subscription_schedule.completed") {
    const schedule = event.data.object as Stripe.SubscriptionSchedule;

    const lastPhase = schedule.phases.at(-1);
    if (!lastPhase?.end_date) {
      console.error("❌ subscription_schedule.completed missing end_date");
      return NextResponse.json({ error: "Invalid subscription schedule data" }, { status: 400 });
    }

    const finalEndDate = new Date(lastPhase.end_date * 1000);

    try {
      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: schedule.subscription as string },
        data: {
          status: "canceled",
          currentPeriodEnd: finalEndDate,
        },
      });

      console.log(`🛑 Subscription ${schedule.subscription} canceled as of ${finalEndDate.toISOString()}`);
    } catch (err) {
      console.error("❌ Error updating subscription status in DB:", err);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    return NextResponse.json({ received: true });
  }

  return NextResponse.json({ received: true });
}
