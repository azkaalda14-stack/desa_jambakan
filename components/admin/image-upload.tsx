"use client"

import type React from "react"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Upload, X, AlertCircle } from "lucide-react"
// Tidak lagi upload langsung dari klien; gunakan route server-side dengan Service Role

interface ImageUploadProps {
  onUpload: (url: string) => void
  currentImage?: string
  bucket?: string
  folder?: string
}

export default function ImageUpload({ onUpload, currentImage, bucket, folder }: ImageUploadProps) {
  const [preview, setPreview] = useState<string>(currentImage || "")
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string>("")

  const effectiveBucket = bucket || process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "public"
  const effectiveFolder = folder || "uploads"

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError("")

    const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
    if (file.size > MAX_FILE_SIZE) {
      const errorMsg = `File terlalu besar (${(file.size / 1024 / 1024).toFixed(2)}MB). Max: 5MB`
      setError(errorMsg)
      console.error("[upload] Client validation:", errorMsg)
      return
    }

    if (!file.type.startsWith("image/")) {
      const errorMsg = "File harus berupa gambar (JPG, PNG, dll)"
      setError(errorMsg)
      console.error("[upload] Client validation:", errorMsg)
      return
    }

    // Show preview while uploading
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload via server route (service role)
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("bucket", effectiveBucket)
      formData.append("folder", effectiveFolder)

      const res = await fetch("/api/upload", { method: "POST", body: formData })
      if (!res.ok) {
        let msg = `Server error (${res.status})`
        try {
          const data = await res.json()
          msg = data?.error || msg
        } catch {}
        throw new Error(msg)
      }
      const data: { url?: string; path?: string } = await res.json()
      const returnedUrl = data.url || ""

      onUpload(returnedUrl)
      setPreview(returnedUrl)
      setError("")
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Kesalahan tidak diketahui"
      console.error("[upload] Server upload error:", errMsg)
      setError(`Gagal upload: ${errMsg}`)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview("")
    setError("")
    onUpload("")
  }

  return (
    <div>
      <Label>Gambar</Label>
      <div className="mt-2 space-y-4">
        {preview && (
          <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
            <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <label className="flex items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition">
          <div className="flex items-center gap-2 text-gray-600">
            <Upload size={20} />
            <span>Klik untuk upload gambar</span>
          </div>
          <input type="file" accept="image/*" onChange={handleFileChange} disabled={isUploading} className="hidden" />
        </label>

        {isUploading && <p className="text-sm text-gray-500">Mengupload...</p>}
      </div>
    </div>
  )
}
