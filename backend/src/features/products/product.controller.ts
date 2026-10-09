import type { Request, Response } from "express";
import { cloudinary } from "../../config/cloudinary";
import { AppError } from "../../shared/errors/AppError";
import { ProductModel } from "./product.model";
import {
  createProductSchema,
  productQuerySchema,
  updateProductSchema,
} from "./product.schema";
import {
  createProduct,
  deleteProduct,
  getProductById,
  listProducts,
  updateProduct,
} from "./product.service";

export async function getProducts(req: Request, res: Response) {
  const query = productQuerySchema.parse(req.query);
  const result = await listProducts(query);

  res.json(result);
}

export async function getProduct(req: Request, res: Response) {
  const product = await getProductById(req.params.id as string);
  res.json({ product });
}

export async function getAdminProducts(
  req: Request,
  res: Response
) {
  const query = productQuerySchema.parse(req.query);
  const filter: Record<string, unknown> = {};

  if (query.category) filter.category = query.category;
  if (query.featured !== undefined) {
    filter.featured = query.featured === "true";
  }
  if (query.search) filter.$text = { $search: query.search };

const sortBy =
  typeof query.sort === "string" ? query.sort : "newest";  

const sort: Record<string, 1 | -1> =
  sortBy === "price-asc"
    ? { price: 1 }
    : sortBy === "price-desc"
      ? { price: -1 }
      : { createdAt: -1 };

  const [products, total] = await Promise.all([
    ProductModel.find(filter)
      .sort(sort)
      .skip((query.page - 1) * query.limit)
      .limit(query.limit),
    ProductModel.countDocuments(filter),
  ]);

  res.json({
    products,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  });
}

export async function createProductHandler(
  req: Request,
  res: Response
) {
  const input = createProductSchema.parse(req.body);
  const product = await createProduct(input);

  res.status(201).json({ message: "Product created", product });
}

export async function updateProductHandler(
  req: Request,
  res: Response
) {
  const input = updateProductSchema.parse(req.body);
  const product = await updateProduct(req.params.id as string, input);

  res.json({ message: "Product updated", product });
}

export async function deleteProductHandler(
  req: Request,
  res: Response
) {
  const product = await deleteProduct(req.params.id as string);

  await Promise.all(
    product.images.map(async (image) => {
      try {
        await cloudinary.uploader.destroy(image.publicId);
      } catch (error) {
        console.error("Cloudinary cleanup failed:", image.publicId, error);
      }
    })
  );

  res.json({ message: "Product deleted" });
}

export async function uploadProductImage(
  req: Request,
  res: Response
) {
  if (!req.file) {
    throw new AppError(400, "Please select an image");
  }

  try {
    const result = await new Promise<{
      secure_url: string;
      public_id: string;
    }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "shopora/products",
          resource_type: "image",
        },
        (error, uploaded) => {
          if (error) {
            console.error("Cloudinary error details:", error);
            reject(error);
            return;
          }

          if (!uploaded) {
            reject(new Error("Cloudinary returned no image data"));
            return;
          }

          resolve({
            secure_url: uploaded.secure_url,
            public_id: uploaded.public_id,
          });
        }
      );

      stream.end(req.file!.buffer);
    });

    res.status(201).json({
      message: "Image uploaded",
      image: {
        url: result.secure_url,
        publicId: result.public_id,
      },
    });
  } catch (error: unknown) {
    console.error("Image upload failed:", error);
    throw new AppError(502, "Cloudinary image upload failed");
  }
}