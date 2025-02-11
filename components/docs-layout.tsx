"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Navigation } from "@components/navigation";
import { Button } from "@components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@components/ui/sheet";
import { ScrollArea } from "@components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Menu } from "lucide-react";

interface DocsSidebarProps {
  items: { title: string; href: string }[];
  isSignedIn: boolean;
}

function DocsSidebar({ items, isSignedIn }: DocsSidebarProps) {
  const pathname = usePathname();

  return (
    <ScrollArea className="h-full py-6 pl-8 pr-6">
      <h4 className="mb-4 text-sm font-semibold">Documentation</h4>
      <nav className="flex flex-col space-y-2">
        <Link
          href="/docs/overview"
          className={`text-sm ${
            pathname === "/docs/overview"
              ? "font-semibold text-primary"
              : "text-muted-foreground hover:text-primary"
          }`}
        >
          Overview
        </Link>
        <Link
          href="/docs/getting-started"
          className={`text-sm ${
            pathname === "/docs/getting-started"
              ? "font-semibold text-primary"
              : "text-muted-foreground hover:text-primary"
          }`}
        >
          Getting Started
        </Link>
        {isSignedIn && (
          <>
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm ${
                  pathname === item.href
                    ? "font-semibold text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {item.title}
              </Link>
            ))}
          </>
        )}
      </nav>
    </ScrollArea>
  );
}

interface DocsLayoutProps {
  children: ReactNode;
}

const sidebarItemsSignedOut = [
  { title: "Overview", href: "/docs/overview" },
  { title: "Getting Started", href: "/docs/getting-started" },
  { title: "Usage", href: "/docs/usage" },
  { title: "Webhooks", href: "/docs/webhooks" },
];

const sidebarItemsSignedIn = [
  { title: "API Key Management", href: "/docs/api-key-management" },
  { title: "Historical Scrapes", href: "/docs/historical-scrapes" },
  { title: "Interactive Scrape Test", href: "/docs/interactive-scrape-test" },
  { title: "Account Settings", href: "/docs/account-settings" },
];

export function DocsLayout({ children }: DocsLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false); // This should be replaced with actual auth state
  const pathname = usePathname();

  const sidebarItems = isSignedIn
    ? sidebarItemsSignedIn
    : sidebarItemsSignedOut;

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <div className="container flex-1">
        <div className="flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
          <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto md:sticky md:block">
            <DocsSidebar items={sidebarItems} isSignedIn={isSignedIn} />
          </aside>
          <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
            <div className="mx-auto w-full min-w-0">
              <div className="mb-4 md:hidden">
                <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
                    >
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Toggle Menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="pr-0">
                    <DocsSidebar items={sidebarItems} isSignedIn={isSignedIn} />
                  </SheetContent>
                </Sheet>
              </div>
              {isSignedIn ? (
                children
              ) : (
                <Tabs defaultValue="overview" className="space-y-6">
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="getting-started">
                      Getting Started
                    </TabsTrigger>
                    <TabsTrigger value="usage">Usage</TabsTrigger>
                    <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview" className="border-none p-0">
                    {pathname === "/docs/overview" ? children : null}
                  </TabsContent>
                  <TabsContent
                    value="getting-started"
                    className="border-none p-0"
                  >
                    {pathname === "/docs/getting-started" ? children : null}
                  </TabsContent>
                  <TabsContent value="usage" className="border-none p-0">
                    {pathname === "/docs/usage" && children}
                  </TabsContent>
                  <TabsContent value="webhooks" className="border-none p-0">
                    {pathname === "/docs/webhooks" && children}
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
