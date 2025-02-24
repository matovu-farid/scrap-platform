"use client";

import { useEffect, useState } from "react";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { Progress } from "@components/ui/progress";
import { scrape } from "@lib/scrap";
import { ScrapeProgressSchema } from "@lib/schemas/scrape-progress";

export function InteractiveScrapeTest() {
  const [url, setUrl] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isScrapingInProgress, setIsScrapingInProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [discoveredLinks, setDiscoveredLinks] = useState<string[]>([]);
  const [exploring, setExploring] = useState<string | null>(null);
  const [totalExploredLinks, setTotalExploredLinks] = useState(0);
  const [totalDiscoveredLinks, setTotalDiscoveredLinks] = useState(0);
  const [results, setResults] = useState<any | null>(null);

  useEffect(() => {
    const evtSource = new EventSource("/api/scrape-callback");

    evtSource.onmessage = (event) => {
      try {
        const rawData = JSON.parse(event.data);

        // Handle error state from server
        if (rawData.error) {
          console.error("Server data error:", rawData.error);
          return;
        }

        // Validate the data against the schema
        const data = ScrapeProgressSchema.parse(rawData);
        console.log({ data });

        setExploring(data.exploring);
        setDiscoveredLinks(data.links ?? []);
        setResults(data.results);
        setProgress(data.progress);
        setTotalExploredLinks(data.totalExploredLinks);
        setTotalDiscoveredLinks(data.totalDiscoveredLinks);
        if (data.progress === 100) {
          setIsScrapingInProgress(false);
        }
      } catch (error) {
        console.error("Error parsing or validating SSE data:", error);
      }
    };

    evtSource.onerror = (err) => {
      console.error("EventSource failed:", err);
    };

    return () => {
      evtSource.close();
    };
  }, []);

  const startScraping = async () => {
    setIsScrapingInProgress(true);
    setProgress(0);
    setDiscoveredLinks([]);
    setResults(null);
    setExploring(null);
    setTotalExploredLinks(0);
    setTotalDiscoveredLinks(0);

    await scrape(url, prompt);
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
        disabled={isScrapingInProgress || !url.trim() || !prompt.trim()}
        className={`w-full transition-all font-semibold ${
          isScrapingInProgress || !url.trim() || !prompt.trim()
            ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-[#7FFFD4] to-[#4169E1] hover:opacity-90 text-gray-900"
        }`}
      >
        {isScrapingInProgress ? "Scraping..." : "Start Scraping"}
      </Button>

      {isScrapingInProgress && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-gray-900 dark:text-gray-100">
            Progress: {progress}%
          </p>
          {exploring && (
            <p className="text-gray-900 dark:text-gray-100">
              Currently exploring: {exploring}
            </p>
          )}
          <p className="text-gray-900 dark:text-gray-100">
            Links explored: {totalExploredLinks} / {totalDiscoveredLinks}
          </p>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Discovered Links:
          </h3>
          <ul className="list-disc pl-5 text-gray-900 dark:text-gray-100">
            {discoveredLinks?.map((link, index) => (
              <li key={index}>{link}</li>
            ))}
          </ul>
        </div>
      )}

      {results && (
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Scraping Results:
          </h3>
          <pre className="bg-white dark:bg-gray-600 p-4 rounded-lg border border-gray-200 dark:border-gray-500 text-gray-900 dark:text-white overflow-auto">
            {JSON.stringify(results, null, 2)}
          </pre>
          <Button className="w-full bg-gradient-to-r from-[#7FFFD4] to-[#4169E1] hover:opacity-90 transition-opacity text-gray-900 font-semibold">
            Export Data
          </Button>
        </div>
      )}
    </div>
  );
}
