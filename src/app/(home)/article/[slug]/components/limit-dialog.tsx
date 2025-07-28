"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export function LimitDialog({ open }: { open: boolean }) {
  const router = useRouter();

  const handleClose = () => {
    router.push("/");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Daily Limit Reached</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">
          You’ve reached your daily limit of free articles. To continue reading,
          please subscribe.
        </p>
        <DialogFooter className="mt-4 flex gap-2">
          <Button variant="outline" onClick={() => router.push("/")}>
            Home
          </Button>
          <Button onClick={() => router.push("/subscribe")}>Subscribe</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
