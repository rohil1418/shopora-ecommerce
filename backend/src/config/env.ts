import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(5000),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  CLIENT_URL: z.string().default("http://localhost:5173"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  ADMIN_NAME: z.string().default("Shopora Admin"),
  ADMIN_EMAIL: z.string().optional(),
  ADMIN_PHONE: z.string().default("9999999999"),
  ADMIN_PASSWORD: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:");
  parsed.error.issues.forEach((issue) =>
    console.error(`  ${issue.path.join(".")}: ${issue.message}`)
  );
  process.exit(1);
}

export const env = parsed.data;