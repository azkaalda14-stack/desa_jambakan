import Link from "next/link"

export default function TenunSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-balance">Karya Tenun Desa Jambakan</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Koleksi karya tenun tradisional yang dibuat dengan keahlian turun temurun.
          </p>
  <div className="w-16 h-1 bg-red-700 mx-auto mt-6"></div>
        </div>

        {/* Highlight Card */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <img
            src="/placeholder.jpg"
            alt="Karya Tenun Tradisional"
            className="w-full h-auto rounded-xl shadow-md"
          />
  <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-8 border border-gray-200 hover:border-red-700 hover:shadow-lg transition">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Warisan Tenun Tradisional</h3>
            <p className="text-gray-700 mb-6">
              Tenun Jambakan adalah hasil karya pengrajin lokal yang mempertahankan teknik tradisional dengan sentuhan
              modern, menghasilkan kain yang berkualitas dan indah.
            </p>
            <Link
              href="/budaya/tenun"
  className="inline-block bg-red-700 hover:bg-red-800 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Lihat Semua Karya →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}