"use server";

import { getUserId } from "@/authActions";
import assert from "assert";
import { prisma } from "@/prisma";

async function createUsageKey(userId: string) {
  const apiKeyData = await prisma.apiKey.create({
    data: {
      userId: userId,
    },
  });
  return apiKeyData.key;
}

export async function findOrCreateUsageKey(userIdParam?: string) {
  const userId = userIdParam || (await getUserId());

  const apiKeyData = await prisma.apiKey.findUnique({
    where: {
      userId: userId,
    },
  });

  if (apiKeyData) {
    return apiKeyData.key;
  }
  return await createUsageKey(userId);
}
export async function regenerateApiKey(userIdParam?: string) {
  const userId = userIdParam || (await getUserId());
  await prisma.apiKey.delete({
    where: {
      userId: userId,
    },
  });
  const apiKeyData = await prisma.apiKey.create({
    data: {
      userId: userId,
    },
  });
  return apiKeyData.key;
}
export async function validateApiKey(apiKey: string) {
  const key = await prisma.apiKey.findUnique({
    where: {
      key: apiKey,
    },
  });
  if (!key) {
    return false;
  }
  return true;
}

export async function getUserFromApiKey(apiKey: string) {
  const keyData = await prisma.apiKey.findUnique({
    where: {
      key: apiKey,
    },
    select: {
      userId: true,
    },
  });

  const userId = keyData?.userId;
  assert(userId, "Invalid API key");

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  assert(user, "User not found");
  return user;
}

export async function getStripeCustomerIdFromApikey(apiKey: string) {
  const user = await getUserFromApiKey(apiKey);
  const stripeCustomerData = await prisma.stripeCustomer.findUnique({
    where: {
      userId: user.id,
    },
    select: {
      customerId: true,
    },
  });
  assert(stripeCustomerData, "Stripe customer not found");
  return stripeCustomerData.customerId;
}
