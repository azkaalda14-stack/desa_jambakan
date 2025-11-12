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

export default function ProgramManagement({ initialPrograms }: any) {
  const [programs, setPrograms] = useState(initialPrograms)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    image_url: "",
    status: "active",
    budget: "",
  })

  const supabase = createClient()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleImageUpload = (url: string) => {
    setFormData({
      ...formData,
      image_url: url,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const data = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        image_url: formData.image_url,
        status: formData.status,
        budget: formData.budget ? Number.parseInt(formData.budget) : null,
      }

      if (editingId) {
        const { error } = await supabase.from("programs").update(data).eq("id", editingId)

        if (error) throw error
        setPrograms(programs.map((item: any) => (item.id === editingId ? { ...item, ...data } : item)))
      } else {
        const { data: newProgram, error } = await supabase.from("programs").insert([data]).select()

        if (error) throw error
        if (newProgram) setPrograms([newProgram[0], ...programs])
      }

      setFormData({ title: "", description: "", category: "", image_url: "", status: "active", budget: "" })
      setEditingId(null)
      setIsFormOpen(false)
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("programs").delete().eq("id", id)
      if (error) throw error
      setPrograms(programs.filter((item: any) => item.id !== id))
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const handleEdit = (item: any) => {
    setFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      image_url: item.image_url || "",
      status: item.status,
      budget: item.budget?.toString() || "",
    })
    setEditingId(item.id)
    setIsFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Manajemen Program</h2>
        <Button
          onClick={() => {
            setIsFormOpen(!isFormOpen)
            setEditingId(null)
            setFormData({ title: "", description: "", category: "", image_url: "", status: "active", budget: "" })
          }}
          className="bg-red-700 hover:bg-red-800"
        >
          <Plus className="mr-2 h-4 w-4" />
          Tambah Program
        </Button>
      </div>

      {isFormOpen && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Program" : "Tambah Program Baru"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Judul Program</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Masukkan judul program"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Kategori</Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Contoh: Pendidikan, Kesehatan"
                  required
                />
              </div>

              <ImageUpload onUpload={handleImageUpload} currentImage={formData.image_url} />

              <div>
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Masukkan deskripsi program"
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="budget">Anggaran (Rp)</Label>
                <Input
                  id="budget"
                  name="budget"
                  type="number"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="Masukkan anggaran"
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
                  <option value="active">Aktif</option>
                  <option value="inactive">Tidak Aktif</option>
                </select>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-red-600 hover:bg-red-700">
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

      {/* Programs List */}
      <div className="space-y-3">
        {programs && programs.length > 0 ? (
          programs.map((item: any) => (
            <Card key={item.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start gap-4">
                  {item.image_url && (
                    <img
                      src={item.image_url || "/placeholder.svg"}
                      alt={item.title}
                      className="w-24 h-24 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    <div className="flex gap-3 mt-3">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{item.category}</span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
        item.status === "active" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.status === "active" ? "Aktif" : "Tidak Aktif"}
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
              <p className="text-center text-gray-500">Belum ada program</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
