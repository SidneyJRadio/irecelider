-- Create table for footer links (social media and navigation)
CREATE TABLE public.footer_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('social', 'navigation', 'region')),
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.footer_links ENABLE ROW LEVEL SECURITY;

-- Public can read active links
CREATE POLICY "Footer links são públicos para leitura"
ON public.footer_links
FOR SELECT
USING (active = true);

-- Admins can manage footer links
CREATE POLICY "Admins podem gerenciar links do footer"
ON public.footer_links
FOR ALL
USING (is_admin_or_supervisor(auth.uid()))
WITH CHECK (is_admin_or_supervisor(auth.uid()));

-- Create trigger for updated_at
CREATE TRIGGER update_footer_links_updated_at
BEFORE UPDATE ON public.footer_links
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default social media links
INSERT INTO public.footer_links (type, label, url, icon, display_order) VALUES
('social', 'Instagram', '#', 'instagram', 1),
('social', 'YouTube', '#', 'youtube', 2),
('social', 'Facebook', '#', 'facebook', 3);

-- Insert default navigation links
INSERT INTO public.footer_links (type, label, url, display_order) VALUES
('navigation', 'Início', '/', 1),
('navigation', 'Notícias', '/noticias', 2),
('navigation', 'Comunicadores', '/comunicadores', 3),
('navigation', 'Contato', '/contato', 4);

-- Insert default region links
INSERT INTO public.footer_links (type, label, url, display_order) VALUES
('region', 'Irecê', '/noticias/irece', 1),
('region', 'Chapada Diamantina', '/noticias/chapada', 2),
('region', 'Regional', '/noticias/regional', 3),
('region', 'Bahia', '/noticias/bahia', 4);