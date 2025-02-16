import { auth } from "@/auth";
import {
  APIGatewayClient,
  CreateUsagePlanKeyCommand,
  GetUsagePlanKeyCommand,
} from "@aws-sdk/client-api-gateway";
const client = new APIGatewayClient({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export async function createKey() {
  const session = await auth();
  const userId = session?.user?.id || "";

  const command = new CreateUsagePlanKeyCommand({
    usagePlanId: process.env.AWS_USAGE_PLAN_ID || "", // required
    keyId: userId, // required
    keyType: process.env.AWS_KEY_TYPE || "", // required
  });
  await client.send(command);
}

export async function getKey() {
  const session = await auth();
  const userId = session?.user?.id || "";

  const command = new GetUsagePlanKeyCommand({
    usagePlanId: process.env.AWS_USAGE_PLAN_ID || "", // required
    keyId: userId, // required
  });
  const { value } = await client.send(command);
  return value;
}
