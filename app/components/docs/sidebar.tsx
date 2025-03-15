"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const sidebarItems = [
  {
    title: "Overview",
    href: "/docs/overview",
  },
  {
    title: "Getting Started",
    href: "/docs/getting-started",
  },
  {
    title: "API Reference",
    href: "/docs/api",
  },
  {
    title: "Webhooks",
    href: "/docs/webhooks",
  },
];

export function DocsSidebar() {
  return (
    <motion.div
      className="w-64 p-4 border-r border-gray-200 dark:border-gray-800"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <nav>
        <ul className="space-y-2">
          {sidebarItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </motion.div>
  );
}
