import { notFound } from "next/navigation";

import { fetchArticles, getSimpleArticles } from "@/actions/article-actions";
import { getCategories } from "@/actions/category-actions";
import { CategoryCarousel } from "@/components/carousel/category-carousel";
import { FilterCarousel } from "@/components/carousel/filter-carousel";
import CategoriesHeader from "@/components/categories-header";

import MainCard from "./components/main-card";
import MainGutter from "./components/main-gutter";

export default async function Home() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { articles: initialData, hasMore: hasMoreInitial } =
    await fetchArticles({
      page: 1,
      pageSize: 5,
      query: "",
      orderBy: "newest",
    });
  if (!initialData) notFound();

  const categories = await getCategories();

  const sliderArticles = await getSimpleArticles();

  return (
    <div className="mx-auto min-h-screen w-full max-w-7xl gap-4 px-4">
      <CategoriesHeader categories={categories} />
      <CategoryCarousel categories={categories} />
      <div className="relative z-10 mx-auto flex w-full max-w-7xl gap-4 px-4">
        {/* Content Area */}
        <ul className="">
          {initialData.map((o, i) => (
            <li key={i}>
              <MainCard article={o} />
            </li>
          ))}
        </ul>

        {/* Sticky Gutter */}
        <div className="sticky top-24 z-0 hidden h-screen min-h-screen w-[250px] self-start 2xl:inline-block">
          <MainGutter />
        </div>
      </div>
      <FilterCarousel articles={sliderArticles} />
    </div>
  );
}
