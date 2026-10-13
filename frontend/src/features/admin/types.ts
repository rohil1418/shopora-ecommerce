import type { ProductTag } from "./constants";

export type AdminProductImage = string | { url: string };

export type AdminProduct = {
  id: string;
  sku: string;
  title: string;
  brand: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  category: string;
  collection: string;
  images: AdminProductImage[];
  sizes: { label: string; stock: number }[];
  stock: number;
  tag?: ProductTag;
  rating?: number;
  reviewsCount: number;
  isActive: boolean;
  deletedAt?: string | null;
  createdAt: string;
};

export type AdminProductList = {
  items: AdminProduct[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ProductPayload = {
  title: string;
  brand: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  collection: string;
  images: string[];
  sizes: { label: string; stock: number }[];
  stock: number;
  tag?: ProductTag;
  rating?: number;
  reviewsCount: number;
  isActive: boolean;
};

export type CollectionOption = { slug: string; title: string };