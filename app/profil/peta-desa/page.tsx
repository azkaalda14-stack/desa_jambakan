import Header from "@/components/header"
import Footer from "@/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Peta",
}

// Sumber koordinat: Wikipedia (Jambakan, Bayat, Klaten) 7.79083°S, 110.67972°E
// Referensi batas kecamatan: Wikipedia Bayat, Klaten

export default function PetaDesaPage() {
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
              src="https://www.google.com/maps?q=7.79083,110.67972&output=embed"
              className="w-full h-[400px] md:h-[560px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>Catatan: Peta menggunakan embed Google Maps untuk memudahkan navigasi dan penanda lokasi.</p>
        </div>
      </section>
      <Footer />
    </main>
  )
}