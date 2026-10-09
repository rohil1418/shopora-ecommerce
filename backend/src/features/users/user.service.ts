import type { HydratedDocument } from "mongoose";
import { UserModel, type IUser, type UserRole } from "./user.model";

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt: Date;
};

export const toPublicUser = (user: HydratedDocument<IUser>): PublicUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  createdAt: user.createdAt,
});

export const findUserById = (id: string) => UserModel.findById(id);

export const findUserByEmail = (email: string) =>
  UserModel.findOne({ email: email.toLowerCase() });

export const findUserByEmailWithPassword = (email: string) =>
  UserModel.findOne({ email: email.toLowerCase() }).select("+passwordHash");

export const createUser = (data: {
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role?: UserRole;
}) => UserModel.create(data);