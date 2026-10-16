import type { Request, Response } from "express";
import { AppError } from "../../shared/errors/AppError";
import { createRazorpayOrder, verifyRazorpayPayment } from "./payment.service";

function currentUserId(req: Request): string {
  if (!req.user) throw new AppError(401, "Please log in to continue");
  return req.user.id;
}

export async function createRazorpayOrderHandler(req: Request, res: Response): Promise<void> {
  res.json(await createRazorpayOrder(currentUserId(req), req.body.orderId));
}

export async function verifyRazorpayPaymentHandler(req: Request, res: Response): Promise<void> {
  res.json({ order: await verifyRazorpayPayment(currentUserId(req), req.body) });
}