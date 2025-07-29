"use server";

import { PrismaClient } from "@/generated/prisma";
import { getUser } from "@/lib/auth/auth-session";


const prisma = new PrismaClient();

export async function notifyBreakingNews(articleId: string, articleTitle: string) {
    const paidUsers = await prisma.user.findMany({
        where: {
            subscriptions: {
                some: {
                    status: "active",
                    currentPeriodEnd: { gt: new Date() },
                },
            },
        },
        select: { id: true },
    });

    const message = `Breaking News: "${articleTitle}" just dropped!`;

    for (const user of paidUsers) {
        await createNotification({
            userId: user.id,
            title: "📰 Breaking News",
            message,
            metadata: {
                articleId,
                type: "breaking_news",
            },
        });
    }

    console.log(`Notified ${paidUsers.length} paid users.`);
}


type CreateNotificationOptions = {
    userId: string
    title: string
    message: string
    channel?: "EMAIL" | "SMS" | "IN_APP"
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata?: any
}

 async function createNotification(options: CreateNotificationOptions) {
    const {
        userId,
        title,
        message,
        channel = "IN_APP",
        metadata,
    } = options;

    const pref = await prisma.notificationPreference.findUnique({
        where: { userId_channel: { userId, channel } },
    });

    if (!pref?.enabled) return null;

    return await prisma.notification.create({
        data: {
            userId,
            title,
            message,
            channel,
            metadata,
        },
    });
}


export async function getNotificationPreferences() {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  const preferences = await prisma.notificationPreference.findMany({
    where: { userId: user.id },
  });

  // Define Channel type
  type Channel = "EMAIL" | "SMS" | "IN_APP";
  // Transform array to object with default `false` if missing
  const prefsRecord: Record<Channel, boolean> = {
    EMAIL: false,
    SMS: false,
    IN_APP: false,
  };

  for (const pref of preferences) {
    prefsRecord[pref.channel] = pref.enabled;
  }

  return prefsRecord;
}


export async function updateNotificationPreferences(data: {
  EMAIL: boolean;
  SMS: boolean;
  IN_APP: boolean;
}) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  const updates = Object.entries(data).map(([channel, enabled]) =>
    prisma.notificationPreference.upsert({
      where: {
        userId_channel: {
          userId: user.id,
          channel: channel as "EMAIL" | "SMS" | "IN_APP",
        },
      },
      update: { enabled },
      create: {
        userId: user.id,
        channel: channel as "EMAIL" | "SMS" | "IN_APP",
        enabled,
      },
    })
  );

  await Promise.all(updates);

  return { success: true };
}
