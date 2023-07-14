import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";

type UserId = number;

declare module "next-auth/jwt" {
  interface JWT {
    USER_ID: UserId;
    ROLE: string;
    USERNAME: string;
  }
}

declare module "next-auth" {
  interface User {
    ID_USER: UserId;
    ROLE: string;
    USERNAME: string;
  }

  interface Session {
    user: User;
  }
}
