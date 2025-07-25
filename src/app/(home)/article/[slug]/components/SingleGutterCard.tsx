
import React from "react";

import { TArticle } from "@/types";

const SingleGutterCard = ({ article }: { article: TArticle }) => {

  return <div className="mb-12 h-[160px] w-full bg-green-800 p-3">{article.title}</div>;
};

export default SingleGutterCard;
