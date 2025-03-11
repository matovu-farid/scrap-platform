import { redirect } from "next/navigation";
import { isSignedIn } from "@/authActions";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const authenticated = await isSignedIn();

  if (authenticated) {
    redirect("/dashboard");
  }

  return (
    <div className="flex items-center justify-center h-screen min-h-screen  bg-gray-50 dark:bg-gray-900">
      <LoginForm />
    </div>
  );
}
