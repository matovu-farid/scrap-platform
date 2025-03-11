"use client";

import { motion } from "framer-motion";
import { HistoricalScrapes } from "@/components/dashboard/historical-scrapes";

export default function HistoricalScrapesPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <HistoricalScrapes />
    </motion.div>
  );
}
