import { api } from "@/shared/api";
import type { Address } from "@/features/addresses";
import type { Order } from "@/features/orders";
import type { CheckoutDraft, DraftItem, Quote } from "@/features/checkout/types";

export type PaymentChoice = "cod" | "razorpay";

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

export function placeOrder(draft: CheckoutDraft, address: Address, paymentMethod: PaymentChoice) {
  return api
    .post<{ message: string; order: Order }>("/orders", {
      items: draft.items.map(toOrderItem),
      ...(draft.couponCode ? { couponCode: draft.couponCode } : {}),
      shippingAddress: {
        fullName: address.fullName,
        phone: address.phone,
        addressLine1: address.addressLine1,
        ...(address.addressLine2 ? { addressLine2: address.addressLine2 } : {}),
        city: address.city,
        state: address.state,
        pincode: address.pincode,
      },
      paymentMethod,
    })
    .then((data) => data.order);
}