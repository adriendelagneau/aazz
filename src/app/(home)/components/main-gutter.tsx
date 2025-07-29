import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";

import { fetchArticles } from "@/actions/article-actions";
import { TArticle } from "@/types";

const MainGutter = async () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { articles: initialData, hasMore: hasMoreInitial } =
  
    await fetchArticles({
      page: 1,
      pageSize: 5,
      query: "",
      orderBy: "newest",
    });
  if (!initialData) notFound();

  return (
    <div className="min-h-screen w-[250px]">
      <p className="pb-8 text-3xl capitalize">derniers articles</p>
      <ul>
        {initialData.map((article, i) => (
          <div key={i}>
            <MainGutterCard article={article} />
            <div className="mx-auto my-4 h-[1px] w-[90%] bg-slate-300"></div>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default MainGutter;

export const MainGutterCard = ({ article }: { article: TArticle }) => {
  return (
    <div className="py-6">
      <div className="float-right h-[120px] w-[120px] rounded-md pl-1">
        <Image
          src={article.asset?.url || ""}
          width={482}
          height={482}
          alt={article.asset?.altText || "alt"}
        />
      </div>
      <p className="text-md font-semibold line-clamp-3">{article.title}</p>
    </div>
  );
};
