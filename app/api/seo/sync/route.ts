/**
 * API Route: Sync SEO Data
 * 
 * This endpoint syncs SEO data from various sources:
 * - Google Search Console
 * - LLM providers (OpenAI, Perplexity, etc.)
 * 
 * Can be called manually or via cron job
 */

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { fetchSearchAnalytics, transformSearchAnalytics, fetchQueries, fetchPages } from "@/lib/services/google-search-console"
import { fetchLLMMetrics, fetchLLMQueries } from "@/lib/services/llm-providers"
import type { SEODataSource } from "@/lib/types/seo"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { website_id, source_type } = body

    if (!website_id) {
      return NextResponse.json({ error: "website_id is required" }, { status: 400 })
    }

    // Fetch the data source configuration
    const { data: dataSource, error: sourceError } = await supabase
      .from("seo_data_sources")
      .select("*")
      .eq("website_id", website_id)
      .eq("source_type", source_type || "google_search_console")
      .eq("is_active", true)
      .single()

    if (sourceError || !dataSource) {
      return NextResponse.json(
        { error: "Data source not found or inactive" },
        { status: 404 }
      )
    }

    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const startDate = new Date(today)
    startDate.setDate(startDate.getDate() - 30) // Last 30 days

    const dateStr = yesterday.toISOString().split("T")[0]
    const startDateStr = startDate.toISOString().split("T")[0]

    if (dataSource.source_type === "google_search_console") {
      // Sync Google Search Console data
      const config = {
        access_token: dataSource.credentials.access_token,
        property_url: dataSource.credentials.property_url,
      }

      // Fetch metrics
      const analyticsData = await fetchSearchAnalytics(config, {
        startDate: startDateStr,
        endDate: dateStr,
      })

      const metrics = transformSearchAnalytics(analyticsData, website_id, dateStr)

      // Upsert metrics
      await supabase.from("google_search_metrics").upsert(metrics, {
        onConflict: "website_id,metric_date",
      })

      // Fetch and store queries
      const queries = await fetchQueries(config, startDateStr, dateStr)
      for (const query of queries) {
        query.website_id = website_id
        await supabase.from("google_search_queries").upsert(query, {
          onConflict: "website_id,query,metric_date",
        })
      }

      // Fetch and store pages
      const pages = await fetchPages(config, startDateStr, dateStr)
      for (const page of pages) {
        page.website_id = website_id
        await supabase.from("google_search_pages").upsert(page, {
          onConflict: "website_id,page_url,metric_date",
        })
      }

      // Update last_sync_at
      await supabase
        .from("seo_data_sources")
        .update({ last_sync_at: new Date().toISOString() })
        .eq("id", dataSource.id)

      return NextResponse.json({
        success: true,
        message: "Google Search Console data synced successfully",
        metrics,
      })
    } else if (["openai", "perplexity", "claude", "gemini"].includes(dataSource.source_type)) {
      // Sync LLM provider data
      const website = await supabase
        .from("websites")
        .select("url")
        .eq("id", website_id)
        .single()

      if (!website.data) {
        return NextResponse.json({ error: "Website not found" }, { status: 404 })
      }

      const config = {
        provider: dataSource.source_type as any,
        api_key: dataSource.credentials?.api_key,
        monitoring_enabled: true,
      }

      const metrics = await fetchLLMMetrics(config, website.data.url, startDateStr, dateStr)
      metrics.website_id = website_id

      // Upsert LLM metrics
      await supabase.from("llm_search_metrics").upsert(metrics, {
        onConflict: "website_id,provider,metric_date",
      })

      // Fetch and store queries
      const queries = await fetchLLMQueries(config, website.data.url, startDateStr, dateStr)
      for (const query of queries) {
        query.website_id = website_id
        await supabase.from("llm_search_queries").upsert(query, {
          onConflict: "website_id,provider,query,metric_date",
        })
      }

      // Update last_sync_at
      await supabase
        .from("seo_data_sources")
        .update({ last_sync_at: new Date().toISOString() })
        .eq("id", dataSource.id)

      return NextResponse.json({
        success: true,
        message: `${dataSource.source_type} data synced successfully`,
        metrics,
      })
    }

    return NextResponse.json({ error: "Unsupported source type" }, { status: 400 })
  } catch (error: any) {
    console.error("Error syncing SEO data:", error)
    return NextResponse.json(
      { error: error.message || "Failed to sync SEO data" },
      { status: 500 }
    )
  }
}

// GET endpoint to check sync status
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const website_id = searchParams.get("website_id")

    if (!website_id) {
      return NextResponse.json({ error: "website_id is required" }, { status: 400 })
    }

    const { data: sources, error } = await supabase
      .from("seo_data_sources")
      .select("*")
      .eq("website_id", website_id)
      .eq("is_active", true)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ sources })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
