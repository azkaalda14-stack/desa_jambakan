"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import ImageUpload from "@/components/admin/image-upload";

type PageItem = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  featured_image_url?: string | null;
  status: "draft" | "published";
  category?: string | null;
  created_at?: string | null;
};

export default function TenunManagement({
  initialItems,
  currentUserId,
}: {
  initialItems: PageItem[];
  currentUserId: string;
}) {
  const supabase = useMemo(() => createClient(), []);
  const [items, setItems] = useState<PageItem[]>(initialItems || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<{
    title: string;
    slug: string;
    description: string;
    technique: string;
    material: string;
    price: string;
    image_url: string;
    status: "draft" | "published";
  }>({ title: "", slug: "", description: "", technique: "", material: "", price: "0", image_url: "", status: "published" });

  useEffect(() => {
    setItems(initialItems || []);
  }, [initialItems]);

  function toSlug(text: string) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  }

  function parseContent(content: string | null | undefined) {
    const c = content || "";
    const techMatch = c.match(/Teknik:\s*(.*)/);
    const matMatch = c.match(/Bahan:\s*(.*)/);
    const priceMatch = c.match(/Harga:\s*(.*)/);
    const descMatch = c.split(/\n\n/).slice(1).join("\n\n");
    return {
      technique: techMatch ? techMatch[1] : "",
      material: matMatch ? matMatch[1] : "",
      price: priceMatch ? priceMatch[1] : "",
      description: descMatch || "",
    };
  }

  function composeContent() {
    const header = `Teknik: ${form.technique}\nBahan: ${form.material}\nHarga: ${form.price}`;
    const body = form.description ? `\n\n${form.description}` : "";
    return `${header}${body}`;
  }

  function resetForm() {
    setForm({ title: "", slug: "", description: "", technique: "", material: "", price: "0", image_url: "", status: "published" });
    setEditingId(null);
    setIsFormOpen(false);
    setError(null);
  }

  async function refresh() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("pages")
      .select("id,title,slug,excerpt,content,featured_image_url,status,category,created_at")
      .eq("category", "tenun")
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setItems((data as PageItem[]) || []);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (!form.title) throw new Error("Judul karya wajib diisi");

      const content = composeContent();
      const payload = {
        title: form.title,
        slug: form.slug || toSlug(form.title),
        excerpt: form.description ? form.description.slice(0, 140) : null,
        content,
        featured_image_url: form.image_url || null,
        status: form.status,
        category: "tenun" as const,
        created_by: currentUserId,
      } as any;

      if (editingId) {
        const { error } = await supabase.from("pages").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("pages").insert(payload);
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
    const ok = confirm("Hapus karya ini?");
    if (!ok) return;
    setLoading(true);
    setError(null);
    const { error } = await supabase.from("pages").delete().eq("id", id);
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function startEdit(item: PageItem) {
    const parsed = parseContent(item.content);
    setForm({
      title: item.title,
      slug: item.slug,
      description: parsed.description || (item.excerpt || ""),
      technique: parsed.technique,
      material: parsed.material,
      price: parsed.price || "0",
      image_url: item.featured_image_url || "",
      status: item.status,
    });
    setEditingId(item.id);
    setIsFormOpen(true);
    setError(null);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kelola Karya Tenun</h1>
          <p className="text-sm text-red-900/60 mt-2">Total: {items?.length || 0} karya</p>
        </div>
        <button
          className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          onClick={() => {
            setIsFormOpen(!isFormOpen);
            setEditingId(null);
            setForm({ title: "", slug: "", description: "", technique: "", material: "", price: "0", image_url: "", status: "published" });
            setError(null);
          }}
        >
          <span className="text-lg">+</span>
          Tambah Karya
        </button>
      </div>

      {isFormOpen && (
        <div className="rounded-lg border border-rose-200 bg-white p-4">
          <h2 className="text-lg font-semibold mb-4">{editingId ? "Edit Karya Tenun" : "Tambah Karya Tenun Baru"}</h2>
          {error && <div className="mb-3 rounded bg-red-100 text-red-700 p-2 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Judul Karya</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => {
                  const t = e.target.value;
                  setForm({ ...form, title: t, slug: toSlug(t) });
                }}
                className="w-full rounded border border-gray-300 p-2"
                placeholder="Nama karya tenun"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Deskripsi</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full rounded border border-gray-300 p-2"
                rows={5}
                placeholder="Deskripsi lengkap karya"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Teknik</label>
                <input
                  type="text"
                  value={form.technique}
                  onChange={(e) => setForm({ ...form, technique: e.target.value })}
                  className="w-full rounded border border-gray-300 p-2"
                  placeholder="Mis: Tangan"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bahan</label>
                <input
                  type="text"
                  value={form.material}
                  onChange={(e) => setForm({ ...form, material: e.target.value })}
                  className="w-full rounded border border-gray-300 p-2"
                  placeholder="Mis: Benang Katun"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Gambar Produk</label>
              <ImageUpload onUploadComplete={(url: string) => setForm({ ...form, image_url: url })} currentImageUrl={form.image_url} />
              <p className="text-xs text-gray-500 mt-1">Format yang didukung: JPEG, PNG, GIF, WebP. Maksimal 2MB.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Harga (opsional)</label>
                <input
                  type="text"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full rounded border border-gray-300 p-2"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status Publikasi</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as "draft" | "published" })}
                  className="w-full rounded border border-gray-300 p-2"
                >
                  <option value="published">Langsung Publish</option>
                  <option value="draft">Simpan Draft</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Draft tidak akan tampil di halaman publik, hanya admin yang bisa melihat</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button type="submit" className="rounded bg-red-700 hover:bg-red-800 text-white px-4 py-2" disabled={loading}>
                {loading ? "Menyimpan..." : editingId ? "Simpan Karya" : "Simpan Karya"}
              </button>
              <button type="button" className="rounded border border-red-700 text-red-700 px-4 py-2" onClick={resetForm}>
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      {loading && items.length === 0 ? (
        <p className="text-sm text-gray-500">Memuat...</p>
      ) : items.length === 0 ? (
        <div className="rounded-lg border border-rose-200 bg-white p-8 text-center text-red-900/60">
          Belum ada karya tenun. Tambahkan karya baru!
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="rounded border border-gray-200 p-4 bg-white">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center rounded px-2 py-1 text-xs ${item.status === "published" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}>{item.status === "published" ? "Publikasi" : "Draft"}</span>
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  </div>
                  {item.excerpt && <p className="text-sm text-gray-700 mt-1">{item.excerpt}</p>}
                </div>
                <div className="w-32 h-20 rounded overflow-hidden border border-gray-200 bg-gray-50">
                  {item.featured_image_url ? (
                    <img src={item.featured_image_url} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <img src="/placeholder.jpg" alt={item.title} className="w-full h-full object-cover" />
                  )}
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <button className="rounded bg-gray-100 text-gray-800 px-3 py-1 text-sm" onClick={() => startEdit(item)}>Edit</button>
                <button className="rounded bg-red-700 text-white px-3 py-1 text-sm" onClick={() => handleDelete(item.id)}>Hapus</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}