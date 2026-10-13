import "../config/env";
import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary";
import { connectDatabase } from "../config/db";
import { CollectionModel } from "../features/products";
import { ProductModel } from "../features/products/product.model";

const ASSETS_DIR = path.resolve(process.cwd(), "../frontend/src/features/products/assets");
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const BATCH_SIZE = 4;

type Job = { file: string; name: string; kind: "product" | "banner"; key: string };
type Outcome = "uploaded" | "skipped" | "missing";

function collectJobs(): Job[] {
  return fs
    .readdirSync(ASSETS_DIR)
    .filter((file) => IMAGE_EXT.has(path.extname(file).toLowerCase()))
    .map((file): Job => {
      const name = path.parse(file).name;
      return name.endsWith("-banner")
        ? { file, name, kind: "banner", key: name.replace(/-banner$/, "") }
        : { file, name, kind: "product", key: name.toUpperCase() };
    });
}

async function processJob(job: Job, force: boolean): Promise<Outcome> {
  if (job.kind === "product") {
    const product = await ProductModel.findOne({ sku: job.key }).select("images");
    if (!product) return "missing";
    if (product.images.length > 0 && !force) return "skipped";
  } else {
    const collection = await CollectionModel.findOne({ slug: job.key }).select("banner");
    if (!collection) return "missing";
    if (collection.banner && !force) return "skipped";
  }

  const result = await cloudinary.uploader.upload(path.join(ASSETS_DIR, job.file), {
    folder: job.kind === "product" ? "shopora/products" : "shopora/banners",
    public_id: job.name,
    overwrite: true,
    resource_type: "image",
    timeout: 120000,
  });

  if (job.kind === "product") {
    await ProductModel.updateOne({ sku: job.key }, { $set: { images: [result.secure_url] } });
  } else {
    await CollectionModel.updateOne({ slug: job.key }, { $set: { banner: result.secure_url } });
  }
  return "uploaded";
}

async function seedImages(): Promise<void> {
  const force = process.argv.includes("--force");
  await connectDatabase();

  if (!fs.existsSync(ASSETS_DIR)) {
    throw new Error(`Assets folder not found: ${ASSETS_DIR}`);
  }

  const jobs = collectJobs();
  console.log(`Found ${jobs.length} images in ${ASSETS_DIR}`);

  const counts = { uploaded: 0, skipped: 0, missing: 0, failed: 0 };

  for (let i = 0; i < jobs.length; i += BATCH_SIZE) {
    const batch = jobs.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async (job) => {
        try {
          const outcome = await processJob(job, force);
          counts[outcome] += 1;
          if (outcome === "missing") console.log(`No database record for ${job.file}`);
        } catch (error) {
          counts.failed += 1;
          console.error(`Failed: ${job.file}`, error instanceof Error ? error.message : error);
        }
      })
    );
    console.log(`Progress: ${Math.min(i + BATCH_SIZE, jobs.length)}/${jobs.length}`);
  }

  console.log("Done:", counts);
  await mongoose.disconnect();
}

seedImages().catch((error) => {
  console.error("Failed to seed images:", error);
  process.exit(1);
});