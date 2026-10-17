import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getErrorMessage } from "@/shared/api";
import RequireLogin from "@/shared/components/RequireLogin";
import { formatPrice } from "@/shared/utils/format";
import { AddressLines } from "@/features/addresses";
import {
  OrderStatusBadge,
  cancelMyOrder,
  fetchOrder,
  formatOrderDate,
  paymentLabel,
  thumbUrl,
  type Order,
  type OrderStatus,
} from "@/features/orders";

const PROGRESS: OrderStatus[] = ["pending", "processing", "shipped", "delivered"];

function Row({ label, value, green = false }: { label: string; value: string; green?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      <span className={green ? "font-semibold text-green-700" : "text-gray-900"}>{value}</span>
    </div>
  );
}

function OrderDetail({ id }: { id: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");

  useEffect(() => {
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

  async function handleCancel() {
    setCancelling(true);
    setCancelError("");
    try {
      setOrder(await cancelMyOrder(id));
      setConfirming(false);
    } catch (err) {
      setCancelError(getErrorMessage(err));
    } finally {
      setCancelling(false);
    }
  }

  if (error) {
    return (
      <main className="mx-auto max-w-md px-6 py-24 text-center">
        <p className="text-gray-600">{error}</p>
        <Link to="/orders" className="mt-6 inline-block text-sm font-bold text-red-600 underline">
          Back to my orders
        </Link>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="h-64 animate-pulse bg-gray-100" />
      </main>
    );
  }

  const progressIndex = PROGRESS.indexOf(order.status);
  const canCancel = order.status === "pending" && order.paymentStatus !== "paid";
  const platformFee = order.platformFee ?? 0;
  const couponDiscount = order.couponDiscount ?? 0;

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-gray-500">
        <Link to="/orders" className="hover:text-red-600">
          My orders
        </Link>
        <ChevronRight size={14} />
        <span className="font-semibold text-gray-800">{order.orderNumber}</span>
      </nav>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#0a1f44]">{order.orderNumber}</h1>
          <p className="text-sm text-gray-500">Placed on {formatOrderDate(order.createdAt)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {order.status === "cancelled" ? (
        <p className="mt-6 bg-red-50 px-4 py-3 text-sm text-red-700">This order was cancelled.</p>
      ) : (
        <ol className="mt-6 grid grid-cols-4 gap-2 text-center text-[10px] font-bold uppercase tracking-widest sm:text-xs">
          {PROGRESS.map((step, index) => (
            <li key={step}>
              <div
                className={`mb-2 h-1 ${index <= progressIndex ? "bg-green-600" : "bg-gray-200"}`}
              />
              <span className={index <= progressIndex ? "text-green-700" : "text-gray-400"}>
                {step}
              </span>
            </li>
          ))}
        </ol>
      )}

      <div className="mt-8 grid gap-6 md:grid-cols-[minmax(0,1fr)_320px]">
        <section className="space-y-4 border p-5">
          <h2 className="text-xs font-bold uppercase tracking-wide text-gray-800">Items</h2>
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
        </section>

        <aside className="space-y-6">
          <section className="space-y-3 border p-5">
            <h2 className="text-xs font-bold uppercase tracking-wide text-gray-800">Payment</h2>
            <p className="text-sm text-gray-600">{paymentLabel(order)}</p>
            <Row label="Subtotal" value={formatPrice(order.subtotal)} />
            {order.couponCode && (
              <Row
                label={`Coupon (${order.couponCode})`}
                value={`-${formatPrice(couponDiscount)}`}
                green
              />
            )}
            <Row
              label="Delivery"
              value={order.shippingFee === 0 ? "FREE" : formatPrice(order.shippingFee)}
              green={order.shippingFee === 0}
            />
            {platformFee > 0 && <Row label="Platform fee" value={formatPrice(platformFee)} />}
            <div className="flex items-center justify-between border-t pt-3">
              <span className="text-sm font-bold uppercase tracking-wide">Total</span>
              <span className="text-lg font-bold">{formatPrice(order.total)}</span>
            </div>
          </section>

          <section className="border p-5">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-800">
              Delivering to
            </h2>
            <AddressLines address={order.shippingAddress} />
          </section>

          {canCancel && (
            <section className="space-y-3">
              {cancelError && (
                <p role="alert" className="bg-red-50 px-3 py-2 text-xs text-red-700">
                  {cancelError}
                </p>
              )}
              {confirming ? (
                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wide">
                  <span className="normal-case tracking-normal text-gray-700">Cancel this order?</span>
                  <button
                    type="button"
                    disabled={cancelling}
                    onClick={() => void handleCancel()}
                    className="text-red-600 hover:underline disabled:opacity-50"
                  >
                    {cancelling ? "Cancelling..." : "Yes, cancel"}
                  </button>
                  <button
                    type="button"
                    disabled={cancelling}
                    onClick={() => setConfirming(false)}
                    className="text-gray-600 hover:underline"
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirming(true)}
                  className="w-full border border-red-600 px-4 py-3 text-xs font-bold uppercase tracking-wide text-red-600 transition-colors hover:bg-red-600 hover:text-white"
                >
                  Cancel order
                </button>
              )}
            </section>
          )}
        </aside>
      </div>
    </main>
  );
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <RequireLogin title="Login to see your order" message="Your orders are saved to your account.">
      {id ? <OrderDetail key={id} id={id} /> : null}
    </RequireLogin>
  );
}