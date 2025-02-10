"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <motion.section
      className="text-center mb-16"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-[#7FFFD4] to-[#4169E1] bg-clip-text text-transparent">
        Welcome to scrap-ai
      </h1>
      <p className="text-xl mb-8 max-w-2xl mx-auto">
        Unleash the power of AI-driven web scraping. scrap-ai combines
        cutting-edge technology with user-friendly interfaces to revolutionize
        your data collection process.
      </p>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Button
          asChild
          size="lg"
          className="bg-gradient-to-r from-[#7FFFD4] to-[#4169E1] hover:opacity-90 transition-opacity"
        >
          <Link href="/login">Get Started for Free</Link>
        </Button>
      </motion.div>
    </motion.section>
  );
}
