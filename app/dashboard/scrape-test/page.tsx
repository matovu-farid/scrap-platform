"use client";

import { motion } from "framer-motion";
import { InteractiveScrapeTest } from "@/components/dashboard/interactive-scrape-test";

export default function ScrapeTestPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <InteractiveScrapeTest />
    </motion.div>
  );
}
