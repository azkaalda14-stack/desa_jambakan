-- Map data model for Desa Jambakan
-- Run these in Supabase SQL editor (Production project).
-- This script creates:
-- 1) map_categories: categories for map features (markers, routes, areas)
-- 2) map_features: map items with type point/polyline/polygon and optional GeoJSON
-- 3) Row Level Security (RLS) policies so public can read published features,
--    authenticated users can manage their own features, and everyone can read categories.
-- 4) Optional storage bucket `map` with basic policies for image uploads.

-- =====================
-- Tables
-- =====================

create table if not exists public.map_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  color text,       -- e.g. '#E11D48' for marker color
  icon text,        -- optional icon name
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists map_categories_slug_idx on public.map_categories(slug);

create table if not exists public.map_features (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category_id uuid references public.map_categories(id) on delete set null,
  type text not null check (type in ('point','polyline','polygon')),
  -- For point markers
  latitude numeric(9,6),   -- -90..90, 6 decimal places
  longitude numeric(9,6),  -- -180..180, 6 decimal places
  -- For shapes (polyline/polygon) or advanced markers
  geojson jsonb,
  image_url text,
  status text not null default 'published' check (status in ('draft','published')),
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists map_features_category_idx on public.map_features(category_id);
create index if not exists map_features_status_idx on public.map_features(status);
create index if not exists map_features_geojson_idx on public.map_features using GIN(geojson);

-- =====================
-- Row Level Security (RLS)
-- =====================

alter table public.map_categories enable row level security;
alter table public.map_features enable row level security;

-- Categories: public can read; authenticated can insert/update/delete (owner-only)
drop policy if exists "Public read categories" on public.map_categories;
create policy "Public read categories" on public.map_categories
  for select to public
  using (true);

drop policy if exists "Insert categories (authenticated)" on public.map_categories;
create policy "Insert categories (authenticated)" on public.map_categories
  for insert to authenticated
  with check (created_by = auth.uid());

drop policy if exists "Update categories (owner)" on public.map_categories;
create policy "Update categories (owner)" on public.map_categories
  for update to authenticated
  using (created_by = auth.uid())
  with check (created_by = auth.uid());

drop policy if exists "Delete categories (owner)" on public.map_categories;
create policy "Delete categories (owner)" on public.map_categories
  for delete to authenticated
  using (created_by = auth.uid());

-- Features: public can read only published; authenticated can read all; owner can write
drop policy if exists "Public read published features" on public.map_features;
create policy "Public read published features" on public.map_features
  for select to public
  using (status = 'published');

drop policy if exists "Authenticated read all features" on public.map_features;
create policy "Authenticated read all features" on public.map_features
  for select to authenticated
  using (true);

drop policy if exists "Insert features (authenticated)" on public.map_features;
create policy "Insert features (authenticated)" on public.map_features
  for insert to authenticated
  with check (created_by = auth.uid());

drop policy if exists "Update features (owner)" on public.map_features;
create policy "Update features (owner)" on public.map_features
  for update to authenticated
  using (created_by = auth.uid())
  with check (created_by = auth.uid());

drop policy if exists "Delete features (owner)" on public.map_features;
create policy "Delete features (owner)" on public.map_features
  for delete to authenticated
  using (created_by = auth.uid());

-- =====================
-- Optional: Storage bucket for map images
-- =====================

-- Create a public bucket 'map' for marker photos or attachments
select storage.create_bucket('map', public := true, file_size_limit := 5242880);

-- Allow authenticated uploads to 'map'
do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname='storage' and tablename='objects' and polname='Authenticated uploads to map'
  ) then
    create policy "Authenticated uploads to map" on storage.objects
      for insert to authenticated
      with check (bucket_id = 'map');
  end if;
end $$;

-- Public read for 'map'
do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname='storage' and tablename='objects' and polname='Public read map bucket'
  ) then
    create policy "Public read map bucket" on storage.objects
      for select to public
      using (bucket_id = 'map');
  end if;
end $$;

-- =====================
-- Notes:
-- - Use 'type = point' with latitude/longitude set for markers.
-- - Use 'type = polyline' or 'polygon' with 'geojson' containing the geometry.
-- - Public can only read published features; drafts are visible to authenticated users.
-- - Manage images in the 'map' bucket via your existing /api/upload route (set bucket="map").