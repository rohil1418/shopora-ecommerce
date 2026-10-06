import type { Product } from "@/features/products";
import type { CartItem } from "@/shared/store";

export type BagLine = {
  key: string;
  item: CartItem;
  product: Product;
};