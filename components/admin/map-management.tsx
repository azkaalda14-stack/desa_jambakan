"use client"

import { useEffect, useMemo, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import ImageUpload from "@/components/admin/image-upload"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Edit2, MapPin } from "lucide-react"

type MapCategory = {
  id: string
  name: string
  slug: string
  description?: string | null
  color?: string | null
  icon?: string | null
}

type MapFeature = {
  id: string
  title: string
  description?: string | null
  category_id?: string | null
  type: "point" | "polyline" | "polygon"
  latitude?: number | null
  longitude?: number | null
  geojson?: any | null
  image_url?: string | null
  status: "draft" | "published"
}

export default function MapManagement({ currentUserId }: { currentUserId: string }) {
  const supabase = useMemo(() => createClient(), [])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [categories, setCategories] = useState<MapCategory[]>([])
  const [features, setFeatures] = useState<MapFeature[]>([])

  // Category form state
  const [catFormOpen, setCatFormOpen] = useState(false)
  const [catEditingId, setCatEditingId] = useState<string | null>(null)
  const [catForm, setCatForm] = useState({ name: "", slug: "", description: "", color: "", icon: "" })

  // Feature form state
  const [featFormOpen, setFeatFormOpen] = useState(false)
  const [featEditingId, setFeatEditingId] = useState<string | null>(null)
  const [featForm, setFeatForm] = useState({
    title: "",
    description: "",
    category_id: "",
    type: "point" as "point" | "polyline" | "polygon",
    latitude: "",
    longitude: "",
    geojson: "",
    image_url: "",
    status: "published" as "draft" | "published",
  })

  useEffect(() => {
    refresh()
  }, [])

  async function refresh() {
    setLoading(true)
    setError(null)
    const { data: cats, error: e1 } = await supabase
      .from("map_categories")
      .select("id,name,slug,description,color,icon")
      .order("name", { ascending: true })
    const { data: feats, error: e2 } = await supabase
      .from("map_features")
      .select("id,title,description,category_id,type,latitude,longitude,geojson,image_url,status")
      .order("created_at", { ascending: false })
    setLoading(false)
    if (e1 || e2) {
      setError(e1?.message || e2?.message || "Gagal memuat data")
      return
    }
    setCategories((cats as MapCategory[]) || [])
    setFeatures((feats as MapFeature[]) || [])
  }

  function generateSlug(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
  }

  // Category CRUD
  async function submitCategory(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const payload = {
        name: catForm.name,
        slug: catForm.slug || generateSlug(catForm.name),
        description: catForm.description || null,
        color: catForm.color || null,
        icon: catForm.icon || null,
        created_by: currentUserId,
      }
      if (catEditingId) {
        const { error } = await supabase.from("map_categories").update(payload).eq("id", catEditingId)
        if (error) throw error
      } else {
        const { error } = await supabase.from("map_categories").insert([payload])
        if (error) throw error
      }
      setCatForm({ name: "", slug: "", description: "", color: "", icon: "" })
      setCatEditingId(null)
      setCatFormOpen(false)
      await refresh()
    } catch (err: any) {
      setError(err.message || "Gagal simpan kategori")
    } finally {
      setLoading(false)
    }
  }

  async function deleteCategory(id: string) {
    if (!confirm("Hapus kategori?")) return
    setLoading(true)
    setError(null)
    try {
      const { error } = await supabase.from("map_categories").delete().eq("id", id)
      if (error) throw error
      await refresh()
    } catch (err: any) {
      setError(err.message || "Gagal hapus kategori")
    } finally {
      setLoading(false)
    }
  }

  // Feature CRUD
  async function submitFeature(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const payload: any = {
        title: featForm.title,
        description: featForm.description || null,
        category_id: featForm.category_id || null,
        type: featForm.type,
        image_url: featForm.image_url || null,
        status: featForm.status,
        created_by: currentUserId,
      }
      if (featForm.type === "point") {
        const lat = featForm.latitude ? Number.parseFloat(featForm.latitude) : undefined
        const lon = featForm.longitude ? Number.parseFloat(featForm.longitude) : undefined
        if (Number.isNaN(lat!) || Number.isNaN(lon!)) throw new Error("Koordinat tidak valid")
        payload.latitude = lat
        payload.longitude = lon
        payload.geojson = null
      } else {
        payload.latitude = null
        payload.longitude = null
        payload.geojson = featForm.geojson ? JSON.parse(featForm.geojson) : null
      }

      if (featEditingId) {
        const { error } = await supabase.from("map_features").update(payload).eq("id", featEditingId)
        if (error) throw error
      } else {
        const { error } = await supabase.from("map_features").insert([payload])
        if (error) throw error
      }

      setFeatForm({
        title: "",
        description: "",
        category_id: "",
        type: "point",
        latitude: "",
        longitude: "",
        geojson: "",
        image_url: "",
        status: "published",
      })
      setFeatEditingId(null)
      setFeatFormOpen(false)
      await refresh()
    } catch (err: any) {
      setError(err.message || "Gagal simpan fitur")
    } finally {
      setLoading(false)
    }
  }

  async function deleteFeature(id: string) {
    if (!confirm("Hapus fitur peta?")) return
    setLoading(true)
    setError(null)
    try {
      const { error } = await supabase.from("map_features").delete().eq("id", id)
      if (error) throw error
      await refresh()
    } catch (err: any) {
      setError(err.message || "Gagal hapus fitur")
    } finally {
      setLoading(false)
    }
  }

  function startEditCategory(cat: MapCategory) {
    setCatForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      color: cat.color || "",
      icon: cat.icon || "",
    })
    setCatEditingId(cat.id)
    setCatFormOpen(true)
  }

  function startEditFeature(feat: MapFeature) {
    setFeatForm({
      title: feat.title,
      description: feat.description || "",
      category_id: feat.category_id || "",
      type: feat.type,
      latitude: feat.latitude?.toString() || "",
      longitude: feat.longitude?.toString() || "",
      geojson: feat.geojson ? JSON.stringify(feat.geojson) : "",
      image_url: feat.image_url || "",
      status: feat.status,
    })
    setFeatEditingId(feat.id)
    setFeatFormOpen(true)
  }

  return (
    <div className="space-y-8">
      {/* Kategori */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Kategori Peta</h2>
        <Button
          onClick={() => {
            setCatFormOpen(!catFormOpen)
            setCatEditingId(null)
            setCatForm({ name: "", slug: "", description: "", color: "", icon: "" })
          }}
          className="bg-red-700 hover:bg-red-800"
        >
          <Plus className="mr-2 h-4 w-4" /> Tambah Kategori
        </Button>
      </div>

      {catFormOpen && (
        <Card>
          <CardHeader>
            <CardTitle>{catEditingId ? "Edit Kategori" : "Tambah Kategori"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submitCategory} className="space-y-4">
              <div>
                <Label htmlFor="cat_name">Nama</Label>
                <Input
                  id="cat_name"
                  value={catForm.name}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value, slug: generateSlug(e.target.value) })}
                  placeholder="Misal: Fasilitas Umum"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="cat_slug">Slug</Label>
                  <Input id="cat_slug" value={catForm.slug} onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="cat_color">Warna (hex)</Label>
                  <Input id="cat_color" value={catForm.color} onChange={(e) => setCatForm({ ...catForm, color: e.target.value })} placeholder="#E11D48" />
                </div>
                <div>
                  <Label htmlFor="cat_icon">Ikon</Label>
                  <Input id="cat_icon" value={catForm.icon} onChange={(e) => setCatForm({ ...catForm, icon: e.target.value })} placeholder="map-pin" />
                </div>
              </div>
              <div>
                <Label htmlFor="cat_desc">Deskripsi (opsional)</Label>
                <Textarea id="cat_desc" value={catForm.description} onChange={(e) => setCatForm({ ...catForm, description: e.target.value })} rows={3} />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-red-700 hover:bg-red-800">{catEditingId ? "Update" : "Simpan"}</Button>
                <Button type="button" variant="outline" onClick={() => { setCatFormOpen(false); setCatEditingId(null) }}>Batal</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="rounded border border-gray-200 p-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: cat.color || "#999" }} />
                <span className="font-semibold">{cat.name}</span>
              </div>
              <div className="text-xs text-gray-500">/{cat.slug}</div>
              {cat.description && <div className="text-sm text-gray-700 mt-1">{cat.description}</div>}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => startEditCategory(cat)}><Edit2 className="w-4 h-4 mr-1" /> Edit</Button>
              <Button variant="destructive" onClick={() => deleteCategory(cat.id)}><Trash2 className="w-4 h-4 mr-1" /> Hapus</Button>
            </div>
          </div>
        ))}
      </div>

      {/* Fitur Peta */}
      <div className="flex items-center justify-between mt-8">
        <h2 className="text-2xl font-bold text-gray-900">Fitur Peta</h2>
        <Button
          onClick={() => {
            setFeatFormOpen(!featFormOpen)
            setFeatEditingId(null)
            setFeatForm({ title: "", description: "", category_id: "", type: "point", latitude: "", longitude: "", geojson: "", image_url: "", status: "published" })
          }}
          className="bg-red-700 hover:bg-red-800"
        >
          <Plus className="mr-2 h-4 w-4" /> Tambah Fitur
        </Button>
      </div>

      {featFormOpen && (
        <Card>
          <CardHeader>
            <CardTitle>{featEditingId ? "Edit Fitur" : "Tambah Fitur Peta"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submitFeature} className="space-y-4">
              <div>
                <Label htmlFor="feat_title">Judul</Label>
                <Input id="feat_title" value={featForm.title} onChange={(e) => setFeatForm({ ...featForm, title: e.target.value })} required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="feat_category">Kategori</Label>
                  <select id="feat_category" className="w-full border rounded px-3 py-2" value={featForm.category_id} onChange={(e) => setFeatForm({ ...featForm, category_id: e.target.value })}>
                    <option value="">—</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="feat_type">Jenis</Label>
                  <select id="feat_type" className="w-full border rounded px-3 py-2" value={featForm.type} onChange={(e) => setFeatForm({ ...featForm, type: e.target.value as any })}>
                    <option value="point">Titik</option>
                    <option value="polyline">Garis</option>
                    <option value="polygon">Area</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="feat_status">Status</Label>
                  <select id="feat_status" className="w-full border rounded px-3 py-2" value={featForm.status} onChange={(e) => setFeatForm({ ...featForm, status: e.target.value as any })}>
                    <option value="published">Publish</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              {featForm.type === "point" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="feat_lat">Latitude</Label>
                    <Input id="feat_lat" value={featForm.latitude} onChange={(e) => setFeatForm({ ...featForm, latitude: e.target.value })} placeholder="-7.79083" />
                  </div>
                  <div>
                    <Label htmlFor="feat_lon">Longitude</Label>
                    <Input id="feat_lon" value={featForm.longitude} onChange={(e) => setFeatForm({ ...featForm, longitude: e.target.value })} placeholder="110.67972" />
                  </div>
                </div>
              ) : (
                <div>
                  <Label htmlFor="feat_geojson">GeoJSON (untuk garis/area)</Label>
                  <Textarea id="feat_geojson" value={featForm.geojson} onChange={(e) => setFeatForm({ ...featForm, geojson: e.target.value })} rows={6} placeholder='{"type":"Polygon","coordinates":[...]}'
                  />
                </div>
              )}

              <div>
                <Label>Gambar (opsional)</Label>
                <ImageUpload onUpload={(url: string) => setFeatForm({ ...featForm, image_url: url })} currentImage={featForm.image_url || undefined} folder="map" bucket="map" />
              </div>

              <div>
                <Label htmlFor="feat_desc">Deskripsi (opsional)</Label>
                <Textarea id="feat_desc" value={featForm.description} onChange={(e) => setFeatForm({ ...featForm, description: e.target.value })} rows={3} />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-red-700 hover:bg-red-800">{featEditingId ? "Update" : "Simpan"}</Button>
                <Button type="button" variant="outline" onClick={() => { setFeatFormOpen(false); setFeatEditingId(null) }}>Batal</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* List fitur */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feat) => (
          <div key={feat.id} className="rounded border border-gray-200 p-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="font-semibold">{feat.title}</span>
              <span className="text-xs text-gray-500">[{feat.type}]</span>
              {feat.status === "draft" && <span className="text-xs px-2 py-0.5 ml-auto rounded bg-yellow-100 text-yellow-700">Draft</span>}
            </div>
            {feat.description && <div className="text-sm text-gray-700 mt-1">{feat.description}</div>}
            {feat.image_url && <img src={feat.image_url} alt={feat.title} className="w-full h-32 object-cover rounded mt-2" />}
            {feat.type === "point" && feat.latitude && feat.longitude && (
              <a
                href={`https://www.google.com/maps?q=${feat.latitude},${feat.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline mt-2 inline-block"
              >
                Lihat di Google Maps
              </a>
            )}
            <div className="flex gap-2 mt-3">
              <Button variant="outline" onClick={() => startEditFeature(feat)}><Edit2 className="w-4 h-4 mr-1" /> Edit</Button>
              <Button variant="destructive" onClick={() => deleteFeature(feat.id)}><Trash2 className="w-4 h-4 mr-1" /> Hapus</Button>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-3">{error}</div>
      )}
      {loading && <div className="text-sm text-gray-500">Memuat...</div>}
    </div>
  )
}