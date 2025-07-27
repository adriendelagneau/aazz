import crypto from "crypto";

import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from "@/generated/prisma";
import { getUser } from "@/lib/auth/auth-session";

const prisma = new PrismaClient();

// Daily read limits per role
const LIMITS = {
    visitor: 1,
    user: 3,
    subscriber: Infinity,
};

function generateVisitorId(ip: string, userAgent: string, screenSize: string, timezone: string) {
    const raw = `${ip}|${userAgent}|${screenSize}|${timezone}`;
    return crypto.createHash("sha256").update(raw).digest("hex");
}

export async function POST(request: NextRequest) {
    try {
        const { articleId, screenSize, timezone } = await request.json();

        if (!articleId || !screenSize || !timezone) {
            return NextResponse.json({ error: "Missing data" }, { status: 400 });
        }

        const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "0.0.0.0";
        const userAgent = request.headers.get("user-agent") || "unknown";

        // Step 1: Auth
        const currentUser = await getUser(); // returns null if not logged in

        let role: "visitor" | "user" | "subscriber" = "visitor";
        let userId: string | null = null;
        let visitorId: string | null = null;

        if (currentUser) {
            const user = await prisma.user.findUnique({
                where: { id: currentUser.id },
                include: { subscriptions: true },
            });

            const isSubscribed = user?.subscriptions?.some(
                (sub) =>
                    sub.status === "active" &&
                    sub.currentPeriodEnd &&
                    sub.currentPeriodEnd > new Date()
            );

            role = isSubscribed ? "subscriber" : "user";
            if (user) {
                userId = user.id;
            }
        } else {
            visitorId = generateVisitorId(ip, userAgent, screenSize, timezone);
        }

        // Step 2: Count recent views
        const viewCount = await prisma.articleView.count({
            where: {
                ...(visitorId ? { visitorId } : { userId }),
                viewedAt: { gte: cutoff },
            },
        });

        const dailyLimit = LIMITS[role];

        if (viewCount >= dailyLimit) {
            return NextResponse.json(
                { error: "Daily article limit reached", remaining: 0 },
                { status: 429 }
            );
        }

        // Step 3: Avoid duplicate logging of same article in same day
        const alreadyViewed = await prisma.articleView.findFirst({
            where: {
                articleId,
                viewedAt: { gte: cutoff },
                ...(visitorId ? { visitorId } : { userId }),
            },
        });

        if (!alreadyViewed) {
            await prisma.articleView.create({
                data: {
                    articleId,
                    userId,
                    visitorId,
                },
            });

            // Increment article total views
            await prisma.article.update({
                where: { id: articleId },
                data: { views: { increment: 1 } },
            });
        }

        return NextResponse.json({
            ok: true,
            remaining: dailyLimit - viewCount - 1,
            role,
        });
    } catch (err) {
        console.error("Error logging view:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
