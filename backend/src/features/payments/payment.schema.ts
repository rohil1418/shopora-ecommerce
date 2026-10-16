import { z } from "zod";

const orderId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid order ID");

export const createRazorpayOrderSchema = z.object({ orderId });

export const verifyRazorpaySchema = z.object({
  orderId,
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
});

export type VerifyRazorpayInput = z.infer<typeof verifyRazorpaySchema>;