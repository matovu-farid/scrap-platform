import "./globals.css";
import { Inter } from "next/font/google";
import type React from "react";
import { QueryClient } from "@tanstack/react-query";
import Provider from "./provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "scrap-ai",
  description: "AI-powered web scraping made easy",
};

// Create a client
const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
