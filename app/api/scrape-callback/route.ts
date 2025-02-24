import { redis, setCache } from "@lib/cache";
import { getScrapeClient } from "@lib/scrap";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { isLinksEvent, isScrapedEvent, isExploreEvent } from "scrap-ai";

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log({ id: body.id });
  const scrapeClient = await getScrapeClient(body.id);
  const headersList = await headers();
  const signature = headersList.get("x-webhook-signature") || "";
  const timestamp = headersList.get("x-webhook-timestamp") || "";

  const isValid = scrapeClient.verifyWebhook({
    body,
    signature: signature,
    timestamp: timestamp,
    maxAge: 5 * 60 * 1000, // Optional: customize max age (default 5 minutes)
  });

  if (!isValid) {
    return new Response("Invalid webhook", { status: 401 });
  }
  console.log({ isValid });

  // Create a streaming response

  if (isScrapedEvent(body)) {
    await redis.set(`scrape-results`, body.data.results);
  } else if (isLinksEvent(body)) {
    const links = body.data.links;

    await redis.sadd("scrape-links", links);
  } else if (isExploreEvent(body)) {
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
  const exploring = await redis.get("scrape-exploring");
  let message = "";
  if (exploring) {
    message += ` Exploring:\n ${exploring}\n`;
  }
  if (links) {
    message = ` Links:\n ${links}\n`;
  }
  if (results) {
    message += ` Results:\n ${results}\n`;
  }

  if (links && results) {
    message = ` Links: ${links} \n Results: ${results}`;
  }
  const customReadable = new ReadableStream({
    start(controller) {
      setTimeout(() => {
        if (message) {
          controller.enqueue(encoder.encode(`${message}\n\n`));
        }
      }, 1000);
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
