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

export default function PageManagement({
  category,
  currentUserId,
}: {
  category: string;
  currentUserId: string;
}) {
  const supabase = useMemo(() => createClient(), []);
  const [items, setItems] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState<{
    id?: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featured_image_url: string;
    status: "draft" | "published";
  }>({ title: "", slug: "", excerpt: "", content: "", featured_image_url: "", status: "draft" });

  async function refresh() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("pages")
      .select("id,title,slug,excerpt,content,featured_image_url,status,category,created_at")
      .eq("category", category)
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setItems((data as PageItem[]) || []);
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  // Prefill edit form when query param ?edit=<id> is present and items loaded
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const editId = params.get("edit");
    if (!editId || items.length === 0) return;
    const target = items.find((i) => i.id === editId);
    if (target) {
      startEdit(target);
      const el = document.getElementById("kelola");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [items]);

  function resetForm() {
    setForm({ title: "", slug: "", excerpt: "", content: "", featured_image_url: "", status: "draft" });
    setIsEditing(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (!form.title || !form.slug) {
        throw new Error("Judul dan slug wajib diisi");
      }
      if (isEditing && form.id) {
        const { error } = await supabase
          .from("pages")
          .update({
            title: form.title,
            slug: form.slug,
            excerpt: form.excerpt || null,
            content: form.content || null,
            featured_image_url: form.featured_image_url || null,
            status: form.status,
          })
          .eq("id", form.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("pages").insert({
          title: form.title,
          slug: form.slug,
          excerpt: form.excerpt || null,
          content: form.content || null,
          featured_image_url: form.featured_image_url || null,
          status: form.status,
          category,
          created_by: currentUserId,
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
    const ok = confirm("Hapus konten ini?");
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
    setForm({
      id: item.id,
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt || "",
      content: item.content || "",
      featured_image_url: item.featured_image_url || "",
      status: item.status || "draft",
    });
    setIsEditing(true);
  }

  async function toggleStatus(item: PageItem) {
    const next = item.status === "published" ? "draft" : "published";
    const { error } = await supabase.from("pages").update({ status: next }).eq("id", item.id);
    if (error) {
      setError(error.message);
      return;
    }
    await refresh();
  }

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-gray-200 p-4 bg-white">
        <h2 className="text-lg font-semibold mb-4">
          {isEditing ? `Edit Konten (${category})` : `Tambah Konten (${category})`}
        </h2>
        {error && (
          <div className="mb-3 rounded bg-red-100 text-red-700 p-2 text-sm">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Judul</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded border border-gray-300 p-2"
                placeholder="Judul konten"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full rounded border border-gray-300 p-2"
                placeholder="contoh: karawitan-intro"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Excerpt</label>
            <input
              type="text"
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className="w-full rounded border border-gray-300 p-2"
              placeholder="Ringkasan singkat (opsional)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Konten</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full rounded border border-gray-300 p-2"
              rows={6}
              placeholder="Isi konten"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Gambar Utama</label>
            <ImageUpload
              onUploadComplete={(url: string) => setForm({ ...form, featured_image_url: url })}
              currentImageUrl={form.featured_image_url}
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm">Status:</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as "draft" | "published" })}
              className="rounded border border-gray-300 p-2 text-sm"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="rounded bg-blue-600 text-white px-3 py-2 text-sm disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Tambah"}
            </button>
            {isEditing && (
              <button
                type="button"
                className="rounded bg-gray-200 text-gray-800 px-3 py-2 text-sm"
                onClick={resetForm}
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

      <div id="kelola">
        <h2 className="text-lg font-semibold mb-4">Daftar Konten</h2>
        {loading && items.length === 0 ? (
          <p className="text-sm text-gray-500">Memuat...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-gray-500">Belum ada konten.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <div key={item.id} className="rounded border border-gray-200 p-3 bg-white">
                {item.featured_image_url && (
                  <img
                    src={item.featured_image_url}
                    alt={item.title}
                    className="w-full h-40 object-cover rounded"
                  />
                )}
                <div className="mt-2">
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-xs text-gray-500">Slug: {item.slug}</p>
                  {item.excerpt && <p className="text-sm text-gray-700 mt-1">{item.excerpt}</p>}
                  <p className="mt-1 text-xs">
        Status: <span className={item.status === "published" ? "text-red-600" : "text-yellow-600"}>{item.status}</span>
                  </p>
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
                  <button
                    className="rounded bg-indigo-600 text-white px-2 py-1 text-sm"
                    onClick={() => toggleStatus(item)}
                  >
                    {item.status === "published" ? "Jadikan Draft" : "Publish"}
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