// app/api/notifications/route.ts
import { NextResponse } from "next/server";

import { PrismaClient } from "@/generated/prisma";
import { getUser } from "@/lib/auth/auth-session";

const prisma = new PrismaClient();

export async function GET() {

    const currentUser = await getUser();
    if (!currentUser) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const notifications = await prisma.notification.findMany({
            where: { userId: currentUser.id },
            orderBy: { createdAt: "desc" },
            take: 50, // limit to recent notifications
        });

        return NextResponse.json({ notifications });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
