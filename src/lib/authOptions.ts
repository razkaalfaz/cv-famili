import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./db";
import Credentials from "next-auth/providers/credentials";
import { Adapter } from "next-auth/adapters";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(db) as Adapter<boolean>,
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: {
        username: { type: "text" },
        password: { type: "text" },
      },
      async authorize(credentials) {
        const authresponse = await fetch(
          "http://localhost:3000/api/auth/login",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          }
        );

        const user = await authresponse.json();

        console.log(user);

        if (authresponse.ok && user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        (session.user.USER_ID = token.USER_ID),
          (session.user.ROLE = token.ROLE);
      }

      return session;
    },

    async jwt({ token, user }) {
      const dbUser = await db.user.findFirst({
        where: { ID_USER: token.USER_ID },
      });

      if (!dbUser) {
        token.USER_ID = parseInt(user!.id);
        token.ROLE = "USER";
        return token;
      } else {
        (token.USER_ID = dbUser.ID_USER), (token.ROLE = dbUser.ROLE!);
        return token;
      }
    },
  },
  pages: {
    signIn: "/",
  },
};
