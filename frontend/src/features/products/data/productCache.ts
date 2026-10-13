import type { Product } from "../types";

const STORAGE_KEY = "shopora-product-cache";
const MAX_ENTRIES = 300;

type ProductCache = Record<string, Product>;

let memory: ProductCache | null = null;

function load(): ProductCache {
  if (memory) return memory;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    memory = raw ? (JSON.parse(raw) as ProductCache) : {};
  } catch {
    memory = {};
  }
  return memory;
}

export function cacheProducts(entries: [uid: string, product: Product][]): void {
  const merged: ProductCache = { ...load() };

  for (const [uid, product] of entries) {
    delete merged[uid];
    merged[uid] = product;
  }

  const keys = Object.keys(merged);
  for (const key of keys.slice(0, Math.max(0, keys.length - MAX_ENTRIES))) {
    delete merged[key];
  }

  memory = merged;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {
  }
}

export function getCachedProduct(uid: string): Product | undefined {
  return load()[uid];
}