import { redis, setCache } from "@lib/cache";
import { getScrapeClient } from "@lib/scrap";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { isLinksEvent, isScrapedEvent, isExploreEvent } from "scrap-ai";
import {
  RedisValuesSchema,
  ScrapeProgressSchema,
} from "@lib/schemas/scrape-progress";
import { z, ZodError } from "zod";

type ScrapeProgress = z.infer<typeof ScrapeProgressSchema>;

export async function POST(req: NextRequest) {
  const body = await req.json();
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
  console.log({ isValid });

  if (!isValid) {
    return new Response("Invalid webhook", { status: 401 });
  }

  // Create a streaming response
  console.log({body})

  if (isScrapedEvent(body)) {
    await redis.set(`scrape-results`, body.data.results);
  } else if (isLinksEvent(body)) {
    const links = body.data.links;
    const tx = redis.multi();
    links.forEach((link) => {
      tx.sadd("scrape-links", link);
    });
    await tx.exec();
  } else if (isExploreEvent(body)) {
    const url = body.data.url;
    await redis
      .multi()
      .set(`scrape-exploring`, url)
      .set(`scrape-explored-links`, body.data.explored || 0)
      .set(`scrape-discovered-links`, body.data.found || 0)
      .exec();
  }

  return new Response("OK", { status: 200 });
}
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();

  let intervalId: NodeJS.Timeout;
  req.signal.addEventListener("abort", () => {
    clearInterval(intervalId);
    console.log("Client disconnected, interval cleared.");
  });

  const customReadable = new ReadableStream({
    start(controller) {
      intervalId = setInterval(async () => {
        // Fetch and validate Redis values
        const rawLinks = await redis.smembers("scrape-links");

        const [rawResults, rawExploring, rawExploredLinks, rawDiscoveredLinks] =
          await redis.mget(
            "scrape-results",
            "scrape-exploring",
            "scrape-explored-links",
            "scrape-discovered-links"
          );

        const links = RedisValuesSchema.links.parse(rawLinks);
        const results = RedisValuesSchema.results.parse(rawResults);
        const exploring = RedisValuesSchema.exploring.parse(rawExploring);
        const totalExploredLinks =
          RedisValuesSchema.totalExploredLinks.parse(rawExploredLinks);
        const totalDiscoveredLinks =
          RedisValuesSchema.totalDiscoveredLinks.parse(rawDiscoveredLinks);

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
          // check if controller is open

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(validatedData)}\n\n`)
          );

          if (results) {
            console.log("Stream closed, interval cleared.");
            controller.close();
            clearInterval(intervalId);
          }
        } catch (error) {
          if (error instanceof ZodError) {
            console.log("Data validation error:", error.message);
          } else if (error instanceof Error) {
            console.log("Data validation error:", error.message);
          } else {
            console.log("Data validation error:", error);
          }
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
