import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

// Deletes published news older than 7 days.
export async function GET() {
  try {
    const supabase = createAdminClient()
    const now = new Date()
    const cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()

    // Delete where published_at older than cutoff and status published
    const { error: delPubErr, count: deletedPublished } = await supabase
      .from("news")
      .delete()
      .lt("published_at", cutoff)
      .eq("status", "published")
      .select("*", { count: "exact" })

    if (delPubErr) throw delPubErr

    // Optional: also delete rows with NULL published_at based on created_at
    const { error: delCreatedErr, count: deletedCreated } = await supabase
      .from("news")
      .delete()
      .is("published_at", null)
      .lt("created_at", cutoff)
      .select("*", { count: "exact" })

    if (delCreatedErr) throw delCreatedErr

    return NextResponse.json({ ok: true, cutoff, deletedPublished, deletedCreated })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}