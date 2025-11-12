import Header from "@/components/header"
import Footer from "@/components/footer"

export default function GaleriPage() {
  const images = [
    "/village-view.jpg",
    "/village-pattern.jpg",
    "/placeholder.jpg",
    "/placeholder.jpg",
    "/village-view.jpg",
    "/village-pattern.jpg",
  ]

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-red-900">Galeri Desa Jambakan</h1>
          <p className="text-gray-600 mt-2">Kumpulan foto kegiatan dan keindahan Desa Jambakan.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((src, idx) => (
            <div key={idx} className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-md hover:shadow-lg transition">
              <img src={src} alt={`Foto Galeri ${idx + 1}`} className="w-full h-48 object-cover" />
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  )
}