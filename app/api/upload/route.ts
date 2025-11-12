import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
    const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
      console.error("[upload] Supabase not configured: missing URL or SERVICE ROLE")
      return NextResponse.json(
        { error: "Upload service not configured. Missing Supabase credentials." },
        { status: 500 },
      )
    }

    // Require authenticated user (basic guard)
    const cookieStore = await cookies()
    const supabaseAuth = createServerClient(SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll() {
          // no-op for API Route
        },
      },
    })
    const {
      data: { user },
    } = await supabaseAuth.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const bucket = (formData.get("bucket") as string | null) || process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "public"
    const folder = (formData.get("folder") as string | null) || "uploads"

    if (!file) {
      console.error("[upload] No file provided in upload request")
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
    if (file.size > MAX_FILE_SIZE) {
      console.error(`[upload] File too large: ${file.size} bytes`)
      return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 })
    }

    if (!file.type.startsWith("image/")) {
      console.error(`[upload] Invalid file type: ${file.type}`)
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9\._-]/g, "_")
    const pathname = `${folder}/${timestamp}-${sanitizedName}`

    console.log(`[upload] Uploading to bucket '${bucket}' path: ${pathname}`)
    const buffer = Buffer.from(await file.arrayBuffer())
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(pathname, buffer, { contentType: file.type, upsert: false })

    if (uploadError) {
      console.error("[upload] Supabase upload error:", uploadError.message)
      return NextResponse.json({ error: uploadError.message }, { status: 400 })
    }

    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(pathname)
    const publicUrl = publicUrlData.publicUrl

    // Generate signed URL (7 days) for private buckets / preview usage
    const { data: signedData, error: signedError } = await supabase.storage
      .from(bucket)
      .createSignedUrl(pathname, 60 * 60 * 24 * 7)

    if (signedError) {
      console.warn("[upload] Signed URL generation failed:", signedError.message)
    }

    console.log(`[upload] Upload successful: ${publicUrl}`)
    return NextResponse.json({ url: signedData?.signedUrl || publicUrl, path: pathname, bucket })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(`[upload] Upload error details:`, {
      error: errorMessage,
      stack: error instanceof Error ? error.stack : null,
    })
    return NextResponse.json(
      {
        error: "Upload failed",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: 500 },
    )
  }
}
