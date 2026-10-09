import { Router } from "express";
import rateLimit from "express-rate-limit";
import { env } from "../../config/env";
import { asyncHandler } from "../../shared/middleware/asyncHandler";
import { validateBody } from "../../shared/middleware/validate";
import { login, logout, me, register } from "./auth.controller";
import { attachUser } from "./auth.middleware";
import { loginSchema, registerSchema } from "./auth.schema";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: env.NODE_ENV === "production" ? 20 : 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts. Please try again in a few minutes." },
});

export const authRouter = Router();

authRouter.post("/register", authLimiter, validateBody(registerSchema), asyncHandler(register));
authRouter.post("/login", authLimiter, validateBody(loginSchema), asyncHandler(login));
authRouter.post("/logout", logout);
authRouter.get("/me", attachUser, me);