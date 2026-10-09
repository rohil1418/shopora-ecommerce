import type { Request, Response } from "express";
import { AUTH_COOKIE, TOKEN_TTL_SECONDS, cookieOptions } from "./auth.constants";
import { loginUser, registerUser } from "./auth.service";

const setAuthCookie = (res: Response, token: string): void => {
  res.cookie(AUTH_COOKIE, token, { ...cookieOptions, maxAge: TOKEN_TTL_SECONDS * 1000 });
};

export async function register(req: Request, res: Response): Promise<void> {
  const { user, token } = await registerUser(req.body);
  setAuthCookie(res, token);
  res.status(201).json({ user });
}

export async function login(req: Request, res: Response): Promise<void> {
  const { user, token } = await loginUser(req.body);
  setAuthCookie(res, token);
  res.json({ user });
}

export function logout(_req: Request, res: Response): void {
  res.clearCookie(AUTH_COOKIE, cookieOptions);
  res.json({ message: "Logged out" });
}

export function me(req: Request, res: Response): void {
  res.json({ user: req.user ?? null });
}