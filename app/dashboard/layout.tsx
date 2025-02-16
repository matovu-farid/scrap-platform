import { isFeatureEnabled } from "@utils/features";
import { DashboardLayoutClient } from "./layout_client";
import { isSignedIn } from "@/authActions";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (isFeatureEnabled("requireAuth") && !(await isSignedIn())) {
    redirect("/");
  }
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
