// components/TrackArticleView.tsx
"use client";

import { useRouter } from "next/router";
import { useEffect } from "react";

interface TrackArticleViewProps {
  articleId: string;
}

export default function TrackArticleView({ articleId }: TrackArticleViewProps) {
  const router = useRouter();

  useEffect(() => {
    const logView = async () => {
      const screenSize = `${window.screen.width}x${window.screen.height}`;
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      try {
        const res = await fetch("/api/log-view", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ articleId, screenSize, timezone }),
        });

        if (res.status === 429) {
          router.push("/limit-reached");
        }
      } catch (err) {
        console.error("View logging failed:", err);
      }
    };

    logView();
  }, [articleId, router]);

  return null; // This component renders nothing
}
