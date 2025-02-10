import { DocsLayout } from "@/components/docs-layout"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DocsPage() {
  return (
    <DocsLayout>
      <h1 className="text-4xl font-bold mb-6">Documentation</h1>
      <p className="text-lg mb-8">
        Welcome to the scrap-ai documentation. Here you'll find everything you need to get started with our AI-powered
        web scraping platform.
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        <Button asChild className="w-full">
          <Link href="/docs/getting-started">Getting Started</Link>
        </Button>
        <Button asChild className="w-full" disabled>
          <Link href="/docs/usage">Usage (Requires Sign In)</Link>
        </Button>
        <Button asChild className="w-full" disabled>
          <Link href="/docs/webhooks">Webhooks (Requires Sign In)</Link>
        </Button>
      </div>
    </DocsLayout>
  )
}

