-- This script seeds sample data for testing
-- Note: This assumes a user with the given ID exists in auth.users
-- In production, this would be replaced with real client data

-- Sample client ID (replace with your actual test user ID after signup)
-- This is just for demonstration purposes
DO $$
DECLARE
  sample_client_id UUID;
  sample_website_id UUID;
  sample_ticket_id UUID;
BEGIN
  -- Get the first client (or you can specify a specific one)
  SELECT id INTO sample_client_id FROM public.clients LIMIT 1;
  
  -- Only seed if we have at least one client
  IF sample_client_id IS NOT NULL THEN
    -- Insert sample website
    INSERT INTO public.websites (client_id, url, name)
    VALUES (sample_client_id, 'https://example.com', 'Example Website')
    ON CONFLICT (client_id, url) DO NOTHING
    RETURNING id INTO sample_website_id;
    
    -- If website was just created, add metrics
    IF sample_website_id IS NOT NULL THEN
      -- Insert sample metrics for the last 30 days
      INSERT INTO public.metrics (website_id, metric_date, visitors, conversion_rate, seo_score, performance_score, leads_generated, revenue)
      SELECT 
        sample_website_id,
        CURRENT_DATE - (n || ' days')::INTERVAL,
        (RANDOM() * 1000 + 500)::INTEGER,
        (RANDOM() * 5 + 2)::DECIMAL(5,2),
        (RANDOM() * 20 + 80)::INTEGER,
        (RANDOM() * 15 + 85)::INTEGER,
        (RANDOM() * 50 + 10)::INTEGER,
        (RANDOM() * 5000 + 1000)::DECIMAL(12,2)
      FROM generate_series(0, 29) AS n
      ON CONFLICT (website_id, metric_date) DO NOTHING;
      
      -- Insert sample reports
      INSERT INTO public.reports (client_id, website_id, title, report_type, content, created_at)
      VALUES 
        (sample_client_id, sample_website_id, 'Weekly Performance Report', 'weekly', '{"summary": "Great performance this week!"}', NOW() - INTERVAL '7 days'),
        (sample_client_id, sample_website_id, 'Bi-weekly Growth Strategy', 'bi-weekly', '{"recommendations": ["Improve mobile experience", "Add more content"]}', NOW() - INTERVAL '14 days'),
        (sample_client_id, sample_website_id, 'Lighthouse Performance Analysis', 'lighthouse', '{"scores": {"performance": 92, "accessibility": 95, "seo": 88}}', NOW() - INTERVAL '3 days')
      ON CONFLICT DO NOTHING;
      
      -- Insert sample tickets
      INSERT INTO public.tickets (client_id, website_id, title, description, status, priority)
      VALUES 
        (sample_client_id, sample_website_id, 'Update homepage hero section', 'Please update the hero section with new branding', 'open', 'high'),
        (sample_client_id, sample_website_id, 'Fix mobile menu bug', 'Mobile menu is not closing properly on iOS', 'in-progress', 'medium'),
        (sample_client_id, sample_website_id, 'SEO optimization for blog posts', 'Optimize meta tags and descriptions', 'done', 'low')
      ON CONFLICT DO NOTHING
      RETURNING id INTO sample_ticket_id;
      
      -- Insert sample brand assets
      INSERT INTO public.brand_assets (client_id, asset_type, name, metadata)
      VALUES 
        (sample_client_id, 'logo', 'Primary Logo', '{"format": "svg", "variations": ["light", "dark"]}'),
        (sample_client_id, 'color-palette', 'Brand Colors', '{"primary": "#3B82F6", "secondary": "#8B5CF6", "accent": "#10B981"}'),
        (sample_client_id, 'typography', 'Font System', '{"heading": "Inter", "body": "Open Sans"}')
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;
END $$;
