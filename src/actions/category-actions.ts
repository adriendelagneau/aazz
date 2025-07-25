"use server";

import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();


export async function getCategories() {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    },
    orderBy: {
      name: "asc", // optional: alphabetical order
    },
  });

  return categories;
}