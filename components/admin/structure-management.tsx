"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import ImageUpload from "@/components/admin/image-upload";

type StructureItem = {
  id: string;
  name: string;
  position: string;
  photo_url?: string | null;
  order_index?: number | null;
  status: "active" | "inactive";
};

export default function StructureManagement({ currentUserId }: { currentUserId: string }) {
  const supabase = useMemo(() => createClient(), []);
  const [items, setItems] = useState<StructureItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [form, setForm] = useState<{
    id?: string;
    name: string;
    position: string;
    contact?: string;
    department?: string;
    photo_url: string;
    order_index: number;
    status: "active" | "inactive";
  }>({ name: "", position: "", contact: "", department: "Pengurus", photo_url: "", order_index: 0, status: "active" });

  async function refresh() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("village_structure")
      .select("id,name,position,photo_url,order_index,status")
      .order("order_index", { ascending: true });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setItems((data as StructureItem[]) || []);
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function resetForm() {
    setForm({ name: "", position: "", contact: "", department: "Pengurus", photo_url: "", order_index: 0, status: "active" });
    setIsEditing(false);
    setIsFormOpen(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (!form.name || !form.position) {
        throw new Error("Nama dan jabatan wajib diisi");
      }
      const positionWithMeta = `${form.position}${form.department ? ` (${form.department})` : ""}${form.contact ? ` - ${form.contact}` : ""}`;
      if (isEditing && form.id) {
        const { error } = await supabase
          .from("village_structure")
          .update({
            name: form.name,
            position: positionWithMeta,
            photo_url: form.photo_url || null,
            order_index: form.order_index || null,
            status: form.status,
          })
          .eq("id", form.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("village_structure").insert({
          name: form.name,
          position: positionWithMeta,
          photo_url: form.photo_url || null,
          order_index: form.order_index || null,
          status: form.status,
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
    const ok = confirm("Hapus anggota struktur ini?");
    if (!ok) return;
    setLoading(true);
    setError(null);
    const { error } = await supabase.from("village_structure").delete().eq("id", id);
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function startEdit(item: StructureItem) {
    setForm({
      id: item.id,
      name: item.name,
      position: item.position,
      contact: "",
      department: "Pengurus",
      photo_url: item.photo_url || "",
      order_index: item.order_index || 0,
      status: item.status,
    });
    setIsEditing(true);
    setIsFormOpen(true);
  }

  async function toggleStatus(item: StructureItem) {
    const next = item.status === "active" ? "inactive" : "active";
    const { error } = await supabase.from("village_structure").update({ status: next }).eq("id", item.id);
    if (error) {
      setError(error.message);
      return;
    }
    await refresh();
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kelola Struktur Organisasi</h1>
          <p className="text-sm text-red-900/60 mt-2">Total: {items?.length || 0} anggota</p>
        </div>
        <button
          className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          onClick={() => {
            setIsFormOpen(!isFormOpen);
            if (!isFormOpen) {
              setIsEditing(false);
              setForm({ name: "", position: "", contact: "", department: "Pengurus", photo_url: "", order_index: 0, status: "active" });
            }
            setError(null);
          }}
        >
          <span className="text-lg">+</span>
          Tambah Anggota
        </button>
      </div>

      {isFormOpen && (
        <div className="rounded-lg border border-rose-200 p-4 bg-white">
          <h2 className="text-lg font-semibold mb-4">{isEditing ? "Edit Anggota" : "Tambah Anggota Baru"}</h2>
          {error && <div className="mb-3 rounded bg-red-100 text-red-700 p-2 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nama Lengkap *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded border border-gray-300 p-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Jabatan *</label>
                <input type="text" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} className="w-full rounded border border-gray-300 p-2" required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Kontak</label>
                <input type="text" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} className="w-full rounded border border-gray-300 p-2" placeholder="Nomor HP atau Email" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bagian</label>
                <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="w-full rounded border border-gray-300 p-2">
                  <option value="Pengurus">Pengurus</option>
                  <option value="Staf">Staf</option>
                  <option value="BPD">BPD</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Deskripsi</label>
              <textarea className="w-full rounded border border-gray-300 p-2" rows={4} placeholder="Deskripsi singkat tentang anggota" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Foto</label>
              <ImageUpload
                onUpload={(url: string) => setForm({ ...form, photo_url: url })}
                currentImage={form.photo_url || undefined}
                folder="village_structure"
                bucket="village_structure"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Urutan Tampil</label>
                <input type="number" value={form.order_index} onChange={(e) => setForm({ ...form, order_index: Number(e.target.value) })} className="w-full rounded border border-gray-300 p-2" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button type="submit" className="rounded bg-red-700 hover:bg-red-800 text-white px-4 py-2 text-sm disabled:opacity-50" disabled={loading}>{loading ? "Menyimpan..." : isEditing ? "Simpan Anggota" : "Simpan Anggota"}</button>
              <button type="button" className="rounded border border-red-700 text-red-700 px-4 py-2 text-sm" onClick={resetForm}>Batal</button>
            </div>
          </form>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold mb-4">Daftar Anggota Struktur Organisasi</h2>
        {loading && items.length === 0 ? (
          <p className="text-sm text-gray-500">Memuat...</p>
        ) : items.length === 0 ? (
          <div className="rounded-lg border border-rose-200 bg-white p-8 text-center text-slate-500">Belum ada anggota struktur organisasi yang ditambahkan.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <div key={item.id} className="rounded border border-gray-200 p-3 bg-white">
                {item.photo_url && <img src={item.photo_url} alt={item.name} className="w-full h-40 object-cover rounded" />}
                <div className="mt-2">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-700">{item.position}</p>
        <p className="mt-1 text-xs">Status: <span className={item.status === "active" ? "text-red-600" : "text-yellow-600"}>{item.status}</span></p>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <button className="rounded bg-gray-100 text-gray-800 px-2 py-1 text-sm" onClick={() => startEdit(item)}>Edit</button>
                  <button className="rounded bg-red-700 text-white px-2 py-1 text-sm" onClick={() => handleDelete(item.id)}>Hapus</button>
                  <button className="rounded bg-indigo-600 text-white px-2 py-1 text-sm" onClick={() => toggleStatus(item)}>{item.status === "active" ? "Nonaktifkan" : "Aktifkan"}</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}