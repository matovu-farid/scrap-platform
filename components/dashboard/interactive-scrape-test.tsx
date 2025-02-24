"use client";

import { useEffect, useState } from "react";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { Progress } from "@components/ui/progress";
import { scrape } from "@lib/scrap";

export function InteractiveScrapeTest() {
  const [url, setUrl] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isScrapingInProgress, setIsScrapingInProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [discoveredLinks, setDiscoveredLinks] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  type ScrapingResult = {
    totalLinks: number;
    dataExtracted: string;
  };
  const [scrapingResult, setScrapingResult] = useState<ScrapingResult | null>(
    null
  );

  useEffect(() => {
    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/scrape-callback`
    );
    eventSource.onmessage = (event) => {
      setMessage(event.data);
    };
    return () => {
      eventSource.close();
    };
  }, []);

  const startScraping = async () => {
    // setIsScrapingInProgress(true);
    // setProgress(0);
    // setDiscoveredLinks([]);
    // setScrapingResult(null);

    // Simulating scraping process
    // for (let i = 0; i <= 100; i += 10) {
    //   await new Promise((resolve) => setTimeout(resolve, 500));
    //   setProgress(i);
    //   if (i % 20 === 0) {
    //     setDiscoveredLinks((prev) => [
    //       ...prev,
    //       `https://example.com/page${i / 10}`,
    //     ]);
    //   }
    // }
    await scrape(url, prompt);

    // setScrapingResult({
    //   totalLinks: 5,
    //   dataExtracted: "Sample extracted data...",
    // });
    // setIsScrapingInProgress(false);
  };

  return (
    <div className="space-y-4 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md w-full">
      <Input
        type="url"
        placeholder="Enter URL to scrape"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="bg-white dark:bg-gray-600 border-gray-200 dark:border-gray-500 placeholder:text-gray-500 dark:placeholder:text-gray-300 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400"
      />
      <Textarea
        placeholder="Enter scraping prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="bg-white dark:bg-gray-600 border-gray-200 dark:border-gray-500 placeholder:text-gray-500 dark:placeholder:text-gray-300 text-gray-900 dark:text-white min-h-[100px] focus:border-blue-500 dark:focus:border-blue-400"
      />
      <form action={async ()=>await scrape(url, prompt)}>
        <Button
          type="submit"
          className="bg-gradient-to-r from-[#7FFFD4] to-[#4169E1] hover:opacity-90 transition-opacity text-gray-900 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start Scraping
        </Button>
      </form>

      <div className="space-y-2">
        <p className="text-gray-900 dark:text-gray-100">{message}</p>
      </div>
    </div>
  );
}
