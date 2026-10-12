import { Router } from "express";
import { asyncHandler } from "../../shared/middleware/asyncHandler";
import { validateBody } from "../../shared/middleware/validate";
import { requireAdmin } from "../auth";
import {
  adminGetProductHandler,
  adminListProductsHandler,
  createProductHandler,
  deleteProductHandler,
  getCollectionHandler,
  getProductHandler,
  listCollectionsHandler,
  listProductsHandler,
  setProductStatusHandler,
  updateProductHandler,
} from "./product.controller";
import { productSchema, statusSchema } from "./product.schema";

export const catalogRouter = Router();

catalogRouter.get("/collections", asyncHandler(listCollectionsHandler));
catalogRouter.get("/collections/:slug", asyncHandler(getCollectionHandler));
catalogRouter.get("/products", asyncHandler(listProductsHandler));
catalogRouter.get("/products/:id", asyncHandler(getProductHandler));

export const adminCatalogRouter = Router();

adminCatalogRouter.use(requireAdmin);

adminCatalogRouter.get("/products", asyncHandler(adminListProductsHandler));
adminCatalogRouter.get("/products/:id", asyncHandler(adminGetProductHandler));
adminCatalogRouter.post("/products", validateBody(productSchema), asyncHandler(createProductHandler));
adminCatalogRouter.put("/products/:id", validateBody(productSchema), asyncHandler(updateProductHandler));
adminCatalogRouter.patch(
  "/products/:id/status",
  validateBody(statusSchema),
  asyncHandler(setProductStatusHandler)
);
adminCatalogRouter.delete("/products/:id", asyncHandler(deleteProductHandler));