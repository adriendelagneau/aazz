// ------------------ Asset Types ------------------
export type AssetType = "IMAGE" | "VIDEO" | "AUDIO";

export interface TAsset {
  id: string;
  url: string;
  legend?: string | null;
  altText?: string | null;
  type?: AssetType;
}

// ------------------ Paragraph ------------------
export interface TParagraph {
  id: string;
  content: string;
  order: number;
  articlePartId: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// ------------------ Part ------------------
export interface TPart {
  id: string;
  title?: string | null;
  order: number;
  articleId: string;
  paragraphs: TParagraph[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// ------------------ Tag ------------------
export interface TTag {
  id: string;
  name: string;
}

// ------------------ Author ------------------
export interface TAuthor {
  id: string;
  name: string | null;
  email?: string;
}

// ------------------ Category ------------------
export interface TCategory {
  id: string;
  name: string;
  slug?: string;
}

// ------------------ Article ------------------
export interface TArticle {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null | undefined;

  published: boolean;
  publishedAt: string | Date;
  createdAt: string | Date;
  updatedAt?: string | Date;
  views?: number;

  authorId: string;
  categoryId?: string | null;
  assetId?: string | null;

  author: TAuthor | null;
  category: TCategory | null;
  asset: TAsset | null;
  parts: TPart[];
  ArticleTag: { tag: TTag }[];
  bookmarkedArticleIds?: string[] | null; // Array of article IDs bookmarked by the current user
  bookmarkedByCurrentUser?: boolean;
}


export interface ArticleWithExtras {
  id: string;
  slug: string;
  title: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  content?: string;

  author: {
    id: string;
    name: string;
    image: string | null;
  };

  category: {
    id: string;
    name: string;
    slug: string;
  };

  parts: {
    id: string;
    title: string;
    order: number;
    paragraphs: {
      id: string;
      content: string;
      order: number;
    }[];
  }[];

  ArticleTag: {
    tag: {
      id: string;
      name: string;
    };
  }[];

  asset: {
    id: string;
    type: string;
    url: string;
    altText: string | null;
    legend: string | null;
  }[];

  likes: {
    userId: string;
  }[];

  // These may or may not exist depending on whether user is present
  bookmarkedBy?: {
    userId: string;
  }[];

  // Computed fields
  likeCount: number;
  likedByCurrentUser: boolean;
  bookmarkedByCurrentUser: boolean;
}
