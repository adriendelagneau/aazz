import React from "react";

import { getArticleBySlug } from "@/actions/article-actions";

import SingleCard from "./components/SingleCard";
import TrackArticleView from "./components/track-article-view";
import MainGutter from "../../components/main-gutter";
// import { LimitDialog } from "./components/limit-dialog";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

const ArticlePage = async ({ params }: ProductPageProps) => {
  const { slug } = await params;

  const article = await getArticleBySlug(slug);
  if (!article) return <div>article not found</div>;

  const articleCreationDate = new Date(article.createdAt);
  const formatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" });
  const formattedDate = formatter.format(articleCreationDate);

  return (
    <>
      <div className="mx-auto mt-28 min-h-[200vh] w-full">
        <div className="relative mx-3 mt-12 flex h-auto gap-6">
          <div className="mx-auto max-w-5xl">
            <h1 className="font-large mb-12 line-clamp-2 text-4xl xl:text-5xl xl:leading-[1.2]">
              {article.title}
            </h1>

            <SingleCard article={article} />
            <div className="my-3 flex items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="text-xl">written by: {article.author.name}</div>
              </div>

              <p className="text-lg">{formattedDate}</p>
            </div>
          </div>

          <div className="sticky top-20 mx-3 hidden h-screen 2xl:inline-block">
            <MainGutter />
          </div>
        </div>
      </div>
      <TrackArticleView articleId={article.id} />
      {/* <LimitDialog open={limitReached} /> */}
    </>
  );
};

export default ArticlePage;
