import { api, ApiError } from "@/shared/api";
import { VIRTUAL_COLLECTIONS } from "./constants";
import type { AdminProduct, AdminProductList, CollectionOption, ProductPayload, AdminOrderList } from "./types";
import { compressImage } from "./imageCompress";
import type { Order, OrderStatus } from "@/features/orders";

const BASE_URL: string = import.meta.env.VITE_API_URL || "/api";

export type ProductView = "all" | "trash";

export function fetchAdminProducts(page: number, limit = 20, status: ProductView = "all") {
  return api.get<AdminProductList>(
    `/admin/products?page=${page}&limit=${limit}&status=${status}`
  );
}

export function fetchAdminProduct(id: string) {
  return api.get<{ product: AdminProduct }>(`/admin/products/${id}`);
}

export function restoreAdminProduct(id: string) {
  return api.post<{ product: AdminProduct }>(`/admin/products/${id}/restore`);
}

export function purgeAdminProduct(id: string) {
  return api.delete<{ message: string }>(`/admin/products/${id}/permanent`);
}

export function createAdminProduct(payload: ProductPayload) {
  return api.post<{ product: AdminProduct }>("/admin/products", payload);
}

export function updateAdminProduct(id: string, payload: ProductPayload) {
  return api.put<{ product: AdminProduct }>(`/admin/products/${id}`, payload);
}

export function deleteAdminProduct(id: string) {
  return api.delete<{ message: string }>(`/admin/products/${id}`);
}

export async function fetchCollectionOptions(): Promise<CollectionOption[]> {
  const data = await api.get<CollectionOption[] | { items?: CollectionOption[] }>("/collections");
  const list = Array.isArray(data) ? data : (data.items ?? []);
  return list
    .filter((c) => !VIRTUAL_COLLECTIONS.includes(c.slug))
    .map(({ slug, title }) => ({ slug, title }));
}

export async function uploadImages(files: File[]): Promise<string[]> {
  const prepared = await Promise.all(files.map((file) => compressImage(file)));

  const form = new FormData();
  prepared.forEach((file) => form.append("images", file));

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 90_000);

  try {
    const response = await fetch(`${BASE_URL}/admin/uploads`, {
      method: "POST",
      credentials: "include",
      body: form,
      signal: controller.signal,
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw new ApiError(response.status, data?.message ?? "Image upload failed", data?.details);
    }
    return (data.images as { url: string }[]).map((image) => image.url);
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError(408, "Upload timed out. Try a smaller image or check your connection.");
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

export function fetchAdminOrders(page: number, status: "all" | OrderStatus, limit = 20) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (status !== "all") params.set("status", status);
  return api.get<AdminOrderList>(`/orders?${params.toString()}`);
}

export function updateAdminOrderStatus(id: string, status: OrderStatus) {
  return api.patch<{ message: string; order: Order }>(`/orders/${id}/status`, { status });
}