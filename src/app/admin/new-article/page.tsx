import React from "react";

import { getCategories } from "@/actions/category-actions";
import { getTags } from "@/actions/tag-actions";


import { CreateArticleForm } from "./components/create-article-form";

const NewProductPage = async () => {
  // 1️⃣ Get the logged-in user session (server-side)

  // 2️⃣ Get categories
  const categories = await getCategories();
  const tags = await getTags();

  return (
<div className="min-h-screen px-4 py-8">
  <h1 className="mb-4 text-2xl font-bold">Create New Article</h1>
  <CreateArticleForm tags={tags} categories={categories} />
</div>
  );
};

export default NewProductPage;
