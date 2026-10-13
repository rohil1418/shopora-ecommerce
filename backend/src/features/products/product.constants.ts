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

export const SORT_OPTIONS = ["newest", "price_asc", "price_desc", "popular"] as const;
export type SortOption = (typeof SORT_OPTIONS)[number];

export const STATUS_FILTERS = ["all", "active", "inactive", "trash"] as const;
export type StatusFilter = (typeof STATUS_FILTERS)[number];