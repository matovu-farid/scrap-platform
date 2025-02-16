"use server";

import { auth } from "@/auth";
import {
  APIGatewayClient,
  CreateApiKeyCommand,
  CreateUsagePlanKeyCommand,
  DeleteApiKeyCommand,
  DeleteUsagePlanKeyCommand,
  GetUsagePlanKeyCommand,
} from "@aws-sdk/client-api-gateway";
import { prisma } from "../prisma";
const client = new APIGatewayClient({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

async function createApiKey() {
  const session = await auth();
  const email = session?.user?.email || "";

  const command = new CreateApiKeyCommand({
    // CreateApiKeyRequest
    name: email,
    description: `API Key for ${email}`,
    enabled: true,

    tags: {
      // MapOfStringToString
      email: email,
    },
  });
  const { value, id } = await client.send(command);
  await prisma.apiKey.create({
    data: {
      email,
      keyId: id || "",
      value: value || "",
    },
  });
  return { value: value || "", id: id || "" };
}

async function getApiKey() {
  try {
    const session = await auth();
    const email = session?.user?.email || "";
    const apiKey = await prisma.apiKey.findUnique({
      where: {
        email,
      },
    });
    return { value: apiKey?.value || "", id: apiKey?.keyId || "" };
  } catch (error) {
    console.log("-".repeat(100));
    console.log({ error });
    console.log("-".repeat(100));
    return { value: "", id: "" };
  }
}

async function deleteApiKey() {
  try {
    const session = await auth();
    const email = session?.user?.email || "";
    const apiKey = await prisma.apiKey.findUnique({
      where: {
        email,
      },
    });
    const command = new DeleteApiKeyCommand({
      apiKey: apiKey?.keyId || "",
    });
    await client.send(command);
    return { value: apiKey?.value || "", id: apiKey?.keyId || "" };
  } catch (error) {
    console.log("-".repeat(100));
    console.log({ error });
    console.log("-".repeat(100));
  }
}

async function deleteApiKeyFromDB() {
  const session = await auth();
  const email = session?.user?.email || "";
  const apiKey = await prisma.apiKey.delete({
    where: { email },
  });
}

export async function findOrCreateApiKey() {
  const apiKey = await getApiKey();
  if (apiKey.value) {
    return apiKey;
  }
  return createApiKey();
}
async function createUsageKey() {
  const apiKey = await findOrCreateApiKey();

  const command = new CreateUsagePlanKeyCommand({
    usagePlanId: process.env.AWS_USAGE_PLAN_ID || "", // required
    keyId: apiKey.id, // required
    keyType: process.env.AWS_KEY_TYPE || "", // required
  });
  const { value } = await client.send(command);

  return { value: value || "", id: apiKey.id };
}

async function getUsageKey() {
  try {
    const apiKey = await findOrCreateApiKey();

    const command = new GetUsagePlanKeyCommand({
      usagePlanId: process.env.AWS_USAGE_PLAN_ID || "", // required
      keyId: apiKey.id, // required
    });
    const { value } = await client.send(command);

    return { value: value || "", id: apiKey.id };
  } catch (error) {
    console.log("-".repeat(100));
    console.log({ error });
    console.log("-".repeat(100));
    return { value: "", id: "" };
  }
}

async function deleteUsageKey() {
  try {
    const apiKey = await findOrCreateApiKey();

    const command = new DeleteUsagePlanKeyCommand({
      usagePlanId: process.env.AWS_USAGE_PLAN_ID || "", // required
      keyId: apiKey.id, // required
    });
    await client.send(command);
  } catch (error) {
    console.log("-".repeat(100));
    console.log({ error });
    console.log("-".repeat(100));
  }
}

export async function findOrCreateUsageKey() {
  const usageKey = await getUsageKey();
  if (usageKey.value) {
    return usageKey;
  }
  return createUsageKey();
}

export async function purgeApiKey() {
  await deleteUsageKey();
  await deleteApiKey();
  await deleteApiKeyFromDB();
}
