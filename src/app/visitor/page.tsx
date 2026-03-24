import DashboardClient from "@/components/dashboard-client";
import { getDemoState } from "@/lib/demo-store";

export default function VisitorPage() {
  return <DashboardClient mode="visitor" />;
}
