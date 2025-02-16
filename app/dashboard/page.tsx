import DashboardClient from "./client";
import { redirect } from "next/navigation";
import { isSignedIn } from "@/authActions";
import { isFeatureEnabled } from "@utils/features";
import { findOrCreateUsageKey } from "@lib/api_key";

export default async function Dashboard() {
  // Only check authentication if requireAuth feature is enabled
  if (isFeatureEnabled("requireAuth") && !(await isSignedIn())) {
    redirect("/");
  }
  await findOrCreateUsageKey();

  return <DashboardClient />;
}
