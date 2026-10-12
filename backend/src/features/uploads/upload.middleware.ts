import path from "node:path";
import multer from "multer";
import { AppError } from "../../shared/errors/AppError";

export const UPLOAD_ROOT = path.resolve(process.cwd(), "uploads");

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
]);

export const uploadProductImages = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 5 },
  fileFilter: (_req, file, callback) => {
    if (ALLOWED_TYPES.has(file.mimetype)) {
      callback(null, true);
      return;
    }
    callback(new AppError(400, "Only JPG, PNG, JPEG, AVIF and WEBP images are allowed"));
  },
}).array("images", 5);