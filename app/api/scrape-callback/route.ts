import { findOrCreateUsageKey } from "@lib/api_key";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { ScrapeClient } from "scrap-ai";

export async function POST(req: NextRequest) {
  console.log("req.body", req.body);
  const { value: apiUsageKey } = await findOrCreateUsageKey();
  const scrapeClient = new ScrapeClient(apiUsageKey);
  const headersList = await headers();
  const signature = headersList.get("x-webhook-signature") || "";
  const timestamp = headersList.get("x-webhook-timestamp") || "";
  const isValid = scrapeClient.verifyWebhook({
    body: JSON.stringify(req.body),
    signature: signature,
    timestamp: timestamp,
    maxAge: 5 * 60 * 1000, // Optional: customize max age (default 5 minutes)
  });
  if (!isValid) {
    return new Response("Invalid webhook", { status: 401 });
  }
  const { results } = scrapeClient.parseWebhookBody(req.body?.toString() || "");
  console.log({ results });
  return new Response("OK", { status: 200 });
}
