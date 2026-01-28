import { StatsGrid } from "@/components/dashboard/stats-grid"
import { RecentScansTable } from "@/components/dashboard/recent-scans-table"
import { QuickActions } from "@/components/dashboard/quick-actions"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of medical imaging analysis system
        </p>
      </div>
      
      <StatsGrid />
      
      <QuickActions />
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Scans</h2>
        <RecentScansTable />
      </div>
    </div>
  )
}
