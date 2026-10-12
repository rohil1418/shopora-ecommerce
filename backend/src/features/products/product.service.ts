import { randomBytes } from "node:crypto";
import mongoose, { type HydratedDocument } from "mongoose";
import { AppError } from "../../shared/errors/AppError";
import { CollectionModel } from "./collection.model";
import type { ProductCategory, ProductTag, SortOption, StatusFilter } from "./product.constants";
import { ProductModel, type IProduct } from "./product.model";
import type { ProductInput, ProductQuery } from "./product.schema";

export type PublicProduct = {
  id: string;
  sku: string;
  title: string;
  brand: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPercent: number;
  category: ProductCategory;
  collection: string;
  images: string[];
  sizes: { label: string; stock: number }[];
  stock: number;
  tag?: ProductTag;
  rating?: number;
  reviewsCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type MongoFilter = NonNullable<Parameters<typeof ProductModel.find>[0]>;

const SORTS: Record<SortOption, Record<string, 1 | -1>> = {
  newest: { createdAt: -1, _id: -1 },
  price_asc: { price: 1, _id: 1 },
  price_desc: { price: -1, _id: 1 },
  popular: { reviewsCount: -1, _id: 1 },
};

export function toPublicProduct(doc: HydratedDocument<IProduct>): PublicProduct {
  const mrp = doc.originalPrice;

  return {
    id: doc.id,
    sku: doc.sku,
    title: doc.title,
    brand: doc.brand,
    description: doc.description,
    price: doc.price,
    originalPrice: mrp,
    discountPercent: mrp && mrp > doc.price ? Math.round((1 - doc.price / mrp) * 100) : 0,
    category: doc.category,
    collection: doc.collectionSlug,
    images: doc.images,
    sizes: doc.sizes.map(({ label, stock }) => ({ label, stock })),
    stock: doc.stock,
    tag: doc.tag,
    rating: doc.rating,
    reviewsCount: doc.reviewsCount,
    isActive: doc.isActive,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export function collectionFilter(slug: string): Record<string, unknown> {
  switch (slug) {
    case "new":
      return { tag: "New" };
    case "bestsellers":
      return { tag: "Bestseller" };
    case "accessories":
      return { $or: [{ category: "accessories" }, { collectionSlug: "bags" }] };
    default:
      return { collectionSlug: slug };
  }
}

const escapeRegex = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function buildFilter(query: ProductQuery, status: StatusFilter): MongoFilter {
  const conditions: Record<string, unknown>[] = [];

  if (status === "active") conditions.push({ isActive: true });
  if (status === "inactive") conditions.push({ isActive: false });
  if (query.collection) conditions.push(collectionFilter(query.collection));
  if (query.category) conditions.push({ category: query.category });
  if (query.tag) conditions.push({ tag: query.tag });

  if (query.search) {
    const pattern = new RegExp(escapeRegex(query.search), "i");
    conditions.push({ $or: [{ title: pattern }, { brand: pattern }] });
  }

  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    const range: Record<string, number> = {};
    if (query.minPrice !== undefined) range.$gte = query.minPrice;
    if (query.maxPrice !== undefined) range.$lte = query.maxPrice;
    conditions.push({ price: range });
  }

  return (conditions.length > 0 ? { $and: conditions } : {}) as MongoFilter;
}

export async function listProducts(query: ProductQuery, status: StatusFilter = "active") {
  const filter = buildFilter(query, status);
  const sort = SORTS[query.sort ?? "newest"];

  const [docs, total] = await Promise.all([
    ProductModel.find(filter)
      .sort(sort)
      .skip((query.page - 1) * query.limit)
      .limit(query.limit),
    ProductModel.countDocuments(filter),
  ]);

  return {
    items: docs.map(toPublicProduct),
    page: query.page,
    limit: query.limit,
    total,
    totalPages: Math.ceil(total / query.limit),
  };
}

function assertValidId(id: string): void {
  if (!mongoose.isValidObjectId(id)) throw new AppError(404, "Product not found");
}

export async function getProductById(id: string, onlyActive: boolean): Promise<PublicProduct> {
  assertValidId(id);
  const doc = await ProductModel.findOne(onlyActive ? { _id: id, isActive: true } : { _id: id });
  if (!doc) throw new AppError(404, "Product not found");
  return toPublicProduct(doc);
}

async function assertCollectionAllowed(slug: string): Promise<void> {
  const collection = await CollectionModel.findOne({ slug, isVirtual: false });
  if (!collection) {
    throw new AppError(400, "Collection not found", [
      { field: "collection", message: "Choose an existing collection" },
    ]);
  }
}

const generateSku = (collection: string): string =>
  `${collection}-${randomBytes(3).toString("hex")}`.toUpperCase();

export async function createProduct(input: ProductInput): Promise<PublicProduct> {
  await assertCollectionAllowed(input.collection);

  const { collection, sku, ...rest } = input;
  const doc = await ProductModel.create({
    ...rest,
    collectionSlug: collection,
    sku: sku ?? generateSku(collection),
  });

  return toPublicProduct(doc);
}

export async function updateProduct(id: string, input: ProductInput): Promise<PublicProduct> {
  assertValidId(id);
  const doc = await ProductModel.findById(id);
  if (!doc) throw new AppError(404, "Product not found");

  await assertCollectionAllowed(input.collection);

  const { collection, sku, ...rest } = input;
  doc.set({
    originalPrice: undefined,
    tag: undefined,
    rating: undefined,
    ...rest,
    collectionSlug: collection,
    ...(sku && { sku }),
  });
  await doc.save();

  return toPublicProduct(doc);
}

export async function setProductActive(id: string, isActive: boolean): Promise<PublicProduct> {
  assertValidId(id);
  const doc = await ProductModel.findByIdAndUpdate(id, { isActive }, { returnDocument: "after" });
  if (!doc) throw new AppError(404, "Product not found");
  return toPublicProduct(doc);
}

export async function deleteProduct(id: string): Promise<void> {
  assertValidId(id);
  const doc = await ProductModel.findByIdAndDelete(id);
  if (!doc) throw new AppError(404, "Product not found");
}