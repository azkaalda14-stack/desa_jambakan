import Header from "@/components/header"
import Footer from "@/components/footer"
import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import MapContentGrid from "@/components/peta/map-content-grid"
import MapFeaturesGrid from "@/components/peta/map-features-grid"

export const metadata: Metadata = {
  title: "Peta",
}

// Sumber koordinat: Wikipedia (Jambakan, Bayat, Klaten) 7.79083°S, 110.67972°E
// Referensi batas kecamatan: Wikipedia Bayat, Klaten

export default async function PetaDesaPage() {
  const supabase = await createClient()
  // Ambil fitur published untuk ditampilkan
  const { data: features } = await supabase
    .from("map_features")
    .select("id,title,description,type,latitude,longitude,image_url,status,category_id")
    .eq("status", "published")
    .order("created_at", { ascending: false })

  // Tambahan: ambil konten dari pages kategori 'peta' yang sudah dipublish
  const { data: petaPages } = await supabase
    .from("pages")
    .select("id,title,slug,excerpt,content,featured_image_url,status,created_at")
    .eq("category", "peta")
    .eq("status", "published")
    .order("created_at", { ascending: false })

  // Geocode alamat patokan untuk meningkatkan akurasi pusat peta
  const address = "Jalan Widor RT 11 RW 04, Jambakan, Bayat, Klaten, Jawa Tengah 57462"
  let centerLat = -7.79083
  let centerLon = 110.67972
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&countrycodes=id`,
      { headers: { Accept: "application/json" }, next: { revalidate: 86400 } },
    )
    const geo = await res.json()
    if (Array.isArray(geo) && geo[0]?.lat && geo[0]?.lon) {
      centerLat = parseFloat(geo[0].lat)
      centerLon = parseFloat(geo[0].lon)
    }
  } catch (e) {
    // Abaikan jika gagal, gunakan koordinat default
  }

  // Buat satu entri fitur "Patokan Alamat" agar tampil di daftar lokasi
  const patokanFeature = {
    id: "patokan-alamat",
    title: "Patokan: Jalan Widor RT 11 RW 04",
    description: "Jambakan, Bayat, Klaten, Jawa Tengah 57462",
    image_url: null,
    type: "point",
    latitude: centerLat,
    longitude: centerLon,
  }

  const combinedFeatures = [patokanFeature, ...(features ?? [])]

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
  <h1 className="text-2xl md:text-3xl font-bold text-red-900">Peta Lokasi Desa</h1>
          <p className="text-gray-600 mt-2">Desa Jambakan, Kecamatan Bayat, Kabupaten Klaten.</p>
        </div>

        {/* Grid dua kolom: informasi kiri, peta kanan (menyerupai referensi) */}
        <div className="grid lg:grid-cols-2 gap-6 items-start">
          {/* Kartu Informasi Desa */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Batas Desa</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Utara</p>
                <p className="text-gray-800">Desa Kebon (perkiraan peta)</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Timur</p>
                <p className="text-gray-800">Desa Talang (perkiraan peta)</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Selatan</p>
                <p className="text-gray-800">Desa Ngerangan (perkiraan peta)</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Barat</p>
                <p className="text-gray-800">Desa Jarum / Krakitan (perkiraan peta)</p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between border-t pt-4">
                <p className="text-sm text-gray-600">Luas Desa</p>
                <p className="text-sm font-medium text-gray-900">—</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Jumlah Penduduk</p>
                <p className="text-sm font-medium text-gray-900">—</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Kode Pos</p>
                <p className="text-sm font-medium text-gray-900">57462</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Koordinat</p>
                <p className="text-sm font-medium text-gray-900">7.79083°S, 110.67972°E</p>
              </div>
            </div>

            <div className="mt-6 text-xs text-gray-500">
              <p>
                Sumber: Google Maps & Wikipedia. Data batas desa bersifat indikatif dan akan diperbarui setelah verifikasi
                BPS/Desa.
              </p>
            </div>
          </div>

          {/* Peta Embedded */}
          <div className="rounded-xl overflow-hidden shadow-md border border-gray-200">
            <iframe
              title="Peta Desa Jambakan"
              src={`https://www.google.com/maps?q=${centerLat},${centerLon}&output=embed`}
              className="w-full h-[400px] md:h-[560px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Daftar lokasi dari database */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Lokasi di Peta</h2>
          {combinedFeatures && combinedFeatures.length > 0 ? (
            <MapFeaturesGrid items={combinedFeatures as any} />
          ) : (
            <p className="text-sm text-gray-600">Belum ada lokasi di peta.</p>
          )}
          <div className="mt-6 text-sm text-gray-500">
            <p>Catatan: Peta utama menggunakan embed Google Maps. Lokasi dinamis ditampilkan dari database.</p>
          </div>
        </div>

        {/* Konten Peta Desa dari pages (kategori 'peta') */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Konten Peta Desa</h2>
          {petaPages && petaPages.length > 0 ? (
            <MapContentGrid items={petaPages as any} />
          ) : (
            <p className="text-sm text-gray-600">Belum ada konten terkait peta.</p>
          )}
        </div>
      </section>
      <Footer />
    </main>
  )
}