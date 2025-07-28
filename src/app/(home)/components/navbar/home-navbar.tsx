"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useScrollDirection } from "@/hooks/use-scroll-position";

import { AuthButton } from "./auth-button";
import { NotificationsButton } from "./notification-button";
import { ThemeSwitch } from "./theme-switch";

export const HomeNavbar = () => {
  const { scrollY } = useScrollDirection();

  return (
    <div className="bg-background fixed top-0 left-0 z-50 flex h-16 w-full items-center px-2">
      <div className="flex w-full items-center justify-between gap-2 md:gap-4">
        {/** Menu & Logo */}

        <div className="flex h-10 flex-1 items-center">
          <SidebarTrigger className="h-10 w-10 cursor-pointer" />
          <NotificationsButton />
          <ThemeSwitch />
        </div>

        {/* Show only if scrollY > 400 */}
        <Link href="/">
          <div
            className={`font-main-title flex-1 text-center text-3xl font-semibold transition-colors duration-300 ${
              scrollY > 400 ? "text-primary-foreground w-auto" : "text-background w-0 overflow-hidden"
            }`}
          >
            La voie de l&apos;info
          </div>
        </Link>

        <div className="flex flex-1 items-center justify-end gap-3">
          {/** toggle theme button */}
          <Link href={"/subscriptions"}>
            <Button className="text-md cursor-pointer">Subscription</Button>
          </Link>

          <AuthButton />
        </div>
      </div>
    </div>
  );
};
