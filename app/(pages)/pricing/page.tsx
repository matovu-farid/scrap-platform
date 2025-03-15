"use client";

import { Navigation } from "@/components/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@hooks/use-toast";

const pricingPlans = [
  {
    name: "Free",
    price: 0,
    features: [
      "100 scrapes per month",
      "Basic AI-powered scraping",
      "JSON and CSV export",
      "Email support",
      "API access (100 requests/day)",
    ],
    limitations: ["No concurrent scraping", "Limited to 1000 pages per scrape"],
  },
  {
    name: "Premium",
    price: 49,
    features: [
      "Unlimited scrapes",
      "Advanced AI-powered scraping",
      "JSON, CSV, and XML export",
      "Priority email and chat support",
      "API access (unlimited requests)",
      "Concurrent scraping (up to 10 jobs)",
      "No page limit per scrape",
      "Custom scraping rules",
      "Scheduled scraping jobs",
      "Data cleansing and preprocessing",
    ],
  },
];

export default function Pricing() {
  const [billingInterval, setBillingInterval] = useState<
    "monthly" | "annually"
  >("monthly");
  const { toast } = useToast();

  const handlePlanSelection = (planName: string) => {
    toast({
      title: "Plan Selected",
      description: `You've selected the ${planName} plan. Redirecting to signup...`,
    });
    // In a real application, you would redirect to a signup page or process here
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      <Navigation />
      <main className="container mx-auto px-4 py-16">
        <motion.h1
          className="text-4xl font-bold text-center mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Choose Your Plan
        </motion.h1>
        <motion.div
          className="flex justify-center items-center mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span
            className={`mr-2 ${
              billingInterval === "monthly" ? "font-bold" : ""
            }`}
          >
            Monthly
          </span>
          <Switch
            checked={billingInterval === "annually"}
            onCheckedChange={(checked) =>
              setBillingInterval(checked ? "annually" : "monthly")
            }
          />
          <span
            className={`ml-2 ${
              billingInterval === "annually" ? "font-bold" : ""
            }`}
          >
            Annually (Save 20%)
          </span>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-8">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 * (index + 1) }}
            >
              <h2 className="text-2xl font-bold mb-4">{plan.name}</h2>
              <p className="text-4xl font-bold mb-6">
                $
                {billingInterval === "annually"
                  ? Math.floor(plan.price * 12 * 0.8)
                  : plan.price}
                <span className="text-base font-normal">
                  /{billingInterval === "annually" ? "year" : "month"}
                </span>
              </p>
              <ul className="mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center mb-2">
                    <svg
                      className="w-4 h-4 mr-2 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    {feature}
                  </li>
                ))}
                {plan.limitations &&
                  plan.limitations.map((limitation, index) => (
                    <li
                      key={index}
                      className="flex items-center mb-2 text-gray-500"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        ></path>
                      </svg>
                      {limitation}
                    </li>
                  ))}
              </ul>
              <Button
                onClick={() => handlePlanSelection(plan.name)}
                className="w-full"
              >
                {plan.name === "Free" ? "Get Started" : "Upgrade Now"}
              </Button>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
