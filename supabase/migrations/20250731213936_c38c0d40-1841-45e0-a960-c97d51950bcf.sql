-- Create admins table with simple email/password (no encryption)
CREATE TABLE public.admins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Create policies for admins table
CREATE POLICY "Admins can view all admins" 
ON public.admins 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.admins a 
  WHERE a.email = auth.jwt() ->> 'email'
));

CREATE POLICY "Admins can manage all admins" 
ON public.admins 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.admins a 
  WHERE a.email = auth.jwt() ->> 'email'
));

-- Insert default admin
INSERT INTO public.admins (email, password, name) 
VALUES ('admin@studyway.com', 'admin123', 'المدير الرئيسي');

-- Add trigger for updated_at
CREATE TRIGGER update_admins_updated_at
BEFORE UPDATE ON public.admins
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();