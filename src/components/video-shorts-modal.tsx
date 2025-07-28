import { X } from "lucide-react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useShortsStore } from "@/lib/store/use-shorts-store";

export function ShortsModal() {
  const { open, setOpen, shorts, currentIndex, next } = useShortsStore();
  const currentShort = shorts[currentIndex];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex h-screen w-screen !max-w-full items-center justify-center overflow-hidden !bg-black !p-0">
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 z-20 text-white hover:text-red-500"
        >
          <X className="h-6 w-6" />
        </button>

        <video
          key={currentShort?.id}
          src={currentShort?.url}
          autoPlay
          muted
          controls={false}
          onEnded={next}
          className="h-full w-full object-contain"
        />
      </DialogContent>
    </Dialog>
  );
}
