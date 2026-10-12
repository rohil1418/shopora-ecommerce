import type { Request, Response } from "express";
import { Types } from "mongoose";
import { OrderModel } from "./order.model";
import {
  createOrderSchema,
  updateOrderStatusSchema,
} from "./order.schema";
import { createOrder } from "./order.service";

type AuthRequest = Request & {
  user?: {
    id?: string;
    _id?: string | Types.ObjectId;
    role?: string;
  };
};

function getUserId(req: Request): string | null {
  const user = (req as AuthRequest).user;
  const id = user?._id?.toString() ?? user?.id;

  return id && Types.ObjectId.isValid(id) ? id : null;
}

export async function createOrderController(
  req: Request,
  res: Response
) {
  const userId = getUserId(req);

  if (!userId) {
    return res.status(401).json({ message: "Please login first" });
  }

  const parsed = createOrderSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid order details",
      errors: parsed.error.flatten(),
    });
  }

  try {
    const order = await createOrder(userId, parsed.data);

    return res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create order";

    return res.status(400).json({ message });
  }
}

export async function getMyOrdersController(
  req: Request,
  res: Response
) {
  const userId = getUserId(req);

  if (!userId) {
    return res.status(401).json({ message: "Please login first" });
  }

  const orders = await OrderModel.find({ user: userId })
    .sort({ createdAt: -1 })
    .lean();

  return res.status(200).json({
    count: orders.length,
    orders,
  });
}

export async function getMyOrderByIdController(
  req: Request,
  res: Response
) {
  const userId = getUserId(req);
  const id = req.params.id as string;

  if (!userId) {
    return res.status(401).json({ message: "Please login first" });
  }

  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid order ID" });
  }

  const order = await OrderModel.findOne({
    _id: id,
    user: userId,
  }).lean();

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  return res.status(200).json({ order });
}

export async function getAllOrdersController(
  _req: Request,
  res: Response
) {
  const orders = await OrderModel.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 })
    .lean();

  return res.status(200).json({
    count: orders.length,
    orders,
  });
}

export async function updateOrderStatusController(
  req: Request,
  res: Response
) {
  const id  = req.params.id as string;

  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid order ID" });
  }

  const parsed = updateOrderStatusSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid order status",
      errors: parsed.error.flatten(),
    });
  }

  const order = await OrderModel.findById(id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.status === "cancelled" && parsed.data.status !== "cancelled") {
    return res.status(400).json({
      message: "A cancelled order cannot be reopened",
    });
  }

  if (order.status === "delivered" && parsed.data.status !== "delivered") {
    return res.status(400).json({
      message: "A delivered order cannot change status",
    });
  }

  order.status = parsed.data.status;
  await order.save();

  return res.status(200).json({
    message: "Order status updated successfully",
    order,
  });
}
