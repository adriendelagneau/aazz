import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { PrismaClient } from "@/generated/prisma";
import { stripe } from "@/lib/stripe";

type StripeSubscriptionType = Stripe.Subscription;

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

      if (!userId || !planId || !subscriptionId) {
        console.error("Missing required metadata in session:", session.metadata);
        return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
      }

      const planConfig = PLAN_CONFIG[planId as keyof typeof PLAN_CONFIG];
      if (!planConfig) {
        console.error("Plan config not found for planId:", planId);
        return NextResponse.json({ error: "Invalid planId in metadata" }, { status: 400 });
      }

      // Create subscription schedule from the original subscription
      const schedule = await stripe.subscriptionSchedules.create({
        from_subscription: subscriptionId,
      });
      console.log(`Schedule created: ${schedule.id}`);

      // Transform phases to match the expected update param type
      const phases = schedule.phases.map((phase) => ({
        start_date: phase.start_date,
        end_date: phase.end_date,
        items: phase.items.map((item) => ({
          price: typeof item.price === "string" ? item.price : item.price.id,
          quantity: item.quantity,
        })),
      }));

      const lastPhase = schedule.phases[schedule.phases.length - 1];
      const newPhaseStartDate = lastPhase.end_date;

      const updatedSchedule = await stripe.subscriptionSchedules.update(schedule.id, {
        end_behavior: "cancel",
        phases: [
          ...phases,
          {
            start_date: newPhaseStartDate,
            items: [
              {
                price: planConfig.priceId,
                quantity: 1,
              },
            ],
            iterations: planConfig.iterations,
          },
        ],
      });
      console.log("Updated schedule phases:", updatedSchedule.phases);

      //   Update user subscription in your DB
      // Fetch subscription details from Stripe
      const subscription = await stripe.subscriptions.retrieve(subscriptionId) as StripeSubscriptionType;


      // Upsert subscription in your DB
      await prisma.subscription.upsert({
        where: {
          id: subscriptionId, // Use the unique 'id' field
        },
        update: {
          status: subscription.status,
          currentPeriodEnd: new Date(subscription.items.data[0].current_period_end * 1000),
        },
        create: {
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: subscriptionId,
          status: subscription.status,
          currentPeriodEnd: new Date(subscription.items.data[0].current_period_end * 1000),
          userId,
        },
      });

      // Update user
      await prisma.user.update({
        where: { id: userId },
        data: {
          stripeCustomerId: session.customer as string,
        },
      });


      console.log(`User ${userId} subscription updated to plan ${planId}`);

    } catch (err) {
      console.error("Error handling checkout.session.completed webhook:", err);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }
  if (event.type === "subscription_schedule.completed") {
    const schedule = event.data.object as Stripe.SubscriptionSchedule;

    const lastPhase = schedule.phases.at(-1);
    if (!lastPhase || !lastPhase.end_date) {
      console.error("Schedule has no phases or missing end_date");
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

      console.log(`Subscription ${schedule.subscription} marked as canceled at ${finalEndDate.toISOString()}`);
    } catch (err) {
      console.error("Error updating subscription in DB:", err);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    return NextResponse.json({ received: true });
  }

  return NextResponse.json({ received: true });
}
