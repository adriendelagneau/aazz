import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from "@/generated/prisma";
import { getUser } from "@/lib/auth/auth-session";
import { stripe } from "@/lib/stripe";


const prisma = new PrismaClient();


const PLAN_CONFIG = {
  "1month": { priceId: "price_1RnM3eBFIZwhMZd1ROS5Wcfc" },
  "4month": { priceId: "price_1RnM4XBFIZwhMZd1hBQXEjmA" },
  "1year": { priceId: "price_1RnM5yBFIZwhMZd13El8nfQ9" },
} as const;

export async function POST(req: NextRequest) {
  const currentUser = await getUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { planId } = await req.json();
  const config = PLAN_CONFIG[planId as keyof typeof PLAN_CONFIG];
  if (!config?.priceId) {
    return NextResponse.json({ error: "Invalid plan configuration" }, { status: 400 });
  }


  const { priceId } = PLAN_CONFIG[planId as keyof typeof PLAN_CONFIG];

  const user = await prisma.user.findUnique({ where: { email: currentUser.email } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Get or create Stripe customer
  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email!,
    });
    customerId = customer.id;

    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: {
      userId: user.id,
      planId: planId, // this is important
    },
    success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?success=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/subscribe?canceled=1`,
  });

  return NextResponse.json({ url: session.url });
}
