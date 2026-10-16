import { api } from "@/shared/api";
import type { CheckoutDraft, DraftItem, Quote } from "@/features/checkout/types";

type OrderItemPayload = {
  productId?: string;
  sku?: string;
  quantity: number;
  size?: string;
};

export function toOrderItem({ uid, size, qty }: DraftItem): OrderItemPayload {
  const tail = uid.slice(-24);
  const isMongoId = /^[a-f0-9]{24}$/i.test(tail);

  return {
    ...(isMongoId ? { productId: tail } : { sku: uid.toUpperCase() }),
    quantity: qty,
    ...(size ? { size } : {}),
  };
}

export function fetchQuote(draft: CheckoutDraft) {
  return api.post<Quote>("/orders/quote", {
    items: draft.items.map(toOrderItem),
    ...(draft.couponCode ? { couponCode: draft.couponCode } : {}),
  });
}