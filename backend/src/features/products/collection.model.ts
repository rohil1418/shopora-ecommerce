import { Schema, model } from "mongoose";

export interface ICollection {
  slug: string;
  title: string;
  description: string;
  banner: string;
  isVirtual: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const collectionSchema = new Schema<ICollection>(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    banner: { type: String, default: "" },
    isVirtual: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const CollectionModel = model<ICollection>("Collection", collectionSchema);