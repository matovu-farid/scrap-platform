"use client";

import { DocsSidebar } from "@/app/components/docs/sidebar";
import { Navigation } from "@/components/navigation";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navigation />
      <div className="flex min-h-screen">
        <DocsSidebar />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
