import "./globals.css"
import { Inter } from "next/font/google"
import { Toaster } from "@components/ui/toaster"
import type React from "react"
import { ThemeProvider } from "@components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "scrap-ai",
  description: "AI-powered web scraping made easy",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

