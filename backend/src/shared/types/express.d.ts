import type { PublicUser } from "../../features/users";

declare global {
  namespace Express {
    interface Request {
      user?: PublicUser;
    }
  }
}

export {};