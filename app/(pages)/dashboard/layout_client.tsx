"use client";

import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import Logo from "@/components/logo";
import { Key, History, Play, User, SquareMenu } from "lucide-react";
import { logout } from "@/authActions";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SidebarContent = ({
  closeMobileMenu,
}: {
  closeMobileMenu?: () => void;
}) => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
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
          <Link
            href="/dashboard"
            onClick={closeMobileMenu}
            className={
              "flex items-center w-full px-4 py-2 text-sm rounded-lg " +
              (isActive("/dashboard")
                ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700")
            }
          >
            <Key className="mr-2 h-4 w-4" />
            API Key
          </Link>

          <Link
            href="/dashboard/historical-scrapes"
            onClick={closeMobileMenu}
            className={
              "flex items-center w-full px-4 py-2 text-sm rounded-lg " +
              (isActive("/dashboard/historical-scrapes")
                ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700")
            }
          >
            <History className="mr-2 h-4 w-4" />
            Historical Scrapes
          </Link>

          <Link
            href="/dashboard/scrape-test"
            onClick={closeMobileMenu}
            className={
              "flex items-center w-full px-4 py-2 text-sm rounded-lg " +
              (isActive("/dashboard/scrape-test")
                ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700")
            }
          >
            <Play className="mr-2 h-4 w-4" />
            Scrape Test
          </Link>

          <Link
            href="/dashboard/account"
            onClick={closeMobileMenu}
            className={
              "flex items-center w-full px-4 py-2 text-sm rounded-lg " +
              (isActive("/dashboard/account")
                ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700")
            }
          >
            <User className="mr-2 h-4 w-4" />
            Account
          </Link>
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
            <Button
              type="submit"
              className="dark:hover:bg-gray-50 dark:hover:text-gray-900"
              variant="ghost"
            >
              Logout
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            <SidebarContent
              closeMobileMenu={() => setIsMobileMenuOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center px-6">
          <SquareMenu
            className="h-5 w-5 md:hidden mr-2 text-gray-600 dark:text-gray-300"
            onClick={() => setIsMobileMenuOpen(true)}
          />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Dashboard
          </h1>
        </header>

        <main className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
}
