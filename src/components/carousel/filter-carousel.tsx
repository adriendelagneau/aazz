"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { TSimpleArticle } from "@/types";

import SliderCard from "./caroudel-card";

export const FilterCarousel = ({
  articles,
}: {
  articles: TSimpleArticle[];
}) => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const router = useRouter();

  const onSelect = (slug: string) => {
    router.push(`/article/${slug}`, { scroll: false });
  };

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="relative my-12 w-full">
      {/* Left Gradient */}
      <div
        className={cn(
          "from-background pointer-events-none absolute top-0 bottom-0 left-12 z-10 w-12 bg-gradient-to-r to-transparent",
          current === 1 && "hidden"
        )}
      />

      <Carousel
        setApi={setApi}
        opts={{ align: "start", dragFree: true }}
        className="w-full px-12"
      >
        <CarouselContent className="-ml-2">
          {articles.map((article) => (
            <CarouselItem
              onClick={() => onSelect(article.slug)}
              key={article.id}
              className="basis-auto cursor-pointer pl-3 mx-1"
            >
              <SliderCard article={article} />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-0 z-20 cursor-pointer" />
        <CarouselNext className="right-0 z-20 cursor-pointer" />
      </Carousel>

      {/* Right Gradient */}
      <div
        className={cn(
          "from-background pointer-events-none absolute top-0 right-12 bottom-0 z-10 w-12 bg-gradient-to-l to-transparent",
          current === count && "hidden"
        )}
      />
    </div>
  );
};
