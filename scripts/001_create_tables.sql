-- Create admin users table
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  position TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create village info table
CREATE TABLE IF NOT EXISTS public.village_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  tagline TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  logo_url TEXT,
  banner_url TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  established_year INTEGER,
  population INTEGER,
  area_km2 DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create news table
CREATE TABLE IF NOT EXISTS public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image_url TEXT,
  author_id UUID NOT NULL REFERENCES public.admins(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create programs table
CREATE TABLE IF NOT EXISTS public.programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  start_date DATE,
  end_date DATE,
  budget DECIMAL(15, 2),
  created_by UUID NOT NULL REFERENCES public.admins(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create gallery table
CREATE TABLE IF NOT EXISTS public.gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT,
  uploaded_by UUID NOT NULL REFERENCES public.admins(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contact submissions table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create services table
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_url TEXT,
  category TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_by UUID NOT NULL REFERENCES public.admins(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.village_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admins (only self)
CREATE POLICY "Admins can view their own profile" ON public.admins FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can update their own profile" ON public.admins FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for village_info (public read, admin write)
CREATE POLICY "Anyone can view village info" ON public.village_info FOR SELECT USING (TRUE);
CREATE POLICY "Only admins can insert village info" ON public.village_info FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));
CREATE POLICY "Only admins can update village info" ON public.village_info FOR UPDATE USING (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));

-- RLS Policies for news (public read published, admin all)
CREATE POLICY "Anyone can view published news" ON public.news FOR SELECT USING (status = 'published' OR EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));
CREATE POLICY "Only admins can insert news" ON public.news FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));
CREATE POLICY "Only admins can update news" ON public.news FOR UPDATE USING (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));
CREATE POLICY "Only admins can delete news" ON public.news FOR DELETE USING (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));

-- RLS Policies for programs (public read active, admin all)
CREATE POLICY "Anyone can view active programs" ON public.programs FOR SELECT USING (status = 'active' OR EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));
CREATE POLICY "Only admins can insert programs" ON public.programs FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));
CREATE POLICY "Only admins can update programs" ON public.programs FOR UPDATE USING (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));
CREATE POLICY "Only admins can delete programs" ON public.programs FOR DELETE USING (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));

-- RLS Policies for gallery (public read, admin write)
CREATE POLICY "Anyone can view gallery" ON public.gallery FOR SELECT USING (TRUE);
CREATE POLICY "Only admins can insert gallery" ON public.gallery FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));
CREATE POLICY "Only admins can update gallery" ON public.gallery FOR UPDATE USING (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));
CREATE POLICY "Only admins can delete gallery" ON public.gallery FOR DELETE USING (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));

-- RLS Policies for contact submissions (public insert, admin read)
CREATE POLICY "Anyone can submit contact form" ON public.contact_submissions FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Only admins can view submissions" ON public.contact_submissions FOR SELECT USING (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));
CREATE POLICY "Only admins can update submissions" ON public.contact_submissions FOR UPDATE USING (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));

-- RLS Policies for services (public read, admin write)
CREATE POLICY "Anyone can view services" ON public.services FOR SELECT USING (status = 'active' OR EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));
CREATE POLICY "Only admins can insert services" ON public.services FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));
CREATE POLICY "Only admins can update services" ON public.services FOR UPDATE USING (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));
CREATE POLICY "Only admins can delete services" ON public.services FOR DELETE USING (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));

-- Create trigger for auto-create admin profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_admin()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.admins (id, full_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'full_name', 'Admin User')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_admin_created ON auth.users;

CREATE TRIGGER on_auth_admin_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_admin();
