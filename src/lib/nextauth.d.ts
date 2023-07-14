import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    USER_ID: number;
    ROLE: string;
  }
}

declare module "next-auth" {
  interface Session {
    user: User & {
      USER_ID: number;
      ROLE: string;
    };
  }
}
