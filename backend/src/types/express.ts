import { User } from ".";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export {};
