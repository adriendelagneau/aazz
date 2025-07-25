"use client";

import {
  BookmarkCheckIcon,
  BookmarkIcon,
} from "lucide-react";
import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";

import { toggleBookmark } from "@/actions/article-actions";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";

export function BookmarkButton({
  articleId,
  initialBookmarked,
}: {
  articleId: string;
  initialBookmarked: boolean;
}) {
  const [optimisticBookmarked, setOptimisticBookmarked] =
    useOptimistic(initialBookmarked);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPending, startTransition] = useTransition();

  const { data: session } = authClient.useSession();

  const user = session?.user;

  const handleToggle = async () => {
    if (!user) {
      return toast("You must be connect to Bookmark !");
    }
    startTransition(async () => {
      setOptimisticBookmarked((prev) => !prev);
      await toggleBookmark(articleId); // actual server call
    });
  };

  return (
    <Button
      onClick={handleToggle}
      variant="ghost"
      //   disabled={isPending}
      className="cursor-pointer"
    >
      {optimisticBookmarked ? <BookmarkCheckIcon  className="text-blue-500"/> : <BookmarkIcon />}
    </Button>
  );
}
