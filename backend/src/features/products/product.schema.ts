import { z } from "zod";

const imageSchema = z.object({
  url: z.string().url(),
  publicId: z.string().min(1),
});

const productFields = {
  name: z.string().trim().min(2).max(150),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(180)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().trim().min(5).max(5000),
  price: z.coerce.number().finite().min(0),
  compareAtPrice: z.coerce.number().finite().min(0).optional(),
  category: z.string().trim().min(2).max(80),
  images: z.array(imageSchema).min(1).max(10),
  sizes: z.array(z.string().trim().min(1).max(30)).max(30).default([]),
  colors: z.array(z.string().trim().min(1).max(50)).max(30).default([]),
  stock: z.coerce.number().int().min(0),
  featured: z.boolean().default(false),
  isActive: z.boolean().default(true),
};

export const createProductSchema = z.object(productFields);

export const updateProductSchema = z
  .object({
    name: productFields.name.optional(),
    slug: productFields.slug.optional(),
    description: productFields.description.optional(),
    price: productFields.price.optional(),
    compareAtPrice: productFields.compareAtPrice,
    category: productFields.category.optional(),
    images: productFields.images.optional(),
    sizes: productFields.sizes.optional(),
    colors: productFields.colors.optional(),
    stock: productFields.stock.optional(),
    featured: productFields.featured.optional(),
    isActive: productFields.isActive.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export const productQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
  category: z.string().trim().optional(),
  search: z.string().trim().optional(),
  featured: z.enum(["true", "false"]).optional(),
  sort: z.enum(["newest", "price-asc", "price-desc"]).default("newest"),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;