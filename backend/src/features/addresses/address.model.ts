import { Schema, model, type Types } from "mongoose";

export const ADDRESS_LABELS = ["home", "work", "other"] as const;
export type AddressLabel = (typeof ADDRESS_LABELS)[number];

export interface IAddress {
  user: Types.ObjectId;
  label: AddressLabel;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const addressDbSchema = new Schema<IAddress>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    label: { type: String, enum: [...ADDRESS_LABELS], default: "home" },
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    addressLine1: { type: String, required: true, trim: true },
    addressLine2: { type: String, trim: true, default: "" },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const AddressModel = model<IAddress>("Address", addressDbSchema);