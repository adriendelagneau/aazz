import Image from "next/image";
import React from "react";

import { TArticle } from "@/types";

const ArticleCard = ({ article }: { article: TArticle }) => {
  const formattedDate = new Date(article.publishedAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );

  return (
    <div className="m-3 mb-6 flex w-full overflow-hidden rounded-xs">
      {/* Image container */}
      <div className="relative">
        <Image
          src={article.asset?.url || "/default-image.jpg"}
          alt={article.asset?.altText || ""}
          width={400}
          height={250}
        />
      </div>

      {/* Content container */}
      <div className="flex w-[50%] flex-col justify-between pl-4">
        <div className="text-3xl font-bold">{article.title}</div>
        <p className="line-clamp-4">
          {article.parts?.[0]?.paragraphs?.[0]?.content || ""}
        </p>
        <div className="flex justify-between text-sm">
          <span>{formattedDate}</span>
          <span>Written by: {article.author?.name || "Unknown Author"}</span>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
