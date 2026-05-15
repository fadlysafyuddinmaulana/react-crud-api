import { create } from "zustand";
import type { Product } from "../interfaces/Product";

interface ProductState {
  selectedProduct: Product | null;

  setSelectedProduct: (product: Product | null) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  selectedProduct: null,

  setSelectedProduct: (product) =>
    set({
      selectedProduct: product,
    }),
}));
