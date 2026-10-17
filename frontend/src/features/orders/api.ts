import { api } from "@/shared/api";
import type { Order } from "./types";

export const fetchOrder = (id: string) =>
  api.get<{ order: Order }>(`/orders/my-orders/${id}`).then((data) => data.order);

export const fetchMyOrders = () =>
  api.get<{ count: number; orders: Order[] }>("/orders/my-orders").then((data) => data.orders);

export const cancelMyOrder = (id: string) =>
  api.post<{ order: Order }>(`/orders/my-orders/${id}/cancel`).then((data) => data.order);