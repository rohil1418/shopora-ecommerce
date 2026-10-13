import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Loader2, Plus, Trash2, Upload, X } from "lucide-react";
import { getErrorMessage } from "@/shared/api";
import { uploadImages } from "../api";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_TAGS,
  type ProductCategory,
  type ProductTag,
} from "../constants";
import type { AdminProduct, AdminProductImage, CollectionOption, ProductPayload } from "../types";

type FormState = {
  title: string;
  brand: string;
  description: string;
  price: string;
  originalPrice: string;
  category: ProductCategory;
  collection: string;
  tag: "" | ProductTag;
  rating: string;
  reviewsCount: string;
  stock: string;
  isActive: boolean;
  images: string[];
  sizes: { label: string; stock: string }[];
};

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-900";

const imageUrl = (image: AdminProductImage): string =>
  typeof image === "string" ? image : image.url;

function toFormState(product?: AdminProduct): FormState {
  return {
    title: product?.title ?? "",
    brand: product?.brand ?? "",
    description: product?.description ?? "",
    price: product ? String(product.price) : "",
    originalPrice: product?.originalPrice ? String(product.originalPrice) : "",
    category: product ? (product.category as ProductCategory) : "men",
    collection: product?.collection ?? "",
    tag: product?.tag ?? "",
    rating: product?.rating !== undefined ? String(product.rating) : "",
    reviewsCount: product ? String(product.reviewsCount) : "0",
    stock: product ? String(product.stock) : "0",
    isActive: product?.isActive ?? true,
    images: (product?.images ?? []).map(imageUrl),
    sizes: (product?.sizes ?? []).map((s) => ({ label: s.label, stock: String(s.stock) })),
  };
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4 rounded-2xl bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      {children}
    </section>
  );
}

type Props = {
  initial?: AdminProduct;
  collections: CollectionOption[];
  submitLabel: string;
  onSubmit: (payload: ProductPayload) => Promise<void>;
};

