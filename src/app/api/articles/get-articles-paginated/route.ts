// app/api/videos/get-videos-paginated/route.ts
import { NextRequest } from "next/server";

import { fetchArticles } from "@/actions/article-actions";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "4", 10);
  const query = searchParams.get("query") || undefined;
  const categorySlug = searchParams.get("categorySlug") || undefined;
  const authorSlug = searchParams.get("authorSlug") || undefined;  // <-- Added here
  const orderBy = searchParams.get("orderBy") as
    | "newest"
    | "lastWeek"
    | "lastMonth"
    | undefined;

  const result = await fetchArticles({
    page,
    pageSize,
    query,
    categorySlug,
    authorSlug,  // <-- Forward authorSlug to fetchArticles
    orderBy,
  });

  return Response.json(result);
}
