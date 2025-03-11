"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Data Analyst",
    company: "TechCorp",
    content:
      "scrap-ai has revolutionized our data collection process. It's fast, reliable, and incredibly easy to use!",
  },
  {
    name: "Michael Chen",
    role: "Marketing Manager",
    company: "GrowthGenius",
    content:
      "The AI-powered scraping capabilities of scrap-ai have given us a competitive edge in market research.",
  },
  {
    name: "Emily Rodriguez",
    role: "Freelance Researcher",
    content:
      "As a freelancer, scrap-ai has been a game-changer. It's like having a research assistant that works 24/7!",
  },
];

export function TestimonialsSection() {
  return (
    <motion.section
      className="mb-16"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <h2 className="text-3xl font-semibold mb-8 text-center">
        What Our Users Say
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 * index }}
          >
            <p className="mb-4 italic">{`"${testimonial.content}"`}</p>
            <p className="font-semibold">{testimonial.name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {testimonial.role}
              {testimonial.company && `, ${testimonial.company}`}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
