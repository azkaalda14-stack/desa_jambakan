"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Edit2 } from "lucide-react"
import ImageUpload from "./image-upload"

export default function NewsManagement({ initialNews }: any) {
  const [news, setNews] = useState(initialNews)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    featured_image_url: "",
    status: "draft",
  })

  const supabase = createClient()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    })
  }

  const handleImageUpload = (url: string) => {
    setFormData({
      ...formData,
      featured_image_url: url,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingId) {
        const { error } = await supabase
          .from("news")
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingId)

        if (error) throw error

        setNews(news.map((item: any) => (item.id === editingId ? { ...item, ...formData } : item)))
      } else {
        const { data: newNews, error } = await supabase
          .from("news")
          .insert([
            {
              ...formData,
              published_at: formData.status === "published" ? new Date().toISOString() : null,
            },
          ])
          .select()

        if (error) throw error
        if (newNews) setNews([newNews[0], ...news])
      }

      setFormData({ title: "", slug: "", content: "", excerpt: "", featured_image_url: "", status: "draft" })
      setEditingId(null)
      setIsFormOpen(false)
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("news").delete().eq("id", id)
      if (error) throw error
      setNews(news.filter((item: any) => item.id !== id))
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const handleEdit = (item: any) => {
    setFormData({
      title: item.title,
      slug: item.slug,
      content: item.content,
      excerpt: item.excerpt,
      featured_image_url: item.featured_image_url || "",
      status: item.status,
    })
    setEditingId(item.id)
    setIsFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Manajemen Berita</h2>
        <Button
          onClick={() => {
            setIsFormOpen(!isFormOpen)
            setEditingId(null)
            setFormData({ title: "", slug: "", content: "", excerpt: "", featured_image_url: "", status: "draft" })
          }}
          className="bg-[#1f7d5e] hover:bg-[#165a47]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Tambah Berita
        </Button>
      </div>

      {isFormOpen && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Berita" : "Tambah Berita Baru"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Judul</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="Masukkan judul berita"
                  required
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" name="slug" value={formData.slug} readOnly className="bg-gray-100" />
              </div>

              <ImageUpload onUpload={handleImageUpload} currentImage={formData.featured_image_url} />

              <div>
                <Label htmlFor="excerpt">Ringkasan</Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  placeholder="Masukkan ringkasan berita"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="content">Konten</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Masukkan konten berita"
                  rows={6}
                  required
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Publikasi</option>
                </select>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-[#1f7d5e] hover:bg-[#165a47]">
                  {editingId ? "Update" : "Simpan"}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false)
                    setEditingId(null)
                  }}
                  variant="outline"
                >
                  Batal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* News List */}
      <div className="space-y-3">
        {news && news.length > 0 ? (
          news.map((item: any) => (
            <Card key={item.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start gap-4">
                  {item.featured_image_url && (
                    <img
                      src={item.featured_image_url || "/placeholder.svg"}
                      alt={item.title}
                      className="w-24 h-24 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{item.excerpt}</p>
                    <div className="flex gap-3 mt-3">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          item.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {item.status === "published" ? "Publikasi" : "Draft"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(item.created_at).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleEdit(item)} variant="outline" size="sm">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => handleDelete(item.id)} variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">Belum ada berita</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
