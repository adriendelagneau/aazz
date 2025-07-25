// components/video-views/HomeMainGrid.tsx

// import { RefObject } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { TArticle } from "@/types";

import ArticleCard from "./article-card";

interface HomeMainGridProps {
  articles: TArticle[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  refObserver: (node?: Element | null) => void; // ✅ fix here
}

export const HomeMainGrid = ({
  articles,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  refObserver,
}: HomeMainGridProps) => {
  // console.log(articles)
  return (
    <div className="no-scrollbar mx-auto w-full max-w-4xl">
      {articles.map((article) => (
        <ArticleCard article={article} key={article.id} />
      ))}

      {(isLoading || (isFetchingNextPage && hasNextPage)) &&
        Array.from({ length: 1 }).map((_, idx) => (
          <div
            key={`skeleton-${idx}`}
            className="overflow-hidden rounded-sm pb-2"
          >
            <div className="flex w-full h-[225px] overflow-hidden rounded-xs">
              {/* Image skeleton */}
              <div className="relative">
                <Skeleton className="h-[225px] w-[400px]" />
              </div>

              {/* Content skeleton */}
              <div className="flex w-[50%] flex-col justify-between pl-4">
                {/* Title */}
                <Skeleton className="mb-3 h-6 w-3/4" />
                <Skeleton className="mb-3 h-6 w-2/4" />


                {/* Paragraph lines */}
                <div className="mb-4 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[90%]" />
                  <Skeleton className="h-4 w-[80%]" />
                  <Skeleton className="h-4 w-[85%]" />

                </div>

                {/* Bottom row */}
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-[30%]" />
                  <Skeleton className="h-4 w-[40%]" />
                </div>
              </div>
            </div>
          </div>
        ))}

      {hasNextPage && <div className="col-span-full" ref={refObserver} />}

      {!hasNextPage && articles.length === 0 && !isLoading && (
        <p className="col-span-full text-center text-teal-800">
          No videos found.
        </p>
      )}
    </div>
  );
};
