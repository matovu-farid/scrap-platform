"use server";
import { ScrapeClient } from "scrap-ai";
import { findOrCreateUsageKey } from "./api_key";
import { auth } from "@/auth";
import { prisma } from "../prisma";
import { redis } from "./cache";

export async function getScrapeClient(userId?: string) {
  const { value: apiUsageKey } = await findOrCreateUsageKey(userId);

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


export async function scrape(url: string, prompt: string) {
  await clearCachedResults();
  const scrapeClient = await getScrapeClient();
  const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/scrape-callback`;
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email || "",
    },
    select: {
      id: true,
    },
  });
  const userId = user?.id || "";

  await scrapeClient.scrape(url, prompt, callbackUrl, userId);
}
