import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { healthRouter } from "./features/health";
import { errorHandler, notFound } from "./shared/middleware/errorHandler";
import { authRouter } from "./features/auth";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());
  if (env.NODE_ENV !== "test") app.use(morgan("dev"));

  app.use("/api/health", healthRouter);
  app.use("/api/auth", authRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}