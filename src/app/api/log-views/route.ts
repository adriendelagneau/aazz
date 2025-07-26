// src/app/api/log-view/route.ts
import crypto from "crypto";

import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

const MAX_VIEWS_PER_24H = 3;

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

        // Get IP address — note: in App Router, IP is from headers or request.ip (but may need custom extraction)
        const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "0.0.0.0";
        const userAgent = request.headers.get("user-agent") || "unknown";

        const visitorId = generateVisitorId(ip, userAgent, screenSize, timezone);

        const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const views = await prisma.articleView.count({
            where: {
                visitorId,
                viewedAt: { gte: cutoff },
            },
        });

        if (views >= MAX_VIEWS_PER_24H) {
            return NextResponse.json({ error: "Daily article limit reached" }, { status: 429 });
        }

        await prisma.articleView.create({
            data: {
                visitorId,
                articleId,
            },
        });

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("log-view error", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
