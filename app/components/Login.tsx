"use client";

import { Button } from "./ui/button";

export function LoginButton() {
  return (
    <a href="/login">
      <Button
        variant="secondary"
        size="sm"
        className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
      >
        Login
      </Button>
    </a>
  );
}
