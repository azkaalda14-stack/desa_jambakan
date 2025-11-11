"use client"

import type React from "react"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Upload, X } from "lucide-react"

interface ImageUploadProps {
  onUpload: (url: string) => void
  currentImage?: string
}

export default function ImageUpload({ onUpload, currentImage }: ImageUploadProps) {
  const [preview, setPreview] = useState<string>(currentImage || "")
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload to Vercel Blob
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      const data = await response.json()
      onUpload(data.url)
      setPreview(data.url)
    } catch (error) {
      console.error("Upload error:", error)
      alert("Gagal mengunggah gambar")
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview("")
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
