-- =============================================
-- PORTAL DE NOTÍCIAS - BANCO DE DADOS COMPLETO
-- =============================================

-- 1. CREATE ENUM FOR ROLES
CREATE TYPE public.app_role AS ENUM ('admin', 'supervisor', 'editor', 'reporter');

-- =============================================
-- 2. BASE TABLES
-- =============================================

-- REGIONS TABLE
CREATE TABLE public.regions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT 'hsl(220, 70%, 45%)',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.regions ENABLE ROW LEVEL SECURITY;

-- RADIOS TABLE
CREATE TABLE public.radios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  tagline TEXT,
  frequency TEXT NOT NULL,
  stream_url TEXT,
  whatsapp_station TEXT,
  whatsapp_commercial TEXT,
  region_id UUID REFERENCES public.regions(id) ON DELETE SET NULL,
  logo_url TEXT,
  color TEXT DEFAULT 'hsl(220, 70%, 45%)',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.radios ENABLE ROW LEVEL SECURITY;

-- PROFILES TABLE
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  region_id UUID REFERENCES public.regions(id) ON DELETE SET NULL,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- USER ROLES TABLE (CRITICAL: Separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- COMMUNICATORS TABLE
CREATE TABLE public.communicators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT DEFAULT 'Locutor',
  program TEXT,
  photo_url TEXT,
  radio_id UUID REFERENCES public.radios(id) ON DELETE SET NULL,
  instagram TEXT,
  bio TEXT,
  active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.communicators ENABLE ROW LEVEL SECURITY;

-- NEWS TABLE
CREATE TABLE public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  image_url TEXT,
  region_id UUID REFERENCES public.regions(id) ON DELETE SET NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured BOOLEAN DEFAULT false,
  views INT DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 3. HELPER FUNCTIONS (SECURITY DEFINER)
-- =============================================

-- Check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Check if user is admin or supervisor
CREATE OR REPLACE FUNCTION public.is_admin_or_supervisor(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin', 'supervisor')
  )
$$;

-- Check if user is editor or reporter
CREATE OR REPLACE FUNCTION public.is_editor_or_reporter(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('editor', 'reporter')
  )
$$;

-- Get user's region_id from profile
CREATE OR REPLACE FUNCTION public.get_user_region_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT region_id
  FROM public.profiles
  WHERE user_id = _user_id
$$;

-- Check if user can manage news for a region
CREATE OR REPLACE FUNCTION public.can_manage_news(_user_id UUID, _region_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    public.is_admin_or_supervisor(_user_id)
    OR (
      public.is_editor_or_reporter(_user_id)
      AND public.get_user_region_id(_user_id) = _region_id
    )
$$;

-- =============================================
-- 4. RLS POLICIES
-- =============================================

-- REGIONS: Public read, admin/supervisor write
CREATE POLICY "Regions are publicly readable"
  ON public.regions FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage regions"
  ON public.regions FOR ALL
  TO authenticated
  USING (public.is_admin_or_supervisor(auth.uid()))
  WITH CHECK (public.is_admin_or_supervisor(auth.uid()));

-- RADIOS: Public read, admin/supervisor write
CREATE POLICY "Radios are publicly readable"
  ON public.radios FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage radios"
  ON public.radios FOR ALL
  TO authenticated
  USING (public.is_admin_or_supervisor(auth.uid()))
  WITH CHECK (public.is_admin_or_supervisor(auth.uid()));

-- PROFILES: Authenticated read, owner update
CREATE POLICY "Profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- USER ROLES: Only admin/supervisor can manage
CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.is_admin_or_supervisor(auth.uid()) OR auth.uid() = user_id);

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_or_supervisor(auth.uid()));

CREATE POLICY "Admins can update roles"
  ON public.user_roles FOR UPDATE
  TO authenticated
  USING (public.is_admin_or_supervisor(auth.uid()))
  WITH CHECK (public.is_admin_or_supervisor(auth.uid()));

CREATE POLICY "Admins can delete roles"
  ON public.user_roles FOR DELETE
  TO authenticated
  USING (public.is_admin_or_supervisor(auth.uid()));

-- COMMUNICATORS: Public read, admin/supervisor write
CREATE POLICY "Communicators are publicly readable"
  ON public.communicators FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage communicators"
  ON public.communicators FOR ALL
  TO authenticated
  USING (public.is_admin_or_supervisor(auth.uid()))
  WITH CHECK (public.is_admin_or_supervisor(auth.uid()));

-- NEWS: Public read for published, regional management
CREATE POLICY "Published news are publicly readable"
  ON public.news FOR SELECT
  USING (status = 'published' OR auth.uid() = author_id OR public.is_admin_or_supervisor(auth.uid()));

CREATE POLICY "Reporters can create news in their region"
  ON public.news FOR INSERT
  TO authenticated
  WITH CHECK (
    public.can_manage_news(auth.uid(), region_id)
    AND author_id = auth.uid()
  );

CREATE POLICY "Users can update their regional news"
  ON public.news FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = author_id 
    OR public.is_admin_or_supervisor(auth.uid())
  )
  WITH CHECK (
    public.can_manage_news(auth.uid(), region_id)
  );

CREATE POLICY "Admins can delete news"
  ON public.news FOR DELETE
  TO authenticated
  USING (public.is_admin_or_supervisor(auth.uid()));

-- =============================================
-- 5. TRIGGERS
-- =============================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_radios_updated_at
  BEFORE UPDATE ON public.radios
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_communicators_updated_at
  BEFORE UPDATE ON public.communicators
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_news_updated_at
  BEFORE UPDATE ON public.news
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- 6. STORAGE BUCKET FOR IMAGES
-- =============================================

INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true);

-- Storage policies
CREATE POLICY "Media is publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

CREATE POLICY "Authenticated users can upload media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'media');

CREATE POLICY "Users can update own media"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'media' AND auth.uid()::text = (storage.foldername(name))[1]);

-- =============================================
-- 7. SEED DATA - REGIONS
-- =============================================

INSERT INTO public.regions (name, slug, color) VALUES
  ('Irecê', 'irece', 'hsl(220, 70%, 45%)'),
  ('Jacobina', 'jacobina', 'hsl(4, 80%, 50%)'),
  ('Itaberaba', 'itaberaba', 'hsl(145, 60%, 40%)'),
  ('Ruy Barbosa', 'ruy-barbosa', 'hsl(280, 60%, 50%)');