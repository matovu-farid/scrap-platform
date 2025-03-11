"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { signIn } from "next-auth/react";
import { FaGoogle, FaGithub, FaDiscord } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        console.error("Login failed:", result.error);
        // Handle error (would add toast notification in a real app)
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = (provider: string) => {
    setIsLoading(true);
    signIn(provider, { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <Navigation />
      <div className="flex-grow flex items-center justify-center">
        <motion.div
          className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-96"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
            Login
          </h1>

          <div className="space-y-3 mb-6">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center space-x-2 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
              onClick={() => handleOAuthLogin("google")}
              disabled={isLoading}
            >
              <FaGoogle className="w-5 h-5" />
              <span>Continue with Google</span>
            </Button>

            <Button
              variant="outline"
              className="w-full flex items-center justify-center space-x-2 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
              onClick={() => handleOAuthLogin("github")}
              disabled={isLoading}
            >
              <FaGithub className="w-5 h-5" />
              <span>Continue with GitHub</span>
            </Button>

            <Button
              variant="outline"
              className="w-full flex items-center justify-center space-x-2 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
              onClick={() => handleOAuthLogin("discord")}
              disabled={isLoading}
            >
              <FaDiscord className="w-5 h-5" />
              <span>Continue with Discord</span>
            </Button>
          </div>

          <div className="relative flex items-center my-6">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
            <span className="flex-shrink-0 mx-4 text-sm text-gray-500 dark:text-gray-400">
              OR
            </span>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Email
              </label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full"
                disabled={isLoading}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Password
              </label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full"
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                  Remember me
                </label>
              </div>
              <a
                href="#"
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                Forgot password?
              </a>
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#7FFFD4] to-[#4169E1] hover:opacity-90 transition-opacity"
              disabled={isLoading}
            >
              <MdEmail className="w-4 h-4 mr-2" />
              {isLoading ? "Logging in..." : "Log In with Email"}
            </Button>
          </form>

          <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <a
              href="#"
              className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              Sign up
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
