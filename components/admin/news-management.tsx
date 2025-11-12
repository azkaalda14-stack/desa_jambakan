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

export default function NewsManagement({ initialNews, currentUserId }: any) {
  const [news, setNews] = useState(initialNews)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    featured_image_url: "",
    status: "draft",
    published_date: "",
    // UI-only: category (not persisted)
    category: "Umum",
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
    setError(null)

    try {
      if (editingId) {
        const { error: updateError } = await supabase
          .from("news")
          .update({
            ...formData,
            // don't send UI-only fields
            category: undefined as unknown as never,
            published_date: undefined as unknown as never,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingId)

        if (updateError) throw updateError

        setNews(news.map((item: any) => (item.id === editingId ? { ...item, ...formData } : item)))
      } else {
        const { data: newNews, error: insertError } = await supabase
          .from("news")
          .insert([
            {
              ...formData,
              author_id: currentUserId,
              // use chosen date for published_at if provided, else now
              published_at:
                formData.status === "published"
                  ? formData.published_date
                    ? new Date(formData.published_date).toISOString()
                    : new Date().toISOString()
                  : null,
            },
          ])
          .select()

        if (insertError) throw insertError
        if (newNews) setNews([newNews[0], ...news])
      }

      setFormData({
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        featured_image_url: "",
        status: "draft",
        published_date: "",
        category: "Umum",
      })
      setEditingId(null)
      setIsFormOpen(false)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error("[v0] News submission error:", errorMessage)
      setError(errorMessage)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error: deleteError } = await supabase.from("news").delete().eq("id", id)
      if (deleteError) throw deleteError
      setNews(news.filter((item: any) => item.id !== id))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error("[v0] Delete error:", errorMessage)
      setError(errorMessage)
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
      published_date: item.published_at ? new Date(item.published_at).toISOString().slice(0, 10) : "",
      category: "Umum",
    })
    setEditingId(item.id)
    setIsFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Kelola Berita & Kegiatan</h2>
          <p className="text-sm text-red-900/60 mt-2">Total: {news?.length || 0} berita</p>
        </div>
        <Button
          onClick={() => {
            setIsFormOpen(!isFormOpen)
            setEditingId(null)
            setFormData({
              title: "",
              slug: "",
              content: "",
              excerpt: "",
              featured_image_url: "",
              status: "draft",
              published_date: "",
              category: "Umum",
            })
            setError(null)
          }}
          className="bg-red-700 hover:bg-red-800"
        >
          <Plus className="mr-2 h-4 w-4" />
          Tambah Berita
        </Button>
      </div>

      {isFormOpen && (
        <Card className="border-rose-200">
          <CardHeader>
            <CardTitle className="text-lg">{editingId ? "Edit Berita" : "Tambah Berita Baru"}</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                <p className="font-semibold">Error:</p>
                <p className="text-sm">{error}</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Judul Berita</Label>
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
                <Label htmlFor="content">Konten Lengkap</Label>
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

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Kategori</Label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option>Umum</option>
                    <option>Pengumuman</option>
                    <option>Kegiatan</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="published_date">Tanggal Acara</Label>
                  <Input
                    id="published_date"
                    name="published_date"
                    type="date"
                    value={formData.published_date}
                    onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="status">Status Publikasi</Label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="published">Langsung Publish</option>
                  <option value="draft">Draft</option>
                </select>
                <p className="text-xs text-gray-500 mt-2">
                  Draft tidak akan tampil di halaman publik, hanya admin yang bisa melihat
                </p>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-red-700 hover:bg-red-800">
                  {editingId ? "Update" : "Simpan"}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false)
                    setEditingId(null)
                    setError(null)
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
                          item.status === "published" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.status === "published" ? "Publish" : "Draft"}
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
          <Card className="border-rose-200">
            <CardContent className="pt-10 pb-10">
              <p className="text-center text-red-900/60">Belum ada berita. Tambahkan berita baru!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
