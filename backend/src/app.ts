import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { authRouter } from "./features/auth";
import { healthRouter } from "./features/health";
import { adminCatalogRouter, catalogRouter } from "./features/products";
import { UPLOAD_ROOT, uploadRouter } from "./features/uploads";
import { errorHandler, notFound } from "./shared/middleware/errorHandler";
import { orderRouter } from "./features/orders";
import { addressRouter } from "./features/addresses";
import { paymentRouter } from "./features/payments";

export function createApp() {
  const app = express();

  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
  app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());
  if (env.NODE_ENV !== "test") app.use(morgan("dev"));

  app.use("/uploads", express.static(UPLOAD_ROOT, { maxAge: "7d" }));

  app.use("/api/health", healthRouter);
  app.use("/api/auth", authRouter);
  app.use("/api", catalogRouter);
  app.use("/api/admin/uploads", uploadRouter);
  app.use("/api/admin", adminCatalogRouter);
  app.use("/api/orders", orderRouter);
  app.use("/api/payments", paymentRouter);
  app.use("/api/addresses", addressRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}