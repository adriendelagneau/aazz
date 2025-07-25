// src/actions/author-actions.ts
"use server";


import { PrismaClient } from "@/generated/prisma"; // Adjust import if needed
import slugify from "@/lib/utils";

import { getUserRole } from "./user-actions";

const prisma = new PrismaClient();

export async function createAuthor({
    name,
    bio,
    userId,
}: {
    name: string;
    bio?: string;
    userId: string;
}) {
    const { role } = await getUserRole();

    if (role !== "ADMIN") {
        return { error: "Unauthorized. Only admins can create authors." };
    }

    const slugBase = slugify(name);
    let slug = slugBase;
    let count = 1;

    while (await prisma.author.findUnique({ where: { slug } })) {
        slug = `${slugBase}-${count++}`;
    }

    try {
        // Fetch user to get image
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { image: true },
        });

        if (!user) {
            return { error: "User not found." };
        }

        const author = await prisma.author.create({
            data: {
                name,
                bio,
                image: user.image || null, // use user's image if available
                slug,
                user: { connect: { id: userId } },
            },
        });

        return { success: true, author };
    } catch (err) {
        console.log(err);
        return { error: "Error creating author." };
    }
}
