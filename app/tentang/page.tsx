import { createClient } from "@/lib/supabase/server"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tentang",
}
import Header from "@/components/header"
import Footer from "@/components/footer"
import DemographicsSection from "@/components/demographics-section"
import PopulationInfographics from "@/components/population-infographics"

export default async function AboutPage() {
  const supabase = await createClient()

  const { data: villageInfo } = await supabase.from("village_info").select("*").single()

  // Cek admin yang login untuk menampilkan tombol edit
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: admin } = user
    ? await supabase.from("admins").select("id").eq("id", user.id).single()
    : ({ data: null } as any)

  // Konten Sejarah Desa (published)
  const { data: sejarahPages } = await supabase
    .from("pages")
    .select("title,content,category,status,published_at")
    .eq("category", "sejarah")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(1)
  const sejarahContent = sejarahPages?.[0]?.content || null

  // Visi & Misi dari content_blocks (opsional), fallback ke placeholder
  const { data: visiMisiBlock } = await supabase
    .from("content_blocks")
    .select("data")
    .eq("key", "visi_misi")
    .single()
  const visi = (visiMisiBlock as any)?.data?.visi || villageInfo?.vision || "Menjadi desa yang maju, berbudaya, dan sejahtera."
  const misi: string[] = (visiMisiBlock as any)?.data?.misi || villageInfo?.mission || [
    "Meningkatkan pelayanan publik yang transparan dan akuntabel",
    "Mendorong partisipasi masyarakat dalam pembangunan desa",
    "Melestarikan budaya lokal dan kearifan desa",
  ]

  // Data demografis tahunan (opsional), fallback contoh
  const { data: demografiBlock } = await supabase
    .from("content_blocks")
    .select("data")
    .eq("key", "demografi_tahunan")
    .single()
  const demoData = (demografiBlock as any)?.data?.years || [
    { year: 2024, births: 42, deaths: 11, households: 835 },
    { year: 2023, births: 39, deaths: 14, households: 820 },
    { year: 2022, births: 35, deaths: 13, households: 802 },
  ]

  // Data untuk Infografis Penduduk (opsional), fallback contoh
  const { data: pendudukRingkas } = await supabase
    .from("content_blocks")
    .select("data")
    .eq("key", "penduduk_ringkas")
    .single()
  const summary = {
    population: (pendudukRingkas as any)?.data?.population ?? villageInfo?.population ?? 0,
    households: (pendudukRingkas as any)?.data?.households ?? demoData?.[0]?.households ?? 0,
  }

  const { data: blokKelompokUmur } = await supabase
    .from("content_blocks")
    .select("data")
    .eq("key", "kelompok_umur")
    .single()
  const ageGroups = (blokKelompokUmur as any)?.data?.items || [
    { group: "0-4", male: 74, female: 51 },
    { group: "5-9", male: 106, female: 83 },
    { group: "10-14", male: 104, female: 84 },
    { group: "15-19", male: 97, female: 74 },
    { group: "20-24", male: 83, female: 88 },
    { group: "25-29", male: 79, female: 80 },
    { group: "30-34", male: 56, female: 65 },
    { group: "35-39", male: 61, female: 69 },
    { group: "40-44", male: 64, female: 62 },
    { group: "45-49", male: 62, female: 77 },
    { group: "50-54", male: 67, female: 93 },
    { group: "55-59", male: 54, female: 62 },
    { group: "60-64", male: 60, female: 60 },
    { group: "65-69", male: 46, female: 47 },
    { group: "70-74", male: 29, female: 25 },
    { group: ">75", male: 40, female: 35 },
  ]

  const { data: blokDusun } = await supabase
    .from("content_blocks")
    .select("data")
    .eq("key", "dusun_penduduk")
    .single()
  const dusun = (blokDusun as any)?.data?.items || [
    { name: "Padealo", value: 703 },
    { name: "Tangoa", value: 820 },
    { name: "Sarampoang", value: 580 },
    { name: "Maningi", value: 451 },
  ]

  const { data: blokPendidikan } = await supabase
    .from("content_blocks")
    .select("data")
    .eq("key", "pendidikan_penduduk")
    .single()
  const education = (blokPendidikan as any)?.data?.items || [
    { level: "Tidak/Belum Sekolah", value: 417 },
    { level: "Belum Tamat SD", value: 267 },
    { level: "Tamat SD", value: 1106 },
    { level: "SMP", value: 612 },
    { level: "SMA", value: 728 },
    { level: "Diploma/Sarjana", value: 140 },
  ]

  // Pekerjaan
  const { data: blokPekerjaan } = await supabase
    .from("content_blocks")
    .select("data")
    .eq("key", "pekerjaan_penduduk")
    .single()
  const jobs = (blokPekerjaan as any)?.data?.items || [
    { name: "Pelajar/Mahasiswa", value: 323 },
    { name: "Belum/Tidak Bekerja", value: 272 },
    { name: "Mengurus Rumah Tangga", value: 271 },
    { name: "Karyawan Swasta", value: 117 },
    { name: "Nelayan/Perikanan", value: 51 },
    { name: "Petani/Pekebun", value: 39 },
    { name: "Wiraswasta", value: 27 },
  ]

  // Perkawinan
  const { data: blokPerkawinan } = await supabase
    .from("content_blocks")
    .select("data")
    .eq("key", "status_perkawinan")
    .single()
  const marriage = (blokPerkawinan as any)?.data?.items || [
    { name: "Belum Kawin", value: 619 },
    { name: "Kawin", value: 459 },
    { name: "Cerai Mati", value: 69 },
    { name: "Cerai Hidup", value: 4 },
    { name: "Kawin Tercatat", value: 2 },
    { name: "Kawin Tidak Tercatat", value: 0 },
  ]

  // Agama
  const { data: blokAgama } = await supabase
    .from("content_blocks")
    .select("data")
    .eq("key", "agama_penduduk")
    .single()
  const religion = (blokAgama as any)?.data?.items || [
    { name: "Islam", value: 1154 },
    { name: "Kristen", value: 0 },
    { name: "Katolik", value: 0 },
    { name: "Hindu", value: 0 },
    { name: "Budha", value: 0 },
    { name: "Kepercayaan lainnya", value: 0 },
  ]

  // Statistik ringkas dihapus sesuai permintaan

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <img src="/placeholder.svg?key=q94jl" alt="Desa" className="rounded-xl shadow-lg w-full h-auto" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{villageInfo?.name || "Desa Kami"}</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                {villageInfo?.description ||
                  "Desa kami adalah sebuah komunitas yang berkembang dengan semangat kebersamaan dan kemajuan bersama."}
              </p>
            </div>
          </div>

          {/* Statistik ringkas dihapus */}


          {/* Sejarah Desa */}
          <section className="py-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl md:text-3xl font-bold text-red-900">Sejarah Desa</h2>
            </div>
            {sejarahContent ? (
              <div className="prose max-w-none bg-white p-6 rounded-lg shadow-md" dangerouslySetInnerHTML={{ __html: sejarahContent }} />
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-700">
                  Belum ada konten sejarah yang dipublikasikan. Silakan tambahkan konten pada admin kategori
                  <span className="font-semibold"> Sejarah</span>.
                </p>
              </div>
            )}
          </section>

          {/* Visi & Misi */}
          <section className="py-12">
            <h2 className="text-2xl md:text-3xl font-bold text-red-900 mb-6">Visi & Misi</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Visi</h3>
                <p className="text-gray-700">{visi}</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Misi</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {misi.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Statistik Demografis */}
          <section className="py-12">
            <h2 className="text-2xl md:text-3xl font-bold text-red-900 mb-6">Statistik Demografis</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <DemographicsSection data={demoData} />
            </div>
          </section>

          {/* Infografis Penduduk mengikuti referensi gambar */}
          <section className="py-12">
            <h2 className="text-2xl md:text-3xl font-bold text-red-900 mb-6">Infografis Penduduk</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <PopulationInfographics summary={summary} ageGroups={ageGroups} dusun={dusun} education={education} jobs={jobs} marriage={marriage} religion={religion} />
            </div>
          </section>
        </div>
      </section>
      <Footer />
    </main>
  )
}
