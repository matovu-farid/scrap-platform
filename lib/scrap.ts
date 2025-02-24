"use server";
import { ScrapeClient } from "scrap-ai";
import { findOrCreateUsageKey } from "./api_key";

export async function getScrapeClient() {
  const { value: apiUsageKey } = await findOrCreateUsageKey();
  
  console.log({ apiUsageKey });
  return new ScrapeClient(apiUsageKey);
}

export async function scrape(url: string, prompt: string) {
  const scrapeClient = await getScrapeClient();
  const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/scrape-callback`;
  console.log({ url, prompt, callbackUrl });
  await scrapeClient.scrape(url, prompt, callbackUrl);
}
