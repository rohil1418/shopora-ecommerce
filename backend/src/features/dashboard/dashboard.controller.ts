import type { Request, Response } from "express";
import { getDashboard } from "./dashboard.service";

export async function getDashboardHandler(_req: Request, res: Response): Promise<void> {
  res.json(await getDashboard());
}