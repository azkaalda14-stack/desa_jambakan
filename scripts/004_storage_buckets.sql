-- Create storage buckets used by the application
-- Run these queries in Supabase SQL editor (adjust public := true/false as needed)

select storage.create_bucket('public', public := true, file_size_limit := 5242880);
select storage.create_bucket('gallery', public := true, file_size_limit := 5242880);
select storage.create_bucket('news', public := true, file_size_limit := 5242880);
select storage.create_bucket('village_structure', public := true, file_size_limit := 5242880);
select storage.create_bucket('tenun', public := true, file_size_limit := 5242880);
select storage.create_bucket('pages', public := true, file_size_limit := 5242880);
select storage.create_bucket('programs', public := true, file_size_limit := 5242880);

-- Example policies (basic):
-- Allow authenticated uploads to 'public'
-- create policy "Authenticated uploads to public" on storage.objects
--   for insert to authenticated
--   with check (bucket_id = 'public');

-- Public read for 'public'
-- create policy "Public read public bucket" on storage.objects
--   for select to public
--   using (bucket_id = 'public');