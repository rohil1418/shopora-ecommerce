import { api } from "@/shared/api";
import type { Order } from "./types";

export const fetchOrder = (id: string) =>
  api.get<{ order: Order }>(`/orders/my-orders/${id}`).then((data) => data.order);