import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getErrorMessage } from "@/shared/api";
import {
  createAdminProduct,
  fetchAdminProduct,
  fetchCollectionOptions,
  ProductForm,
  updateAdminProduct,
  type AdminProduct,
  type CollectionOption,
  type ProductPayload,
} from "../features/admin";

export default function AdminProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [collections, setCollections] = useState<CollectionOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    setError("");

    Promise.all([fetchCollectionOptions(), id ? fetchAdminProduct(id) : Promise.resolve(null)])
      .then(([options, existing]) => {
        if (ignore) return;
        setCollections(options);
        setProduct(existing);
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
  }, [id]);

  async function handleSubmit(payload: ProductPayload) {
    if (id) await updateAdminProduct(id, payload);
    else await createAdminProduct(payload);
    navigate("/admin/products");
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div>
        <Link
          to="/admin/products"
          className="mb-2 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back to products
        </Link>
        <h1 className="text-xl font-bold text-slate-900">{id ? "Edit product" : "Add product"}</h1>
      </div>

      {isLoading && (
        <div className="rounded-2xl bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
          Loading...
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {!isLoading && !error && (
        <ProductForm
          key={product?.id ?? "new"}
          initial={product ?? undefined}
          collections={collections}
          submitLabel={id ? "Save changes" : "Create product"}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}