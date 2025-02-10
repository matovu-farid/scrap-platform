"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export function AccountSettings() {
  const [name, setName] = useState("John Doe")
  const [email, setEmail] = useState("john@example.com")
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Account Updated",
      description: "Your account information has been updated successfully.",
    })
  }

  return (
    <div className="space-y-4 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
          />
        </div>
        <Button
          type="submit"
          className="bg-gradient-to-r from-[#7FFFD4] to-[#4169E1] hover:opacity-90 transition-opacity text-white"
        >
          Update Account
        </Button>
      </form>
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Help & Resources</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <a href="/docs" className="text-blue-600 dark:text-blue-400 hover:underline">
              Documentation
            </a>
          </li>
          <li>
            <a href="/faq" className="text-blue-600 dark:text-blue-400 hover:underline">
              Frequently Asked Questions
            </a>
          </li>
          <li>
            <a href="/support" className="text-blue-600 dark:text-blue-400 hover:underline">
              Contact Support
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}

