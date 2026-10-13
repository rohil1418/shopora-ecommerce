import { Schema, model } from "mongoose";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_TAGS,
  type ProductCategory,
  type ProductTag,
} from "./product.constants";

export interface ISize {
  label: string;
  stock: number;
}

export interface IProduct {
  sku: string;
  title: string;
  brand: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  collectionSlug: string;
  images: string[];
  sizes: ISize[];
  stock: number;
  tag?: ProductTag;
  rating?: number;
  reviewsCount: number;
  isActive: boolean;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const sizeSchema = new Schema<ISize>(
  {
    label: { type: String, required: true, trim: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
  },
  { _id: false }
);

const productSchema = new Schema<IProduct>(
  {
    sku: { type: String, required: true, unique: true, uppercase: true, trim: true },
    title: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 1 },
    originalPrice: { type: Number, min: 1 },
    category: { type: String, enum: [...PRODUCT_CATEGORIES], required: true },
    collectionSlug: { type: String, required: true, lowercase: true, trim: true, index: true },
    images: { type: [String], default: [] },
    sizes: { type: [sizeSchema], default: [] },
    stock: { type: Number, default: 0, min: 0 },
    tag: { type: String, enum: [...PRODUCT_TAGS] },
    rating: { type: Number, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

productSchema.index({ isActive: 1, category: 1 });
productSchema.index({ tag: 1 });
productSchema.index({ deletedAt: 1 });

export const ProductModel = model<IProduct>("Product", productSchema);