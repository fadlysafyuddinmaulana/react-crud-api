import { create } from "zustand";

interface ProductState {
  selectedId: number | null;

  setSelectedId: (id: number) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  selectedId: null,

  setSelectedId: (id) =>
    set({
      selectedId: id,
    }),
}));
