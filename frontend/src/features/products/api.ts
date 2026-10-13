import { api } from "@/shared/api";
import { cacheProducts } from "./data/productCache";
import { getProductUid } from "./data/collections";
import type { Product, ProductCategory } from "./types";

type ApiProduct = {
  id: string;
  title: string;
  brand: string;
  price: number;
  originalPrice?: number;
  category: string;
  collection: string;
  images: string[];
  tag?: "New" | "Bestseller";
  rating?: number;
  reviewsCount: number;
};

type ApiCollection = { slug: string; title: string; description: string; banner: string };

type ApiCollectionResponse = {
  collection: ApiCollection;
  filters: string[];
  items: ApiProduct[];
  page: number;
  totalPages: number;
  total: number;
};

export type CollectionData = {
  collection: ApiCollection;
  filters: string[];
  products: Product[];
  page: number;
  totalPages: number;
  total: number;
};

function optimizeImage(url: string): string {
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;
  return url.replace("/upload/", "/upload/f_auto,q_auto,w_900,c_limit/");
}

export function mapApiProduct(product: ApiProduct): Product {
  return {
    id: product.id,
    collection: product.collection,
    title: product.title,
    price: product.price,
    category: product.category as ProductCategory,
    image: product.images[0] ? optimizeImage(product.images[0]) : "",
    brand: product.brand || undefined,
    originalPrice: product.originalPrice,
    rating: product.rating,
    reviews: product.reviewsCount > 0 ? product.reviewsCount : undefined,
    tag: product.tag,
  };
}

type CollectionParams = { category?: string; page?: number; limit?: number };

export async function fetchCollection(
  slug: string,
  { category, page = 1, limit = 50 }: CollectionParams = {}
): Promise<CollectionData> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (category) params.set("category", category);

  const data = await api.get<ApiCollectionResponse>(
    `/collections/${encodeURIComponent(slug)}?${params.toString()}`
  );

  const products = data.items.map(mapApiProduct);
  cacheProducts(products.map((product) => [getProductUid(product), product]));

  return {
    collection: data.collection,
    filters: data.filters,
    products,
    page: data.page,
    totalPages: data.totalPages,
    total: data.total,
  };
}

export async function fetchProductById(id: string): Promise<Product> {
  const data = await api.get<{ product: ApiProduct }>(`/products/${id}`);
  const product = mapApiProduct(data.product);
  cacheProducts([[getProductUid(product), product]]);
  return product;
}