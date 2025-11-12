import Link from "next/link"

export default function GallerySection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-balance">Galeri Desa Jambakan</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Dokumentasi visual keindahan, kegiatan, dan budaya Desa Jambakan.
          </p>
  <div className="w-16 h-1 bg-red-700 mx-auto mt-6"></div>
        </div>

        <div className="text-center">
  <Link href="/galeri" className="inline-block bg-red-700 hover:bg-red-800 text-white px-8 py-3 rounded-lg font-semibold transition">
            Lihat Semua Galeri →
          </Link>
        </div>
      </div>
    </section>
  )
}