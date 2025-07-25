"use server";

import slugify from "slugify";

import { PrismaClient } from "@/generated/prisma";



const prisma = new PrismaClient();



export async function createTag(name: string) {
  if (!name || name.trim().length === 0) {
    throw new Error("Tag name is required");
  }

  // Normalize tag name
  const normalizedTagName = name.trim();

  // Generate slug (lowercase, URL-friendly)
  const slug = slugify(normalizedTagName, { lower: true, strict: true });

  // Check if tag already exists
  const existingTag = await prisma.tag.findUnique({
    where: { slug },
  });

  if (existingTag) {
    // Return existing tag if found
    return existingTag;
  }

  // Create new tag
  const newTag = await prisma.tag.create({
    data: {
      name: normalizedTagName,
      slug,
    },
  });

  return newTag;
}


export async function getTags() {
  return await prisma.tag.findMany({
    orderBy: {
      name: "asc",
    },
  });
}