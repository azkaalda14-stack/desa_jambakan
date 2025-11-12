"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function InlineActions({ pageId }: { pageId: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const ok = confirm("Hapus konten ini dari publik?");
    if (!ok) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("pages").delete().eq("id", pageId);
      if (error) throw error;
      router.refresh();
    } catch (e) {
      alert("Gagal menghapus: " + (e as any)?.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-2">
      <a
        href={`?edit=${pageId}#kelola`}
        className="rounded bg-gray-100 text-gray-800 px-3 py-1 text-sm"
      >
        Edit
      </a>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="rounded bg-red-600 text-white px-3 py-1 text-sm disabled:opacity-50"
      >
        {loading ? "Menghapus..." : "Hapus"}
      </button>
    </div>
  );
}