export default function ProductForm({ initial, collections, submitLabel, onSubmit }: Props) {
  const [form, setForm] = useState<FormState>(() => toFormState(initial));
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const options =
    initial && !collections.some((c) => c.slug === initial.collection)
      ? [...collections, { slug: initial.collection, title: initial.collection }]
      : collections;

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;
    if (files.length > 5) return setError("Upload up to 5 images at a time");
    if (files.some((f) => f.size > 5 * 1024 * 1024)) {
      return setError("Each image must be 5MB or smaller");
    }

    setError("");
    setUploading(true);
    try {
      const urls = await uploadImages(files);
      setForm((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUploading(false);
    }
  }

  function updateSize(index: number, field: "label" | "stock", value: string) {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    const price = Number(form.price);
    const mrp = form.originalPrice.trim() === "" ? undefined : Number(form.originalPrice);
    const rating = form.rating.trim() === "" ? undefined : Number(form.rating);
    const reviewsCount = form.reviewsCount.trim() === "" ? 0 : Number(form.reviewsCount);

    if (form.title.trim().length < 2) return setError("Title must be at least 2 characters");
    if (!form.brand.trim()) return setError("Brand is required");
    if (!Number.isInteger(price) || price <= 0) {
      return setError("Price must be a whole number greater than 0");
    }
    if (mrp !== undefined && (!Number.isInteger(mrp) || mrp < price)) {
      return setError("MRP must be a whole number greater than or equal to the price");
    }
    if (!form.collection) return setError("Choose a collection");
    if (form.images.length === 0) return setError("Add at least one image");
    if (rating !== undefined && (Number.isNaN(rating) || rating < 0 || rating > 5)) {
      return setError("Rating must be between 0 and 5");
    }
    if (!Number.isInteger(reviewsCount) || reviewsCount < 0) {
      return setError("Reviews count must be a whole number");
    }

    const sizes = form.sizes.map((s) => ({ label: s.label.trim(), stock: Number(s.stock) }));
    if (sizes.some((s) => !s.label)) return setError("Every size needs a label");
    if (sizes.some((s) => !Number.isInteger(s.stock) || s.stock < 0)) {
      return setError("Size stock must be a whole number, 0 or more");
    }

    const stock = sizes.length > 0 ? 0 : Number(form.stock || 0);
    if (!Number.isInteger(stock) || stock < 0) {
      return setError("Stock must be a whole number, 0 or more");
    }

    const payload: ProductPayload = {
      title: form.title.trim(),
      brand: form.brand.trim(),
      description: form.description.trim(),
      price,
      ...(mrp !== undefined && { originalPrice: mrp }),
      category: form.category,
      collection: form.collection,
      images: form.images,
      sizes,
      stock,
      ...(form.tag && { tag: form.tag }),
      ...(rating !== undefined && { rating }),
      reviewsCount,
      isActive: form.isActive,
    };

    setSubmitting(true);
    try {
      await onSubmit(payload);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Card title="Basic details">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Title">
            <input className={inputClass} value={form.title} onChange={(e) => set("title", e.target.value)} />
          </Field>
          <Field label="Brand">
            <input className={inputClass} value={form.brand} onChange={(e) => set("brand", e.target.value)} />
          </Field>
          <Field label="Collection">
            <select className={inputClass} value={form.collection} onChange={(e) => set("collection", e.target.value)}>
              <option value="">Select collection</option>
              {options.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.title}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Category">
            <select
              className={`${inputClass} capitalize`}
              value={form.category}
              onChange={(e) => set("category", e.target.value as ProductCategory)}
            >
              {PRODUCT_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Tag" hint="New / Bestseller products also show in those collections">
            <select className={inputClass} value={form.tag} onChange={(e) => set("tag", e.target.value as "" | ProductTag)}>
              <option value="">None</option>
              {PRODUCT_TAGS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
          {initial && (
            <Field label="SKU" hint="SKU cannot be changed">
              <input className={`${inputClass} bg-slate-50 text-slate-500`} value={initial.sku} disabled />
            </Field>
          )}
        </div>
        <Field label="Description">
          <textarea
            rows={4}
            maxLength={2000}
            className={inputClass}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </Field>
      </Card>

      <Card title="Pricing and ratings">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Price (₹)">
            <input type="number" min={1} className={inputClass} value={form.price} onChange={(e) => set("price", e.target.value)} />
          </Field>
          <Field label="MRP (₹)" hint="Optional. Must be at least the price">
            <input type="number" min={1} className={inputClass} value={form.originalPrice} onChange={(e) => set("originalPrice", e.target.value)} />
          </Field>
          <Field label="Rating (0 to 5)" hint="Optional">
            <input type="number" min={0} max={5} step={0.1} className={inputClass} value={form.rating} onChange={(e) => set("rating", e.target.value)} />
          </Field>
          <Field label="Reviews count">
            <input type="number" min={0} className={inputClass} value={form.reviewsCount} onChange={(e) => set("reviewsCount", e.target.value)} />
          </Field>
        </div>
      </Card>

      <Card title="Images">
        {form.images.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {form.images.map((url, index) => (
              <div key={url} className="relative overflow-hidden rounded-xl border border-slate-200">
                <img src={url} alt="" className="aspect-square w-full object-cover" />
                {index === 0 && (
                  <span className="absolute left-2 top-2 rounded bg-slate-900 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-white">
                    Main
                  </span>
                )}
                <button
                  type="button"
                  aria-label="Remove image"
                  onClick={() => set("images", form.images.filter((_, i) => i !== index))}
                  className="absolute right-2 top-2 rounded-full bg-white p-1 shadow hover:bg-red-50"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        <label
          className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 px-4 py-6 text-sm font-medium text-slate-600 transition hover:border-slate-900 ${
            uploading ? "pointer-events-none opacity-60" : ""
          }`}
        >
          {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
          {uploading ? "Uploading..." : "Upload images (JPG, PNG, WEBP, AVIF, up to 5 at a time, 5MB each)"}
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="hidden"
            onChange={handleFiles}
          />
        </label>
        <p className="text-xs text-slate-400">The first image is the main product image.</p>
      </Card>

      <Card title="Sizes and stock">
        {form.sizes.map((size, index) => (
          <div key={index} className="flex items-end gap-3">
            <Field label={index === 0 ? "Size label" : ""}>
              <input className={inputClass} placeholder="e.g. M or 42" value={size.label} onChange={(e) => updateSize(index, "label", e.target.value)} />
            </Field>
            <Field label={index === 0 ? "Stock" : ""}>
              <input type="number" min={0} className={inputClass} value={size.stock} onChange={(e) => updateSize(index, "stock", e.target.value)} />
            </Field>
            <button
              type="button"
              aria-label="Remove size"
              onClick={() => set("sizes", form.sizes.filter((_, i) => i !== index))}
              className="mb-1 rounded-lg p-2.5 text-slate-500 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => set("sizes", [...form.sizes, { label: "", stock: "0" }])}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <Plus size={16} />
          Add size
        </button>

        {form.sizes.length === 0 ? (
          <Field label="Stock" hint="No sizes added, so stock is tracked for the whole product">
            <input type="number" min={0} className={`${inputClass} md:max-w-xs`} value={form.stock} onChange={(e) => set("stock", e.target.value)} />
          </Field>
        ) : (
          <p className="text-xs text-slate-400">Stock is tracked per size.</p>
        )}
      </Card>

      <Card title="Visibility">
        <label className="flex items-center gap-3 text-sm text-slate-700">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={form.isActive}
            onChange={(e) => set("isActive", e.target.checked)}
          />
          Active (visible on the store)
        </label>
      </Card>

      {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting || uploading}
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60"
        >
          {submitting ? "Saving..." : submitLabel}
        </button>
        <Link to="/admin/products" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          Cancel
        </Link>
      </div>
    </form>
  );
}