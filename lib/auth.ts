import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { env } from "@/env";
import { Resend } from "resend";
import { sendVerificationEmail } from "./emails/sendVerificationEmail";
import { sendPasswordResetEmail } from "./emails/sendPasswordResetEmail";
import { nextCookies } from "better-auth/next-js";

const prisma = new PrismaClient();
export const auth = betterAuth({
  appName: "Scrap Platform",
  plugins: [nextCookies()],
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github", "email-password", "discord"],
      allowDifferentEmails: false,
    },
  },

  emailVerification: {
    autoSignInAfterVerification: true,

    // sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      await sendVerificationEmail({
        to: user.email,
        subject: "Verify your email address",
        text: `Click the link to verify your email: ${url}`,
      });
    },
  },

  emailAndPassword: {
    autoSignIn: true,

    enabled: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      await sendPasswordResetEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
      });
    },
  },
  socialProviders: {
    github: {
      clientId: env.AUTH_GITHUB_ID,
      clientSecret: env.AUTH_GITHUB_SECRET,
    },
    google: {
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    },
    discord: {
      clientId: env.AUTH_DISCORD_ID,
      clientSecret: env.AUTH_DISCORD_SECRET,
    },
  },
  onAPIError: {
    onError: (error) => {
      console.error(error);
      if (error instanceof Error) {
        console.log(error.message);
      }
    },
  },
});
