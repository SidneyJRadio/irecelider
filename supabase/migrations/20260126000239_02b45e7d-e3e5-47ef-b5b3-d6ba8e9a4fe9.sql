-- Tabela de Banners Publicitários
CREATE TABLE public.banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  link_url TEXT,
  position TEXT NOT NULL DEFAULT 'above_news',
  slot INTEGER NOT NULL DEFAULT 1,
  active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de Configurações do Site
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Inserir configurações padrão do YouTube
INSERT INTO public.site_settings (key, value) VALUES 
  ('youtube_video_id', 'CyKl-0Y1ZDg'),
  ('youtube_channel_url', 'https://youtube.com/@example');

-- Adicionar campos de vídeo na tabela news
ALTER TABLE public.news 
  ADD COLUMN video_url TEXT,
  ADD COLUMN image_position TEXT DEFAULT 'top',
  ADD COLUMN video_position TEXT;

-- Habilitar RLS nas novas tabelas
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para banners
CREATE POLICY "Banners ativos são públicos" 
ON public.banners 
FOR SELECT 
USING (active = true);

CREATE POLICY "Admins podem gerenciar banners" 
ON public.banners 
FOR ALL 
USING (is_admin_or_supervisor(auth.uid()))
WITH CHECK (is_admin_or_supervisor(auth.uid()));

-- Políticas RLS para site_settings
CREATE POLICY "Configurações são públicas para leitura" 
ON public.site_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Admins podem gerenciar configurações" 
ON public.site_settings 
FOR ALL 
USING (is_admin_or_supervisor(auth.uid()))
WITH CHECK (is_admin_or_supervisor(auth.uid()));

-- Trigger para atualizar updated_at em banners
CREATE TRIGGER update_banners_updated_at
BEFORE UPDATE ON public.banners
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para atualizar updated_at em site_settings
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();