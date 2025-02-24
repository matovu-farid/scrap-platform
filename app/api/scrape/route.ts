import { NextResponse } from "next/server";
import { scrape } from "@lib/scrap";
import { z } from "zod";

export async function POST(request: Request) {
  const data = await request.json();
  const { url, prompt } = z
    .object({
      url: z.string(),
      prompt: z.string(),
    })
    .parse(data);
  await scrape(url, prompt);
  return NextResponse.json({ message: "Scraping initiated successfully" });
}
