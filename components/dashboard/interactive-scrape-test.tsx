"use client";

import { useEffect, useState } from "react";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { Progress } from "@components/ui/progress";
import { clearCachedResults, scrape } from "@lib/scrap";
import { ScrapeProgressSchema } from "@lib/schemas/scrape-progress";
import { Loader2, Copy, Check } from "lucide-react";
import dynamic from "next/dynamic";
import { Switch } from "@components/ui/switch";
import { Label } from "@components/ui/label";
import { useTheme } from "next-themes";

// Dynamically import Ace editor to avoid SSR issues
const AceEditor = dynamic(
  async () => {
    const ace = await import("react-ace");
    await import("ace-builds/src-noconflict/mode-json");
    await import("ace-builds/src-noconflict/theme-github");
    await import("ace-builds/src-noconflict/theme-monokai");
    return ace;
  },
  { ssr: false }
);

export function InteractiveScrapeTest() {
  const [url, setUrl] = useState("https://matovu-farid.com");
  const [prompt, setPrompt] = useState("What is this website about?");
  const [isScrapingInProgress, setIsScrapingInProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [discoveredLinks, setDiscoveredLinks] = useState<string[]>([]);
  const [exploring, setExploring] = useState<string | null>(null);
  const [totalExploredLinks, setTotalExploredLinks] = useState(0);
  const [totalDiscoveredLinks, setTotalDiscoveredLinks] = useState(0);
  const [results, setResults] = useState<any | null>(null);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [isDiscoveringLinks, setIsDiscoveringLinks] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSchema, setShowSchema] = useState(false);
  const [schema, setSchema] = useState(`{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "The title of the content"
    },
    "summary": {
      "type": "string",
      "description": "A brief summary of the content"
    }
  },
  "required": ["title", "summary"]
}`);

  useEffect(() => {
    clearCachedResults().then(() => {
      const evtSource = new EventSource("/api/scrape-callback");
      setEventSource(evtSource);

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

          // If we receive any links, we're past the initial discovery phase
          if (data.links && data.links.length > 0) {
            setIsDiscoveringLinks(false);
          }

          setExploring(data.exploring);
          setDiscoveredLinks(data.links ?? []);
          setResults(data.results);
          setProgress(data.progress);
          setTotalExploredLinks(data.totalExploredLinks);
          setTotalDiscoveredLinks(data.totalDiscoveredLinks);

          // Set AI processing state when scraping is complete but results aren't ready
          if (data.progress === 100 && !data.results) {
            setIsAiProcessing(true);
          }

          if (data.results) {
            setIsAiProcessing(false);
            setIsScrapingInProgress(false);
          }
        } catch (error) {
          console.error("Error parsing or validating SSE data:", error);
        }
      };

      evtSource.onerror = (err) => {
        console.error("EventSource failed:", err);

        setEventSource(null);
      };

      return () => {
        evtSource.close();
      };
    });
  }, []);
  useEffect(() => {
    if (results && eventSource) {
      eventSource.close();
    }
  }, [results, eventSource]);

  const startScraping = async () => {
    setIsScrapingInProgress(true);
    setIsDiscoveringLinks(true);
    setProgress(0);
    setDiscoveredLinks([]);
    setResults(null);
    setExploring(null);
    setTotalExploredLinks(0);
    setTotalDiscoveredLinks(0);

    try {
      // Parse schema to validate it's proper JSON
      const parsedSchema = showSchema ? JSON.parse(schema) : undefined;
      await scrape(url, prompt, parsedSchema);
    } catch (error) {
      console.error("Invalid schema JSON:", error);
      setIsScrapingInProgress(false);
      // You might want to add error handling UI here
    }
  };

  const copyResults = async () => {
    if (results) {
      await navigator.clipboard.writeText(JSON.stringify(results, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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

      <div className="flex items-center space-x-2">
        <Switch
          id="schema-mode"
          checked={showSchema}
          onCheckedChange={setShowSchema}
        />
        <Label htmlFor="schema-mode">Use Custom Schema</Label>
      </div>

      {showSchema && (
        <div className="space-y-2">
          <Label>JSON Schema</Label>
          <div className="h-[300px] w-full rounded-md border border-gray-200 dark:border-gray-500">
            <AceEditor
              mode="json"
              theme="monokai"
              onChange={setSchema}
              value={schema}
              name="schema-editor"
              editorProps={{ $blockScrolling: true }}
              setOptions={{
                showLineNumbers: true,
                tabSize: 2,
              }}
              width="100%"
              height="100%"
              className="rounded-md"
            />
          </div>
        </div>
      )}

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

      {isDiscoveringLinks && (
        <div className="flex flex-col items-center justify-center space-y-3 py-4">
          <Loader2 className="h-8 w-8 animate-spin text-green-500" />
          <p className="text-gray-900 dark:text-gray-100 text-center">
            Discovering links on the page...
          </p>
        </div>
      )}

      {isScrapingInProgress && !isDiscoveringLinks && (
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

      {isAiProcessing && (
        <div className="flex flex-col items-center justify-center space-y-3 py-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-gray-900 dark:text-gray-100 text-center">
            AI is analyzing the scraped content...
          </p>
        </div>
      )}

      {results && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Scraping Results:
            </h3>
            <button
              onClick={copyResults}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              title="Copy results"
            >
              {copied ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : (
                <Copy className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              )}
            </button>
          </div>
          <pre className="bg-white dark:bg-gray-600 p-4 rounded-lg border border-gray-200 dark:border-gray-500 text-gray-900 dark:text-white overflow-x-auto whitespace-pre-wrap break-words max-w-full">
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
