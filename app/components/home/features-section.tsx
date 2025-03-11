"use client";

import { motion } from "framer-motion";

export function FeaturesSection() {
  return (
    <motion.section
      className="mb-16"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <h2 className="text-3xl font-semibold mb-8 text-center">
        Why Choose scrap-ai?
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">AI-Powered Scraping</h3>
          <p>
            Our advanced AI algorithms ensure accurate and efficient data
            extraction from any website.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">
            User-Friendly Interface
          </h3>
          <p>
            No coding required. Our intuitive dashboard makes web scraping
            accessible to everyone.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Scalable & Fast</h3>
          <p>
            Handle large-scale scraping jobs with ease. Get the data you need,
            when you need it.
          </p>
        </div>
      </div>
    </motion.section>
  );
}
