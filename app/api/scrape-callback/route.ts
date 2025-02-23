import { findOrCreateUsageKey } from "@lib/api_key";
import { redis, setCache } from "@lib/cache";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { ScrapeClient, isLinksEvent, isScrapedEvent } from "scrap-ai";
import { isExploreEventData } from "scrap-ai/script/webHooks";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { value: apiUsageKey } = await findOrCreateUsageKey();

  const scrapeClient = new ScrapeClient(apiUsageKey);
  const headersList = await headers();
  const signature = headersList.get("x-webhook-signature") || "";
  const timestamp = headersList.get("x-webhook-timestamp") || "";

  const isValid = scrapeClient.verifyWebhook({
    body: JSON.stringify(body),
    signature: signature,
    timestamp: timestamp,
    maxAge: 5 * 60 * 1000, // Optional: customize max age (default 5 minutes)
  });

  if (!isValid) {
    return new Response("Invalid webhook", { status: 401 });
  }

  // Create a streaming response

  if (isScrapedEvent(body)) {
    await redis.set(`scrape-results`, body.data.results);
  } else if (isLinksEvent(body)) {
    const links = body.data.links;

    await redis.sadd("scrape-links", links);
  } else if (isExploreEventData(body)) {
    const url = body.data.url;
    await redis.set(`scrape-exploring`, url);
  }

  return new Response("OK", { status: 200 });
}
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();

  const links = await redis.smembers("scrape-links");
  const results = await redis.get("scrape-results");
  const message = `Links: ${links} \n Results: ${results}`;
  const customReadable = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(`${message}\n\n`));
    },
  });
  return new Response(customReadable, {
    // Set the headers for Server-Sent Events (SSE)
    headers: {
      Connection: "keep-alive",
      "Content-Encoding": "none",
      "Cache-Control": "no-cache, no-transform",
      "Content-Type": "text/event-stream; charset=utf-8",
    },
  });
}
