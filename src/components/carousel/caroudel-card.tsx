"use client";

import Image from "next/image";
import Link from "next/link";

import { TSimpleArticle } from "@/types"; // Make sure this matches your types location

const SliderCard = ({ article }: { article: TSimpleArticle }) => {
  return (
    <Link
      href={`/article/${article.slug}`}
      className="flex h-auto w-64 flex-col gap-1.5 rounded-sm border capitalize shadow-md"
    >
      <Image
        src={article.imageUrl}
        alt={article.alt}
        width={320}
        height={180}
        className="mx-auto"
      />

      <div className="p-3">
        <p className="line-clamp-1 font-semibold">{article.title}</p>
      </div>
    </Link>
  );
};

export default SliderCard;
