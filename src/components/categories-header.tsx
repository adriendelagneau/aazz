"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import React from "react";

import { Button } from "@/components/ui/button";
import { Category } from "@/generated/prisma";

interface CategoriesHeaderProps {
  categories: Category[];
}

const CategoriesHeader = ({ categories }: CategoriesHeaderProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const activeCategory = searchParams.get("category");

  const onSelect = (value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("category", value);
      params.delete("page");
    } else {
      params.delete("category");
      params.delete("page");
    }

    router.push(`/search?${params.toString()}`);
  };

  const isSearchPage = pathname === "/search";

  return (
    <div className="mb-20 flex w-full flex-wrap justify-center gap-1 px-2 py-4">
      {isSearchPage && (
        <Button
          variant={!activeCategory ? "default" : "ghost"}
          className={`text-xl font-medium transition-all ${
            !activeCategory
              ? "bg-primary text-white"
              : "hover:text-secondary-foreground"
          }`}
          onClick={() => onSelect(null)}
        >
          All
        </Button>
      )}

      {categories.map((c) => {
        const isActive = activeCategory === c.slug;

        return (
          <Button
            key={c.id}
            variant={isActive ? "default" : "ghost"}
            className={`cursor-pointer text-xl font-medium transition-all ${
              isActive
                ? "bg-primary text-white"
                : "hover:text-secondary-foreground"
            }`}
            onClick={() => onSelect(c.slug)}
          >
            {c.name}
          </Button>
        );
      })}
    </div>
  );
};

export default CategoriesHeader;
