import { z } from "zod";

const orderItemSchema = z
  .object({
    productId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid product ID").optional(),
    sku: z.string().trim().min(2).max(60).optional(),
    quantity: z.number().int().min(1).max(10),
    size: z.string().trim().max(20).optional(),
  })
  .refine((item) => item.productId || item.sku, {
    message: "Each item needs a productId or sku",
  });

const itemsSchema = z
  .array(orderItemSchema)
  .min(1, "Order must contain at least one item")
  .max(50);

export const quoteOrderSchema = z.object({
  items: itemsSchema,
  couponCode: z.string().trim().max(30).optional(),
});

export const createOrderSchema = z.object({
  items: itemsSchema,
  couponCode: z.string().trim().max(30).optional(),

  shippingAddress: z.object({
    fullName: z.string().trim().min(2),
    phone: z.string().trim().min(10).max(15),
    addressLine1: z.string().trim().min(5),
    addressLine2: z.string().trim().optional(),
    city: z.string().trim().min(2),
    state: z.string().trim().min(2),
    pincode: z.string().trim().regex(/^\d{6}$/, "Invalid pincode"),
  }),

  paymentMethod: z.enum(["cod"]).default("cod"),
});

export type OrderItemInput = z.infer<typeof orderItemSchema>;
export type QuoteInput = z.infer<typeof quoteOrderSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export const updateOrderStatusSchema = z.object({
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]),
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;