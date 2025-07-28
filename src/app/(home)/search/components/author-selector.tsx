"use client";

import { useSearchParams, useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Author = {
  id: string;
  name: string;
  slug: string;
};

type AuthorSelectorProps = {
  authors: Author[];
};

export const AuthorSelector = ({ authors }: AuthorSelectorProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeAuthorSlug = searchParams.get("author");

  const onAuthorChange = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!slug || slug === "all") {
      params.delete("author");
      params.delete("page");
    } else {
      params.set("author", slug);
      params.delete("page");
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="mb-8 flex justify-center px-4">
      <Select onValueChange={onAuthorChange} value={activeAuthorSlug ?? "all"}>
        <SelectTrigger className="w-[220px] text-base font-medium">
          <SelectValue placeholder="Select Author" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Authors</SelectItem>
          {authors.map((author) => (
            <SelectItem key={author.id} value={author.slug}>
              {author.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
