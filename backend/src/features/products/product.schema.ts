import { z } from "zod";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_TAGS,
  SORT_OPTIONS,
  STATUS_FILTERS,
} from "./product.constants";

const sizeSchema = z.object({
  label: z.string().trim().min(1, "Size label is required").max(20),
  stock: z.coerce.number().int("Stock must be a whole number").min(0, "Stock cannot be negative"),
});

export const productSchema = z
  .object({
    sku: z.string().trim().min(2).max(40).optional(),
    title: z.string().trim().min(2, "Title must be at least 2 characters").max(120),
    brand: z.string().trim().min(1, "Brand is required").max(60),
    description: z.string().trim().max(2000).default(""),
    price: z.coerce.number().int("Price must be a whole number").positive("Price must be greater than 0"),
    originalPrice: z.coerce.number().int().positive().optional(),
    category: z.enum(PRODUCT_CATEGORIES),
    collection: z.string().trim().toLowerCase().min(1, "Collection is required"),
    images: z.array(z.string().trim().min(1)).min(1, "Add at least one image"),
    sizes: z.array(sizeSchema).default([]),
    stock: z.coerce.number().int().min(0).default(0),
    tag: z.enum(PRODUCT_TAGS).optional(),
    rating: z.coerce.number().min(0).max(5).optional(),
    reviewsCount: z.coerce.number().int().min(0).default(0),
    isActive: z.boolean().default(true),
  })
  .refine((data) => data.originalPrice === undefined || data.originalPrice >= data.price, {
    message: "MRP must be greater than or equal to the price",
    path: ["originalPrice"],
  });

export const statusSchema = z.object({ isActive: z.boolean() });

export const productQuerySchema = z.object({
  collection: z.string().trim().toLowerCase().optional(),
  category: z.enum(PRODUCT_CATEGORIES).optional(),
  tag: z.enum(PRODUCT_TAGS).optional(),
  search: z.string().trim().max(60).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  sort: z.enum(SORT_OPTIONS).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const adminProductQuerySchema = productQuerySchema.extend({
  status: z.enum(STATUS_FILTERS).default("all"),
});

export type ProductInput = z.infer<typeof productSchema>;
export type ProductQuery = z.infer<typeof productQuerySchema>;