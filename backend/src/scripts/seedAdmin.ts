import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDatabase } from "../config/db";
import { env } from "../config/env";
import { UserModel } from "../features/users";

async function seedAdmin(): Promise<void> {
  if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
    console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env first");
    process.exit(1);
  }
  if (env.ADMIN_PASSWORD.length < 8) {
    console.error("ADMIN_PASSWORD must be at least 8 characters");
    process.exit(1);
  }

  await connectDatabase();

  const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 10);

  await UserModel.findOneAndUpdate(
    { email: env.ADMIN_EMAIL.toLowerCase() },
    {
      $set: {
        name: env.ADMIN_NAME,
        phone: env.ADMIN_PHONE,
        passwordHash,
        role: "admin",
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log(`Admin ready: ${env.ADMIN_EMAIL}`);
  await mongoose.disconnect();
}

seedAdmin().catch((error) => {
  console.error("Failed to seed admin:", error);
  process.exit(1);
});