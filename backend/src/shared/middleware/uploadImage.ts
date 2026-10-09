import multer from "multer";
import { AppError } from "../errors/AppError";

export const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (_req, file, callback) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
      "image/jpg",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      callback(
        new AppError(400, "Only JPEG, PNG, JPG, Avif and WebP images are allowed")
      );
      return;
    }

    callback(null, true);
  },
});