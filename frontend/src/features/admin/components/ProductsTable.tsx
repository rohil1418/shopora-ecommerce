import { Link } from "react-router-dom";
import { Loader2, Package, Pencil, RotateCcw, Trash2 } from "lucide-react";
import type { AdminProduct } from "../types";

const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function thumbnail(product: AdminProduct): string | undefined {
  const first = product.images[0];
  return typeof first === "string" ? first : first?.url;
}

function totalStock(product: AdminProduct): number {
  return product.sizes.length > 0
    ? product.sizes.reduce((sum, size) => sum + size.stock, 0)
    : product.stock;
}

function formatDate(value?: string | null): string {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

type Props = {
  products: AdminProduct[];
  variant?: "products" | "trash";
  busyId?: string | null;
  onTrash?: (product: AdminProduct) => void;
  onRestore?: (product: AdminProduct) => void;
  onPurge?: (product: AdminProduct) => void;
};

export default function ProductsTable({
  products,
  variant = "products",
  busyId = null,
  onTrash,
  onRestore,
  onPurge,
}: Props) {
  const inTrash = variant === "trash";

  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
      <table className="w-full min-w-[820px] text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3 font-semibold">Product</th>
            <th className="px-4 py-3 font-semibold">SKU</th>
            <th className="px-4 py-3 font-semibold">Collection</th>
            <th className="px-4 py-3 font-semibold">Category</th>
            <th className="px-4 py-3 text-right font-semibold">Price</th>
            <th className="px-4 py-3 text-right font-semibold">Stock</th>
            <th className="px-4 py-3 font-semibold">{inTrash ? "Deleted on" : "Status"}</th>
            <th className="px-4 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {products.map((product) => {
            const src = thumbnail(product);
            const stock = totalStock(product);
            const busy = busyId === product.id;

            return (
              <tr key={product.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {src ? (
                      <img
                        src={src}
                        alt=""
                        className={`h-12 w-12 rounded-lg object-cover ${inTrash ? "grayscale" : ""}`}
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                        <Package size={20} />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-900">{product.title}</p>
                      <p className="text-xs text-slate-500">{product.brand}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-600">{product.sku}</td>
                <td className="px-4 py-3 text-slate-600">{product.collection}</td>
                <td className="px-4 py-3 capitalize text-slate-600">{product.category}</td>
                <td className="px-4 py-3 text-right">
                  <p className="font-medium text-slate-900">{money.format(product.price)}</p>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <p className="text-xs text-slate-400 line-through">
                      {money.format(product.originalPrice)}
                    </p>
                  )}
                </td>
                <td
                  className={`px-4 py-3 text-right font-medium ${
                    stock === 0 ? "text-red-600" : "text-slate-700"
                  }`}
                >
                  {stock}
                </td>
                <td className="px-4 py-3">
                  {inTrash ? (
                    <span className="text-slate-600">{formatDate(product.deletedAt)}</span>
                  ) : (
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        product.isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {inTrash ? (
                      <>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => onRestore?.(product)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                        >
                          {busy ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <RotateCcw size={14} />
                          )}
                          Restore
                        </button>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => onPurge?.(product)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          <Trash2 size={14} />
                          Delete forever
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          <Pencil size={14} />
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => onTrash?.(product)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}