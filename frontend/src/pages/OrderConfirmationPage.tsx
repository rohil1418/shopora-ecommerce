import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getErrorMessage } from "@/shared/api";
import { formatPrice } from "@/shared/utils/format";
import { AddressLines } from "@/features/addresses";
import {
  fetchOrder,
  formatOrderDate,
  paymentLabel,
  thumbUrl,
  type Order,
} from "@/features/orders";

export default function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    let ignore = false;

    fetchOrder(id)
      .then((result) => {
        if (!ignore) setOrder(result);
      })
      .catch((err) => {
        if (!ignore) setError(getErrorMessage(err));
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  if (error) {
    return (
      <main className="mx-auto max-w-md px-6 py-24 text-center">
        <p className="text-gray-600">{error}</p>
        <Link
          to="/"
          className="mt-6 inline-block bg-[#0a1f44] px-6 py-3 text-sm font-medium uppercase tracking-wide text-white"
        >
          Back to home
        </Link>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-12">
        <div className="h-64 animate-pulse bg-gray-100" />
      </main>
    );
  }

  const isOnline = order.paymentMethod === "razorpay";

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <div className="flex flex-col items-center text-center">
        <motion.span
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 16 }}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500 text-white"
        >
          <Check size={40} />
        </motion.span>
        <h1 className="mt-6 text-3xl font-bold text-[#0a1f44]">Order placed!</h1>
        <p className="mt-3 text-gray-600">
          Thank you for shopping with Shopora.{" "}
          {isOnline
            ? "We have received your payment."
            : `Please keep ${formatPrice(order.total)} ready to pay when your order arrives.`}
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Order <span className="font-bold text-gray-900">{order.orderNumber}</span> ·{" "}
          {formatOrderDate(order.createdAt)}
        </p>
      </div>

      <div className="mt-10 space-y-6 border p-6">
        <ul className="space-y-4">
          {order.items.map((item) => (
            <li key={`${item.sku}-${item.size ?? "-"}`} className="flex gap-3">
              {item.image ? (
                <img
                  src={thumbUrl(item.image)}
                  alt=""
                  className="aspect-[3/4] w-16 shrink-0 bg-gray-100 object-cover"
                />
              ) : (
                <div className="aspect-[3/4] w-16 shrink-0 bg-gray-100" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-gray-900">{item.title}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {item.size ? `Size: ${item.size} · ` : ""}Qty: {item.quantity}
                </p>
              </div>
              <p className="text-sm font-bold text-gray-900">
                {formatPrice(item.price * item.quantity)}
              </p>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between border-t pt-4">
          <span className="text-sm font-bold uppercase tracking-wide text-gray-900">
            Total · {paymentLabel(order)}
          </span>
          <span className="text-lg font-bold text-gray-900">{formatPrice(order.total)}</span>
        </div>

        <div className="border-t pt-4">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-800">
            Delivering to
          </h2>
          <AddressLines address={order.shippingAddress} />
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link
          to="/"
          className="inline-block bg-[#0a1f44] px-6 py-3 text-sm font-medium uppercase tracking-wide text-white transition-colors hover:bg-red-600"
        >
          Continue shopping
        </Link>
      </div>
    </main>
  );
}