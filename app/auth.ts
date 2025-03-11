import NextAuth from "next-auth";

import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "../auth.config";
import Passkey from "next-auth/providers/passkey";
import { env } from "@/env";
const prisma = new PrismaClient();

const providers =
  env.NODE_ENV === "development"
    ? [Passkey, ...authConfig.providers]
    : [...authConfig.providers];

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  experimental: { enableWebAuthn: true },
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account, profile, user }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.id = user?.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
  },

  providers,
});
