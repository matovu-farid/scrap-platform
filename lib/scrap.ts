"use server";
import { ScrapeClient } from "scrap-ai";
import { findOrCreateUsageKey } from "./api_key";
import { auth } from "@/auth";
import { prisma } from "../prisma";
import { redis } from "./cache";
import { env } from "@/env";
import { z } from "zod";

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

export async function scrape(
  url: string,
  prompt: string,
  schema?: Record<string, any>
) {
  const response = await fetch("/api/scrape", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url,
      prompt,
      schema,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to start scraping");
  }

  return response.json();
}
