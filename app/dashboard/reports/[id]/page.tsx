import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, ArrowLeft, Plus } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch the specific report
  const { data: report } = await supabase
    .from("reports")
    .select("*, websites(name, url)")
    .eq("id", id)
    .eq("client_id", user.id)
    .single()

  if (!report) {
    notFound()
  }

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
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/reports">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
        </div>
        <div className="flex gap-2">
          {report.file_url && (
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          )}
          <Button asChild>
            <Link href="/dashboard/tickets/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Task
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-2xl">{report.title}</CardTitle>
              <Badge variant={getReportTypeBadge(report.report_type).variant}>
                {getReportTypeBadge(report.report_type).label}
              </Badge>
            </div>
            <CardDescription>
              {report.websites?.name && (
                <>
                  {report.websites.name} ({report.websites.url}) •{" "}
                </>
              )}
              {new Date(report.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Report Content */}
          {report.content?.summary && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Executive Summary</h3>
              <p className="text-muted-foreground">{report.content.summary}</p>
            </div>
          )}

          {report.content?.scores && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Performance Scores</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Object.entries(report.content.scores).map(([key, value]) => (
                  <Card key={key}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium capitalize">{key}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{value as string}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {report.content?.recommendations && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Recommendations</h3>
              <ul className="space-y-2">
                {report.content.recommendations.map((rec: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {report.content?.metrics && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Key Metrics</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(report.content.metrics).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="text-sm font-medium capitalize">{key.replace(/_/g, " ")}</span>
                    <span className="text-lg font-semibold">{value as string}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!report.content && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No detailed content available for this report.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
