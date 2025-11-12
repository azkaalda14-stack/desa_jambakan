"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type SejarahItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  status: "draft" | "published";
  category: string | null;
};

export default function SejarahManagement({ currentUserId }: { currentUserId: string }) {
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [item, setItem] = useState<SejarahItem | null>(null);
  const [deskripsi, setDeskripsi] = useState("");
  const [sejarah, setSejarah] = useState("");

  // Ambil entri sejarah terbaru (apapun statusnya)
  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("pages")
        .select("id,title,slug,excerpt,content,status,category")
        .eq("category", "sejarah")
        .order("updated_at", { ascending: false })
        .limit(1);
      setLoading(false);
      if (error) {
        setError(error.message);
        return;
      }
      const current = (data && data[0]) || null;
      if (!mounted) return;
      setItem(current as SejarahItem | null);
      setDeskripsi((current?.excerpt as string) || "");
      setSejarah((current?.content as string) || "");
    }
    fetchData();
    return () => {
      mounted = false;
    };
  }, [supabase]);

  async function save() {
    setLoading(true);
    setError(null);
    const payload = {
      title: item?.title || "Sejarah Desa",
      slug: item?.slug || "sejarah-desa",
      excerpt: deskripsi,
      content: sejarah,
      status: "published" as const,
      category: "sejarah",
      created_by: currentUserId,
      published_at: new Date().toISOString(),
    };

    let res;
    if (item?.id) {
      res = await supabase.from("pages").update(payload).eq("id", item.id).select().single();
    } else {
      res = await supabase.from("pages").insert(payload).select().single();
    }
    setLoading(false);
    if (res.error) {
      setError(res.error.message);
      return;
    }
    // Simpan hasil dan sinkronkan form
    const saved = res.data as SejarahItem;
    setItem(saved);
    setDeskripsi(saved.excerpt || "");
    setSejarah(saved.content || "");
  }

  return (
    <section className="rounded-xl border bg-neutral-50 p-5">
      <h2 className="text-xl font-semibold mb-4">Deskripsi & Sejarah</h2>
      {error && (
        <div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Deskripsi</label>
          <textarea
            className="w-full rounded-md border bg-white p-3 min-h-[180px]"
            placeholder="Ringkasan singkat profil desa..."
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Sejarah</label>
          <textarea
            className="w-full rounded-md border bg-white p-3 min-h-[180px]"
            placeholder="Tulis sejarah desa secara lengkap..."
            value={sejarah}
            onChange={(e) => setSejarah(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button
          onClick={save}
          disabled={loading}
          className="px-4 py-2 rounded-md bg-red-700 text-white hover:bg-red-800 disabled:opacity-60"
        >
          {loading ? "Menyimpan..." : "Simpan Sejarah"}
        </button>
        {item?.status === "published" && (
          <span className="text-xs text-gray-600">Tersimpan sebagai konten dipublikasikan</span>
        )}
      </div>
    </section>
  );
}