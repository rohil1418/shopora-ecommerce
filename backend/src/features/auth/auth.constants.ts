import type { CookieOptions } from "express";
import { env } from "../../config/env";

export const AUTH_COOKIE = "token";
export const TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60;

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: env.NODE_ENV === "production",
  path: "/",
};