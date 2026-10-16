import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { ApiError, getErrorMessage } from "@/shared/api";
import { useAuth, useCart } from "@/shared/store";
import { formatPrice } from "@/shared/utils/format";
import type { Address } from "@/features/addresses";
import type { Order } from "@/features/orders";
import {
  createRazorpayPayment,
  placeOrder,
  verifyRazorpayPayment,
  type PaymentChoice,
  type RazorpayProof,
} from "@/features/checkout/api";
import { clearDraft } from "@/features/checkout/draft";
import {
  PaymentCancelledError,
  loadRazorpay,
  payWithRazorpay,
} from "@/features/checkout/razorpay";
import type { CheckoutDraft, Quote } from "@/features/checkout/types";

type Props = { draft: CheckoutDraft; address: Address; quote: Quote | null };

const OPTIONS: { value: PaymentChoice; title: string; hint: string }[] = [
  {
    value: "cod",
    title: "Cash on delivery",
    hint: "Pay in cash or UPI when your order arrives",
  },
  {
    value: "razorpay",
    title: "Pay online",
    hint: "UPI, cards and netbanking through Razorpay",
  },
];

const messageOf = (err: unknown): string =>
  err instanceof ApiError
    ? getErrorMessage(err)
    : err instanceof Error
      ? err.message
      : getErrorMessage(err);

export default function PaymentStep({ draft, address, quote }: Props) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { removeItem } = useCart();
  const [method, setMethod] = useState<PaymentChoice>("cod");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const [proof, setProof] = useState<RazorpayProof | null>(null);

  const total = quote?.total ?? 0;
  const canPay = Boolean(quote?.canOrder) && !busy;

  function finish(order: Order) {
    draft.items.forEach((item) => removeItem(item.uid, item.size));
    clearDraft();
    navigate(`/order-confirmation/${order._id}`, { replace: true });
  }

  async function handlePay() {
    setBusy(true);
    setError("");

    try {
      if (proof) {
        finish(await verifyRazorpayPayment(proof));
        return;
      }

      if (method === "cod") {
        finish(await placeOrder(draft, address, "cod"));
        return;
      }

      if (!(await loadRazorpay())) {
        throw new Error("Could not load the payment window. Check your connection and try again.");
      }

      let orderId = pendingOrderId;
      if (!orderId) {
        const order = await placeOrder(draft, address, "razorpay");
        orderId = order._id;
        setPendingOrderId(orderId);
      }

      const info = await createRazorpayPayment(orderId);
      const result = await payWithRazorpay({
        key: info.keyId,
        amount: info.amount,
        currency: info.currency,
        name: "Shopora",
        description: `Order ${info.orderNumber}`,
        order_id: info.razorpayOrderId,
        prefill: user ? { name: user.name, email: user.email, contact: user.phone } : {},
        theme: { color: "#0a1f44" },
      });

      const payment: RazorpayProof = {
        orderId,
        razorpayOrderId: result.razorpay_order_id,
        razorpayPaymentId: result.razorpay_payment_id,
        razorpaySignature: result.razorpay_signature,
      };
      setProof(payment);
      finish(await verifyRazorpayPayment(payment));
    } catch (err) {
      setError(
        err instanceof PaymentCancelledError
          ? "Payment was cancelled. Your order is saved for a short while, you can try the payment again."
          : messageOf(err)
      );
      setBusy(false);
    }
  }

  const label = proof
    ? "Confirm payment"
    : method === "cod"
      ? `Place order · ${formatPrice(total)}`
      : pendingOrderId
        ? `Retry payment · ${formatPrice(total)}`
        : `Pay ${formatPrice(total)}`;

  return (
    <section className="space-y-4 border p-6">
      <h2 className="text-xs font-bold uppercase tracking-wide text-gray-800">Payment method</h2>

      {OPTIONS.map((option) => {
        const selected = method === option.value;
        return (
          <label
            key={option.value}
            className={`flex cursor-pointer items-start gap-3 border p-4 transition ${
              selected ? "border-[#0a1f44] bg-blue-50/30" : "border-gray-200"
            } ${proof ? "cursor-not-allowed opacity-60" : ""}`}
          >
            <input
              type="radio"
              name="payment-method"
              checked={selected}
              disabled={Boolean(proof) || busy}
              onChange={() => setMethod(option.value)}
              className="mt-1 h-4 w-4 accent-red-600"
            />
            <span>
              <span className="block text-sm font-bold text-gray-900">{option.title}</span>
              <span className="block text-xs text-gray-500">{option.hint}</span>
            </span>
          </label>
        );
      })}

      {proof && (
        <p className="bg-amber-50 px-4 py-3 text-sm text-amber-800">
          We received your payment but could not confirm it yet. Please do not pay again, press
          Confirm payment.
        </p>
      )}

      {error && (
        <p role="alert" className="bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="button"
        disabled={!canPay}
        onClick={() => void handlePay()}
        className="flex w-full items-center justify-center gap-2 bg-red-600 px-6 py-4 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy && <Loader2 size={16} className="animate-spin" />}
        {busy ? "Please wait..." : label}
      </button>
    </section>
  );
}