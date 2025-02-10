import { NextResponse } from "next/server"
import axios from "axios"

export async function POST(request: Request) {
  const { apiKey, targetUrl, webhookUrl } = await request.json()

  try {
    const response = await axios.post("https://api.example.com/scrape", {
      apiKey,
      targetUrl,
      webhookUrl,
      instructions: "Extract all relevant information from this webpage",
    })

    if (!response.data.success) {
      throw new Error(response.data.error || "Scraping failed")
    }

    return NextResponse.json({ message: "Scraping initiated successfully" })
  } catch (error) {
    console.error("Scraping error:", error)
    return NextResponse.json({ error: "An error occurred during scraping" }, { status: 500 })
  }
}

