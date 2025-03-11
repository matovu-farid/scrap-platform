"use server";

import assert from "assert";
import { prisma } from "./prisma";
import { signIn, signOut, auth } from "./auth";
import { createSubscribedUser } from "@/lib/stripe";

export async function login() {
  await signIn();
}

export async function postLogin() {
  const session = await auth();
  const user = session?.user;

  console.log({ session, user });
  assert(user, "User must be logged in");
  const email = user.email;
  assert(email, "Email must be found");
  const name = user.name;
  const userData = await prisma.user.findUnique({
    where: {
      email: email,
    },
    select: {
      id: true,
    },
  });
  const userId = userData?.id;
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
  await signOut();
}

export async function getSession() {
  const session = await auth();
  return session;
}

export async function isSignedIn() {
  const session = await getSession();

  return !!(session && session.user);
}

export async function getUserId() {
  const session = await getSession();
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
