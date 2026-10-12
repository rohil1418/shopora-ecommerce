import { Router } from "express";
import { AppError } from "../../shared/errors/AppError";
import { requireAdmin } from "../auth";
import { uploadProductImages } from "./upload.middleware";
import { uploadToCloudinary } from "./upload.service";
import type { Request, Response, NextFunction } from "express";

export const uploadRouter = Router();

uploadRouter.post(
  "/",
  requireAdmin,
  uploadProductImages,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
    } catch (error) {
      next(error);
    }
  }
);