// stores/shorts-store.ts
import { create } from "zustand";

type Short = { id: string | number; url: string };

interface ShortsState {
  open: boolean;
  shorts: Short[];
  currentIndex: number;
  setOpen: (value: boolean) => void;
  setShorts: (shorts: Short[], startIndex?: number) => void;
  next: () => void;
}

export const useShortsStore = create<ShortsState>((set, get) => ({
  open: false,
  shorts: [],
  currentIndex: 0,
  setOpen: (value) => set({ open: value }),
  setShorts: (shorts, startIndex = 0) =>
    set({ shorts, currentIndex: startIndex, open: true }),
  next: () => {
    const { currentIndex, shorts } = get();
    if (currentIndex < shorts.length - 1) {
      set({ currentIndex: currentIndex + 1 });
    } else {
      set({ open: false }); // close modal when done
    }
  },
}));
