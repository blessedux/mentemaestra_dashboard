# SEO Integration Guide

This document explains how to set up and use the SEO integration system for tracking Google Search Console and LLM/AI provider metrics.

## Overview

The SEO integration system allows you to:

- Track Google Search Console metrics (clicks, impressions, CTR, position)
- Monitor AI/LLM search performance (mentions, citations, click-throughs)
- Track keyword rankings across different sources
- Receive AI-generated SEO recommendations
- View real-time SEO analytics in the dashboard

## Database Setup

First, run the database migration to create the necessary tables:

```sql
-- Run this script in your Supabase SQL editor
\i scripts/006_create_seo_schema.sql
```

This creates the following tables:

- `seo_data_sources` - Configuration for data sources
- `google_search_metrics` - Daily Google Search Console metrics
- `google_search_queries` - Top performing search queries
- `google_search_pages` - Top performing pages
- `llm_search_metrics` - AI/LLM provider metrics
- `llm_search_queries` - Queries that led to website mentions
- `seo_keywords` - Keyword tracking
- `seo_recommendations` - AI-generated optimization suggestions

## Setting Up Data Sources

### Google Search Console

1. **Create a Google Cloud Project**

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable Search Console API**

   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Search Console API"
   - Click "Enable"

3. **Create OAuth 2.0 Credentials**

   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs
   - Save the Client ID and Client Secret

4. **Get Access Token**

   - Use OAuth 2.0 flow to get an access token
   - You can use tools like [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
   - Scope needed: `https://www.googleapis.com/auth/webmasters.readonly`

5. **Add to Dashboard**
   - Go to Dashboard > SEO > Settings
   - Click "Add Source"
   - Select "Google Search Console"
   - Enter:
     - **Access Token**: Your OAuth access token
     - **Property URL**: Your Search Console property (e.g., `sc-domain:example.com` or `https://example.com`)

### LLM Providers (OpenAI, Perplexity, Claude, etc.)

Most LLM providers don't have public APIs for citation tracking. The system uses:

1. **API Keys** (if available)

   - Some providers may offer APIs for tracking
   - Enter API keys in the settings page

2. **Monitoring Services**

   - Use third-party services that track AI citations
   - Set up webhooks to receive citation events

3. **Custom Integrations**
   - Build custom scrapers or monitoring tools
   - Send data via the API endpoints

## API Endpoints

### Sync SEO Data

```bash
POST /api/seo/sync
Content-Type: application/json

{
  "website_id": "uuid",
  "source_type": "google_search_console" | "openai" | "perplexity" | etc.
}
```

This endpoint:

- Fetches data from the specified source
- Stores metrics in the database
- Updates the last sync timestamp

### Get SEO Overview

```bash
GET /api/seo/overview?website_id=uuid
```

Returns aggregated SEO metrics including:

- Google Search Console metrics with trends
- LLM provider metrics by provider
- Keyword statistics
- Recommendation counts

## Usage

### Manual Sync

1. Go to Dashboard > SEO
2. Click "Sync Data" button
3. Wait for the sync to complete
4. View updated metrics

### Automatic Sync

Set up a cron job or scheduled task to call the sync endpoint:

```bash
# Example cron job (daily at 2 AM)
0 2 * * * curl -X POST https://your-domain.com/api/seo/sync \
  -H "Content-Type: application/json" \
  -d '{"website_id":"your-website-id","source_type":"google_search_console"}'
```

### Viewing Metrics

1. Navigate to Dashboard > SEO
2. View overview metrics in the "Overview" tab
3. Switch to specific tabs for detailed views:
   - **Google Search**: Google Search Console details
   - **AI/LLM Search**: Performance across AI providers
   - **Keywords**: Top ranking keywords
   - **Recommendations**: AI-generated optimization suggestions

## LLM/AI Tracking

Since most LLM providers don't offer public APIs for citation tracking, the system includes:

1. **Mock Data** for development/testing
2. **Webhook Support** for real-time citation events
3. **Custom Integration Points** for third-party services

To implement real LLM tracking:

1. Use citation monitoring services (e.g., Originality.ai, specialized SEO tools)
2. Set up webhooks to receive citation events
3. Call the tracking API when citations are detected
4. Use the `trackCitation` function in `lib/services/llm-providers.ts`

## Recommendations

The system automatically generates SEO recommendations based on:

- Low citation rates in AI responses
- Poor AI ranking scores
- High-performing queries that could be optimized
- Keyword ranking changes

Recommendations are stored in the `seo_recommendations` table and displayed in the dashboard.

## Troubleshooting

### Google Search Console API Errors

- **401 Unauthorized**: Access token expired, refresh it
- **403 Forbidden**: Check API permissions and OAuth scopes
- **404 Not Found**: Verify property URL is correct

### No Data Showing

1. Check data source is active in Settings
2. Verify last sync timestamp
3. Manually trigger a sync
4. Check browser console for errors

### LLM Metrics Not Updating

- LLM tracking requires custom integrations
- Use mock data for development
- Set up monitoring services for production

## Next Steps

1. **Set up Google Search Console** integration
2. **Configure LLM providers** (if APIs available)
3. **Set up automated syncing** via cron jobs
4. **Monitor recommendations** and implement optimizations
5. **Track keyword rankings** over time

## Development Notes

- Mock data is available for testing without API credentials
- All services include error handling and logging
- Database schema supports multiple websites and sources
- API routes include proper authentication checks
