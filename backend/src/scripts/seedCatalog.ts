import mongoose from "mongoose";
import { connectDatabase } from "../config/db";
import { CollectionModel } from "../features/products";
import { SEED_COLLECTIONS, seedSizesFor } from "./seedData";
import { ProductModel } from '../features/products/product.model';

async function seedCatalog(): Promise<void> {
  const reset = process.argv.includes("--reset");
  await connectDatabase();
  await connectDatabase();
  await ProductModel.syncIndexes();

  if (reset) {
    await ProductModel.deleteMany({});
    await CollectionModel.deleteMany({});
    console.log("Removed existing products and collections");
  }

  const baseTime = Date.now();
  let position = 0;
  let collectionsCreated = 0;
  let productsCreated = 0;

  for (const [index, seed] of SEED_COLLECTIONS.entries()) {
    if (!(await CollectionModel.exists({ slug: seed.slug }))) {
      await CollectionModel.create({
        slug: seed.slug,
        title: seed.title,
        description: seed.description,
        banner: "",
        isVirtual: seed.isVirtual ?? false,
        sortOrder: index,
      });
      collectionsCreated += 1;
    }

    for (const [id, brand, title, price, originalPrice, category, rating, reviewsCount, tag] of seed.rows) {
      position += 1;
      const sku = `${seed.slug}-${id}`.toUpperCase();
      if (await ProductModel.exists({ sku })) continue;

      const sizeLabels = seedSizesFor(seed.slug, category);

      await ProductModel.create({
        sku,
        title,
        brand,
        description: "",
        price,
        originalPrice,
        category,
        collectionSlug: seed.slug,
        images: [],
        sizes: sizeLabels.map((label) => ({ label, stock: 20 })),
        stock: sizeLabels.length > 0 ? 0 : 50,
        tag,
        rating,
        reviewsCount,
        isActive: true,
        createdAt: new Date(baseTime - position * 1000),
      });
      productsCreated += 1;
    }
  }

  console.log(`Collections created: ${collectionsCreated}`);
  console.log(`Products created: ${productsCreated}`);
  await mongoose.disconnect();
}

seedCatalog().catch((error) => {
  console.error("Failed to seed catalog:", error);
  process.exit(1);
});