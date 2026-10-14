import mongoose, { type HydratedDocument } from "mongoose";
import { AppError } from "../../shared/errors/AppError";
import { AddressModel, type AddressLabel, type IAddress } from "./address.model";
import type { AddressInput } from "./address.schema";

const MAX_ADDRESSES = 10;

export type PublicAddress = {
  id: string;
  label: AddressLabel;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
};

const toPublicAddress = (doc: HydratedDocument<IAddress>): PublicAddress => ({
  id: doc.id,
  label: doc.label,
  fullName: doc.fullName,
  phone: doc.phone,
  addressLine1: doc.addressLine1,
  addressLine2: doc.addressLine2,
  city: doc.city,
  state: doc.state,
  pincode: doc.pincode,
  isDefault: doc.isDefault,
});

function assertValidId(id: string): void {
  if (!mongoose.isValidObjectId(id)) throw new AppError(404, "Address not found");
}

async function findOwned(userId: string, id: string) {
  assertValidId(id);
  const doc = await AddressModel.findOne({ _id: id, user: userId });
  if (!doc) throw new AppError(404, "Address not found");
  return doc;
}

async function clearDefault(userId: string, exceptId?: string): Promise<void> {
  await AddressModel.updateMany(
    { user: userId, isDefault: true, ...(exceptId ? { _id: { $ne: exceptId } } : {}) },
    { isDefault: false }
  );
}

export async function listAddresses(userId: string): Promise<PublicAddress[]> {
  const docs = await AddressModel.find({ user: userId }).sort({ isDefault: -1, createdAt: -1 });
  return docs.map(toPublicAddress);
}

export async function createAddress(userId: string, input: AddressInput): Promise<PublicAddress> {
  const count = await AddressModel.countDocuments({ user: userId });
  if (count >= MAX_ADDRESSES) {
    throw new AppError(400, `You can save up to ${MAX_ADDRESSES} addresses`);
  }

  const makeDefault = input.isDefault || count === 0;
  if (makeDefault) await clearDefault(userId);

  const doc = await AddressModel.create({ ...input, user: userId, isDefault: makeDefault });
  return toPublicAddress(doc);
}

export async function updateAddress(
  userId: string,
  id: string,
  input: AddressInput
): Promise<PublicAddress> {
  const doc = await findOwned(userId, id);

  const makeDefault = input.isDefault || doc.isDefault;
  if (makeDefault) await clearDefault(userId, id);

  doc.set({ ...input, isDefault: makeDefault });
  await doc.save();
  return toPublicAddress(doc);
}

export async function setDefaultAddress(userId: string, id: string): Promise<PublicAddress> {
  const doc = await findOwned(userId, id);
  await clearDefault(userId, id);
  doc.isDefault = true;
  await doc.save();
  return toPublicAddress(doc);
}

export async function deleteAddress(userId: string, id: string): Promise<void> {
  assertValidId(id);
  const doc = await AddressModel.findOneAndDelete({ _id: id, user: userId });
  if (!doc) throw new AppError(404, "Address not found");

  if (doc.isDefault) {
    const next = await AddressModel.findOne({ user: userId }).sort({ createdAt: -1 });
    if (next) {
      next.isDefault = true;
      await next.save();
    }
  }
}