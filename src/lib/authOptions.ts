import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./db";
import CredentialsProvider from "next-auth/providers/credentials";
import { Adapter } from "next-auth/adapters";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(db) as Adapter<boolean>,
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      credentials: {
        username: { type: "text" },
        password: { type: "text" },
      },
      async authorize(credentials) {
        const authresponse = await fetch(
          process.env.NEXT_PUBLIC_API_AUTH_LOGIN!,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          }
        );

        const user = await authresponse.json();

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
        session.user.ROLE = token.ROLE;
        session.user.ID_USER = token.USER_ID;
        session.user.USERNAME = token.USERNAME;
      }

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.ROLE = user.ROLE;
        token.USERNAME = user.USERNAME;
        token.USER_ID = user.ID_USER;
      }
      return token;
    },
  },
  pages: {
    signIn: "/",
  },
};
