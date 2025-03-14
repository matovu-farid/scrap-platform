"use server";
import { ScrapeClient } from "scrap-ai";
import { findOrCreateUsageKey } from "./apikey";
import { prisma } from "@/prisma";
import { redis } from "./cache";
import { env } from "@/env";
import { getMySession } from "@/authActions";

export async function getScrapeClient(userId?: string) {
  const apiUsageKey = await findOrCreateUsageKey(userId);

  console.log({ apiUsageKey });
  return new ScrapeClient(apiUsageKey);
}
export async function clearCachedResults() {
  await redis
    .multi()
    .del("scrape-results")
    .del("scrape-links")
    .del("scrape-exploring")
    .del("scrape-explored-links")
    .del("scrape-discovered-links")
    .exec();
}

export async function scrape(url: string, prompt: string, schema?: any) {
  await clearCachedResults();
  const scrapeClient = await getScrapeClient();
  const callbackUrl = `${env.NEXT_PUBLIC_APP_URL}/api/scrape-callback`;
  const sessionData = await getMySession();

  const userId = sessionData?.user.id || "";

  await scrapeClient.scrape({ url, prompt, callbackUrl, id: userId, schema });
}
