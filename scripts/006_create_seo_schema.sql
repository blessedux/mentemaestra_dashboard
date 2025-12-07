-- SEO Integration Schema
-- Supports Google Search Console and LLM/AI search providers

-- SEO Data Sources (Google Search Console, OpenAI, Perplexity, etc.)
CREATE TABLE IF NOT EXISTS public.seo_data_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  website_id UUID NOT NULL REFERENCES public.websites(id) ON DELETE CASCADE,
  source_type TEXT NOT NULL, -- 'google_search_console', 'openai', 'perplexity', 'claude', 'custom'
  source_name TEXT NOT NULL,
  credentials JSONB, -- Encrypted API keys, tokens, etc.
  is_active BOOLEAN DEFAULT true,
  last_sync_at TIMESTAMPTZ,
  sync_frequency TEXT DEFAULT 'daily', -- 'hourly', 'daily', 'weekly'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(website_id, source_type)
);

-- Google Search Console Metrics
CREATE TABLE IF NOT EXISTS public.google_search_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  website_id UUID NOT NULL REFERENCES public.websites(id) ON DELETE CASCADE,
  metric_date DATE NOT NULL,
  clicks INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  ctr DECIMAL(5,4) DEFAULT 0.0000, -- Click-through rate
  average_position DECIMAL(6,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(website_id, metric_date)
);

-- Google Search Console Queries (top performing queries)
CREATE TABLE IF NOT EXISTS public.google_search_queries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  website_id UUID NOT NULL REFERENCES public.websites(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  clicks INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  ctr DECIMAL(5,4) DEFAULT 0.0000,
  average_position DECIMAL(6,2) DEFAULT 0.00,
  metric_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(website_id, query, metric_date)
);

-- Google Search Console Pages (top performing pages)
CREATE TABLE IF NOT EXISTS public.google_search_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  website_id UUID NOT NULL REFERENCES public.websites(id) ON DELETE CASCADE,
  page_url TEXT NOT NULL,
  clicks INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  ctr DECIMAL(5,4) DEFAULT 0.0000,
  average_position DECIMAL(6,2) DEFAULT 0.00,
  metric_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(website_id, page_url, metric_date)
);

-- LLM/AI Search Metrics (OpenAI, Perplexity, Claude, etc.)
CREATE TABLE IF NOT EXISTS public.llm_search_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  website_id UUID NOT NULL REFERENCES public.websites(id) ON DELETE CASCADE,
  provider TEXT NOT NULL, -- 'openai', 'perplexity', 'claude', 'gemini', 'custom'
  metric_date DATE NOT NULL,
  mentions INTEGER DEFAULT 0, -- Number of times website is mentioned in AI responses
  citations INTEGER DEFAULT 0, -- Number of times website is cited as source
  click_throughs INTEGER DEFAULT 0, -- Estimated clicks from AI search results
  ranking_score DECIMAL(5,2) DEFAULT 0.00, -- AI-specific ranking score
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(website_id, provider, metric_date)
);

-- LLM Search Queries (queries that led to website mentions)
CREATE TABLE IF NOT EXISTS public.llm_search_queries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  website_id UUID NOT NULL REFERENCES public.websites(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  query TEXT NOT NULL,
  mentions INTEGER DEFAULT 0,
  citations INTEGER DEFAULT 0,
  metric_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(website_id, provider, query, metric_date)
);

-- SEO Keywords Tracking
CREATE TABLE IF NOT EXISTS public.seo_keywords (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  website_id UUID NOT NULL REFERENCES public.websites(id) ON DELETE CASCADE,
  keyword TEXT NOT NULL,
  source TEXT NOT NULL, -- 'google', 'openai', 'perplexity', etc.
  current_rank INTEGER, -- Current ranking position
  previous_rank INTEGER, -- Previous ranking position
  search_volume INTEGER DEFAULT 0,
  difficulty INTEGER DEFAULT 0, -- Keyword difficulty score (0-100)
  cpc DECIMAL(8,2), -- Cost per click
  competition TEXT, -- 'low', 'medium', 'high'
  metric_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(website_id, keyword, source, metric_date)
);

-- SEO Recommendations (AI-generated optimization suggestions)
CREATE TABLE IF NOT EXISTS public.seo_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  website_id UUID NOT NULL REFERENCES public.websites(id) ON DELETE CASCADE,
  recommendation_type TEXT NOT NULL, -- 'content', 'technical', 'on_page', 'off_page', 'llm_optimization'
  priority TEXT NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  action_items JSONB, -- Array of specific actions to take
  expected_impact TEXT, -- 'low', 'medium', 'high'
  status TEXT DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'dismissed'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_google_search_metrics_website_date ON public.google_search_metrics(website_id, metric_date DESC);
CREATE INDEX IF NOT EXISTS idx_google_search_queries_website_date ON public.google_search_queries(website_id, metric_date DESC);
CREATE INDEX IF NOT EXISTS idx_google_search_pages_website_date ON public.google_search_pages(website_id, metric_date DESC);
CREATE INDEX IF NOT EXISTS idx_llm_search_metrics_website_provider_date ON public.llm_search_metrics(website_id, provider, metric_date DESC);
CREATE INDEX IF NOT EXISTS idx_llm_search_queries_website_provider_date ON public.llm_search_queries(website_id, provider, metric_date DESC);
CREATE INDEX IF NOT EXISTS idx_seo_keywords_website_source_date ON public.seo_keywords(website_id, source, metric_date DESC);
CREATE INDEX IF NOT EXISTS idx_seo_data_sources_website ON public.seo_data_sources(website_id, is_active);
