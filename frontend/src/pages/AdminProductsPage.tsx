import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { getErrorMessage } from "@/shared/api";
import {
  ConfirmDialog,
  ProductsTable,
  deleteAdminProduct,
  fetchAdminProducts,
  purgeAdminProduct,
  restoreAdminProduct,
  type AdminProduct,
  type AdminProductList,
  type ProductView,
} from "../features/admin";

const PAGE_SIZE = 20;

type Dialog = { kind: "trash" | "purge"; product: AdminProduct };

export default function AdminProductsPage() {
  const [view, setView] = useState<ProductView>("all");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<AdminProductList | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [notice, setNotice] = useState("");

  const [dialog, setDialog] = useState<Dialog | null>(null);
  const [working, setWorking] = useState(false);
  const [dialogError, setDialogError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const inTrash = view === "trash";

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    setError("");

    fetchAdminProducts(page, PAGE_SIZE, view)
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
  }, [page, view, reloadKey]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  function switchView(next: ProductView) {
    if (next === view) return;
    setView(next);
    setPage(1);
    setData(null);
    setError("");
    setNotice("");
  }

  function afterChange() {
    if (data && data.items.length === 1 && page > 1) setPage((p) => p - 1);
    else setReloadKey((key) => key + 1);
  }

  async function confirmDialog() {
    if (!dialog) return;
    setWorking(true);
    setDialogError("");

    try {
      if (dialog.kind === "trash") {
        await deleteAdminProduct(dialog.product.id);
        setNotice(`"${dialog.product.title}" was moved to trash`);
      } else {
        await purgeAdminProduct(dialog.product.id);
        setNotice(`"${dialog.product.title}" was permanently deleted`);
      }
      setDialog(null);
      afterChange();
    } catch (err) {
      setDialogError(getErrorMessage(err));
    } finally {
      setWorking(false);
    }
  }

  async function restore(product: AdminProduct) {
    setBusyId(product.id);
    setError("");
    try {
      await restoreAdminProduct(product.id);
      setNotice(`"${product.title}" was restored`);
      afterChange();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  }

  function closeDialog() {
    setDialog(null);
    setDialogError("");
  }

  const from = data && data.total > 0 ? (data.page - 1) * data.limit + 1 : 0;
  const to = data ? Math.min(data.page * data.limit, data.total) : 0;

  const tabClass = (active: boolean) =>
    `rounded-lg px-4 py-2 text-sm font-semibold transition ${
      active ? "bg-slate-900 text-white" : "bg-white text-slate-600 hover:bg-slate-50"
    }`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{inTrash ? "Trash" : "Products"}</h1>
          <p className="text-sm text-slate-500">
            {data
              ? `${data.total} ${inTrash ? "products in trash" : "products in your store"}`
              : "Loading..."}
          </p>
        </div>
        {!inTrash && (
          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            <Plus size={16} />
            Add product
          </Link>
        )}
      </div>

      <div className="flex gap-2">
        <button type="button" onClick={() => switchView("all")} className={tabClass(!inTrash)}>
          Products
        </button>
        <button type="button" onClick={() => switchView("trash")} className={tabClass(inTrash)}>
          Trash
        </button>
      </div>

      {inTrash && (
        <div className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Products in trash are hidden from your store. Restore them to bring them back, or
          delete them forever.
        </div>
      )}

      {notice && (
        <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{notice}</div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {isLoading && !data && (
        <div className="rounded-2xl bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
          Loading...
        </div>
      )}

      {data && data.items.length === 0 && (
        <div className="rounded-2xl bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
          {inTrash ? "Trash is empty." : "No products yet."}
        </div>
      )}

      {data && data.items.length > 0 && (
        <div className={isLoading ? "opacity-60 transition" : "transition"}>
          <ProductsTable
            products={data.items}
            variant={inTrash ? "trash" : "products"}
            busyId={busyId}
            onTrash={(product) => {
              setDialogError("");
              setDialog({ kind: "trash", product });
            }}
            onRestore={(product) => void restore(product)}
            onPurge={(product) => {
              setDialogError("");
              setDialog({ kind: "purge", product });
            }}
          />
        </div>
      )}

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>
            Showing {from}-{to} of {data.total}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page <= 1 || isLoading}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-medium disabled:opacity-40"
            >
              Previous
            </button>
            <span>
              Page {data.page} of {data.totalPages}
            </span>
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

      {dialog?.kind === "trash" && (
        <ConfirmDialog
          title="Move to trash?"
          message={`"${dialog.product.title}" (${dialog.product.sku}) will be hidden from your store. You can restore it any time from Trash.`}
          confirmLabel="Move to trash"
          busyLabel="Moving..."
          busy={working}
          error={dialogError}
          onConfirm={() => void confirmDialog()}
          onCancel={closeDialog}
        />
      )}

      {dialog?.kind === "purge" && (
        <ConfirmDialog
          title="Delete forever?"
          message={`"${dialog.product.title}" (${dialog.product.sku}) will be permanently deleted. This cannot be undone.`}
          confirmLabel="Delete forever"
          busyLabel="Deleting..."
          tone="danger"
          busy={working}
          error={dialogError}
          onConfirm={() => void confirmDialog()}
          onCancel={closeDialog}
        />
      )}
    </div>
  );
}