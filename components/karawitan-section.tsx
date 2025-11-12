import Link from "next/link"

export default function KarawitanSection() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-balance">Karawitan Desa Jambakan</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Seni gamelan tradisional yang hidup di masyarakat Jambakan.</p>
  <div className="w-16 h-1 bg-red-700 mx-auto mt-6"></div>
        </div>

        {/* Feature Card */}
  <div className="rounded-xl border border-gray-200 hover:border-red-700 p-6 md:p-8 bg-white transition">
          <div className="grid md:grid-cols-3 gap-6 items-center">
            <img
              src="/placeholder.jpg"
              alt="Karawitan Tradisional"
              className="w-full h-auto rounded-lg shadow-sm md:col-span-1"
            />
            <div className="md:col-span-2">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Pelajari Karawitan Tradisional</h3>
              <p className="text-gray-700 mb-4">
                Karawitan adalah musik gamelan Jawa yang menjadi bagian penting budaya Desa Jambakan.
              </p>
  <Link href="/budaya/karawitan" className="inline-block bg-red-700 hover:bg-red-800 text-white px-6 py-3 rounded-lg font-semibold transition">
                Lihat Selengkapnya →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}