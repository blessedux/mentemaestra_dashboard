/**
 * API Route: Get SEO Overview
 * 
 * Returns aggregated SEO metrics for a website
 */

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { SEOOverview } from "@/lib/types/seo"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const website_id = searchParams.get("website_id")

    if (!website_id) {
      return NextResponse.json({ error: "website_id is required" }, { status: 400 })
    }

    const today = new Date()
    const thirtyDaysAgo = new Date(today)
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const sixtyDaysAgo = new Date(today)
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)

    // Fetch Google Search Console metrics
    const { data: googleMetrics } = await supabase
      .from("google_search_metrics")
      .select("*")
      .eq("website_id", website_id)
      .gte("metric_date", thirtyDaysAgo.toISOString().split("T")[0])
      .order("metric_date", { ascending: false })

    const { data: googleMetricsPrevious } = await supabase
      .from("google_search_metrics")
      .select("*")
      .eq("website_id", website_id)
      .gte("metric_date", sixtyDaysAgo.toISOString().split("T")[0])
      .lt("metric_date", thirtyDaysAgo.toISOString().split("T")[0])
      .order("metric_date", { ascending: false })

    // Fetch LLM metrics
    const { data: llmMetrics } = await supabase
      .from("llm_search_metrics")
      .select("*")
      .eq("website_id", website_id)
      .gte("metric_date", thirtyDaysAgo.toISOString().split("T")[0])
      .order("metric_date", { ascending: false })

    const { data: llmMetricsPrevious } = await supabase
      .from("llm_search_metrics")
      .select("*")
      .eq("website_id", website_id)
      .gte("metric_date", sixtyDaysAgo.toISOString().split("T")[0])
      .lt("metric_date", thirtyDaysAgo.toISOString().split("T")[0])
      .order("metric_date", { ascending: false })

    // Fetch keywords
    const { data: keywords } = await supabase
      .from("seo_keywords")
      .select("*")
      .eq("website_id", website_id)
      .order("metric_date", { ascending: false })
      .limit(100)

    // Fetch recommendations
    const { data: recommendations } = await supabase
      .from("seo_recommendations")
      .select("*")
      .eq("website_id", website_id)

    // Calculate Google metrics
    const totalClicks = googleMetrics?.reduce((sum, m) => sum + m.clicks, 0) || 0
    const totalImpressions = googleMetrics?.reduce((sum, m) => sum + m.impressions, 0) || 0
    const avgCtr = totalImpressions > 0 ? totalClicks / totalImpressions : 0
    const avgPosition =
      googleMetrics?.reduce((sum, m) => sum + m.average_position, 0) / (googleMetrics?.length || 1) || 0

    const prevClicks = googleMetricsPrevious?.reduce((sum, m) => sum + m.clicks, 0) || 0
    const prevImpressions = googleMetricsPrevious?.reduce((sum, m) => sum + m.impressions, 0) || 0
    const prevAvgCtr = prevImpressions > 0 ? prevClicks / prevImpressions : 0
    const prevAvgPosition =
      googleMetricsPrevious?.reduce((sum, m) => sum + m.average_position, 0) /
        (googleMetricsPrevious?.length || 1) || 0

    // Calculate LLM metrics
    const totalMentions = llmMetrics?.reduce((sum, m) => sum + m.mentions, 0) || 0
    const totalCitations = llmMetrics?.reduce((sum, m) => sum + m.citations, 0) || 0
    const totalClickThroughs = llmMetrics?.reduce((sum, m) => sum + m.click_throughs, 0) || 0
    const avgRankingScore =
      llmMetrics?.reduce((sum, m) => sum + m.ranking_score, 0) / (llmMetrics?.length || 1) || 0

    const prevMentions = llmMetricsPrevious?.reduce((sum, m) => sum + m.mentions, 0) || 0
    const prevCitations = llmMetricsPrevious?.reduce((sum, m) => sum + m.citations, 0) || 0
    const prevClickThroughs = llmMetricsPrevious?.reduce((sum, m) => sum + m.click_throughs, 0) || 0

    // Group LLM metrics by provider
    const llmByProvider: Record<string, { mentions: number; citations: number; click_throughs: number }> = {}
    llmMetrics?.forEach((m) => {
      if (!llmByProvider[m.provider]) {
        llmByProvider[m.provider] = { mentions: 0, citations: 0, click_throughs: 0 }
      }
      llmByProvider[m.provider].mentions += m.mentions
      llmByProvider[m.provider].citations += m.citations
      llmByProvider[m.provider].click_throughs += m.click_throughs
    })

    // Calculate keyword stats
    const rankingImprovements =
      keywords?.filter((k) => k.current_rank && k.previous_rank && k.current_rank < k.previous_rank).length || 0
    const rankingDeclines =
      keywords?.filter((k) => k.current_rank && k.previous_rank && k.current_rank > k.previous_rank).length || 0

    const topKeywords = keywords
      ?.filter((k) => k.current_rank && k.current_rank <= 10)
      .sort((a, b) => (a.current_rank || 100) - (b.current_rank || 100))
      .slice(0, 10) || []

    // Calculate recommendation stats
    const recPending = recommendations?.filter((r) => r.status === "pending").length || 0
    const recInProgress = recommendations?.filter((r) => r.status === "in_progress").length || 0
    const recCompleted = recommendations?.filter((r) => r.status === "completed").length || 0
    const recCritical = recommendations?.filter((r) => r.priority === "critical").length || 0

    const overview: SEOOverview = {
      google: {
        total_clicks: totalClicks,
        total_impressions: totalImpressions,
        average_ctr: avgCtr,
        average_position: avgPosition,
        trend: {
          clicks: prevClicks > 0 ? ((totalClicks - prevClicks) / prevClicks) * 100 : 0,
          impressions: prevImpressions > 0 ? ((totalImpressions - prevImpressions) / prevImpressions) * 100 : 0,
          ctr: prevAvgCtr > 0 ? ((avgCtr - prevAvgCtr) / prevAvgCtr) * 100 : 0,
          position: prevAvgPosition > 0 ? ((prevAvgPosition - avgPosition) / prevAvgPosition) * 100 : 0, // Inverted because lower is better
        },
      },
      llm: {
        total_mentions: totalMentions,
        total_citations: totalCitations,
        total_click_throughs: totalClickThroughs,
        average_ranking_score: avgRankingScore,
        by_provider: llmByProvider,
        trend: {
          mentions: prevMentions > 0 ? ((totalMentions - prevMentions) / prevMentions) * 100 : 0,
          citations: prevCitations > 0 ? ((totalCitations - prevCitations) / prevCitations) * 100 : 0,
          click_throughs: prevClickThroughs > 0 ? ((totalClickThroughs - prevClickThroughs) / prevClickThroughs) * 100 : 0,
        },
      },
      keywords: {
        total_tracked: keywords?.length || 0,
        ranking_improvements: rankingImprovements,
        ranking_declines: rankingDeclines,
        top_keywords: topKeywords as any,
      },
      recommendations: {
        pending: recPending,
        in_progress: recInProgress,
        completed: recCompleted,
        critical: recCritical,
      },
    }

    return NextResponse.json(overview)
  } catch (error: any) {
    console.error("Error fetching SEO overview:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
