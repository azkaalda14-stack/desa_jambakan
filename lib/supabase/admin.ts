import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// Server-only Supabase client using Service Role key.
// DO NOT expose SUPABASE_SERVICE_ROLE_KEY on the client.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  return createSupabaseClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}