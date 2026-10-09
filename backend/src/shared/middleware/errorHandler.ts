import type { ErrorRequestHandler, RequestHandler } from "express";
import mongoose from "mongoose";
import { ZodError } from "zod";
import { env } from "../../config/env";
import { AppError } from "../errors/AppError";

export const notFound: RequestHandler = (req, _res, next) => {
  next(new AppError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

const isDuplicateKeyError = (error: unknown): boolean =>
  typeof error === "object" && error !== null && "code" in error && error.code === 11000;

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(400).json({
      message: "Validation failed",
      details: err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message, details: err.details });
    return;
  }

  if (isDuplicateKeyError(err)) {
    res.status(409).json({ message: "This value already exists" });
    return;
  }

  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }

  console.error(err);
  res.status(500).json({
    message: "Something went wrong",
    ...(env.NODE_ENV === "development" && { error: String(err) }),
  });
};