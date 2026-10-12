import { Router } from "express";
import { requireAdmin, requireAuth } from "../auth";
import {
  createOrderController,
  getMyOrdersController,
  getMyOrderByIdController,
  getAllOrdersController,
  updateOrderStatusController,
} from "./order.controller";

export const orderRouter = Router();

orderRouter.post("/", requireAuth, createOrderController);
orderRouter.get("/my-orders", requireAuth, getMyOrdersController);
orderRouter.get("/my-orders/:id", requireAuth, getMyOrderByIdController);

orderRouter.get("/", requireAdmin, getAllOrdersController);
orderRouter.patch("/:id/status", requireAdmin, updateOrderStatusController);
