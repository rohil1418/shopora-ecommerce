import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { saveDraft } from "@/features/checkout";
import { getProduct } from "@/features/products";
import { isValidPincode, usePincode } from "@/shared/hooks/usePincode";
import { useCart, useWishlist } from "@/shared/store";
import { findCoupon, summarize } from "@/shared/utils/pricing";
import type { BagLine } from "../types";
import BagItemCard from "./BagItemCard";
import CouponBox from "./CouponBox";
import EmptyBag from "./EmptyBag";
import PriceDetails from "./PriceDetails";

const lineKey = (uid: string, size: string | null): string => `${uid}|${size ?? "-"}`;

export default function BagView() {
  const navigate = useNavigate();
  const { items, removeItem, setQty, setSize } = useCart();
  const { add: addToWishlist } = useWishlist();
  const [pincode, setPincode] = usePincode();
  const [editingPincode, setEditingPincode] = useState<boolean>(false);
  const [pincodeDraft, setPincodeDraft] = useState<string>(pincode);
  const [deselected, setDeselected] = useState<string[]>([]);
  const [couponCode, setCouponCode] = useState<string | null>(null);

  const lines: BagLine[] = items.flatMap((item) => {
    const product = getProduct(item.uid);
    return product ? [{ key: lineKey(item.uid, item.size), item, product }] : [];
  });

  const selectedLines = lines.filter((line) => !deselected.includes(line.key));
  const allSelected = lines.length > 0 && selectedLines.length === lines.length;

  const coupon = couponCode ? findCoupon(couponCode) : undefined;
  const sellingTotal = selectedLines.reduce(
    (sum, line) => sum + line.product.price * line.item.qty,
    0
  );
  const summary = summarize(
    selectedLines.map((line) => ({
      price: line.product.price,
      originalPrice: line.product.originalPrice ?? line.product.price,
      qty: line.item.qty,
    })),
    coupon
  );

  const toggleLine = (key: string) =>
    setDeselected((prev) =>
      prev.includes(key) ? prev.filter((existing) => existing !== key) : [...prev, key]
    );

  const toggleAll = () => setDeselected(allSelected ? lines.map((line) => line.key) : []);

  const removeLines = (target: BagLine[]) => {
    target.forEach((line) => removeItem(line.item.uid, line.item.size));
    setDeselected((prev) => prev.filter((key) => !target.some((line) => line.key === key)));
  };

  const moveToWishlist = (target: BagLine[]) => {
    target.forEach((line) => addToWishlist(line.item.uid));
    removeLines(target);
  };

   const goToCheckout = () => {
    if (selectedLines.length === 0) return;
    saveDraft({
      items: selectedLines.map((line) => ({
        uid: line.item.uid,
        size: line.item.size,
        qty: line.item.qty,
      })),
      couponCode,
    });
    navigate("/checkout");
  };

  const savePincode = () => {
    if (!isValidPincode(pincodeDraft)) return;
    setPincode(pincodeDraft);
    setEditingPincode(false);
  };

  if (lines.length === 0) return <EmptyBag />;

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center border-b pb-4">
        <span />
        <ol className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] sm:gap-3">
          <li className="border-b-2 border-green-600 pb-1 text-green-700">Bag</li>
          <li aria-hidden className="w-6 border-t border-dashed border-gray-300 sm:w-12" />
          <li className="text-gray-400">Address</li>
          <li aria-hidden className="w-6 border-t border-dashed border-gray-300 sm:w-12" />
          <li className="text-gray-400">Payment</li>
        </ol>
        <span className="flex items-center justify-end gap-1.5 text-xs font-semibold uppercase tracking-widest text-gray-600">
          <ShieldCheck size={20} className="text-green-600" />
          <span className="hidden sm:inline">100% Secure</span>
        </span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border border-red-100 bg-red-50 px-4 py-4">
            {editingPincode ? (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  savePincode();
                }}
                className="flex flex-1 items-center gap-2"
              >
                <input
                  inputMode="numeric"
                  maxLength={6}
                  value={pincodeDraft}
                  onChange={(event) => setPincodeDraft(event.target.value.replace(/\D/g, ""))}
                  aria-label="Pincode"
                  className="w-32 border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#0a1f44]"
                />
                <button
                  type="submit"
                  disabled={!isValidPincode(pincodeDraft)}
                  className="text-xs font-bold uppercase tracking-wide text-red-600 disabled:opacity-40"
                >
                  Save
                </button>
              </form>
            ) : (
              <>
                <p className="text-sm text-gray-800">
                  Deliver to: <span className="font-bold">{pincode}</span>
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setPincodeDraft(pincode);
                    setEditingPincode(true);
                  }}
                  className="border border-red-600 px-4 py-2 text-xs font-bold uppercase tracking-wide text-red-600 transition-colors hover:bg-red-600 hover:text-white"
                >
                  Change address
                </button>
              </>
            )}
          </div>

          <div className="flex items-center justify-between border-b py-3">
            <label className="flex cursor-pointer items-center gap-3 text-sm font-bold uppercase tracking-wide text-gray-800">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                className="h-4 w-4 accent-red-600"
              />
              {selectedLines.length}/{lines.length} items selected
            </label>
            <div className="flex divide-x text-xs font-bold uppercase tracking-wide text-gray-600">
              <button
                type="button"
                onClick={() => removeLines(selectedLines)}
                disabled={selectedLines.length === 0}
                className="px-3 transition-colors hover:text-red-600 disabled:opacity-40 sm:px-4"
              >
                Remove
              </button>
              <button
                type="button"
                onClick={() => moveToWishlist(selectedLines)}
                disabled={selectedLines.length === 0}
                className="px-3 transition-colors hover:text-red-600 disabled:opacity-40 sm:px-4"
              >
                Move to wishlist
              </button>
            </div>
          </div>

          <ul className="space-y-4">
            <AnimatePresence initial={false}>
              {lines.map((line) => (
                <BagItemCard
                  key={line.key}
                  line={line}
                  selected={!deselected.includes(line.key)}
                  onToggle={() => toggleLine(line.key)}
                  onRemove={() => removeLines([line])}
                  onQtyChange={(qty) => setQty(line.item.uid, line.item.size, qty)}
                  onSizeChange={(size) => setSize(line.item.uid, line.item.size, size)}
                />
              ))}
            </AnimatePresence>
          </ul>
        </div>

        <aside className="space-y-6 lg:border-l lg:pl-6">
          <CouponBox
            appliedCode={couponCode}
            subtotal={sellingTotal}
            savings={summary.couponDiscount}
            onApply={setCouponCode}
            onRemove={() => setCouponCode(null)}
          />
          <PriceDetails
            summary={summary}
            canOrder={selectedLines.length > 0}
            onPlaceOrder={goToCheckout}
          />
        </aside>
      </div>
    </main>
  );
}
