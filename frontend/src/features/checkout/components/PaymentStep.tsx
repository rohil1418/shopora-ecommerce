import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { getErrorMessage } from "@/shared/api";
import { useCart } from "@/shared/store";
import { formatPrice } from "@/shared/utils/format";
import type { Address } from "@/features/addresses";
import { placeOrder } from "@/features/checkout/api";
import { clearDraft } from "@/features/checkout/draft";
import type { CheckoutDraft, Quote } from "@/features/checkout/types";

type Props = { draft: CheckoutDraft; address: Address; quote: Quote | null };

export default function PaymentStep({ draft, address, quote }: Props) {
  const navigate = useNavigate();
  const { removeItem } = useCart();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const canPlace = Boolean(quote?.canOrder) && !busy;

  async function handlePlaceOrder() {
    setBusy(true);
    setError("");
    try {
      const order = await placeOrder(draft, address, "cod");
      draft.items.forEach((item) => removeItem(item.uid, item.size));
      clearDraft();
      navigate(`/order-confirmation/${order._id}`, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
      setBusy(false);
    }
  }

  return (
    <section className="space-y-4 border p-6">
      <h2 className="text-xs font-bold uppercase tracking-wide text-gray-800">Payment method</h2>

      <label className="flex cursor-pointer items-start gap-3 border border-[#0a1f44] bg-blue-50/30 p-4">
        <input type="radio" checked readOnly className="mt-1 h-4 w-4 accent-red-600" />
        <span>
          <span className="block text-sm font-bold text-gray-900">Cash on delivery</span>
          <span className="block text-xs text-gray-500">
            Pay in cash or UPI when your order arrives
          </span>
        </span>
      </label>

      <label className="flex items-start gap-3 border border-gray-200 p-4 opacity-60">
        <input type="radio" disabled className="mt-1 h-4 w-4" />
        <span>
          <span className="block text-sm font-bold text-gray-900">
            Pay online <span className="text-xs font-normal text-gray-500">(coming soon)</span>
          </span>
          <span className="block text-xs text-gray-500">UPI, cards and netbanking</span>
        </span>
      </label>

      {error && (
        <p role="alert" className="bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="button"
        disabled={!canPlace}
        onClick={() => void handlePlaceOrder()}
        className="flex w-full items-center justify-center gap-2 bg-red-600 px-6 py-4 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy && <Loader2 size={16} className="animate-spin" />}
        {busy ? "Placing order..." : `Place order · ${formatPrice(quote?.total ?? 0)}`}
      </button>
    </section>
  );
}