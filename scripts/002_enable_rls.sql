-- Enable Row Level Security on all tables
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Clients policies
CREATE POLICY "Users can view their own client profile"
  ON public.clients FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own client profile"
  ON public.clients FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own client profile"
  ON public.clients FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Websites policies
CREATE POLICY "Users can view their own websites"
  ON public.websites FOR SELECT
  USING (client_id = auth.uid());

CREATE POLICY "Users can insert their own websites"
  ON public.websites FOR INSERT
  WITH CHECK (client_id = auth.uid());

CREATE POLICY "Users can update their own websites"
  ON public.websites FOR UPDATE
  USING (client_id = auth.uid());

CREATE POLICY "Users can delete their own websites"
  ON public.websites FOR DELETE
  USING (client_id = auth.uid());

-- Metrics policies
CREATE POLICY "Users can view metrics for their websites"
  ON public.metrics FOR SELECT
  USING (website_id IN (SELECT id FROM public.websites WHERE client_id = auth.uid()));

-- Reports policies
CREATE POLICY "Users can view their own reports"
  ON public.reports FOR SELECT
  USING (client_id = auth.uid());

-- Tickets policies
CREATE POLICY "Users can view their own tickets"
  ON public.tickets FOR SELECT
  USING (client_id = auth.uid());

CREATE POLICY "Users can create their own tickets"
  ON public.tickets FOR INSERT
  WITH CHECK (client_id = auth.uid());

CREATE POLICY "Users can update their own tickets"
  ON public.tickets FOR UPDATE
  USING (client_id = auth.uid());

-- Ticket comments policies
CREATE POLICY "Users can view comments on their tickets"
  ON public.ticket_comments FOR SELECT
  USING (ticket_id IN (SELECT id FROM public.tickets WHERE client_id = auth.uid()));

CREATE POLICY "Users can create comments on their tickets"
  ON public.ticket_comments FOR INSERT
  WITH CHECK (ticket_id IN (SELECT id FROM public.tickets WHERE client_id = auth.uid()) AND user_id = auth.uid());

-- Ticket attachments policies
CREATE POLICY "Users can view attachments on their tickets"
  ON public.ticket_attachments FOR SELECT
  USING (ticket_id IN (SELECT id FROM public.tickets WHERE client_id = auth.uid()));

CREATE POLICY "Users can create attachments on their tickets"
  ON public.ticket_attachments FOR INSERT
  WITH CHECK (ticket_id IN (SELECT id FROM public.tickets WHERE client_id = auth.uid()));

-- Brand assets policies
CREATE POLICY "Users can view their own brand assets"
  ON public.brand_assets FOR SELECT
  USING (client_id = auth.uid());

-- Payment details policies
CREATE POLICY "Users can view their own payment details"
  ON public.payment_details FOR SELECT
  USING (client_id = auth.uid());

CREATE POLICY "Users can update their own payment details"
  ON public.payment_details FOR UPDATE
  USING (client_id = auth.uid());

-- Team members policies
CREATE POLICY "Users can view their team members"
  ON public.team_members FOR SELECT
  USING (client_id = auth.uid());

CREATE POLICY "Users can manage their team members"
  ON public.team_members FOR ALL
  USING (client_id = auth.uid());
