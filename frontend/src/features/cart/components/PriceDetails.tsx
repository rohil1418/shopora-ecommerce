import { formatPrice } from "@/shared/utils/format";
import type { PriceSummary } from "@/shared/utils/pricing";

type PriceDetailsProps = {
  summary: PriceSummary;
  canOrder: boolean;
  onPlaceOrder: () => void;
};

export default function PriceDetails({ summary, canOrder, onPlaceOrder }: PriceDetailsProps) {
  return (
    <section>
      <h2 className="text-xs font-bold uppercase tracking-wide text-gray-500">
        Price details ({summary.itemCount} {summary.itemCount === 1 ? "item" : "items"})
      </h2>

      <dl className="mt-4 space-y-3 text-sm text-gray-800">
        <div className="flex justify-between">
          <dt>Total MRP</dt>
          <dd>{formatPrice(summary.totalMrp)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Discount on MRP</dt>
          <dd className="text-green-600">- {formatPrice(summary.discountOnMrp)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Coupon discount</dt>
          {summary.couponDiscount > 0 ? (
            <dd className="text-green-600">- {formatPrice(summary.couponDiscount)}</dd>
          ) : (
            <dd className="text-red-500">Apply coupon</dd>
          )}
        </div>
        <div className="flex justify-between">
          <dt>Platform fee</dt>
          <dd>{formatPrice(summary.platformFee)}</dd>
        </div>
        <div className="flex justify-between border-t border-dashed pt-3 text-base font-bold">
          <dt>Total amount</dt>
          <dd>{formatPrice(summary.total)}</dd>
        </div>
      </dl>

      <p className="mt-4 text-xs text-gray-500">
        By placing the order, you agree to Shopora's Terms of Use and Privacy Policy.
      </p>

      <button
        type="button"
        onClick={onPlaceOrder}
        disabled={!canOrder}
        className="mt-3 w-full bg-red-600 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Place order
      </button>
    </section>
  );
}