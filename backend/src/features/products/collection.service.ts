import type { HydratedDocument } from "mongoose";
import { AppError } from "../../shared/errors/AppError";
import { CollectionModel, type ICollection } from "./collection.model";
import { PRODUCT_CATEGORIES } from "./product.constants";
import { ProductModel } from "./product.model";
import type { ProductQuery } from "./product.schema";
import { buildFilter, listProducts } from "./product.service";

export type PublicCollection = {
  slug: string;
  title: string;
  description: string;
  banner: string;
};

const toPublicCollection = (doc: HydratedDocument<ICollection>): PublicCollection => ({
  slug: doc.slug,
  title: doc.title,
  description: doc.description,
  banner: doc.banner,
});

export async function listCollections() {
  const collections = await CollectionModel.find({ isActive: true }).sort({ sortOrder: 1 });

  const counts = await Promise.all(
    collections.map((collection) =>
      ProductModel.countDocuments(buildFilter({ collection: collection.slug } as ProductQuery, "active"))
    )
  );

  return {
    items: collections.map((collection, index) => ({
      ...toPublicCollection(collection),
      productCount: counts[index],
    })),
  };
}

export async function getCollectionDetail(slug: string, query: ProductQuery) {
  const collection = await CollectionModel.findOne({ slug: slug.toLowerCase(), isActive: true });
  if (!collection) throw new AppError(404, "Collection not found");

  const present = (await ProductModel.distinct(
    "category",
    buildFilter({ collection: collection.slug } as ProductQuery, "active")
  )) as string[];
  const filters = ["all", ...PRODUCT_CATEGORIES.filter((category) => present.includes(category))];

  const sort = query.sort ?? (collection.slug === "bestsellers" ? "popular" : "newest");
  const list = await listProducts({ ...query, collection: collection.slug, sort });

  return { collection: toPublicCollection(collection), filters, ...list };
}