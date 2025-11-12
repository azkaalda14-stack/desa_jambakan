import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN

    if (!token) {
      console.error("[v0] BLOB_READ_WRITE_TOKEN not configured")
      return NextResponse.json(
        { error: "Upload service not configured. Please contact administrator." },
        { status: 500 },
      )
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      console.error("[v0] No file provided in upload request")
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
    if (file.size > MAX_FILE_SIZE) {
      console.error(`[v0] File too large: ${file.size} bytes`)
      return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 })
    }

    if (!file.type.startsWith("image/")) {
      console.error(`[v0] Invalid file type: ${file.type}`)
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    const timestamp = Date.now()
    const pathname = `desa/${timestamp}-${file.name}`

    console.log(`[v0] Uploading file: ${pathname}`)
    const blob = await put(pathname, file, {
      access: "public",
      token: token, // Explicitly pass the token
    })
    console.log(`[v0] Upload successful: ${blob.url}`)

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(`[v0] Upload error details:`, {
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
