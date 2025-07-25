"use client";

import { usePathname } from "next/navigation";
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterShareButton,
  XIcon,
} from "react-share";

const Share = () => {
  const pathname = usePathname();
  const baseUrl = process.env.NEXT_PUBLIC_NEXTAUTH_URL;

  return (
    <div className="mt-3 flex gap-2">
      <FacebookShareButton url={`${baseUrl}${pathname}`}>
        <FacebookIcon size={35} borderRadius={10} />
      </FacebookShareButton>

      <TwitterShareButton url={`${baseUrl}${pathname}`}>
        <XIcon size={35} borderRadius={10} />
      </TwitterShareButton>
    </div>
  );
};

export default Share;
