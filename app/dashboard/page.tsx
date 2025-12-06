import { StatCard } from "@/components/dashboard/stat-card"
import { TrafficChart } from "@/components/dashboard/traffic-chart"
import { TopPagesTable } from "@/components/dashboard/top-pages-table"
import { RecentReports } from "@/components/dashboard/recent-reports"
import { Users, TrendingUp, Search, Zap, DollarSign, Target } from "lucide-react"

export default function DashboardPage() {
  // Mock metrics for the last 30 days
  const mockMetrics = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    return {
      metric_date: date.toISOString(),
      visitors: Math.floor(Math.random() * 1000) + 500,
      conversion_rate: (Math.random() * 5 + 2).toFixed(2),
      seo_score: Math.floor(Math.random() * 20) + 80,
      performance_score: Math.floor(Math.random() * 15) + 85,
      leads_generated: Math.floor(Math.random() * 50) + 10,
      revenue: (Math.random() * 5000 + 1000).toFixed(2),
    }
  })

  // Mock reports
  const mockReports = [
    {
      id: 1,
      report_type: "weekly",
      title: "Weekly Performance Report",
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      report_type: "bi_weekly",
      title: "Bi-Weekly Growth Strategy",
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 3,
      report_type: "lighthouse",
      title: "Lighthouse Performance Audit",
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  // Calculate current month stats
  const totalVisitors = mockMetrics.reduce((sum, m) => sum + m.visitors, 0)
  const avgConversionRate =
    mockMetrics.reduce((sum, m) => sum + Number.parseFloat(m.conversion_rate), 0) / mockMetrics.length
  const avgSeoScore = mockMetrics.reduce((sum, m) => sum + m.seo_score, 0) / mockMetrics.length
  const avgPerformanceScore = mockMetrics.reduce((sum, m) => sum + m.performance_score, 0) / mockMetrics.length
  const totalLeads = mockMetrics.reduce((sum, m) => sum + m.leads_generated, 0)
  const totalRevenue = mockMetrics.reduce((sum, m) => sum + Number.parseFloat(m.revenue), 0)

  // Prepare chart data
  const trafficData = mockMetrics.map((m) => ({
    date: new Date(m.metric_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    visitors: m.visitors,
  }))

  // Mock top pages data
  const topPagesData = [
    { page: "/", visitors: 12543, conversionRate: 3.2 },
    { page: "/products", visitors: 8234, conversionRate: 4.1 },
    { page: "/about", visitors: 6321, conversionRate: 2.8 },
    { page: "/contact", visitors: 4532, conversionRate: 5.3 },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Welcome back! Here&apos;s your overview for this month.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Visitors This Month"
          value={totalVisitors.toLocaleString()}
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Conversion Rate"
          value={`${avgConversionRate.toFixed(1)}%`}
          icon={TrendingUp}
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard title="SEO Score" value={Math.round(avgSeoScore)} icon={Search} />
        <StatCard title="Performance Score" value={Math.round(avgPerformanceScore)} icon={Zap} />
        <StatCard title="Leads Generated" value={totalLeads} icon={Target} />
        <StatCard title="Revenue" value={`$${totalRevenue.toLocaleString()}`} icon={DollarSign} />
      </div>

      {/* Charts and Tables */}
      <div className="grid gap-4 md:grid-cols-7">
        <TrafficChart data={trafficData} />
        <TopPagesTable data={topPagesData} />
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <RecentReports reports={mockReports} />
      </div>
    </div>
  )
}
