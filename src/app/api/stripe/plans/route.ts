// app/api/stripe/plans/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { stripe } from "@/lib/stripe";

export async function GET() {
    try {
        const prices = await stripe.prices.list({
            expand: ["data.product"],
            active: true,
            recurring: { interval: "month" }, // optional filter
        });

        const formatted = prices.data.map((price) => {
            const product = price.product as Stripe.Product;

            console.log(product, "product details");
            return {
                id: price.id,
                title: product.name,
                description: product.description,
                price: (price.unit_amount || 0) / 100,
                currency: price.currency.toUpperCase(),
                interval: price.recurring?.interval,
                interval_count: price.recurring?.interval_count,
            };
        });

        return NextResponse.json(formatted);
    } catch (error) {
        console.error("Stripe price fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 });
    }
}
