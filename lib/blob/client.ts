import { put } from "@vercel/blob"

export async function uploadImage(file: File, pathname: string) {
  try {
    const blob = await put(pathname, file, { access: "public" })
    return blob.url
  } catch (error) {
    console.error("Upload error:", error)
    throw error
  }
}
