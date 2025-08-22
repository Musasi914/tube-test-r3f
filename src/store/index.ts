import { create } from "zustand";

interface Store {
  progress: number;
  setProgress: (progress: number) => void;
}

const useStore = create<Store>()((set) => ({
  progress: 0,
  setProgress: (progress: number) => set({ progress }),
}));

export default useStore;
