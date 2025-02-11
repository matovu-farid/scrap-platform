import { auth,  } from "@/auth";
import DashboardClient from "./client";
import { redirect } from "next/navigation";
export default async function Dashboard() {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/");
  }
  return <DashboardClient />;
}
