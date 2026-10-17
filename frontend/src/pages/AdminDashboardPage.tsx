import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, IndianRupee, Package, Plus, RefreshCw, ShoppingBag } from "lucide-react";
import { getErrorMessage } from "@/shared/api";
import { useAuth } from "@/shared/store";
import { formatPrice } from "@/shared/utils/format";
import { OrderStatusBadge, formatOrderDate, paymentLabel, thumbUrl } from "@/features/orders";
import {
  SalesChart,
  StatCard,
  fetchDashboard,
  type DashboardData,
} from "../features/admin";

function Thumb({ src }: { src: string }) {
  return src ? (
    <img src={thumbUrl(src, 100)} alt="" className="h-11 w-11 shrink-0 rounded-lg object-cover" />
  ) : (
    <div className="h-11 w-11 shrink-0 rounded-lg bg-slate-100" />
  );
}

function Card({
  title,
  action,
  children,
}: {
  title: string;
  action?: { label: string; to: string };
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        {action && (
          <Link to={action.to} className="text-xs font-semibold text-slate-600 hover:text-slate-900">
            {action.label}
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="h-32 animate-pulse rounded-2xl bg-white" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="h-72 animate-pulse rounded-2xl bg-white lg:col-span-2" />
        <div className="h-72 animate-pulse rounded-2xl bg-white" />
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    setError("");

    fetchDashboard()
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
  }, [reloadKey]);

  const firstName = user?.name.split(" ")[0] ?? "";
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Welcome back, {firstName}</h1>
          <p className="text-sm text-slate-500">{today}. Here is what is happening in your store.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            disabled={isLoading}
            aria-label="Refresh"
            className="rounded-lg border border-slate-300 bg-white p-2.5 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          </button>
          <Link
            to="/admin/orders"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            View orders
          </Link>
          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
          >
            <Plus size={16} />
            Add product
          </Link>
        </div>
      </div>

      {error && (
        <div className="flex items-center justify-between gap-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            className="font-semibold underline"
          >
            Try again
          </button>
        </div>
      )}

      {!data && !error && <DashboardSkeleton />}

      {data && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total sales"
              value={formatPrice(data.stats.totalSales)}
              hint={`${data.stats.totalOrders} orders, cancelled ones not counted`}
              icon={IndianRupee}
              to="/admin/orders"
            />
            <StatCard
              label="Orders today"
              value={String(data.stats.ordersToday)}
              hint={`${formatPrice(data.stats.salesToday)} in sales today`}
              icon={ShoppingBag}
              to="/admin/orders"
            />
            <StatCard
              label="Pending orders"
              value={String(data.stats.pendingOrders)}
              hint={data.stats.pendingOrders > 0 ? "Waiting for you to process" : "All caught up"}
              icon={Clock}
              tone={data.stats.pendingOrders > 0 ? "warning" : "default"}
              to="/admin/orders"
            />
            <StatCard
              label="Products"
              value={String(data.stats.activeProducts)}
              hint={`${data.stats.totalProducts} in total, ${data.stats.lowStockCount} low on stock`}
              icon={Package}
              tone={data.stats.lowStockCount > 0 ? "warning" : "default"}
              to="/admin/products"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <SalesChart days={data.salesByDay} />
            </div>

            <Card title={`Low stock (${data.stats.lowStockCount})`}>
              {data.lowStock.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-500">
                  All products are well stocked.
                </p>
              ) : (
                <ul className="space-y-3">
                  {data.lowStock.map((product) => (
                    <li key={product.id}>
                      <Link
                        to={`/admin/products/${product.id}/edit`}
                        className="flex items-center gap-3 rounded-lg p-1 hover:bg-slate-50"
                      >
                        <Thumb src={product.image} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-slate-900">
                            {product.title}
                          </p>
                          <p className="font-mono text-xs text-slate-500">{product.sku}</p>
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            product.stock === 0
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {product.stock === 0 ? "Out of stock" : `${product.stock} left`}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card title="Latest orders" action={{ label: "View all", to: "/admin/orders" }}>
                {data.recentOrders.length === 0 ? (
                  <p className="py-8 text-center text-sm text-slate-500">No orders yet.</p>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {data.recentOrders.map((order) => (
                      <li key={order.id} className="flex items-center gap-3 py-3">
                        <Thumb src={order.image} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-slate-900">
                            {order.customer?.name ?? "Deleted user"}
                          </p>
                          <p className="truncate text-xs text-slate-500">
                            <span className="font-mono">{order.orderNumber}</span> ·{" "}
                            {formatOrderDate(order.createdAt)} · {order.itemCount}{" "}
                            {order.itemCount === 1 ? "item" : "items"} · {paymentLabel(order)}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-sm font-semibold text-slate-900">
                            {formatPrice(order.total)}
                          </span>
                          <OrderStatusBadge status={order.status} />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            </div>

            <Card title="Recently added" action={{ label: "All products", to: "/admin/products" }}>
              {data.recentProducts.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-500">No products yet.</p>
              ) : (
                <ul className="space-y-3">
                  {data.recentProducts.map((product) => (
                    <li key={product.id}>
                      <Link
                        to={`/admin/products/${product.id}/edit`}
                        className="flex items-center gap-3 rounded-lg p-1 hover:bg-slate-50"
                      >
                        <Thumb src={product.image} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-slate-900">
                            {product.title}
                          </p>
                          <p className="truncate text-xs text-slate-500">
                            {product.collection} · {formatOrderDate(product.createdAt)}
                            {product.isActive ? "" : " · Inactive"}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-slate-900">
                          {formatPrice(product.price)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
}