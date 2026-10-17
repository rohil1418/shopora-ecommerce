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
import { dashboardRouter } from "./features/dashboard";
import fs from "node:fs";
import path from "node:path";

const clientDist = path.resolve(process.cwd(), "../frontend/dist");

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
      contentSecurityPolicy: {
        directives: {
          "default-src": ["'self'"],
          "script-src": ["'self'", "https://checkout.razorpay.com"],
          "style-src": ["'self'", "'unsafe-inline'", "https:"],
          "img-src": ["'self'", "data:", "blob:", "https:"],
          "font-src": ["'self'", "data:", "https:"],
          "connect-src": ["'self'", "https://api.razorpay.com", "https://lumberjack.razorpay.com"],
          "frame-src": ["'self'", "https://api.razorpay.com", "https://checkout.razorpay.com"],
          "object-src": ["'none'"],
        },
      },
    })
  );  app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());
  if (env.NODE_ENV !== "test") app.use(morgan("dev"));

  app.use("/uploads", express.static(UPLOAD_ROOT, { maxAge: "7d" }));

  app.use("/api/health", healthRouter);
  app.use("/api/auth", authRouter);
  app.use("/api", catalogRouter);
  app.use("/api/admin/uploads", uploadRouter);
  app.use("/api/admin/dashboard", dashboardRouter);
  app.use("/api/admin", adminCatalogRouter);
  app.use("/api/orders", orderRouter);
  app.use("/api/payments", paymentRouter);
  app.use("/api/addresses", addressRouter);

    if (env.NODE_ENV === "production" && fs.existsSync(clientDist)) {
    app.use(express.static(clientDist, { index: false, maxAge: "7d" }));

    app.get(/^\/(?!api\/|uploads\/).*/, (_req, res) => {
      res.setHeader("Cache-Control", "no-cache");
      res.sendFile(path.join(clientDist, "index.html"));
    });
  }

  app.use(notFound);
  app.use(errorHandler);

  return app;
}