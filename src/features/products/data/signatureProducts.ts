import type { Product, ProductFilter } from "../types";
import { getImage } from "./images";

export const signatureCollection = {
  title: "Signature Collection",
  description:
    "Our most loved pieces, refreshed for the season. Timeless cuts, premium fabrics and the details that define us.",
  banner: getImage("signature-banner", 1440, 600),
};

export const PRODUCT_FILTERS: { value: ProductFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
  { value: "accessories", label: "Accessories" },
];

export const signatureProducts: Product[] = [
  { id: 1, title: "Signature Logo Tee", price: 1999, category: "men", image: getImage("signature-1", 600, 800), tag: "Bestseller" },
  { id: 2, title: "Signature Oxford Shirt", price: 3499, category: "men", image: getImage("signature-2", 600, 800) },
  { id: 3, title: "Signature Wool Blazer", price: 8999, category: "men", image: getImage("signature-3", 600, 800), tag: "New" },
  { id: 4, title: "Signature Knit Cardigan", price: 4299, category: "women", image: getImage("signature-4", 600, 800) },
  { id: 5, title: "Signature Pleated Skirt", price: 2799, category: "women", image: getImage("signature-5", 600, 800) },
  { id: 6, title: "Signature Trench Coat", price: 9499, category: "women", image: getImage("signature-6", 600, 800), tag: "New" },
  { id: 7, title: "Signature Leather Belt", price: 1799, category: "accessories", image: getImage("signature-7", 600, 800) },
  { id: 8, title: "Signature Canvas Tote", price: 2299, category: "accessories", image: getImage("signature-8", 600, 800), tag: "Bestseller" },
];