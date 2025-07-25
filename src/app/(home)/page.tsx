import { notFound } from "next/navigation";

import { fetchArticles } from "@/actions/article-actions";

export default async function Home() {
  const { articles: initialData, hasMore: hasMoreInitial } =
    await fetchArticles({
      page: 1,
      pageSize: 5,
      query: "",
      orderBy: "newest",
    });
  if (!initialData) notFound();

  console.log(initialData, hasMoreInitial, "initial data");

  return (
    <div className="scrollbar scrollbar-none mx-auto min-h-screen w-full max-w-7xl gap-4 px-4"></div>
  );
}
