import type { Order } from "./types";

export const formatOrderDate = (value: string): string =>
  new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export const thumbUrl = (url: string, width = 160): string =>
  url.includes("res.cloudinary.com") && url.includes("/upload/")
    ? url.replace("/upload/", `/upload/f_auto,q_auto,w_${width},c_limit/`)
    : url;

export function paymentLabel(order: Pick<Order, "paymentMethod" | "paymentStatus">): string {
  if (order.paymentMethod === "razorpay") {
    if (order.paymentStatus === "paid") return "Paid online";
    if (order.paymentStatus === "failed") return "Payment failed";
    return "Online payment pending";
  }
  return order.paymentStatus === "paid" ? "Cash on delivery (paid)" : "Cash on delivery";
}