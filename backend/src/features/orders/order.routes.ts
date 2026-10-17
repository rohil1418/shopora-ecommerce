import { Router } from "express";
import { requireAdmin, requireAuth } from "../auth";
import {
  createOrderController,
  quoteOrderController,
  getMyOrdersController,
  getMyOrderByIdController,
  cancelMyOrderController,
  getAllOrdersController,
  updateOrderStatusController,
} from "./order.controller";

export const orderRouter = Router();

orderRouter.post("/", requireAuth, createOrderController);
orderRouter.post("/quote", requireAuth, quoteOrderController);
orderRouter.get("/my-orders", requireAuth, getMyOrdersController);
orderRouter.get("/my-orders/:id", requireAuth, getMyOrderByIdController);
orderRouter.post("/my-orders/:id/cancel", requireAuth, cancelMyOrderController);

orderRouter.get("/", requireAdmin, getAllOrdersController);
orderRouter.patch("/:id/status", requireAdmin, updateOrderStatusController);
