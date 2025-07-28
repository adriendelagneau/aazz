"use server";

import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { z } from "zod";


import { Prisma, PrismaClient } from "@/generated/prisma";
import { getUser } from "@/lib/auth/auth-session";
import { articleSchema } from "@/lib/validation";
import { TArticle, TSimpleArticle } from "@/types";



const prisma = new PrismaClient();


async function generateUniqueSlug(title: string) {
  const baseSlug = slugify(title, { lower: true, strict: true });
  let slug = baseSlug;
  let counter = 1;

  while (await prisma.article.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`;
  }

  return slug;
}


export async function createArticle(values: z.infer<typeof articleSchema>) {
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

  const validatedFields = articleSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { title, excerpt, categoryId, tagIds, parts, asset } = validatedFields.data;
  const slug = await generateUniqueSlug(title);

  const createdArticle = await prisma.$transaction(async (tx) => {
    // 1. Create article
    const article = await tx.article.create({
      data: {
        title,
        slug,
        excerpt,
        authorId: author.id, // ✅ uses Author.id, not User.id
        categoryId,
        published: true,
        publishedAt: new Date(),
        ArticleTag: {
          create: tagIds.map((tagId) => ({
            tag: { connect: { id: tagId } },
          })),
        },
      },
    });

    // 2. Create parts
    const createdParts = await Promise.all(
      parts.map((part) =>
        tx.articlePart.create({
          data: {
            title: part.title,
            order: part.order,
            articleId: article.id,
          },
        })
      )
    );

    // 3. Create paragraphs
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const createdPart = createdParts[i];

      await Promise.all(
        part.paragraphs.map((paragraph) =>
          tx.paragraph.create({
            data: {
              content: paragraph.content,
              order: paragraph.order,
              articlePartId: createdPart.id,
            },
          })
        )
      );
    }

    // 4. Create asset if provided
    let createdAssetId: string | null = null;
    if (asset) {
      const createdAsset = await tx.asset.create({
        data: {
          type: asset.type,
          url: asset.url,
          legend: asset.legend ?? null,
          altText: asset.altText ?? null,
          article: {
            connect: { id: article.id },
          },
        },
      });

      createdAssetId = createdAsset.id;
    }

    // 5. Update article with assetId and return it
    return tx.article.update({
      where: { id: article.id },
      data: {
        assetId: createdAssetId,
      },
      include: {
        parts: {
          include: {
            paragraphs: true,
          },
          orderBy: {
            order: "asc",
          },
        },
        category: true,
        ArticleTag: {
          include: { tag: true },
        },
        asset: true,
        author: true,
      },
    });
  });

  revalidatePath("/");

  return createdArticle;
}


export async function getArticleBySlug(slug: string) {
  if (!slug) throw new Error("Slug is required");

  const user = await getUser();

  // Fetch article first
  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          id: true,
          name: true,

        },
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      parts: {
        orderBy: { order: "asc" },
        include: {
          paragraphs: {
            orderBy: { order: "asc" },
          },
        },
      },
      ArticleTag: {
        include: {
          tag: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      asset: {
        select: {
          id: true,
          type: true,
          url: true,
          altText: true,
          legend: true,
        },
      },
    },
  });

  if (!article) throw new Error("Article not found");

  // Get user's bookmarks if logged in
  let bookmarkedByCurrentUser = false;

  if (user) {
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: { bookmarkedArticleIds: true },
    });

    bookmarkedByCurrentUser = userData?.bookmarkedArticleIds.includes(article.id) || false;
  }

  return {
    ...article,
    bookmarkedByCurrentUser,
  };
}

export async function toggleBookmark(articleId: string) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  const current = await prisma.user.findUnique({
    where: { id: user.id },
    select: { bookmarkedArticleIds: true },
  });

  if (!current) throw new Error("User not found");

  const alreadyBookmarked = current.bookmarkedArticleIds.includes(articleId);

  const updatedBookmarks = alreadyBookmarked
    ? current.bookmarkedArticleIds.filter(id => id !== articleId)
    : [...current.bookmarkedArticleIds, articleId];

  await prisma.user.update({
    where: { id: user.id },
    data: { bookmarkedArticleIds: updatedBookmarks },
  });

  revalidatePath(`/article/${articleId}`); // optional, if needed

  return { bookmarked: !alreadyBookmarked };
}

export const getSimpleArticles = async (): Promise<TSimpleArticle[]> => {
  const articles = await prisma.article.findMany({
    take: 12,
    select: {
      id: true,
      title: true,
      slug: true, // ✅ Include slug here
      asset: {
        select: {
          url: true,
          altText: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return articles.map((a) => ({
    id: a.id,
    title: a.title,
    slug: a.slug, // ✅ Include slug in the result
    imageUrl: a.asset?.url ?? "",
    alt: a.asset?.altText ?? "Article image",
  }));
};


export async function fetchArticles({
  query,
  page = 1,
  pageSize = 4,
  categorySlug,
  authorSlug,
  orderBy = "newest",
}: {
  query?: string;
  page?: number;
  pageSize?: number;
  categorySlug?: string;
  authorSlug?: string;
  orderBy?: "newest" | "lastWeek" | "lastMonth";
}): Promise<{ articles: TArticle[]; hasMore: boolean }> {
  const skip = (page - 1) * pageSize;

  const now = new Date();
  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(now.getDate() - 1);

  const oneMonthAgo = new Date(now);
  oneMonthAgo.setMonth(now.getMonth() - 1);

  const orderClause: Prisma.ArticleOrderByWithRelationInput = { createdAt: "desc" };

  const where: Prisma.ArticleWhereInput = {
    ...(categorySlug && {
      category: {
        slug: categorySlug,
      },
    }),
    ...(authorSlug && {
      author: {
        slug: authorSlug,
      },
    }),
    ...(query && {
      OR: [
        {
          title: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          excerpt: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          parts: {
            some: {
              OR: [
                {
                  title: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
                {
                  paragraphs: {
                    some: {
                      content: {
                        contains: query,
                        mode: "insensitive",
                      },
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    }),
    ...(orderBy === "lastWeek" && {
      createdAt: {
        gte: oneWeekAgo,
      },
    }),
    ...(orderBy === "lastMonth" && {
      createdAt: {
        gte: oneMonthAgo,
      },
    }),
  };

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: orderClause,
      skip,
      take: pageSize,
      include: {
        category: true,
        author: true,
        asset: true,
        parts: {
          include: {
            paragraphs: true,
          },
        },
        ArticleTag: {
          include: {
            tag: true,
          },
        },
      },
    }),
    prisma.article.count({ where }),
  ]);

  return {
    articles,
    hasMore: skip + articles.length < total,
  };
}
