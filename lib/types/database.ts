export interface Client {
  id: string
  company_name: string
  subscription_tier: "basic" | "premium" | "enterprise"
  created_at: string
  updated_at: string
}

export interface Website {
  id: string
  client_id: string
  url: string
  name: string
  created_at: string
}

export interface Metric {
  id: string
  website_id: string
  metric_date: string
  visitors: number
  conversion_rate: number
  seo_score: number
  performance_score: number
  leads_generated: number
  revenue: number
  created_at: string
}

export interface Report {
  id: string
  client_id: string
  website_id?: string
  title: string
  report_type: "weekly" | "bi-weekly" | "lighthouse" | "seo-anomalies"
  content: Record<string, any>
  file_url?: string
  created_at: string
}

export interface Ticket {
  id: string
  client_id: string
  website_id?: string
  title: string
  description?: string
  status: "open" | "in-progress" | "done"
  priority: "low" | "medium" | "high"
  created_at: string
  updated_at: string
}

export interface TicketComment {
  id: string
  ticket_id: string
  user_id: string
  comment: string
  created_at: string
}

export interface TicketAttachment {
  id: string
  ticket_id: string
  file_url: string
  file_name: string
  file_type?: string
  created_at: string
}

export interface BrandAsset {
  id: string
  client_id: string
  asset_type: "logo" | "color-palette" | "typography" | "template" | "animation"
  name: string
  file_url?: string
  metadata?: Record<string, any>
  created_at: string
}

export interface PaymentDetails {
  id: string
  client_id: string
  stripe_customer_id?: string
  last_four?: string
  card_brand?: string
  created_at: string
  updated_at: string
}

export interface TeamMember {
  id: string
  client_id: string
  email: string
  name: string
  role: "member" | "admin"
  invited_at: string
}
