import { Fragment, useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { getErrorMessage } from "@/shared/api";
import { formatPrice } from "@/shared/utils/format";
import { AddressLines } from "@/features/addresses";
import {
  OrderStatusBadge,
  formatOrderDate,
  paymentLabel,
  thumbUrl,
  type OrderStatus,
} from "@/features/orders";
import {
  ConfirmDialog,
  fetchAdminOrders,
  updateAdminOrderStatus,
  type AdminOrder,
  type AdminOrderList,
} from "../features/admin";

type Tab = "all" | OrderStatus;

const TABS: { value: Tab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const NEXT_STATUSES: Record<OrderStatus, OrderStatus[]> = {
  pending: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

type CancelRequest = { order: AdminOrder };

export default function AdminOrdersPage() {
  const [tab, setTab] = useState<Tab>("all");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<AdminOrderList | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [notice, setNotice] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [cancelRequest, setCancelRequest] = useState<CancelRequest | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    setError("");

    fetchAdminOrders(page, tab)
      .then((result) => {
        if (!ignore) setData(result);
      })
      .catch((err) => {
        if (!ignore) setError(getErrorMessage(err));
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [page, tab, reloadKey]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  function switchTab(next: Tab) {
    if (next === tab) return;
    setTab(next);
    setPage(1);
    setData(null);
    setOpenId(null);
  }

  async function applyStatus(order: AdminOrder, status: OrderStatus) {
    setUpdatingId(order._id);
    setError("");
    try {
      const result = await updateAdminOrderStatus(order._id, status);
      setNotice(`${order.orderNumber}: ${result.message}`);
      setReloadKey((key) => key + 1);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUpdatingId(null);
    }
  }

  function handleChange(order: AdminOrder, status: OrderStatus) {
    if (status === "cancelled") {
      setCancelError("");
      setCancelRequest({ order });
      return;
    }
    void applyStatus(order, status);
  }

  async function confirmCancel() {
    if (!cancelRequest) return;
    setCancelling(true);
    setCancelError("");
    try {
      const result = await updateAdminOrderStatus(cancelRequest.order._id, "cancelled");
      setNotice(`${cancelRequest.order.orderNumber}: ${result.message}`);
      setCancelRequest(null);
      setReloadKey((key) => key + 1);
    } catch (err) {
      setCancelError(getErrorMessage(err));
    } finally {
      setCancelling(false);
    }
  }

  const tabClass = (active: boolean) =>
    `rounded-lg px-4 py-2 text-sm font-semibold transition ${
      active ? "bg-slate-900 text-white" : "bg-white text-slate-600 hover:bg-slate-50"
    }`;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Orders</h1>
        <p className="text-sm text-slate-500">
          {data ? `${data.total} orders` : "Loading orders..."}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => switchTab(item.value)}
            className={tabClass(tab === item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {notice && (
        <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{notice}</div>
      )}
      {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      {isLoading && !data && (
        <div className="rounded-2xl bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
          Loading...
        </div>
      )}

      {data && data.items.length === 0 && (
        <div className="rounded-2xl bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
          No orders here.
        </div>
      )}

      {data && data.items.length > 0 && (
        <div
          className={`overflow-x-auto rounded-2xl bg-white shadow-sm ${isLoading ? "opacity-60" : ""}`}
        >
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Order</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 text-right font-semibold">Total</th>
                <th className="px-4 py-3 font-semibold">Payment</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Move to</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.items.map((order) => {
                const open = openId === order._id;
                const options = NEXT_STATUSES[order.status];

                return (
                  <Fragment key={order._id}>
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <p className="font-mono text-xs font-semibold text-slate-900">
                          {order.orderNumber}
                        </p>
                        <p className="text-xs text-slate-500">{formatOrderDate(order.createdAt)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900">
                          {order.user?.name ?? "Deleted user"}
                        </p>
                        <p className="text-xs text-slate-500">{order.user?.email ?? ""}</p>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-slate-900">
                        {formatPrice(order.total)}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{paymentLabel(order)}</td>
                      <td className="px-4 py-3">
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-3">
                        {options.length === 0 ? (
                          <span className="text-slate-400">-</span>
                        ) : (
                          <select
                            value=""
                            disabled={updatingId === order._id}
                            onChange={(e) => handleChange(order, e.target.value as OrderStatus)}
                            className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs capitalize"
                          >
                            <option value="" disabled>
                              {updatingId === order._id ? "Updating..." : "Select"}
                            </option>
                            {options.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => setOpenId(open ? null : order._id)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900"
                        >
                          Details
                          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      </td>
                    </tr>

                    {open && (
                      <tr className="bg-slate-50">
                        <td colSpan={7} className="px-4 py-4">
                          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_280px]">
                            <ul className="space-y-3">
                              {order.items.map((item) => (
                                <li
                                  key={`${item.sku}-${item.size ?? "-"}`}
                                  className="flex items-center gap-3"
                                >
                                  {item.image ? (
                                    <img
                                      src={thumbUrl(item.image, 100)}
                                      alt=""
                                      className="h-12 w-12 rounded-lg object-cover"
                                    />
                                  ) : (
                                    <div className="h-12 w-12 rounded-lg bg-slate-200" />
                                  )}
                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-slate-900">
                                      {item.title}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                      {item.sku}
                                      {item.size ? ` · Size ${item.size}` : ""} · Qty {item.quantity}
                                    </p>
                                  </div>
                                  <span className="text-sm font-medium text-slate-900">
                                    {formatPrice(item.price * item.quantity)}
                                  </span>
                                </li>
                              ))}
                            </ul>

                            <div className="space-y-4 text-sm">
                              <div>
                                <p className="mb-1 text-xs font-semibold uppercase text-slate-500">
                                  Ship to
                                </p>
                                <AddressLines address={order.shippingAddress} />
                              </div>
                              <div className="space-y-1 text-slate-600">
                                <p>Subtotal: {formatPrice(order.subtotal)}</p>
                                {order.couponCode && (
                                  <p>
                                    Coupon {order.couponCode}: -
                                    {formatPrice(order.couponDiscount ?? 0)}
                                  </p>
                                )}
                                <p>Delivery: {formatPrice(order.shippingFee)}</p>
                                <p>Platform fee: {formatPrice(order.platformFee ?? 0)}</p>
                                {order.razorpayPaymentId && (
                                  <p className="break-all font-mono text-xs">
                                    {order.razorpayPaymentId}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>
            Page {data.page} of {data.totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page <= 1 || isLoading}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-medium disabled:opacity-40"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= data.totalPages || isLoading}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-medium disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {cancelRequest && (
        <ConfirmDialog
          title="Cancel this order?"
          message={
            cancelRequest.order.paymentStatus === "paid"
              ? `${cancelRequest.order.orderNumber} was paid online. Cancelling puts the stock back, but the money is not refunded automatically, refund it from your Razorpay dashboard.`
              : `${cancelRequest.order.orderNumber} will be cancelled and its stock put back. This cannot be undone.`
          }
          confirmLabel="Cancel order"
          busyLabel="Cancelling..."
          tone="danger"
          busy={cancelling}
          error={cancelError}
          onConfirm={() => void confirmCancel()}
          onCancel={() => setCancelRequest(null)}
        />
      )}
    </div>
  );
}