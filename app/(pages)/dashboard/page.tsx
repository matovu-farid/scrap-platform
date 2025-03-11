import { postLogin } from "@/authActions";
import ApiManagmentPage from "./api-managment/page";

export default async function Dashboard() {
  // Only check authentication if requireAuth feature is enabled

  await postLogin();

  return <ApiManagmentPage />;
}
