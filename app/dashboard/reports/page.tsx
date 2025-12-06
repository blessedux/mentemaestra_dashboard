import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, ExternalLink, FileText } from "lucide-react"
import Link from "next/link"

export default async function ReportsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch all reports for the client
  const { data: reports } = await supabase
    .from("reports")
    .select("*, websites(name)")
    .eq("client_id", user.id)
    .order("created_at", { ascending: false })

  const getReportTypeBadge = (type: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      weekly: { variant: "default", label: "Weekly" },
      "bi-weekly": { variant: "secondary", label: "Bi-Weekly" },
      lighthouse: { variant: "outline", label: "Lighthouse" },
      "seo-anomalies": { variant: "destructive", label: "SEO Anomalies" },
    }
    return variants[type] || { variant: "default", label: type }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
          <p className="text-muted-foreground">View and download your analytics reports</p>
        </div>
      </div>

      <div className="grid gap-4">
        {!reports || reports.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">No reports available yet</p>
            </CardContent>
          </Card>
        ) : (
          reports.map((report: any) => (
            <Card key={report.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      {report.title}
                      <Badge variant={getReportTypeBadge(report.report_type).variant}>
                        {getReportTypeBadge(report.report_type).label}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {report.websites?.name && `${report.websites.name} • `}
                      {new Date(report.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {report.file_url && (
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        PDF
                      </Button>
                    )}
                    <Button size="sm" asChild>
                      <Link href={`/dashboard/reports/${report.id}`}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {report.content && (
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    {report.content.summary && <p>{report.content.summary}</p>}
                    {report.content.recommendations && (
                      <div className="mt-2">
                        <p className="font-medium text-foreground">Key Recommendations:</p>
                        <ul className="list-disc list-inside mt-1">
                          {report.content.recommendations.slice(0, 3).map((rec: string, idx: number) => (
                            <li key={idx}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {report.content.scores && (
                      <div className="mt-2 flex gap-4">
                        {Object.entries(report.content.scores).map(([key, value]) => (
                          <div key={key} className="text-xs">
                            <span className="font-medium capitalize">{key}: </span>
                            <span>{value as string}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
