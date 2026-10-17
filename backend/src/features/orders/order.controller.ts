import type { Request, Response } from "express";
import { Types } from "mongoose";
import { AppError } from "../../shared/errors/AppError";
import { ORDER_STATUSES, OrderModel, type OrderStatus } from "./order.model";
import {
  createOrderSchema,
  quoteOrderSchema,
  updateOrderStatusSchema,
} from "./order.schema";
import { buildQuote, cancelMyOrder, cancelOrder, createOrder } from "./order.service";

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

export async function quoteOrderController(
  req: Request,
  res: Response
) {
  const parsed = quoteOrderSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid order details",
      errors: parsed.error.flatten(),
    });
  }

  try {
    return res.status(200).json(await buildQuote(parsed.data));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to price this order";

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

export async function cancelMyOrderController(req: Request, res: Response) {
  const userId = getUserId(req);
  const id = req.params.id as string;

  if (!userId) {
    return res.status(401).json({ message: "Please login first" });
  }

  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid order ID" });
  }

  try {
    const order = await cancelMyOrder(userId, id);
    return res.status(200).json({ message: "Order cancelled", order });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: "Something went wrong" });
  }
}

export async function getAllOrdersController(req: Request, res: Response) {
  const status = ORDER_STATUSES.find((value) => value === req.query.status);
  const page = Math.max(1, Number.parseInt(String(req.query.page ?? "1"), 10) || 1);
  const limit = Math.min(50, Math.max(1, Number.parseInt(String(req.query.limit ?? "20"), 10) || 20));
  const filter = status ? { status } : {};

  const [items, total] = await Promise.all([
    OrderModel.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    OrderModel.countDocuments(filter),
  ]);

  return res.status(200).json({
    items,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });
}

const NEXT_STATUSES: Record<OrderStatus, OrderStatus[]> = {
  pending: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

export async function updateOrderStatusController(req: Request, res: Response) {
  const id = req.params.id as string;

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

  const next = parsed.data.status;

  if (next === order.status) {
    return res.status(200).json({ message: "Order status updated successfully", order });
  }

  if (!NEXT_STATUSES[order.status].includes(next)) {
    return res.status(400).json({
      message: `An order that is ${order.status} cannot be changed to ${next}`,
    });
  }

  if (next === "cancelled") {
    const cancelled = await cancelOrder(id);
    if (!cancelled) {
      return res.status(409).json({ message: "This order could not be cancelled. Refresh and try again." });
    }
    return res.status(200).json({ message: "Order cancelled and stock restored", order: cancelled });
  }

  order.status = next;
  if (next === "delivered" && order.paymentMethod === "cod") {
    order.paymentStatus = "paid";
    order.paidAt = new Date();
  }
  await order.save();

  return res.status(200).json({
    message: "Order status updated successfully",
    order,
  });
}