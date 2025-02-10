import { Navigation } from "@/components/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

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
    content: "The AI-powered scraping capabilities of scrap-ai have given us a competitive edge in market research.",
  },
  {
    name: "Emily Rodriguez",
    role: "Freelance Researcher",
    content:
      "As a freelancer, scrap-ai has been a game-changer. It's like having a research assistant that works 24/7!",
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      <Navigation />
      <main className="container mx-auto px-4 py-16">
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
            Unleash the power of AI-driven web scraping. scrap-ai combines cutting-edge technology with user-friendly
            interfaces to revolutionize your data collection process.
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

        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-3xl font-semibold mb-8 text-center">Why Choose scrap-ai?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">AI-Powered Scraping</h3>
              <p>Our advanced AI algorithms ensure accurate and efficient data extraction from any website.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">User-Friendly Interface</h3>
              <p>No coding required. Our intuitive dashboard makes web scraping accessible to everyone.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Scalable & Fast</h3>
              <p>Handle large-scale scraping jobs with ease. Get the data you need, when you need it.</p>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-3xl font-semibold mb-8 text-center">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 * index }}
              >
                <p className="mb-4 italic">"{testimonial.content}"</p>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {testimonial.role}
                  {testimonial.company && `, ${testimonial.company}`}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h2 className="text-3xl font-semibold mb-8">Ready to Transform Your Data Collection?</h2>
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-[#7FFFD4] to-[#4169E1] hover:opacity-90 transition-opacity"
          >
            <Link href="/login">Start Scraping Now</Link>
          </Button>
        </motion.section>
      </main>
    </div>
  )
}

