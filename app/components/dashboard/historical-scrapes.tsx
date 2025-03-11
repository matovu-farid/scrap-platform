"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const mockScrapes = [
  {
    id: 1,
    date: "2023-06-01",
    duration: "2m 30s",
    status: "Success",
    url: "https://example.com",
  },
  {
    id: 2,
    date: "2023-06-02",
    duration: "1m 45s",
    status: "Failed",
    url: "https://example.org",
  },
  {
    id: 3,
    date: "2023-06-03",
    duration: "3m 15s",
    status: "Success",
    url: "https://example.net",
  },
];

export function HistoricalScrapes() {
  const [searchTerm, setSearchTerm] = useState("");
  type Scrape = {
    id: number;
    date: string;
    duration: string;
    status: string;
    url: string;
  };
  const [selectedScrape, setSelectedScrape] = useState<Scrape | null>(null);

  const filteredScrapes = mockScrapes.filter(
    (scrape) =>
      scrape.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scrape.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md w-full">
      <Input
        type="text"
        placeholder="Search by URL or status"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
      />
      <div className="bg-white dark:bg-gray-700 rounded-lg overflow-hidden">
        <Table>
          <TableCaption>A list of your recent scrapes</TableCaption>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-800">
              <TableHead className="text-gray-700 dark:text-gray-300">
                Date
              </TableHead>
              <TableHead className="text-gray-700 dark:text-gray-300">
                URL
              </TableHead>
              <TableHead className="text-gray-700 dark:text-gray-300">
                Duration
              </TableHead>
              <TableHead className="text-gray-700 dark:text-gray-300">
                Status
              </TableHead>
              <TableHead className="text-gray-700 dark:text-gray-300">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredScrapes.map((scrape) => (
              <TableRow key={scrape.id}>
                <TableCell className="text-gray-900 dark:text-gray-100">
                  {scrape.date}
                </TableCell>
                <TableCell className="text-gray-900 dark:text-gray-100">
                  {scrape.url}
                </TableCell>
                <TableCell className="text-gray-900 dark:text-gray-100">
                  {scrape.duration}
                </TableCell>
                <TableCell className="text-gray-900 dark:text-gray-100">
                  {scrape.status}
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedScrape(scrape)}
                        className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500"
                      >
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white dark:bg-gray-800">
                      <DialogHeader>
                        <DialogTitle>Scrape Details</DialogTitle>
                        <DialogDescription>
                          Detailed information about the scrape session.
                        </DialogDescription>
                      </DialogHeader>
                      {selectedScrape && (
                        <div className="mt-4 space-y-2">
                          <p className="text-gray-700 dark:text-gray-300">
                            <strong>Date:</strong> {selectedScrape.date}
                          </p>
                          <p className="text-gray-700 dark:text-gray-300">
                            <strong>URL:</strong> {selectedScrape.url}
                          </p>
                          <p className="text-gray-700 dark:text-gray-300">
                            <strong>Duration:</strong> {selectedScrape.duration}
                          </p>
                          <p className="text-gray-700 dark:text-gray-300">
                            <strong>Status:</strong> {selectedScrape.status}
                          </p>
                          <p className="text-gray-700 dark:text-gray-300">
                            <strong>Links Found:</strong> 42
                          </p>
                          <p className="text-gray-700 dark:text-gray-300">
                            <strong>Errors:</strong> None
                          </p>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
