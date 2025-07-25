import Image from "next/image";
import Link from "next/link";
import React from "react";

import { TArticle } from "@/types";

const MainCard = ({ article }: { article: TArticle }) => {
  const firstParagraph = article.parts?.[0]?.paragraphs?.[0]?.content ?? "";

  return (
    <div className="mx-auto mb-4 flex max-w-screen-xl flex-col gap-6 p-3 lg:flex-row-reverse">
      {/* Image Section */}
      <div className="rounded-sm lg:w-1/2">
        {article.asset ? (
          <Link href={`/article/${article.slug}`} className="block">
            <Image
              src={article.asset.url}
              width={844}
              height={482}
              alt={article.asset.altText ?? "Article image"}
              loading="lazy"
              className="rounded-sm w-full object-cover"
            />
            {article.asset.legend && (
              <p className="pt-2 text-sm italic">
                {article.asset.legend}
              </p>
            )}
          </Link>
        ) : (
          <div className="flex h-[482px] w-full items-center justify-center rounded-sm">
            No image available
          </div>
        )}
      </div>

      {/* Text Section */}
      <div className="flex flex-col justify-between pr-3 lg:w-1/2">
        <div className="text-3xl font-semibold leading-snug line-clamp-2 xl:text-4xl xl:leading-tight">
          <Link href={`/article/${article.slug}`}>
            {article.title}
          </Link>
        </div>

        <div className="mt-4">
          <p className="line-clamp-3 text-lg ">{firstParagraph}</p>
          <p className="pt-5 text-sm">
            Written by: {article.author?.name ?? "Unknown"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MainCard;
