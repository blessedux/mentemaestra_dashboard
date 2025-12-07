-- Add version and updated_at columns to websites table
ALTER TABLE public.websites
ADD COLUMN IF NOT EXISTS version TEXT DEFAULT '1.0.0',
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Add requested_by column to tickets table
ALTER TABLE public.tickets
ADD COLUMN IF NOT EXISTS requested_by TEXT;

-- Create trigger to update websites.updated_at
CREATE TRIGGER IF NOT EXISTS update_websites_updated_at
BEFORE UPDATE ON public.websites
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update existing websites to have updated_at = created_at if null
UPDATE public.websites
SET updated_at = created_at
WHERE updated_at IS NULL;
