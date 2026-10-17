import { Router } from "express";
import { asyncHandler } from "../../shared/middleware/asyncHandler";
import { requireAdmin } from "../auth";
import { getDashboardHandler } from "./dashboard.controller";

export const dashboardRouter = Router();

dashboardRouter.get("/", requireAdmin, asyncHandler(getDashboardHandler));