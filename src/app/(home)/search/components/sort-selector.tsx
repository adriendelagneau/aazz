"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SortSelector = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeSort = searchParams.get("sort");

  const onSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "newest") {
      params.delete("sort"); // default — remove sort param
      params.delete("page");
    } else {
      params.set("sort", value);
      params.delete("page");
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="mb-8 flex justify-center px-4">
      <Select onValueChange={onSortChange} value={activeSort ?? "newest"}>
        <SelectTrigger className="w-[180px] text-xl font-medium">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="lastWeek">Last Week</SelectItem>
          <SelectItem value="lastMonth">Last Month</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SortSelector;
