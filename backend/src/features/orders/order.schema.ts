
import { z } from "zod";

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid product ID"),
        quantity: z.number().int().min(1).max(10),
        size: z.string().trim().optional(),
      })
    )
    .min(1, "Order must contain at least one item"),

  shippingAddress: z.object({
    fullName: z.string().trim().min(2),
    phone: z.string().trim().min(10).max(15),
    addressLine1: z.string().trim().min(5),
    addressLine2: z.string().trim().optional(),
    city: z.string().trim().min(2),
    state: z.string().trim().min(2),
    pincode: z.string().trim().regex(/^\d{6}$/, "Invalid pincode"),
  }),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ]),
});

export type UpdateOrderStatusInput = z.infer<
  typeof updateOrderStatusSchema
>;
