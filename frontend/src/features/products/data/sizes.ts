import type { Product } from "../types";

const CLOTHING_SIZES = ["S", "M", "L", "XL", "XXL"];
const KIDS_SIZES = ["2-3Y", "4-5Y", "6-7Y", "8-9Y"];
const SHOE_SIZES = ["6", "7", "8", "9", "10"];

const NO_SIZE_COLLECTIONS = ["perfume", "beauty", "bags"];
const NO_SIZE_CATEGORIES = ["accessories", "makeup", "skincare", "haircare"];

export function getSizes(product: Product): string[] {
  if (NO_SIZE_COLLECTIONS.includes(product.collection)) return [];
  if (NO_SIZE_CATEGORIES.includes(product.category)) return [];
  if (product.collection === "footwear") return SHOE_SIZES;
  if (product.category === "boys" || product.category === "girls") return KIDS_SIZES;
  return CLOTHING_SIZES;
}