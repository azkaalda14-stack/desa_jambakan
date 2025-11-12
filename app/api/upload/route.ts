import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { put } from "@vercel/blob"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
    const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

    // Require authenticated user (basic guard)
    let userId: string | null = null
    if (SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
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
      userId = user?.id ?? null
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

    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9\._-]/g, "_")
    const pathname = `${folder}/${timestamp}-${sanitizedName}`

    // Prefer Supabase storage when configured
    if (SUPABASE_URL && SERVICE_ROLE_KEY) {
      const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)
      console.log(`[upload] Uploading to Supabase bucket '${bucket}' path: ${pathname}`)
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
      return NextResponse.json({ url: signedData?.signedUrl || publicUrl, path: pathname, bucket, userId, storage: "supabase" })
    }

    // If Service Role is missing but user is authenticated, use Supabase with user session
    if (SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && userId) {
      const cookieStore = await cookies()
      const supabaseAuth = createServerClient(SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll() {
            // no-op
          },
        },
      })
      console.log(`[upload] Authenticated Supabase upload for user ${userId} to '${bucket}/${pathname}'`)
      const buffer = Buffer.from(await file.arrayBuffer())
      const { error: uploadError } = await supabaseAuth.storage
        .from(bucket)
        .upload(pathname, buffer, { contentType: file.type, upsert: false })

      if (uploadError) {
        console.error("[upload] Authenticated Supabase upload error:", uploadError.message)
        return NextResponse.json({ error: uploadError.message }, { status: 400 })
      }

      const { data: publicUrlData } = supabaseAuth.storage.from(bucket).getPublicUrl(pathname)
      const publicUrl = publicUrlData.publicUrl

      const { data: signedData, error: signedError } = await supabaseAuth.storage
        .from(bucket)
        .createSignedUrl(pathname, 60 * 60 * 24 * 7)
      if (signedError) {
        console.warn("[upload] Signed URL generation failed (authed):", signedError.message)
      }

      console.log(`[upload] Upload successful (authed): ${publicUrl}`)
      return NextResponse.json({ url: signedData?.signedUrl || publicUrl, path: pathname, bucket, userId, storage: "supabase" })
    }

    // Fallback to Vercel Blob when Supabase is not configured but Blob token is available
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      console.log(`[upload] Supabase not configured. Using Vercel Blob fallback at path: ${pathname}`)
      const blob = await put(`${bucket}/${pathname}`, file, { access: "public" })
      return NextResponse.json({ url: blob.url, path: `${bucket}/${pathname}`, bucket, userId, storage: "blob" })
    }

    console.error("[upload] No storage configured: set Supabase or BLOB_READ_WRITE_TOKEN")
    return NextResponse.json(
      {
        error:
          "Layanan upload belum dikonfigurasi. Setel env Supabase atau BLOB_READ_WRITE_TOKEN di server.",
      },
      { status: 500 },
    )
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

// Simple status endpoint to help the client show which storage is active
export async function GET() {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

  const hasSupabaseSR = Boolean(SUPABASE_URL && SERVICE_ROLE_KEY)
  const hasBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN)
  let storage: "supabase" | "blob" | "none" = "none"

  if (hasSupabaseSR) {
    storage = "supabase"
  } else if (SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const cookieStore = await cookies()
      const supabaseAuth = createServerClient(SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll() {},
        },
      })
      const { data: { user } } = await supabaseAuth.auth.getUser()
      if (user) storage = "supabase"
    } catch {}
  }

  if (storage === "none" && hasBlob) storage = "blob"

  const message =
    storage === "supabase"
      ? (hasSupabaseSR ? "Storage aktif: Supabase (Service Role)" : "Storage aktif: Supabase (autentikasi pengguna)")
      : storage === "blob"
        ? "Storage aktif: Vercel Blob (fallback)"
        : "Storage belum dikonfigurasi di server"

  return NextResponse.json({ storage, message })
}
