"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ThemeSwitcher } from "@components/theme-switcher";
import { APIKeyManagement } from "@components/dashboard/api-key-management";
import { HistoricalScrapes } from "@components/dashboard/historical-scrapes";
import { InteractiveScrapeTest } from "@components/dashboard/interactive-scrape-test";
import { AccountSettings } from "@components/dashboard/account-settings";
import { Button } from "@components/ui/button";
import { Sheet, SheetContent } from "@components/ui/sheet";
import Logo from "@components/logo";
import { Key, History, Play, User, Menu } from "lucide-react";
import { logout } from "@/authActions";

export default function DashboardClient() {
  const [activeTab, setActiveTab] = useState("api-key");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const SidebarContent = () => (
    <>
      {/* Logo and Title */}
      <div className="flex items-center p-4">
        <Logo className="w-8 h-8 mr-2" />
        <span className="text-lg font-semibold from-[#7FFFD4] to-[#4169E1] bg-gradient-to-r bg-clip-text text-transparent">
          scrap-ai
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-4">
        <div className="px-2 space-y-1">
          <button
            type="button"
            onClick={() => {
              setActiveTab("api-key");
              setIsMobileMenuOpen(false);
            }}
            className={
              "flex items-center w-full px-4 py-2 text-sm rounded-lg " +
              (activeTab === "api-key"
                ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700")
            }
          >
            <Key className="mr-2 h-4 w-4" />
            API Key
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("historical-scrapes");
              setIsMobileMenuOpen(false);
            }}
            className={
              "flex items-center w-full px-4 py-2 text-sm rounded-lg " +
              (activeTab === "historical-scrapes"
                ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700")
            }
          >
            <History className="mr-2 h-4 w-4" />
            Historical Scrapes
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("scrape-test");
              setIsMobileMenuOpen(false);
            }}
            className={
              "flex items-center w-full px-4 py-2 text-sm rounded-lg " +
              (activeTab === "scrape-test"
                ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700")
            }
          >
            <Play className="mr-2 h-4 w-4" />
            Scrape Test
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("account");
              setIsMobileMenuOpen(false);
            }}
            className={
              "flex items-center w-full px-4 py-2 text-sm rounded-lg " +
              (activeTab === "account"
                ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700")
            }
          >
            <User className="mr-2 h-4 w-4" />
            Account
          </button>
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="flex items-center justify-between p-4">
          <ThemeSwitcher />
          <form
            action={async () => {
              await logout();
            }}
          >
            <Button type="submit" variant="ghost">
              Logout
            </Button>
          </form>
        </div>
      </div>
    </>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "api-key":
        return <APIKeyManagement />;
      case "historical-scrapes":
        return <HistoricalScrapes />;
      case "scrape-test":
        return <InteractiveScrapeTest />;
      case "account":
        return <AccountSettings />;
      default:
        return <APIKeyManagement />;
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="flex flex-col h-full">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent
          side="left"
          className="w-64 p-0 bg-white dark:bg-gray-800"
        >
          <div className="flex flex-col h-full">
            <SidebarContent />
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center px-6">
          {/* <Button
         
          
            // variant="ghost"
            className="md:hidden mr-2 text-gray-600 dark:text-gray-300"
            asChild
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button> */}
          <Button
            asChild
            type="button"
            variant="ghost"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Dashboard
          </h1>
        </header>

        <main className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-gray-900">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
