"use client";

import { DocsSidebar } from "./docs/sidebar";

export function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <DocsSidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
