"use client";

import { Button } from "./ui/button";
import { login } from "@/authActions";

export function LoginButton() {
  return (
    <form
      action={async () => {
        await login();
      }}
    >
      <Button
        variant="secondary"
        size="sm"
        className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
      >
        Login
      </Button>
    </form>
  );
}
