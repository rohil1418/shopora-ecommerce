import { AppError } from "../../shared/errors/AppError";
import { OrderModel } from "../orders/order.model";
import { getRazorpay, isValidSignature } from "./razorpay.client";
import type { VerifyRazorpayInput } from "./payment.schema";

async function findOwnedOnlineOrder(userId: string, orderId: string) {
  const order = await OrderModel.findOne({ _id: orderId, user: userId });
  if (!order) throw new AppError(404, "Order not found");
  if (order.paymentMethod !== "razorpay") {
    throw new AppError(400, "This order is not an online payment order");
  }
  return order;
}

export async function createRazorpayOrder(userId: string, orderId: string) {
  const order = await findOwnedOnlineOrder(userId, orderId);
  if (order.paymentStatus === "paid") throw new AppError(400, "This order is already paid");
  if (order.status === "cancelled") {
    throw new AppError(409, "This order was cancelled. Please place the order again.");
  }

  const { razorpay, keyId } = getRazorpay();
  const amount = order.total * 100;

  let razorpayOrderId = order.razorpayOrderId;
  if (!razorpayOrderId) {
    try {
      const created = await razorpay.orders.create({
        amount,
        currency: "INR",
        receipt: order.orderNumber,
        notes: { orderId: order.id },
      });
      razorpayOrderId = created.id;
      order.razorpayOrderId = razorpayOrderId;
      await order.save();
    } catch (error) {
      console.error("Razorpay order creation failed:", error);
      throw new AppError(502, "Could not start the payment. Please try again.");
    }
  }

  return { keyId, razorpayOrderId, amount, currency: "INR", orderNumber: order.orderNumber };
}

export async function verifyRazorpayPayment(userId: string, input: VerifyRazorpayInput) {
  const order = await findOwnedOnlineOrder(userId, input.orderId);
  if (order.paymentStatus === "paid") return order.toObject();

  if (!order.razorpayOrderId || order.razorpayOrderId !== input.razorpayOrderId) {
    throw new AppError(400, "Payment does not match this order");
  }
  if (!isValidSignature(input.razorpayOrderId, input.razorpayPaymentId, input.razorpaySignature)) {
    throw new AppError(400, "Payment verification failed");
  }

  const paid = await OrderModel.findOneAndUpdate(
    { _id: order._id, status: "pending", paymentStatus: "pending" },
    {
      paymentStatus: "paid",
      razorpayPaymentId: input.razorpayPaymentId,
      paidAt: new Date(),
    },
    { returnDocument: "after" }
  );

  if (!paid) {
    throw new AppError(
      409,
      "This order was cancelled before the payment was confirmed. If money was deducted, please contact support with your payment id."
    );
  }
  return paid.toObject();
}