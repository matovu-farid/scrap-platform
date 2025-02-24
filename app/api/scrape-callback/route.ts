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

  // Create a streaming response

  if (isScrapedEvent(body)) {
    await redis.set(`scrape-results`, body.data.results);
  } else if (isLinksEvent(body)) {
    const links = body.data.links;

    await redis.sadd("scrape-links", links);
  } else if (isExploreEvent(body)) {
    const url = body.data.url;
    await redis.set(`scrape-exploring`, url);
    await redis.set(`scrape-explored-links`, body.data.explored || 0);
    await redis.set(`scrape-discovered-links`, body.data.found || 0);
  }

  return new Response("OK", { status: 200 });
}
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();

  const links = await redis.smembers("scrape-links");
  const results = await redis.get("scrape-results");
  const exploring = await redis.get("scrape-exploring");
  const totalExploredLinks = await redis.get("scrape-explored-links") as number;
  const totalDiscoveredLinks = await redis.get("scrape-discovered-links") as number;


  const customReadable = new ReadableStream({
    start(controller) {
      setInterval(() => {
        let message = "message";
        if (exploring) {
          message = `Exploring:\n${exploring}`;
          controller.enqueue(encoder.encode(`data: ${message}\n\n`));
        }
        if (links) {
          message = `Links:\n${links}`;
          controller.enqueue(encoder.encode(`data: ${message}\n\n`));
        }
        if (results) {
          message = `Results:\n${results}`;
          controller.enqueue(encoder.encode(`data: ${message}\n\n`));
        }
        if (totalExploredLinks) {
          message = `Explored Links:\n${totalExploredLinks}`;
          controller.enqueue(encoder.encode(`data: ${message}\n\n`));
        }
        if (totalDiscoveredLinks) {
            message = `Discovered Links:\n${totalDiscoveredLinks}`;
          controller.enqueue(encoder.encode(`data: ${message}\n\n`));
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
      "Access-Control-Allow-Origin": "*",
    },
  });
}
