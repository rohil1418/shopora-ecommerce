import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { formatPrice } from "@/shared/utils/format";
import type { Quote } from "@/features/checkout/types";

const thumb = (url: string): string =>
  url.includes("res.cloudinary.com") && url.includes("/upload/")
    ? url.replace("/upload/", "/upload/f_auto,q_auto,w_160,c_limit/")
    : url;

function Row({ label, value, green = false }: { label: string; value: string; green?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      <span className={green ? "font-semibold text-green-700" : "text-gray-900"}>{value}</span>
    </div>
  );
}

export default function OrderSummary({ quote }: { quote: Quote }) {
  const mrpDiscount = quote.mrpTotal - quote.subtotal;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wide text-gray-800">
          Order summary ({quote.itemCount} {quote.itemCount === 1 ? "item" : "items"})
        </h2>

        <ul className="mt-4 space-y-4">
          {quote.items.map((item) => (
            <li key={`${item.productId}-${item.size ?? "-"}`} className="flex gap-3">
              {item.image ? (
                <img
                  src={thumb(item.image)}
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
                <p className="mt-1 text-sm font-bold text-gray-900">
                  {formatPrice(item.price * item.quantity)}
                </p>
                {item.issue && (
                  <p className="mt-1 text-xs font-semibold text-red-600">{item.issue}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-3 border-t pt-6">
        <h2 className="text-xs font-bold uppercase tracking-wide text-gray-800">Price details</h2>
        <Row label="Total MRP" value={formatPrice(quote.mrpTotal)} />
        {mrpDiscount > 0 && <Row label="Discount on MRP" value={`-${formatPrice(mrpDiscount)}`} green />}
        {quote.couponCode && (
          <Row
            label={`Coupon (${quote.couponCode})`}
            value={`-${formatPrice(quote.couponDiscount)}`}
            green
          />
        )}
        <Row
          label="Delivery"
          value={quote.shippingFee === 0 ? "FREE" : formatPrice(quote.shippingFee)}
          green={quote.shippingFee === 0}
        />
        <Row label="Platform fee" value={formatPrice(quote.platformFee)} />

        <div className="flex items-center justify-between border-t pt-4">
          <span className="text-sm font-bold uppercase tracking-wide text-gray-900">
            Total amount
          </span>
          <span className="text-lg font-bold text-gray-900">{formatPrice(quote.total)}</span>
        </div>
      </div>

      {quote.couponError && (
        <p className="flex items-start gap-2 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          Coupon not applied: {quote.couponError}
        </p>
      )}

      {!quote.canOrder && (
        <p className="bg-red-50 px-3 py-2 text-xs text-red-700">
          Some items are not available in the quantity you chose.{" "}
          <Link to="/bag" className="font-bold underline">
            Update your bag
          </Link>
        </p>
      )}
    </div>
  );
}