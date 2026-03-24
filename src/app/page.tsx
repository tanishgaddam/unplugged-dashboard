import DashboardClient from "@/components/dashboard-client";
import { getDemoState } from "@/lib/demo-store";

export default function HomePage() {
  return <DashboardClient mode="overview" />;
}
