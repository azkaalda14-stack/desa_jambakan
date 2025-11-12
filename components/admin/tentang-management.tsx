"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type YearStat = { year: number; births: number; deaths: number; households: number };
type NamedValue = { name: string; value: number };
type AgeGroup = { group: string; male: number; female: number };

export default function TentangManagement({ currentUserId }: { currentUserId: string }) {
  const supabase = useMemo(() => createClient(), []);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Desa Kami (village_info)
  const [villageId, setVillageId] = useState<string | null>(null);
  const [villageName, setVillageName] = useState("");
  const [villageDescription, setVillageDescription] = useState("");
  const [population, setPopulation] = useState<number>(0);

  // Visi & Misi
  const [visi, setVisi] = useState("");
  const [misiText, setMisiText] = useState(""); // newline separated

  // Demografi tahunan
  const [years, setYears] = useState<YearStat[]>([]);

  // Infografis ringkas
  const [householdsSummary, setHouseholdsSummary] = useState<number>(0);

  // Items by category
  const [agama, setAgama] = useState<NamedValue[]>([]);
  const [perkawinan, setPerkawinan] = useState<NamedValue[]>([]);
  const [pekerjaan, setPekerjaan] = useState<NamedValue[]>([]);
  const [pendidikan, setPendidikan] = useState<NamedValue[]>([]);
  const [dusun, setDusun] = useState<NamedValue[]>([]);
  const [kelompokUmur, setKelompokUmur] = useState<AgeGroup[]>([]);

  async function loadAll() {
    setLoading(true);
    setError(null);
    try {
      const { data: villageInfo } = await supabase.from("village_info").select("*").single();
      if (villageInfo) {
        setVillageId(villageInfo.id);
        setVillageName(villageInfo.name || "");
        setVillageDescription(villageInfo.description || "");
        setPopulation(villageInfo.population || 0);
      }

      const { data: visiMisiBlock } = await supabase
        .from("content_blocks")
        .select("data")
        .eq("key", "visi_misi")
        .single();
      const vm = (visiMisiBlock as any)?.data || {};
      setVisi(vm.visi || "");
      setMisiText((vm.misi || []).join("\n"));

      const { data: demografiBlock } = await supabase
        .from("content_blocks")
        .select("data")
        .eq("key", "demografi_tahunan")
        .single();
      setYears(((demografiBlock as any)?.data?.years || []) as YearStat[]);

      const { data: ringkas } = await supabase
        .from("content_blocks")
        .select("data")
        .eq("key", "penduduk_ringkas")
        .single();
      setHouseholdsSummary((ringkas as any)?.data?.households || 0);
      setPopulation((ringkas as any)?.data?.population ?? population);

      async function loadList(key: string, setter: (v: NamedValue[]) => void) {
        const { data } = await supabase.from("content_blocks").select("data").eq("key", key).single();
        setter((((data as any)?.data?.items) || []) as NamedValue[]);
      }

      async function loadAge() {
        const { data } = await supabase
          .from("content_blocks")
          .select("data")
          .eq("key", "kelompok_umur")
          .single();
        setKelompokUmur((((data as any)?.data?.items) || []) as AgeGroup[]);
      }

      await Promise.all([
        loadList("agama_penduduk", setAgama),
        loadList("status_perkawinan", setPerkawinan),
        loadList("pekerjaan_penduduk", setPekerjaan),
        loadList("pendidikan_penduduk", setPendidikan),
        loadList("dusun_penduduk", setDusun),
        loadAge(),
      ]);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helpers
  function addYear() {
    const now = new Date().getFullYear();
    setYears((prev) => [...prev, { year: now, births: 0, deaths: 0, households: 0 }]);
  }
  function removeYear(idx: number) {
    setYears((prev) => prev.filter((_, i) => i !== idx));
  }
  function addItem(setter: (v: NamedValue[]) => void) {
    setter((prev) => [...prev, { name: "", value: 0 }]);
  }
  function removeItem(setter: (v: NamedValue[]) => void, idx: number) {
    setter((prev) => prev.filter((_, i) => i !== idx));
  }
  function addAgeGroup() {
    setKelompokUmur((prev) => [...prev, { group: "0-4", male: 0, female: 0 }]);
  }
  function removeAgeGroup(idx: number) {
    setKelompokUmur((prev) => prev.filter((_, i) => i !== idx));
  }

  async function saveVillageInfo() {
    setLoading(true);
    setError(null);
    try {
      if (villageId) {
        const { error } = await supabase
          .from("village_info")
          .update({ name: villageName, description: villageDescription, population })
          .eq("id", villageId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("village_info")
          .insert({ name: villageName, description: villageDescription, population });
        if (error) throw error;
      }
      // also store summary block for population/households
      const { error: e2 } = await supabase.from("content_blocks").upsert({
        key: "penduduk_ringkas",
        title: "Ringkas Penduduk",
        data: { population, households: householdsSummary },
        updated_by: currentUserId,
        status: "active",
      }, { onConflict: "key" } as any);
      if (e2) throw e2;
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan Desa Kami");
    } finally {
      setLoading(false);
    }
  }

  async function saveVisiMisi() {
    setLoading(true);
    setError(null);
    try {
      const misi = misiText.split("\n").map((s) => s.trim()).filter(Boolean);
      const { error } = await supabase.from("content_blocks").upsert({
        key: "visi_misi",
        title: "Visi & Misi",
        data: { visi, misi },
        updated_by: currentUserId,
        status: "active",
      }, { onConflict: "key" } as any);
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan Visi & Misi");
    } finally {
      setLoading(false);
    }
  }

  async function saveDemografiTahunan() {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.from("content_blocks").upsert({
        key: "demografi_tahunan",
        title: "Demografi Tahunan",
        data: { years },
        updated_by: currentUserId,
        status: "active",
      }, { onConflict: "key" } as any);
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan Demografi Tahunan");
    } finally {
      setLoading(false);
    }
  }

  async function saveList(key: string, title: string, items: NamedValue[]) {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.from("content_blocks").upsert({
        key,
        title,
        data: { items },
        updated_by: currentUserId,
        status: "active",
      }, { onConflict: "key" } as any);
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || `Gagal menyimpan ${title}`);
    } finally {
      setLoading(false);
    }
  }

  async function saveKelompokUmur() {
    return saveList("kelompok_umur", "Kelompok Umur", kelompokUmur.map((k) => ({ name: k.group, value: 0 })));
  }

  return (
    <div className="space-y-8" id="kelola-tentang">
      {error && <div className="rounded bg-red-100 text-red-700 p-2 text-sm">{error}</div>}

      {/* Desa Kami */}
      <section className="rounded-lg border p-4 bg-white">
        <h2 className="text-lg font-semibold mb-4">Desa Kami</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nama Desa</label>
            <input className="w-full rounded border p-2" value={villageName} onChange={(e) => setVillageName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Jumlah Penduduk</label>
            <input type="number" className="w-full rounded border p-2" value={population} onChange={(e) => setPopulation(Number(e.target.value))} />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Deskripsi</label>
          <textarea className="w-full rounded border p-2" rows={4} value={villageDescription} onChange={(e) => setVillageDescription(e.target.value)} />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Jumlah KK (Ringkas)</label>
          <input type="number" className="w-full rounded border p-2" value={householdsSummary} onChange={(e) => setHouseholdsSummary(Number(e.target.value))} />
        </div>
        <button onClick={saveVillageInfo} className="rounded bg-red-600 text-white px-3 py-2 text-sm" disabled={loading}>{loading ? "Menyimpan..." : "Simpan Desa Kami"}</button>
      </section>

      {/* Sejarah dikelola via PageManagement di halaman, tidak di sini */}

      {/* Visi & Misi */}
      <section className="rounded-lg border p-4 bg-white">
        <h2 className="text-lg font-semibold mb-4">Visi & Misi</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Visi</label>
          <textarea className="w-full rounded border p-2" rows={3} value={visi} onChange={(e) => setVisi(e.target.value)} />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Misi (satu per baris)</label>
          <textarea className="w-full rounded border p-2" rows={6} value={misiText} onChange={(e) => setMisiText(e.target.value)} />
        </div>
        <button onClick={saveVisiMisi} className="rounded bg-red-600 text-white px-3 py-2 text-sm" disabled={loading}>{loading ? "Menyimpan..." : "Simpan Visi & Misi"}</button>
      </section>

      {/* Demografi Tahunan */}
      <section className="rounded-lg border p-4 bg-white">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Statistik Demografis (Tahunan)</h2>
          <button type="button" className="rounded bg-gray-200 text-gray-800 px-3 py-2 text-sm" onClick={addYear}>Tambah Tahun</button>
        </div>
        <div className="space-y-3">
          {years.map((y, idx) => (
            <div key={idx} className="grid md:grid-cols-4 gap-3">
              <input type="number" className="rounded border p-2" value={y.year} onChange={(e) => setYears((prev) => prev.map((p, i) => i === idx ? { ...p, year: Number(e.target.value) } : p))} />
              <input type="number" className="rounded border p-2" value={y.births} onChange={(e) => setYears((prev) => prev.map((p, i) => i === idx ? { ...p, births: Number(e.target.value) } : p))} placeholder="Lahir" />
              <input type="number" className="rounded border p-2" value={y.deaths} onChange={(e) => setYears((prev) => prev.map((p, i) => i === idx ? { ...p, deaths: Number(e.target.value) } : p))} placeholder="Meninggal" />
              <div className="flex gap-2">
                <input type="number" className="rounded border p-2 flex-1" value={y.households} onChange={(e) => setYears((prev) => prev.map((p, i) => i === idx ? { ...p, households: Number(e.target.value) } : p))} placeholder="KK" />
                <button type="button" className="rounded bg-red-100 text-red-700 px-3 py-2 text-sm" onClick={() => removeYear(idx)}>Hapus</button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <button onClick={saveDemografiTahunan} className="rounded bg-red-600 text-white px-3 py-2 text-sm" disabled={loading}>{loading ? "Menyimpan..." : "Simpan Demografi"}</button>
        </div>
      </section>

      {/* List editors */}
      {[
        { key: "agama_penduduk", title: "Berdasarkan Agama", items: agama, setter: setAgama },
        { key: "status_perkawinan", title: "Berdasarkan Perkawinan", items: perkawinan, setter: setPerkawinan },
        { key: "pekerjaan_penduduk", title: "Berdasarkan Pekerjaan", items: pekerjaan, setter: setPekerjaan },
        { key: "pendidikan_penduduk", title: "Berdasarkan Pendidikan", items: pendidikan, setter: setPendidikan },
        { key: "dusun_penduduk", title: "Berdasarkan Dusun", items: dusun, setter: setDusun },
      ].map(({ key, title, items, setter }) => (
        <section key={key} className="rounded-lg border p-4 bg-white">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button type="button" className="rounded bg-gray-200 text-gray-800 px-3 py-2 text-sm" onClick={() => addItem(setter)}>Tambah Baris</button>
          </div>
          <div className="space-y-3">
            {items.map((it, idx) => (
              <div key={idx} className="grid md:grid-cols-3 gap-3">
                <input className="rounded border p-2" placeholder="Nama" value={it.name} onChange={(e) => setter(items.map((p, i) => i === idx ? { ...p, name: e.target.value } : p))} />
                <input type="number" className="rounded border p-2" placeholder="Jumlah" value={it.value} onChange={(e) => setter(items.map((p, i) => i === idx ? { ...p, value: Number(e.target.value) } : p))} />
                <div>
                  <button type="button" className="rounded bg-red-100 text-red-700 px-3 py-2 text-sm" onClick={() => removeItem(setter, idx)}>Hapus</button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <button onClick={() => saveList(key, title, items)} className="rounded bg-red-600 text-white px-3 py-2 text-sm" disabled={loading}>{loading ? "Menyimpan..." : `Simpan ${title}`}</button>
          </div>
        </section>
      ))}

      {/* Kelompok Umur */}
      <section className="rounded-lg border p-4 bg-white">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Berdasarkan Kelompok Umur</h2>
          <button type="button" className="rounded bg-gray-200 text-gray-800 px-3 py-2 text-sm" onClick={addAgeGroup}>Tambah Kelompok</button>
        </div>
        <div className="space-y-3">
          {kelompokUmur.map((it, idx) => (
            <div key={idx} className="grid md:grid-cols-4 gap-3">
              <input className="rounded border p-2" placeholder="Kelompok" value={it.group} onChange={(e) => setKelompokUmur(kelompokUmur.map((p, i) => i === idx ? { ...p, group: e.target.value } : p))} />
              <input type="number" className="rounded border p-2" placeholder="Laki-laki" value={it.male} onChange={(e) => setKelompokUmur(kelompokUmur.map((p, i) => i === idx ? { ...p, male: Number(e.target.value) } : p))} />
              <input type="number" className="rounded border p-2" placeholder="Perempuan" value={it.female} onChange={(e) => setKelompokUmur(kelompokUmur.map((p, i) => i === idx ? { ...p, female: Number(e.target.value) } : p))} />
              <div>
                <button type="button" className="rounded bg-red-100 text-red-700 px-3 py-2 text-sm" onClick={() => removeAgeGroup(idx)}>Hapus</button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <button onClick={saveKelompokUmur} className="rounded bg-red-600 text-white px-3 py-2 text-sm" disabled={loading}>{loading ? "Menyimpan..." : "Simpan Kelompok Umur"}</button>
        </div>
      </section>
    </div>
  );
}