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
  const [exploring, setExploring] = useState<string[]>([]);

  type ScrapingResult = {
    totalLinks: number;
    dataExtracted: string;
  };
  const [scrapingResult, setScrapingResult] = useState<ScrapingResult | null>(
    null
  );

  useEffect(() => {
    const evtSource = new EventSource(
      "http://localhost:3000/api/scrape-callback"
    );
    evtSource.onmessage = (event) => {
      if (event.data.startsWith("Exploring\n")) {
        setExploring(event.data.replace("Exploring\n", ""));
      }
      if (event.data.startsWith("Links\n")) {
        setDiscoveredLinks(event.data.replace("Links\n", ""));
      }
      if (event.data.startsWith("Results\n")) {
        setScrapingResult(event.data.replace("Results\n", ""));
      }
    };
    evtSource.onerror = (err) => {
      console.error("EventSource failed:", err);
    };
    evtSource.onmessage = (event) => {
      setMessage(event.data);
    };
    return () => {
      evtSource.close();
    };
  }, []);

  const startScraping = async () => {
    setIsScrapingInProgress(true);
    setProgress(0);
    setDiscoveredLinks([]);
    setScrapingResult(null);

    await scrape(url, prompt);

    setScrapingResult({
      totalLinks: 5,
      dataExtracted: "Sample extracted data...",
    });
    setIsScrapingInProgress(false);
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
      <Button
        onClick={startScraping}
        disabled={isScrapingInProgress || !url || !prompt}
        className="bg-gradient-to-r from-[#7FFFD4] to-[#4169E1] hover:opacity-90 transition-opacity text-gray-900 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isScrapingInProgress ? "Scraping..." : "Start Scraping"}
      </Button>
      <div className="space-y-2">
        <p className="text-gray-900 dark:text-gray-100">{message}</p>
      </div>
      {isScrapingInProgress && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-gray-900 dark:text-gray-100">
            Scraping in progress: {progress}%
          </p>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Discovered Links:
          </h3>
          <ul className="list-disc pl-5 text-gray-900 dark:text-gray-100">
            {discoveredLinks.map((link, index) => (
              <li key={index}>{link}</li>
            ))}
          </ul>
        </div>
      )}
      {scrapingResult && (
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Scraping Result:
          </h3>
          <p className="text-gray-900 dark:text-gray-100">
            Total Links Found: {scrapingResult.totalLinks}
          </p>
          <p className="text-gray-900 dark:text-gray-100">Extracted Data:</p>
          <pre className="bg-white dark:bg-gray-600 p-4 rounded-lg border border-gray-200 dark:border-gray-500 text-gray-900 dark:text-white">
            {scrapingResult.dataExtracted}
          </pre>
          <Button className="bg-gradient-to-r from-[#7FFFD4] to-[#4169E1] hover:opacity-90 transition-opacity text-gray-900 font-semibold">
            Export Data
          </Button>
        </div>
      )}
    </div>
  );
}
