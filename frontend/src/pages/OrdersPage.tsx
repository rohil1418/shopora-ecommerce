import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getErrorMessage } from "@/shared/api";
import RequireLogin from "@/shared/components/RequireLogin";
import { formatPrice } from "@/shared/utils/format";
import {
  OrderStatusBadge,
  fetchMyOrders,
  formatOrderDate,
  paymentLabel,
  thumbUrl,
  type Order,
} from "@/features/orders";

function OrdersContent() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    fetchMyOrders()
      .then((result) => {
        if (!ignore) setOrders(result);
      })
      .catch((err) => {
        if (!ignore) setError(getErrorMessage(err));
      });

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold text-[#0a1f44]">My orders</h1>

      {error && <p className="mt-6 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      {!orders && !error && <div className="mt-6 h-40 animate-pulse bg-gray-100" />}

      {orders && orders.length === 0 && (
        <div className="mt-10 text-center">
          <p className="text-gray-600">You have not placed any orders yet.</p>
          <Link
            to="/"
            className="mt-6 inline-block bg-[#0a1f44] px-6 py-3 text-sm font-medium uppercase tracking-wide text-white transition-colors hover:bg-red-600"
          >
            Start shopping
          </Link>
        </div>
      )}

      {orders && orders.length > 0 && (
        <ul className="mt-6 space-y-4">
          {orders.map((order) => {
            const count = order.items.reduce((sum, item) => sum + item.quantity, 0);
            return (
              <li key={order._id} className="border">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-gray-50 px-4 py-3">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{order.orderNumber}</p>
                    <p className="text-xs text-gray-500">
                      Placed on {formatOrderDate(order.createdAt)}
                    </p>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </div>

                <div className="flex items-center gap-2 px-4 py-4">
                  {order.items.slice(0, 4).map((item) =>
                    item.image ? (
                      <img
                        key={`${item.sku}-${item.size ?? "-"}`}
                        src={thumbUrl(item.image)}
                        alt={item.title}
                        className="aspect-[3/4] w-14 bg-gray-100 object-cover"
                      />
                    ) : (
                      <div
                        key={`${item.sku}-${item.size ?? "-"}`}
                        className="aspect-[3/4] w-14 bg-gray-100"
                      />
                    )
                  )}
                  {order.items.length > 4 && (
                    <span className="text-xs text-gray-500">+{order.items.length - 4} more</span>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-t px-4 py-3 text-sm">
                  <span className="text-gray-600">
                    {count} {count === 1 ? "item" : "items"} · {paymentLabel(order)} ·{" "}
                    <span className="font-bold text-gray-900">{formatPrice(order.total)}</span>
                  </span>
                  <Link
                    to={`/orders/${order._id}`}
                    className="text-xs font-bold uppercase tracking-wide text-red-600 hover:underline"
                  >
                    View details
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}

export default function OrdersPage() {
  return (
    <RequireLogin title="Login to see your orders" message="Your orders are saved to your account.">
      <OrdersContent />
    </RequireLogin>
  );
}