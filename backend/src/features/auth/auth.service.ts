import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { AppError } from "../../shared/errors/AppError";
import {
  createUser,
  findUserByEmail,
  findUserByEmailWithPassword,
  toPublicUser,
  type PublicUser,
} from "../users";
import { TOKEN_TTL_SECONDS } from "./auth.constants";
import type { LoginInput, RegisterInput } from "./auth.schema";

const SALT_ROUNDS = 10;

export const signToken = (userId: string): string =>
  jwt.sign({}, env.JWT_SECRET, {
    subject: userId,
    expiresIn: TOKEN_TTL_SECONDS,
    algorithm: "HS256",
  });

export function verifyToken(token: string): { userId: string } | null {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET, { algorithms: ["HS256"] });
    return typeof payload === "object" && typeof payload.sub === "string"
      ? { userId: payload.sub }
      : null;
  } catch {
    return null;
  }
}

type AuthResult = { user: PublicUser; token: string };

export async function registerUser(input: RegisterInput): Promise<AuthResult> {
  if (await findUserByEmail(input.email)) {
    throw new AppError(409, "An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
  const user = await createUser({
    name: input.name,
    email: input.email,
    phone: input.phone,
    passwordHash,
  });

  return { user: toPublicUser(user), token: signToken(user.id) };
}

export async function loginUser(input: LoginInput): Promise<AuthResult> {
  const user = await findUserByEmailWithPassword(input.email);
  const isValid = user ? await bcrypt.compare(input.password, user.passwordHash) : false;

  if (!user || !isValid) {
    throw new AppError(401, "Invalid email or password");
  }

  return { user: toPublicUser(user), token: signToken(user.id) };
}