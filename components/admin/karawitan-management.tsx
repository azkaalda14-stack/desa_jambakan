"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type PageItem = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  status: "draft" | "published";
  category?: string | null;
  created_at?: string | null;
};

export default function KarawitanManagement({
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
    excerpt: string;
    content: string;
    video_url: string;
  }>({ title: "", slug: "", excerpt: "", content: "", video_url: "" });

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

  function resetForm() {
    setForm({ title: "", slug: "", excerpt: "", content: "", video_url: "" });
    setEditingId(null);
    setIsFormOpen(false);
    setError(null);
  }

  async function refresh() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("pages")
      .select("id,title,slug,excerpt,content,status,category,created_at")
      .eq("category", "karawitan")
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
      if (!form.title) throw new Error("Judul wajib diisi");

      const composedContent = form.video_url
        ? `${form.video_url}\n\n${form.content}`
        : form.content;

      if (editingId) {
        const { error } = await supabase
          .from("pages")
          .update({
            title: form.title,
            slug: form.slug || toSlug(form.title),
            excerpt: form.excerpt || null,
            content: composedContent || null,
            status: "published",
          })
          .eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("pages").insert({
          title: form.title,
          slug: form.slug || toSlug(form.title),
          excerpt: form.excerpt || null,
          content: composedContent || null,
          status: "published",
          category: "karawitan",
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
    // ambil URL pertama dari konten sebagai video_url jika ada
    const urlMatch = item.content?.match(/https?:\/\/\S+/);
    const videoUrl = urlMatch ? urlMatch[0] : "";
    const contentWithoutUrl = videoUrl
      ? (item.content || "").replace(videoUrl, "").trim()
      : item.content || "";

    setForm({
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt || "",
      content: contentWithoutUrl,
      video_url: videoUrl,
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
          <h1 className="text-3xl font-bold text-gray-900">Kelola Karawitan</h1>
          <p className="text-sm text-red-900/60 mt-2">Total: {items?.length || 0} konten</p>
        </div>
        <button
          className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          onClick={() => {
            setIsFormOpen(!isFormOpen);
            setEditingId(null);
            setForm({ title: "", slug: "", excerpt: "", content: "", video_url: "" });
            setError(null);
          }}
        >
          <span className="text-lg">+</span>
          Tambah Konten
        </button>
      </div>

      {isFormOpen && (
        <div className="rounded-lg border border-rose-200 bg-white p-4">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? "Edit Konten Karawitan" : "Tambah Konten Karawitan"}
          </h2>
          {error && (
            <div className="mb-3 rounded bg-red-100 text-red-700 p-2 text-sm">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Judul</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setForm({ ...form, title, slug: toSlug(title) });
                }}
                className="w-full rounded border border-gray-300 p-2"
                placeholder="Judul konten"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Deskripsi Singkat</label>
              <input
                type="text"
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                className="w-full rounded border border-gray-300 p-2"
                placeholder="Deskripsi singkat"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Konten Lengkap</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full rounded border border-gray-300 p-2"
                rows={6}
                placeholder="Konten lengkap tentang karawitan"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">URL Video</label>
              <input
                type="url"
                value={form.video_url}
                onChange={(e) => setForm({ ...form, video_url: e.target.value })}
                className="w-full rounded border border-gray-300 p-2"
                placeholder="https://..."
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="rounded bg-red-700 hover:bg-red-800 text-white px-4 py-2" disabled={loading}>
                {loading ? "Menyimpan..." : editingId ? "Simpan Konten" : "Simpan Konten"}
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
          Belum ada konten karawitan. Tambahkan konten baru!
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="rounded border border-gray-200 p-4 bg-white">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  {item.excerpt && <p className="text-sm text-gray-600 mt-1">{item.excerpt}</p>}
                  <div className="flex gap-3 mt-3">
                    <span className={`text-xs px-2 py-1 rounded ${item.status === "published" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"}`}>
                      {item.status === "published" ? "Publish" : "Draft"}
                    </span>
                    <span className="text-xs text-gray-500">{new Date(item.created_at || Date.now()).toLocaleDateString("id-ID")}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="rounded border px-2 py-1 text-sm" onClick={() => startEdit(item)}>Edit</button>
                  <button className="rounded bg-red-700 text-white px-2 py-1 text-sm" onClick={() => handleDelete(item.id)}>Hapus</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}