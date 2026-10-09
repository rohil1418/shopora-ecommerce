import { v2 as cloudinary } from "cloudinary";
import { env } from "./env";

console.log("Cloudinary env check:", {
  cloudNameLoaded: Boolean(env.CLOUDINARY_CLOUD_NAME),
  apiKeyLoaded: Boolean(env.CLOUDINARY_API_KEY),
  apiSecretLoaded: Boolean(env.CLOUDINARY_API_SECRET),
});

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };