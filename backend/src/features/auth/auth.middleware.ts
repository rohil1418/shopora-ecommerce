import type { Request, RequestHandler } from "express";
import { AppError } from "../../shared/errors/AppError";
import { findUserById, toPublicUser, type PublicUser } from "../users";
import { AUTH_COOKIE } from "./auth.constants";
import { verifyToken } from "./auth.service";

async function resolveUser(req: Request): Promise<PublicUser | null> {
  const token = req.cookies?.[AUTH_COOKIE];
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const user = await findUserById(payload.userId);
  return user ? toPublicUser(user) : null;
}

export const attachUser: RequestHandler = async (req, _res, next) => {
  try {
    req.user = (await resolveUser(req)) ?? undefined;
    next();
  } catch (error) {
    next(error);
  }
};

const ensureLoggedIn: RequestHandler = (req, _res, next) => {
  if (!req.user) {
    next(new AppError(401, "Please log in to continue"));
    return;
  }
  next();
};

const ensureAdmin: RequestHandler = (req, _res, next) => {
  if (req.user?.role !== "admin") {
    next(new AppError(403, "Admin access required"));
    return;
  }
  next();
};

export const requireAuth: RequestHandler[] = [attachUser, ensureLoggedIn];
export const requireAdmin: RequestHandler[] = [attachUser, ensureLoggedIn, ensureAdmin];