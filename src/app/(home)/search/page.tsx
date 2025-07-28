import { notFound } from "next/navigation";

import { fetchArticles } from "@/actions/article-actions";
import { getAuthors } from "@/actions/author-actions";
import { getCategories } from "@/actions/category-actions";
import { CategoryCarousel } from "@/components/carousel/category-carousel";
import CategoriesHeader from "@/components/categories-header";
import { InfiniteScroll } from "@/components/infinite-scroll";

import { AuthorSelector } from "./components/author-selector";
import SearchBox from "./components/search-box";
import SortSelector from "./components/sort-selector";

interface ProductPageProps {
  params: Promise<{ query: string; categorySlug: string }>;
}

const SearchPage = async ({ params }: ProductPageProps) => {
  const { query, categorySlug } = await params;
  const authors = await getAuthors(); // fetch authors
  const categories = await getCategories();
  // console.log(categories);

  const { articles: initialData, hasMore: hasMoreInitial } =
    await fetchArticles({
      page: 1,
      pageSize: 5,
      categorySlug,
      query,
      orderBy: "newest",
    });
  if (!initialData) notFound();

  return (
    <div className="no-scrollbar overflow-y-auto">
      <CategoriesHeader categories={categories} />
      <CategoryCarousel categories={categories} />
      <div className="flex w-full items-center justify-between px-4 py-2">
        <SearchBox />
        <div className="flex items-center gap-2">
          <AuthorSelector authors={authors} />
          <SortSelector />
        </div>
      </div>
      <InfiniteScroll
        initialArticles={initialData}
        hasMoreInitial={hasMoreInitial}
        initialQuery={query}
        initialOrderBy="newest"
        initialCategorySlug={categorySlug}
      />
    </div>
  );
};

export default SearchPage;
