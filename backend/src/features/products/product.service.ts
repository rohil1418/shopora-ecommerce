import mongoose from "mongoose";
import { AppError } from "../../shared/errors/AppError";
import { ProductModel } from "./product.model";
import type {
  CreateProductInput,
  UpdateProductInput,
} from "./product.schema";

export async function listProducts(query: {
  page: number;
  limit: number;
  category?: string;
  search?: string;
  featured?: "true" | "false";
  sort: "newest" | "price-asc" | "price-desc";
}) {
  const filter: Record<string, unknown> = { isActive: true };

  if (query.category) filter.category = query.category;
  if (query.featured !== undefined) {
    filter.featured = query.featured === "true";
  }
  if (query.search) {
    filter.$text = { $search: query.search };
  }

const sortBy =
  typeof query.sort === "string" ? query.sort : "newest";  

const sort: Record<string, 1 | -1> =
  sortBy === "price-asc"
    ? { price: 1 }
    : sortBy === "price-desc"
      ? { price: -1 }
      : { createdAt: -1 };

  const skip = (query.page - 1) * query.limit;

  const [products, total] = await Promise.all([
    ProductModel.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(query.limit)
      .lean(),
    ProductModel.countDocuments(filter),
  ]);

  return {
    products,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  };
}

export async function getProductById(id: string) {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError(400, "Invalid product id");
  }

  const product = await ProductModel.findOne({
    _id: id,
    isActive: true,
  });

  if (!product) throw new AppError(404, "Product not found");

  return product;
}

export async function createProduct(input: CreateProductInput) {
  if (
    input.compareAtPrice !== undefined &&
    input.compareAtPrice < input.price
  ) {
    throw new AppError(
      400,
      "Compare-at price must be greater than or equal to price"
    );
  }

  return ProductModel.create(input);
}

export async function updateProduct(
  id: string,
  input: UpdateProductInput
) {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError(400, "Invalid product id");
  }

  const product = await ProductModel.findById(id);

  if (!product) throw new AppError(404, "Product not found");

  const nextPrice = input.price ?? product.price;
  const nextCompareAtPrice =
    input.compareAtPrice === undefined
      ? product.compareAtPrice
      : input.compareAtPrice;

  if (
    nextCompareAtPrice !== undefined &&
    nextCompareAtPrice < nextPrice
  ) {
    throw new AppError(
      400,
      "Compare-at price must be greater than or equal to price"
    );
  }

  Object.assign(product, input);
  await product.save();

  return product;
}

export async function deleteProduct(id: string) {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError(400, "Invalid product id");
  }

  const product = await ProductModel.findByIdAndDelete(id);

  if (!product) throw new AppError(404, "Product not found");

  return product;
}