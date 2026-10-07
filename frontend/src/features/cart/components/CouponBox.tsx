import { useState, type FormEvent } from "react";
import { Tag } from "lucide-react";
import { formatPrice } from "@/shared/utils/format";
import { findCoupon } from "@/shared/utils/pricing";

type CouponBoxProps = {
  appliedCode: string | null;
  subtotal: number;
  savings: number;
  onApply: (code: string) => void;
  onRemove: () => void;
};

export default function CouponBox({
  appliedCode,
  subtotal,
  savings,
  onApply,
  onRemove,
}: CouponBoxProps) {
  const [value, setValue] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const coupon = findCoupon(value);

    if (!coupon) {
      setError("Invalid coupon code");
      return;
    }
    if (subtotal < coupon.minOrder) {
      setError(`Add items worth ${formatPrice(coupon.minOrder - subtotal)} more to use this coupon`);
      return;
    }

    setError("");
    setValue("");
    onApply(coupon.code);
  };

  return (
    <section className="border-b pb-6">
      <h2 className="text-xs font-bold uppercase tracking-wide text-gray-500">Coupons</h2>

      {appliedCode ? (
        <div className="mt-3 flex items-start justify-between gap-3 border border-green-200 bg-green-50 px-4 py-3">
          <div>
            <p className="flex items-center gap-2 text-sm font-bold text-green-800">
              <Tag size={16} />
              {appliedCode} applied
            </p>
            <p className="mt-1 text-xs text-green-700">
              {savings > 0
                ? `You saved ${formatPrice(savings)}`
                : "Minimum order of ₹999 is needed for this coupon"}
            </p>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="text-xs font-bold uppercase tracking-wide text-red-600 hover:underline"
          >
            Remove
          </button>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
            <input
              value={value}
              onChange={(event) => {
                setValue(event.target.value);
                if (error) setError("");
              }}
              placeholder="Enter coupon code"
              aria-label="Coupon code"
              className="min-w-0 flex-1 border border-gray-300 px-3 py-2 text-sm uppercase outline-none placeholder:normal-case focus:border-[#0a1f44]"
            />
            <button
              type="submit"
              className="border border-red-600 px-4 py-2 text-xs font-bold uppercase tracking-wide text-red-600 transition-colors hover:bg-red-600 hover:text-white"
            >
              Apply
            </button>
          </form>
          {error ? (
            <p role="alert" className="mt-2 text-xs font-semibold text-red-600">
              {error}
            </p>
          ) : (
            <p className="mt-2 text-xs text-gray-500">
              Try <span className="font-bold text-gray-800">SHOPORA10</span>: 10% off up to ₹300
              on orders above ₹999
            </p>
          )}
        </>
      )}
    </section>
  );
}