"use client";

import { ArrowUpIcon } from "lucide-react";
import React, { useState, useEffect } from "react";

import { Button } from "@/components/ui/button"; // your shadcnui button

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.pageYOffset > 900); // show button after 300px scroll
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!visible) return null;

  return (
    <Button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className="bg-primary text-primary-foreground fixed right-12 bottom-12  shadow-lg"
    >
      <ArrowUpIcon />
    </Button>
  );
}
