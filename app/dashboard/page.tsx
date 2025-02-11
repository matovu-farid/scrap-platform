import DashboardClient from "./client";
import { redirect } from "next/navigation";
import { isSignedIn } from "@/authActions";
export default async function Dashboard() {
  if (!(await isSignedIn())) {
    redirect("/");
  }
  return <DashboardClient />;
}
