"use server";

import { revalidatePath } from "next/cache";

import { PrismaClient } from "@/generated/prisma";
import { getUser } from "@/lib/auth/auth-session";
import { VideoShortInput } from "@/lib/validation";

const prisma = new PrismaClient();

export async function createVideoShort(data: VideoShortInput) {
  const user = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  // Get associated author (must exist)
  const author = await prisma.author.findUnique({
    where: { userId: user.id },
  });

  if (!author) {
    throw new Error("User is not an author");
  }

  // Use a transaction to create Asset and VideoShort atomically
  await prisma.$transaction(async (tx) => {
    // 1. Create the asset first
    const asset = await tx.asset.create({
      data: {
        url: data.asset!.url,
        type: data.asset!.type,
        legend: data.asset!.legend,
        altText: data.asset!.altText,
      },
    });

    // 2. Create the video short referencing the newly created asset
    await tx.videoShort.create({
      data: {
        title: data.title,
        description: data.description,
        duration: data.duration,
        authorId: author.id,
        assetId: asset.id,
      },
    });
  });

  revalidatePath("/"); // Adjust the path as needed
}

export async function getLatestVideoShorts() {
  try {
    const videos = await prisma.videoShort.findMany({
      orderBy: {
        publishedAt: "desc",
      },
      take: 8,
      include: {
        asset: true,
      },
    });

    return videos;
  } catch (error) {
    console.error("[getLatestVideoShorts]", error);
    throw new Error("Failed to fetch latest video shorts.");
  }
}