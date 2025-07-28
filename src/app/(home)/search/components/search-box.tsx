"use client";

import { SearchIcon } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SearchBox = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentQuery = searchParams.get("query") ?? "";
  const [value, setValue] = useState(currentQuery);

  // Sync local state with URL when it changes (e.g. via back/forward)
  useEffect(() => {
    setValue(currentQuery);
  }, [currentQuery]);

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (value.trim()) {
      params.set("query", value.trim());
      params.delete("page");
    } else {
      params.delete("query");
      params.delete("page");
    }

    router.push(`?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="mb-6 flex w-full max-w-md items-center gap-2 px-4">
      <Input
        placeholder="Search articles..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="text-lg"
      />
      <Button
        onClick={handleSearch}
        className="cursot-pointer text-lg font-semibold"
      >
        <SearchIcon className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default SearchBox;
