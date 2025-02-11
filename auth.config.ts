import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Discord from "next-auth/providers/discord";
import Resend from "next-auth/providers/resend";
import Passkey from "next-auth/providers/passkey";
import type { NextAuthConfig } from "next-auth";

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [GitHub, Google, Discord, Resend, Passkey],
  experimental: { enableWebAuthn: true },
} satisfies NextAuthConfig;
