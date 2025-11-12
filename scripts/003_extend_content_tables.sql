-- Extend content tables to support categories and village structure

-- 1) Pages: add category for feature grouping (karawitan, tenun, sejarah, peta)
ALTER TABLE public.pages
  ADD COLUMN IF NOT EXISTS category TEXT;
CREATE INDEX IF NOT EXISTS pages_category_status_idx ON public.pages(category, status);

-- 2) Village Structure: create table for desa organizational members
CREATE TABLE IF NOT EXISTS public.village_structure (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  photo_url TEXT,
  order_index INT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','inactive')),
  created_by UUID REFERENCES public.admins(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.village_structure ENABLE ROW LEVEL SECURITY;

-- RLS: public can view active; admins full CRUD
CREATE POLICY IF NOT EXISTS "Public can view active village_structure" ON public.village_structure
  FOR SELECT USING (
    status = 'active' OR EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );
CREATE POLICY IF NOT EXISTS "Admins can insert village_structure" ON public.village_structure
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));
CREATE POLICY IF NOT EXISTS "Admins can update village_structure" ON public.village_structure
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));
CREATE POLICY IF NOT EXISTS "Admins can delete village_structure" ON public.village_structure
  FOR DELETE USING (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));

-- 3) Gallery: ensure status column for publish/draft control
CREATE TABLE IF NOT EXISTS public.gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT,
  uploaded_by UUID REFERENCES public.admins(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft','published')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- If table already exists, just add status column safely
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'gallery' AND column_name = 'status'
  ) THEN
    ALTER TABLE public.gallery ADD COLUMN status TEXT DEFAULT 'published' CHECK (status IN ('draft','published'));
  END IF;
END $$;

-- RLS: public read published; admins CRUD
CREATE POLICY IF NOT EXISTS "Public can view published gallery" ON public.gallery
  FOR SELECT USING (
    status = 'published' OR EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );
CREATE POLICY IF NOT EXISTS "Admins can insert gallery" ON public.gallery
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));
CREATE POLICY IF NOT EXISTS "Admins can update gallery" ON public.gallery
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));
CREATE POLICY IF NOT EXISTS "Admins can delete gallery" ON public.gallery
  FOR DELETE USING (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));

-- End of migration 003