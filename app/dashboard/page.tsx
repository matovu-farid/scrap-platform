import ApiManagmentPage from "./api-managment/page";

import { findOrCreateUsageKey } from "@lib/api_key";

export default async function Dashboard() {
  // Only check authentication if requireAuth feature is enabled

  await findOrCreateUsageKey();

  return <ApiManagmentPage />;
}
