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

export default function ServicesManagement({ initialServices }: any) {
  const [services, setServices] = useState(initialServices)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    status: "active",
  })

  const supabase = createClient()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingId) {
        const { error } = await supabase.from("services").update(formData).eq("id", editingId)

        if (error) throw error
        setServices(services.map((item: any) => (item.id === editingId ? { ...item, ...formData } : item)))
      } else {
        const { data: newService, error } = await supabase.from("services").insert([formData]).select()

        if (error) throw error
        if (newService) setServices([newService[0], ...services])
      }

      setFormData({ name: "", description: "", category: "", status: "active" })
      setEditingId(null)
      setIsFormOpen(false)
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("services").delete().eq("id", id)
      if (error) throw error
      setServices(services.filter((item: any) => item.id !== id))
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const handleEdit = (item: any) => {
    setFormData({
      name: item.name,
      description: item.description,
      category: item.category,
      status: item.status,
    })
    setEditingId(item.id)
    setIsFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Manajemen Layanan</h2>
        <Button
          onClick={() => {
            setIsFormOpen(!isFormOpen)
            setEditingId(null)
            setFormData({ name: "", description: "", category: "", status: "active" })
          }}
          className="bg-red-700 hover:bg-red-800"
        >
          <Plus className="mr-2 h-4 w-4" />
          Tambah Layanan
        </Button>
      </div>

      {isFormOpen && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Layanan" : "Tambah Layanan Baru"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nama Layanan</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Masukkan nama layanan"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Masukkan deskripsi layanan"
                  rows={4}
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
                  placeholder="Contoh: Administrasi, Teknis"
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
                <Button type="submit" className="bg-red-700 hover:bg-red-800">
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

      {/* Services List */}
      <div className="space-y-3">
        {services && services.length > 0 ? (
          services.map((item: any) => (
            <Card key={item.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    <div className="flex gap-3 mt-3">
                      {item.category && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{item.category}</span>
                      )}
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
              <p className="text-center text-gray-500">Belum ada layanan</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
