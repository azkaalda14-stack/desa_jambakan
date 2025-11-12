-- Add category support to news table
-- Run these queries in Supabase SQL editor

ALTER TABLE public.news
  ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Umum';

-- Helpful index for filtering/sorting by category and published status
CREATE INDEX IF NOT EXISTS news_category_status_idx
  ON public.news (category, status, published_at DESC);

-- Backfill null categories to 'Umum' for existing rows
UPDATE public.news SET category = 'Umum' WHERE category IS NULL;