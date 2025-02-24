import { redis, setCache } from "@lib/cache";
import { getScrapeClient } from "@lib/scrap";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { isLinksEvent, isScrapedEvent, isExploreEvent } from "scrap-ai";
import {
  RedisValuesSchema,
  ScrapeProgressSchema,
} from "@lib/schemas/scrape-progress";
import { z } from "zod";

type ScrapeProgress = z.infer<typeof ScrapeProgressSchema>;

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
    links.forEach((link) => {
      redis.sadd("scrape-links", link);
    });
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

  // Fetch and validate Redis values
  const rawLinks = await redis.smembers("scrape-links");
  const rawResults = await redis.get("scrape-results");
  const rawExploring = await redis.get("scrape-exploring");
  const rawExploredLinks = await redis.get("scrape-explored-links");
  const rawDiscoveredLinks = await redis.get("scrape-discovered-links");

  // Parse and validate the values
  console.log({
    rawLinks,
    rawResults,
    rawExploring,
    rawExploredLinks,
    rawDiscoveredLinks,
  });
  const links = RedisValuesSchema.links.parse(rawLinks);
  const results = RedisValuesSchema.results.parse(rawResults);
  const exploring = RedisValuesSchema.exploring.parse(rawExploring);
  const totalExploredLinks =
    RedisValuesSchema.totalExploredLinks.parse(rawExploredLinks);
  const totalDiscoveredLinks =
    RedisValuesSchema.totalDiscoveredLinks.parse(rawDiscoveredLinks);
  let intervalId: NodeJS.Timeout;
  req.signal.addEventListener("abort", () => {
    clearInterval(intervalId);
    console.log("Client disconnected, interval cleared.");
  });

  const customReadable = new ReadableStream({
    start(controller) {
      intervalId = setInterval(() => {
        // Calculate progress percentage
        const progress =
          totalDiscoveredLinks > 0
            ? Math.round((totalExploredLinks / totalDiscoveredLinks) * 100)
            : 0;

        // Create the data object
        const data: ScrapeProgress = {
          exploring,
          links,
          results,
          totalExploredLinks,
          totalDiscoveredLinks,
          progress,
        };

        // Validate the data against the schema
        try {
          const validatedData = ScrapeProgressSchema.parse(data);
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(validatedData)}\n\n`)
          );
        } catch (error) {
          console.error("Data validation error:", error);
          // Send an error state that the client can handle
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: "Invalid data state" })}\n\n`
            )
          );
        }
      }, 1000);
    },
    cancel() {
      clearInterval(intervalId);
      console.log("Stream cancelled, interval cleared.");
    },
  });
  

  return new Response(customReadable, {
    headers: {
      Connection: "keep-alive",
      "Content-Encoding": "none",
      "Cache-Control": "no-cache, no-transform",
      "Content-Type": "text/event-stream; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
