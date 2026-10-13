export const PRODUCT_CATEGORIES = [
  "men",
  "women",
  "accessories",
  "boys",
  "girls",
  "makeup",
  "skincare",
  "haircare",
] as const;
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const PRODUCT_TAGS = ["New", "Bestseller"] as const;
export type ProductTag = (typeof PRODUCT_TAGS)[number];

export const VIRTUAL_COLLECTIONS = ["new", "bestsellers", "accessories"];