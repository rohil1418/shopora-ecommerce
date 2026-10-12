import type { UploadApiResponse } from "cloudinary";
import cloudinary from "../../config/cloudinary";

export function uploadToCloudinary(
  buffer: Buffer,
  folder = "shopora/products"
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result?: UploadApiResponse) => {
        if (error || !result) return reject(error ?? new Error("Upload failed"));
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
}