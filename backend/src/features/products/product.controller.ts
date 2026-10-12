import type { Request, Response } from "express";
import { getCollectionDetail, listCollections } from "./collection.service";
import {
  adminProductQuerySchema,
  productQuerySchema,
} from "./product.schema";
import {
  createProduct,
  deleteProduct,
  getProductById,
  listProducts,
  setProductActive,
  updateProduct,
} from "./product.service";

const param = (req: Request, name: string): string => String(req.params[name]);

export async function listCollectionsHandler(_req: Request, res: Response): Promise<void> {
  res.json(await listCollections());
}

export async function getCollectionHandler(req: Request, res: Response): Promise<void> {
  const query = productQuerySchema.parse(req.query);
  res.json(await getCollectionDetail(param(req, "slug"), query));
}

export async function listProductsHandler(req: Request, res: Response): Promise<void> {
  const query = productQuerySchema.parse(req.query);
  res.json(await listProducts(query));
}

export async function getProductHandler(req: Request, res: Response): Promise<void> {
  res.json({ product: await getProductById(param(req, "id"), true) });
}

export async function adminListProductsHandler(req: Request, res: Response): Promise<void> {
  const { status, ...query } = adminProductQuerySchema.parse(req.query);
  res.json(await listProducts(query, status));
}

export async function adminGetProductHandler(req: Request, res: Response): Promise<void> {
  res.json({ product: await getProductById(param(req, "id"), false) });
}

export async function createProductHandler(req: Request, res: Response): Promise<void> {
  res.status(201).json({ product: await createProduct(req.body) });
}

export async function updateProductHandler(req: Request, res: Response): Promise<void> {
  res.json({ product: await updateProduct(param(req, "id"), req.body) });
}

export async function setProductStatusHandler(req: Request, res: Response): Promise<void> {
  res.json({ product: await setProductActive(param(req, "id"), req.body.isActive) });
}

export async function deleteProductHandler(req: Request, res: Response): Promise<void> {
  await deleteProduct(param(req, "id"));
  res.json({ message: "Product deleted" });
}