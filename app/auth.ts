import NextAuth from "next-auth";

import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "../auth.config";
import Passkey from "next-auth/providers/passkey";
import Resend from "next-auth/providers/resend";
const prisma = new PrismaClient();

const providers = {
  ...authConfig.providers,
  Passkey,
  Resend,
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  experimental: { enableWebAuthn: true },
  session: { strategy: "jwt" },
  providers,
});
