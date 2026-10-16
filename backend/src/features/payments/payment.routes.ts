import { Router } from "express";
import { asyncHandler } from "../../shared/middleware/asyncHandler";
import { validateBody } from "../../shared/middleware/validate";
import { requireAuth } from "../auth";
import { createRazorpayOrderHandler, verifyRazorpayPaymentHandler } from "./payment.controller";
import { createRazorpayOrderSchema, verifyRazorpaySchema } from "./payment.schema";

export const paymentRouter = Router();

paymentRouter.use(requireAuth);

paymentRouter.post(
  "/razorpay/order",
  validateBody(createRazorpayOrderSchema),
  asyncHandler(createRazorpayOrderHandler)
);
paymentRouter.post(
  "/razorpay/verify",
  validateBody(verifyRazorpaySchema),
  asyncHandler(verifyRazorpayPaymentHandler)
);