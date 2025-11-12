"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import ImageUpload from "@/components/admin/image-upload";

type GalleryItem = {
  id: string;
  title: string;
  description?: string | null;
  image_url: string;
  category?: string | null;
  uploaded_by?: string | null;
  created_at?: string | null;
};

export default function GalleryManagement({
  initialGallery,
  currentUserId,
}: {
  initialGallery: GalleryItem[];
  currentUserId: string;
}) {
  const supabase = useMemo(() => createClient(), []);
  const [items, setItems] = useState<GalleryItem[]>(initialGallery || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<{
    id?: string;
    title: string;
    description: string;
    category: string;
    image_url: string;
  }>({ title: "", description: "", category: "", image_url: "" });

  const [isEditing, setIsEditing] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    setItems(initialGallery || []);
  }, [initialGallery]);

  async function refresh() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("gallery")
      .select("id,title,description,image_url,category,uploaded_by,created_at")
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setItems(data || []);
  }

  function resetForm() {
    setForm({ title: "", description: "", category: "", image_url: "" });
    setIsEditing(false);
    setIsFormOpen(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (!form.title || !form.image_url) {
        throw new Error("Judul dan gambar wajib diisi");
      }

      if (isEditing && form.id) {
        const { error } = await supabase
          .from("gallery")
          .update({
            title: form.title,
            description: form.description || null,
            category: form.category || null,
            image_url: form.image_url,
          })
          .eq("id", form.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("gallery").insert({
          title: form.title,
          description: form.description || null,
          category: form.category || null,
          image_url: form.image_url,
          uploaded_by: currentUserId,
        });
        if (error) throw error;
      }
      await refresh();
      resetForm();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat menyimpan");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    const ok = confirm("Hapus item galeri ini?");
    if (!ok) return;
    setLoading(true);
    setError(null);
    const { error } = await supabase.from("gallery").delete().eq("id", id);
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function startEdit(item: GalleryItem) {
    setForm({
      id: item.id,
      title: item.title,
      description: item.description || "",
      category: item.category || "",
      image_url: item.image_url,
    });
    setIsEditing(true);
    setIsFormOpen(true);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kelola Galeri</h1>
          <p className="text-sm text-red-900/60 mt-2">Total: {items?.length || 0} foto</p>
        </div>
        <button
          className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          onClick={() => {
            setIsFormOpen(!isFormOpen);
            setIsEditing(false);
            setForm({ title: "", description: "", category: "Tenun", image_url: "" });
            setError(null);
          }}
        >
          <span className="text-lg">+</span>
          Tambah Foto
        </button>
      </div>

      {isFormOpen && (
        <div className="rounded-lg border border-rose-200 bg-white p-4">
          <h2 className="text-lg font-semibold mb-4">
            {isEditing ? "Edit Foto" : "Tambah Foto ke Galeri"}
          </h2>
          {error && (
            <div className="mb-3 rounded bg-red-100 text-red-700 p-2 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Judul Foto</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded border border-gray-300 p-2"
                placeholder="Judul foto"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Deskripsi</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full rounded border border-gray-300 p-2"
                rows={3}
                placeholder="Deskripsi foto"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Kategori</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded border border-gray-300 p-2"
              >
                <option value="Tenun">Tenun</option>
                <option value="Kegiatan Umum">Kegiatan Umum</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Upload Gambar</label>
              <ImageUpload
                onUploadComplete={(url: string) => setForm({ ...form, image_url: url })}
                currentImageUrl={form.image_url}
              />
              {!form.image_url && (
                <p className="text-xs text-gray-500 mt-1">Format yang didukung: JPEG, PNG, GIF, WebP. Maksimal 2MB.</p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="rounded bg-red-700 hover:bg-red-800 text-white px-4 py-2"
                disabled={loading}
              >
                {loading ? "Menyimpan..." : "Simpan Foto"}
              </button>
              <button
                type="button"
                className="rounded border border-red-700 text-red-700 px-4 py-2"
                onClick={resetForm}
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold mb-4">Daftar Galeri</h2>
        {loading && items.length === 0 ? (
          <p className="text-sm text-gray-500">Memuat...</p>
        ) : items.length === 0 ? (
          <div className="rounded-lg border border-rose-200 bg-white p-8 text-center text-red-900/60">
            Belum ada foto di galeri. Tambahkan foto baru!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <div key={item.id} className="rounded border border-gray-200 p-3">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-40 object-cover rounded"
                />
                <div className="mt-2">
                  <h3 className="font-medium">{item.title}</h3>
                  {item.category && (
                    <p className="text-xs text-gray-500">Kategori: {item.category}</p>
                  )}
                  {item.description && (
                    <p className="text-sm text-gray-700 mt-1">{item.description}</p>
                  )}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    className="rounded bg-gray-100 text-gray-800 px-2 py-1 text-sm"
                    onClick={() => startEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="rounded bg-red-600 text-white px-2 py-1 text-sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}