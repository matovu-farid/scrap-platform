"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <motion.section
      className="text-center"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      <h2 className="text-3xl font-semibold mb-8">
        Ready to Transform Your Data Collection?
      </h2>
      <Button
        asChild
        size="lg"
        className="bg-gradient-to-r from-[#7FFFD4] to-[#4169E1] hover:opacity-90 transition-opacity"
      >
        <Link href="/login">Start Scraping Now</Link>
      </Button>
    </motion.section>
  );
}
