import { create } from "zustand";

interface AppState {
  navOpen: boolean;
  toggleNav: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  navOpen: false,
  toggleNav: () => set((s) => ({ navOpen: !s.navOpen })),
}));
