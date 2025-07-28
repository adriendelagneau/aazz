"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import { TArticle } from "@/types";

import { HomeMainGrid } from "./home-main-grid";

interface InfiniteScrollProps {
  initialArticles: TArticle[];
  hasMoreInitial: boolean;
  initialQuery?: string;
  initialCategorySlug?: string;
  initialAuthorSlug?: string;
  initialOrderBy: "newest" | "lastWeek" | "lastMonth";
}

export const InfiniteScroll = ({
  initialArticles,
  hasMoreInitial,
  initialQuery,
  initialCategorySlug,
  initialAuthorSlug,
  initialOrderBy,
}: InfiniteScrollProps) => {
  const searchParams = useSearchParams();
  const { ref, inView } = useInView({ rootMargin: "30px" });

  const query = searchParams.get("query") || "";
  const categorySlug = searchParams.get("category") || "";
  const authorSlug = searchParams.get("author") || "";
  const orderBy =
    (searchParams.get("orderBy") as "newest" | "lastWeek" | "lastMonth") ||
    "newest";

  const shouldUseInitialData =
    query === (initialQuery || "") &&
    categorySlug === (initialCategorySlug || "") &&
    authorSlug === (initialAuthorSlug || "") &&
    orderBy === initialOrderBy;

  const queryResult = useInfiniteQuery({
    queryKey: ["articles", query, categorySlug, authorSlug, orderBy],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams({
        page: pageParam.toString(),
        pageSize: "4",
        query,
        categorySlug,
        authorSlug,
        orderBy,
      });

      const res = await fetch(
        `/api/articles/get-articles-paginated?${params.toString()}`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch articles");
      }
      return res.json();
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
    initialPageParam: 1,
    refetchOnWindowFocus: false,
    ...(shouldUseInitialData && {
      initialData: {
        pages: [
          {
            articles: initialArticles,
            hasMore: hasMoreInitial,
          },
        ],
        pageParams: [1],
      },
    }),
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    queryResult;

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const articles = data?.pages.flatMap((page) => page.articles) || [];

  return (
    <HomeMainGrid
      articles={articles}
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage ?? false}
      refObserver={ref}
    />
  );
};
