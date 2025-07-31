-- Add missing columns to countries table
ALTER TABLE public.countries ADD COLUMN IF NOT EXISTS capital TEXT;
ALTER TABLE public.countries ADD COLUMN IF NOT EXISTS population BIGINT;
ALTER TABLE public.countries ADD COLUMN IF NOT EXISTS acceptance_rate DECIMAL(5,2);
ALTER TABLE public.countries ADD COLUMN IF NOT EXISTS living_cost INTEGER;

-- Update universities table to match interface
ALTER TABLE public.universities ADD COLUMN IF NOT EXISTS website TEXT;

-- Drop the old site_settings table and create a new one with proper structure
DROP TABLE IF EXISTS public.site_settings CASCADE;

CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  site_name TEXT DEFAULT 'StudyWay',
  site_logo TEXT,
  phone TEXT,
  email TEXT,
  whatsapp TEXT,
  address TEXT,
  about_description TEXT,
  primary_color TEXT DEFAULT '#3B82F6',
  secondary_color TEXT DEFAULT '#10B981',
  accent_color TEXT DEFAULT '#F59E0B',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for site_settings
CREATE POLICY "Site settings are viewable by everyone" 
ON public.site_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can update site settings" 
ON public.site_settings 
FOR UPDATE 
USING (true);

CREATE POLICY "Admins can insert site settings" 
ON public.site_settings 
FOR INSERT 
WITH CHECK (true);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default settings
INSERT INTO public.site_settings (site_name, phone, email, whatsapp, address, about_description)
VALUES (
  'StudyWay',
  '+1234567890',
  'info@studyway.com',
  '+1234567890',
  '123 Education Street, City, Country',
  'موقع StudyWay هو منصتك الموثوقة للدراسة في الخارج. نحن نقدم خدمات شاملة لمساعدة الطلاب في العثور على أفضل الجامعات والبرامج الدراسية حول العالم. فريقنا من الخبراء جاهز لمساعدتك في كل خطوة من رحلتك التعليمية، من اختيار التخصص المناسب إلى إكمال إجراءات القبول والحصول على التأشيرة. نحن ملتزمون بجعل حلم الدراسة في الخارج حقيقة لكل طالب طموح.'
);