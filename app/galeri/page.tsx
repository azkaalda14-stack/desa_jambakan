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
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-balance">Galeri Desa Jambakan</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">Kumpulan foto kegiatan dan keindahan Desa Jambakan.</p>
  <div className="w-16 h-1 bg-red-700 mx-auto mt-6"></div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((src, idx) => (
              <div key={idx} className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition">
                <img src={src} alt={`Foto Galeri ${idx + 1}`} className="w-full h-48 object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}