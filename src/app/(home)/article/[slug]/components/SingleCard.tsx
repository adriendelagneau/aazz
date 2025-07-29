import Image from "next/image";
import React from "react";

import { TArticle } from "@/types";

import { BookmarkButton } from "./bookmark";
import { ReadAloudButton } from "./read-a-loud";
import { ShareButton } from "./share-button";

const SingleCard = ({ article }: { article: TArticle }) => {
  const articleText = [
    article.title,
    ...article.parts.flatMap((part) => [
      part.title ?? "",
      ...part.paragraphs.map((p) => p.content),
    ]),
  ].join(". ");

  return (
    <>
      <div className="w-full rounded">
        <Image
          src={article.asset?.url || "/default-image.png"}
          width={1256}
          height={519}
          alt={article.asset?.legend || article.title}
        />
        <p className="text-secondary-foreground py-3 text-sm capitalize">
          {article.asset?.legend}
        </p>
      </div>
      <ShareButton
        url={`${process.env.NEXT_PUBLIC_URL}/article/${article.slug}`}
      />
      <BookmarkButton
        articleId={article.id}
        initialBookmarked={article.bookmarkedByCurrentUser ?? false}
      />
      <ReadAloudButton text={articleText} />
      <ul>
        {article.parts.map((c, i) => (
          <li key={i} className="my-24">
            <h3 className="mb-6 text-2xl font-semibold">{c.title}</h3>
            <div className="text-xl leading-10 first-letter:text-2xl" key={i}>
              {c.paragraphs.map((p, j) => (
                <div key={j} className="mt-6">
                  {p.content}
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default SingleCard;
