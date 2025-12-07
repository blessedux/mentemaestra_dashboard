// SEO-related TypeScript interfaces

export type SEODataSourceType = 
  | "google_search_console" 
  | "openai" 
  | "perplexity" 
  | "claude" 
  | "gemini"
  | "custom"

export type LLMProvider = "openai" | "perplexity" | "claude" | "gemini" | "custom"

export type RecommendationType = "content" | "technical" | "on_page" | "off_page" | "llm_optimization"
export type RecommendationPriority = "low" | "medium" | "high" | "critical"
export type RecommendationStatus = "pending" | "in_progress" | "completed" | "dismissed"
export type RecommendationImpact = "low" | "medium" | "high"

export interface SEODataSource {
  id: string
  website_id: string
  source_type: SEODataSourceType
  source_name: string
  credentials: Record<string, any> // Encrypted API keys, tokens, etc.
  is_active: boolean
  last_sync_at?: string
  sync_frequency: "hourly" | "daily" | "weekly"
  created_at: string
  updated_at: string
}

export interface GoogleSearchMetrics {
  id: string
  website_id: string
  metric_date: string
  clicks: number
  impressions: number
  ctr: number // Click-through rate (0-1)
  average_position: number
  created_at: string
}

export interface GoogleSearchQuery {
  id: string
  website_id: string
  query: string
  clicks: number
  impressions: number
  ctr: number
  average_position: number
  metric_date: string
  created_at: string
}

export interface GoogleSearchPage {
  id: string
  website_id: string
  page_url: string
  clicks: number
  impressions: number
  ctr: number
  average_position: number
  metric_date: string
  created_at: string
}

export interface LLMSearchMetrics {
  id: string
  website_id: string
  provider: LLMProvider
  metric_date: string
  mentions: number
  citations: number
  click_throughs: number
  ranking_score: number
  created_at: string
}

export interface LLMSearchQuery {
  id: string
  website_id: string
  provider: LLMProvider
  query: string
  mentions: number
  citations: number
  metric_date: string
  created_at: string
}

export interface SEOKeyword {
  id: string
  website_id: string
  keyword: string
  source: string
  current_rank?: number
  previous_rank?: number
  search_volume: number
  difficulty: number
  cpc?: number
  competition: "low" | "medium" | "high"
  metric_date: string
  created_at: string
  updated_at: string
}

export interface SEORecommendation {
  id: string
  website_id: string
  recommendation_type: RecommendationType
  priority: RecommendationPriority
  title: string
  description: string
  action_items: string[]
  expected_impact: RecommendationImpact
  status: RecommendationStatus
  created_at: string
  updated_at: string
}

// API Response Types
export interface GoogleSearchConsoleResponse {
  rows: Array<{
    keys: string[]
    clicks: number
    impressions: number
    ctr: number
    position: number
  }>
}

export interface LLMProviderResponse {
  provider: LLMProvider
  mentions: number
  citations: number
  queries: Array<{
    query: string
    mentions: number
    citations: number
  }>
}

// Aggregated Metrics for Dashboard
export interface SEOOverview {
  google: {
    total_clicks: number
    total_impressions: number
    average_ctr: number
    average_position: number
    trend: {
      clicks: number // Percentage change
      impressions: number
      ctr: number
      position: number
    }
  }
  llm: {
    total_mentions: number
    total_citations: number
    total_click_throughs: number
    average_ranking_score: number
    by_provider: Record<LLMProvider, {
      mentions: number
      citations: number
      click_throughs: number
    }>
    trend: {
      mentions: number
      citations: number
      click_throughs: number
    }
  }
  keywords: {
    total_tracked: number
    ranking_improvements: number
    ranking_declines: number
    top_keywords: SEOKeyword[]
  }
  recommendations: {
    pending: number
    in_progress: number
    completed: number
    critical: number
  }
}
