import { Router } from "express";
import { AppError } from "../../shared/errors/AppError";
import { requireAdmin } from "../auth";
import { uploadProductImages } from "./upload.middleware";
import { uploadToCloudinary } from "./upload.service";
import type { Request, Response, NextFunction } from "express";

export const uploadRouter = Router();

uploadRouter.post("/", requireAdmin, uploadProductImages, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = (req.files as Express.Multer.File[]) ?? [];
    console.log(
      "[upload] files received:",
      files.map((f) => `${f.originalname} ${Math.round(f.size / 1024)}KB`)
    );
    if (files.length === 0) throw new AppError(400, "No images uploaded");

    const started = Date.now();
    const images = await Promise.all(files.map((f) => uploadToCloudinary(f.buffer)));
    console.log(`[upload] cloudinary done in ${Date.now() - started}ms`);

    res.status(201).json({ images });
  } catch (error) {
    console.error("[upload] failed:", error);
    next(error);
  }
});