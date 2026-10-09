import { Router } from "express";
import { asyncHandler } from "../../shared/middleware/asyncHandler";
import { validateBody } from "../../shared/middleware/validate";
import { uploadImage } from "../../shared/middleware/uploadImage";
import { requireAdmin } from "../auth";
import {
  createProductHandler,
  deleteProductHandler,
  getAdminProducts,
  getProduct,
  getProducts,
  updateProductHandler,
  uploadProductImage,
} from "./product.controller";
import {
  createProductSchema,
  updateProductSchema,
} from "./product.schema";

export const productRouter = Router();

productRouter.get("/", asyncHandler(getProducts));
productRouter.get("/:id", asyncHandler(getProduct));

productRouter.get(
  "/admin/all",
  ...requireAdmin,
  asyncHandler(getAdminProducts)
);

productRouter.post(
  "/upload-image",
  ...requireAdmin,
  uploadImage.single("image"),
  asyncHandler(uploadProductImage)
);

productRouter.post(
  "/",
  ...requireAdmin,
  validateBody(createProductSchema),
  asyncHandler(createProductHandler)
);

productRouter.patch(
  "/:id",
  ...requireAdmin,
  validateBody(updateProductSchema),
  asyncHandler(updateProductHandler)
);

productRouter.delete(
  "/:id",
  ...requireAdmin,
  asyncHandler(deleteProductHandler)
);