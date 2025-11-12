-- Additional content tables for CMS features
-- This script creates pages, content blocks, events, documents, partners,
-- testimonials, tags, and page_tags with RLS policies aligned to admin users.

-- Pages table (general page content)
CREATE TABLE IF NOT EXISTS public.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  excerpt TEXT,
  featured_image_url TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','published')),
  meta JSONB,
  published_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES public.admins(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content blocks (reusable structured blocks, JSON data)
CREATE TABLE IF NOT EXISTS public.content_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL,
  title TEXT,
  data JSONB NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','inactive')),
  updated_by UUID REFERENCES public.admins(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS content_blocks_key_idx ON public.content_blocks(key);

-- Events (acara desa)
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  location TEXT,
  start_at TIMESTAMP WITH TIME ZONE,
  end_at TIMESTAMP WITH TIME ZONE,
  image_url TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  created_by UUID REFERENCES public.admins(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents (dokumen resmi desa)
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  category TEXT,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft','published')),
  uploaded_by UUID REFERENCES public.admins(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Partners (mitra/komunitas)
CREATE TABLE IF NOT EXISTS public.partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','inactive')),
  created_by UUID REFERENCES public.admins(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Testimonials (testimoni warga/mitra)
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author TEXT NOT NULL,
  role TEXT,
  quote TEXT NOT NULL,
  avatar_url TEXT,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft','published')),
  created_by UUID REFERENCES public.admins(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tags and many-to-many relation to pages
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.page_tags (
  page_id UUID NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (page_id, tag_id)
);

-- Enable RLS
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_tags ENABLE ROW LEVEL SECURITY;

-- RLS Policies for pages (public read published, admin write)
CREATE POLICY "Public can view published pages" ON public.pages FOR SELECT USING (
  status = 'published' OR EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);
CREATE POLICY "Admins can insert pages" ON public.pages FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);
CREATE POLICY "Admins can update pages" ON public.pages FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);
CREATE POLICY "Admins can delete pages" ON public.pages FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

-- RLS Policies for content_blocks (public read active, admin write)
CREATE POLICY "Public can view active blocks" ON public.content_blocks FOR SELECT USING (
  status = 'active' OR EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);
CREATE POLICY "Admins can insert blocks" ON public.content_blocks FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);
CREATE POLICY "Admins can update blocks" ON public.content_blocks FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);
CREATE POLICY "Admins can delete blocks" ON public.content_blocks FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

-- RLS Policies for events (public read published, admin write)
CREATE POLICY "Public can view published events" ON public.events FOR SELECT USING (
  status = 'published' OR EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);
CREATE POLICY "Admins can insert events" ON public.events FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);
CREATE POLICY "Admins can update events" ON public.events FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);
CREATE POLICY "Admins can delete events" ON public.events FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

-- RLS Policies for documents (public read published, admin write)
CREATE POLICY "Public can view published documents" ON public.documents FOR SELECT USING (
  status = 'published' OR EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);
CREATE POLICY "Admins can insert documents" ON public.documents FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);
CREATE POLICY "Admins can update documents" ON public.documents FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);
CREATE POLICY "Admins can delete documents" ON public.documents FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

-- RLS Policies for partners (public read active, admin write)
CREATE POLICY "Public can view active partners" ON public.partners FOR SELECT USING (
  status = 'active' OR EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);
CREATE POLICY "Admins can insert partners" ON public.partners FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);
CREATE POLICY "Admins can update partners" ON public.partners FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);
CREATE POLICY "Admins can delete partners" ON public.partners FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

-- RLS Policies for testimonials (public read published, admin write)
CREATE POLICY "Public can view published testimonials" ON public.testimonials FOR SELECT USING (
  status = 'published' OR EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);
CREATE POLICY "Admins can insert testimonials" ON public.testimonials FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);
CREATE POLICY "Admins can update testimonials" ON public.testimonials FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);
CREATE POLICY "Admins can delete testimonials" ON public.testimonials FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

-- RLS Policies for tags (public read, admin write)
CREATE POLICY "Public can view tags" ON public.tags FOR SELECT USING (TRUE);
CREATE POLICY "Admins can insert tags" ON public.tags FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);
CREATE POLICY "Admins can update tags" ON public.tags FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);
CREATE POLICY "Admins can delete tags" ON public.tags FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

-- RLS Policies for page_tags (public read, admin write)
CREATE POLICY "Public can view page_tags" ON public.page_tags FOR SELECT USING (TRUE);
CREATE POLICY "Admins can insert page_tags" ON public.page_tags FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);
CREATE POLICY "Admins can delete page_tags" ON public.page_tags FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

-- Optional seeds (uncomment to insert sample rows)
-- INSERT INTO public.tags (name) VALUES ('Budaya'), ('Karawitan'), ('Tenun');
-- INSERT INTO public.pages (title, slug, status, created_by)
-- VALUES ('Tentang Desa', 'tentang', 'published', NULL);