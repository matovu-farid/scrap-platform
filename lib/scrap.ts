"use server";
import { ScrapeClient } from "scrap-ai";
import { findOrCreateUsageKey } from "./api_key";

export async function scrape(url: string, prompt: string) {
  const { value: apiUsageKey } = await findOrCreateUsageKey();
  const scrapeClient = new ScrapeClient(apiUsageKey);
  const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/scrape-callback`;
  console.log("Scraping", url, prompt, callbackUrl);
  await scrapeClient.scrape(url, prompt, callbackUrl);
}
