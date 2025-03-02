"use server";

import assert from "assert";
import { prisma } from "../prisma";
import { signIn, signOut, auth } from "./auth";
import { createSubscribedUser } from "@lib/stripe";

export async function login() {
  await signIn();
  const session = await auth();
  const user = session?.user;
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
  async function generateApiKeyIfMissing() {
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
  await Promise.all([
    generateApiKeyIfMissing(),
    createSubscribedUser(email, userId, name ?? undefined),
  ]);
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
