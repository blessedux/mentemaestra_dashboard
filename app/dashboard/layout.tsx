import type React from "react"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const mockClient = {
    company_name: "Demo Client Inc.",
    subscription_tier: "premium",
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/30 p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">MenteMaestra</h1>
          <p className="text-sm text-muted-foreground mt-1">{mockClient.company_name}</p>
        </div>
        <DashboardNav />
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
