import { StatsCard } from "./stats-card";
import { Activity, Clock, TrendingUp, Download } from "lucide-react";
import { dashboardStats } from "@/lib/mock-data";

export function StatsGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Scans"
        value={dashboardStats.totalScans.toLocaleString()}
        icon={Activity}
        trend={{ value: 12, isPositive: true }}
      />
      <StatsCard
        title="Pending Reviews"
        value={dashboardStats.pendingReviews}
        icon={Clock}
        trend={{ value: 5, isPositive: false }}
      />
      <StatsCard
        title="AI Accuracy"
        value={`${dashboardStats.aiAccuracy}%`}
        icon={TrendingUp}
        trend={{ value: 2.3, isPositive: true }}
      />
      <StatsCard
        title="Government Imports"
        value={dashboardStats.governmentImports}
        icon={Download}
        trend={{ value: 8, isPositive: true }}
      />
    </div>
  );
}
