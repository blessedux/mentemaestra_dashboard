"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, TrendingUp, TrendingDown, Search, Bot, AlertCircle, RefreshCw } from "lucide-react"
import { useSelectedProject } from "@/lib/hooks/use-selected-project"
import type { SEOOverview } from "@/lib/types/seo"

export default function SEOPage() {
  const { selectedProjectId } = useSelectedProject()
  const [overview, setOverview] = useState<SEOOverview | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)

  useEffect(() => {
    if (selectedProjectId) {
      fetchSEOOverview()
    }
  }, [selectedProjectId])

  const fetchSEOOverview = async () => {
    if (!selectedProjectId) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/seo/overview?website_id=${selectedProjectId}`)
      if (response.ok) {
        const data = await response.json()
        setOverview(data)
      }
    } catch (error) {
      console.error("Error fetching SEO overview:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSync = async () => {
    if (!selectedProjectId) return

    setIsSyncing(true)
    try {
      const response = await fetch("/api/seo/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ website_id: selectedProjectId }),
      })

      if (response.ok) {
        // Refresh overview after sync
        await fetchSEOOverview()
      }
    } catch (error) {
      console.error("Error syncing SEO data:", error)
    } finally {
      setIsSyncing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!overview) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">SEO Analytics</h2>
            <p className="text-muted-foreground">Track your search performance across Google and AI providers</p>
          </div>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center mb-4">No SEO data available</p>
            <Button onClick={handleSync} disabled={isSyncing}>
              {isSyncing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Sync Data
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const TrendIndicator = ({ value }: { value: number }) => {
    const isPositive = value > 0
    return (
      <div className={`flex items-center gap-1 text-sm ${isPositive ? "text-green-600" : "text-red-600"}`}>
        {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
        <span>{Math.abs(value).toFixed(1)}%</span>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">SEO Analytics</h2>
          <p className="text-muted-foreground">Track your search performance across Google and AI providers</p>
        </div>
        <Button onClick={handleSync} disabled={isSyncing} variant="outline">
          {isSyncing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Sync Data
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="google">Google Search</TabsTrigger>
          <TabsTrigger value="llm">AI/LLM Search</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Google Search Metrics */}
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Search className="h-5 w-5" />
              Google Search Console
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{overview.google.total_clicks.toLocaleString()}</div>
                  <TrendIndicator value={overview.google.trend.clicks} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{overview.google.total_impressions.toLocaleString()}</div>
                  <TrendIndicator value={overview.google.trend.impressions} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Average CTR</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{(overview.google.average_ctr * 100).toFixed(2)}%</div>
                  <TrendIndicator value={overview.google.trend.ctr} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Average Position</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{overview.google.average_position.toFixed(1)}</div>
                  <TrendIndicator value={overview.google.trend.position} />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* LLM/AI Search Metrics */}
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI/LLM Search Performance
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Mentions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{overview.llm.total_mentions.toLocaleString()}</div>
                  <TrendIndicator value={overview.llm.trend.mentions} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Citations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{overview.llm.total_citations.toLocaleString()}</div>
                  <TrendIndicator value={overview.llm.trend.citations} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Click Throughs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{overview.llm.total_click_throughs.toLocaleString()}</div>
                  <TrendIndicator value={overview.llm.trend.click_throughs} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">AI Ranking Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{overview.llm.average_ranking_score.toFixed(1)}</div>
                  <p className="text-xs text-muted-foreground mt-1">Out of 100</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Keywords Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Keywords Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">Total Tracked</p>
                  <p className="text-2xl font-bold">{overview.keywords.total_tracked}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ranking Improvements</p>
                  <p className="text-2xl font-bold text-green-600">{overview.keywords.ranking_improvements}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ranking Declines</p>
                  <p className="text-2xl font-bold text-red-600">{overview.keywords.ranking_declines}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                SEO Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{overview.recommendations.pending}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold">{overview.recommendations.in_progress}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{overview.recommendations.completed}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Critical</p>
                  <p className="text-2xl font-bold text-red-600">{overview.recommendations.critical}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="google" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Google Search Console Details</CardTitle>
              <CardDescription>Detailed metrics from Google Search Console</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Detailed Google Search Console data will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="llm" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI/LLM Search Details</CardTitle>
              <CardDescription>Performance across different AI providers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(overview.llm.by_provider).map(([provider, data]) => (
                  <div key={provider} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium capitalize">{provider}</p>
                      <p className="text-sm text-muted-foreground">
                        {data.mentions} mentions • {data.citations} citations
                      </p>
                    </div>
                    <Badge variant="outline">{data.click_throughs} clicks</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keywords" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Ranking Keywords</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {overview.keywords.top_keywords.slice(0, 10).map((keyword, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{keyword.keyword}</p>
                      <p className="text-sm text-muted-foreground">Position: {keyword.current_rank}</p>
                    </div>
                    <Badge variant="outline">{keyword.source}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SEO Recommendations</CardTitle>
              <CardDescription>AI-generated optimization suggestions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Recommendations will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
