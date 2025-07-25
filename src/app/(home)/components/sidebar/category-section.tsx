"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import React from "react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Props {
  categories: Category[];
  closeSidebar?: () => void; // Optional callback to close the sidebar (trigger click)
}

export function CategorySection({ categories, closeSidebar }: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const activeCategory = searchParams.get("category");
  const isSearchPage = pathname === "/search";

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xl mb-3">Categories</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {/* "All" button to clear category filter */}
          {isSearchPage && (
            <SidebarMenuItem key="all">
              <SidebarMenuButton
                tooltip="All categories"
                asChild
                isActive={!activeCategory}
              >
                <Link
                  href="/search"
                  onClick={() => closeSidebar?.()}
                >
                  <span>All</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          {/* Category buttons */}
          {categories.map((category) => {
            const isActive =
              isSearchPage && activeCategory === category.slug;
            const href = `/search?category=${category.slug}`;

            return (
              <SidebarMenuItem key={category.id}>
                <SidebarMenuButton
                  tooltip={category.name}
                  asChild
                  isActive={isActive}
                >
                  <Link
                    href={href}
                    onClick={() => closeSidebar?.()}
                  >
                    <span>{category.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
