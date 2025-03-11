"use server";

import assert from "assert";
import { prisma } from "./prisma";
import { createSubscribedUser } from "@/lib/stripe";
import { redirect } from "next/navigation";
import { auth } from "../lib/auth";
import { headers } from "next/headers";

export type Provider = Required<
  Parameters<typeof auth.api.signInSocial>
>[0]["body"]["provider"];

export const signinWithSocial = async (provider: Provider) => {
  const response = await auth.api.signInSocial({
    headers: await headers(),
    body: {
      provider,
      callbackURL: "/dashboard",
    },
  });
  console.log({ response });
  return response;
};

export const signinWithEmail = async (email: string, password: string) => {
  return await auth.api.signInEmail({
    headers: await headers(),
    body: {
      email,
      password,
    },
  });
};

export async function postLogin() {
  const session = await getMySession();
  console.log({ session });
  const user = session?.user;

  console.log({ session, user });
  assert(user, "User must be logged in");
  const email = user.email;
  assert(email, "Email must be found");
  const name = user.name;
  const userId = user.id;
  assert(userId, "UserId must be found");

  await Promise.all([
    generateApiKeyIfMissing(userId),
    createStripeCustomerIfMissing(email, userId, name ?? undefined),
  ]);
}
async function generateApiKeyIfMissing(userId: string) {
  await prisma.apiKey.upsert({
    where: {
      userId: userId,
    },
    update: {},
    create: {
      userId: userId,
    },
  });
}

async function createStripeCustomerIfMissing(
  email: string,
  userId: string,
  name?: string
) {
  const stripeCustomer = await prisma.stripeCustomer.findUnique({
    where: {
      userId: userId,
    },
  });
  if (!stripeCustomer) {
    const { customer } = await createSubscribedUser(
      email,
      userId,
      name ?? undefined
    );
    await prisma.stripeCustomer.create({
      data: {
        userId: userId,
        customerId: customer.id,
      },
    });
  }
}
export async function logout() {
  await auth.api.signOut({
    headers: await headers(),
  });
}

export async function getMySession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

export async function isSignedIn() {
  const session = await getMySession();

  return !!(session && session.user);
}

export async function getUserId() {
  const session = await getMySession();
  const email = session?.user?.email;
  assert(email, "Email must be found");
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
    select: {
      id: true,
    },
  });
  assert(user, "User must be found");
  return user.id;
}
