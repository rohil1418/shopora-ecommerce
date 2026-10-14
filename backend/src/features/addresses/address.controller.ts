import type { Request, Response } from "express";
import { AppError } from "../../shared/errors/AppError";
import {
  createAddress,
  deleteAddress,
  listAddresses,
  setDefaultAddress,
  updateAddress,
} from "./address.service";

function currentUserId(req: Request): string {
  if (!req.user) throw new AppError(401, "Please log in to continue");
  return req.user.id;
}

const param = (req: Request, name: string): string => String(req.params[name]);

export async function listAddressesHandler(req: Request, res: Response): Promise<void> {
  res.json({ items: await listAddresses(currentUserId(req)) });
}

export async function createAddressHandler(req: Request, res: Response): Promise<void> {
  res.status(201).json({ address: await createAddress(currentUserId(req), req.body) });
}

export async function updateAddressHandler(req: Request, res: Response): Promise<void> {
  res.json({ address: await updateAddress(currentUserId(req), param(req, "id"), req.body) });
}

export async function setDefaultAddressHandler(req: Request, res: Response): Promise<void> {
  res.json({ address: await setDefaultAddress(currentUserId(req), param(req, "id")) });
}

export async function deleteAddressHandler(req: Request, res: Response): Promise<void> {
  await deleteAddress(currentUserId(req), param(req, "id"));
  res.json({ message: "Address deleted" });
}