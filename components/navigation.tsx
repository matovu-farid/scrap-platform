"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";

interface NavItem {
  href: string;
  label: string;
}

interface NavigationProps {
  items?: NavItem[];
}

const defaultItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Pricing" },
  { href: "/docs/overview", label: "Documentation" },
];

export function Navigation({ items = defaultItems }: NavigationProps) {
  const pathname = usePathname();

  return (
    <nav className="p-4 flex justify-between items-center bg-white dark:bg-gray-800 shadow-md">
      <div className="flex items-center space-x-2">
        <ThemeSwitcher />
        <Logo className="w-8 h-8" />
        <span className="text-lg font-semibold bg-gradient-to-r from-[#7FFFD4] to-[#4169E1] bg-clip-text text-transparent">
          scrap-ai
        </span>
      </div>
      <ul className="flex items-center space-x-6">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`text-gray-600 dark:text-gray-300 hover:text-[#7FFFD4] dark:hover:text-[#7FFFD4] transition-colors duration-200 ${
                pathname === item.href
                  ? "text-[#4169E1] dark:text-[#7FFFD4]"
                  : ""
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
        <li>
          <Button
            asChild
            variant="secondary"
            size="sm"
            className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <Link href="/login">Login</Link>
          </Button>
        </li>
      </ul>
    </nav>
  );
}
