import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, ExternalLink } from "lucide-react"
import Link from "next/link"
import type { Report } from "@/lib/types/database"

interface RecentReportsProps {
  reports: Report[]
}

export function RecentReports({ reports }: RecentReportsProps) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Reports</CardTitle>
        <CardDescription>Latest generated reports</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reports.length === 0 ? (
            <p className="text-sm text-muted-foreground">No reports available yet</p>
          ) : (
            reports.map((report) => (
              <div key={report.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{report.title}</p>
                    <p className="text-xs text-muted-foreground">{new Date(report.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" asChild>
                    <Link href={`/dashboard/reports/${report.id}`}>
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
        <Button variant="outline" className="w-full mt-4 bg-transparent" asChild>
          <Link href="/dashboard/reports">View All Reports</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
