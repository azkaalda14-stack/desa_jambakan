import Link from "next/link"
import { Calendar } from "lucide-react"

export default function NewsSection({ news }: any) {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-balance">Berita & Kegiatan Desa</h2>
  <div className="w-16 h-1 bg-red-700 mx-auto"></div>
        </div>

        {/* News Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {news && news.length > 0 ? (
            news.map((item: any) => (
              <article
                key={item.id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition"
              >
                {item.featured_image_url && (
                  <img
                    src={item.featured_image_url || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.excerpt}</p>
                  <div className="flex items-center gap-4 text-gray-500 text-sm mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      {new Date(item.published_at).toLocaleDateString("id-ID")}
                    </div>
                  </div>
                  <Link
                    href={`/berita/${item.slug}`}
            className="text-red-700 font-semibold hover:text-red-800 transition"
                  >
                    Baca Selengkapnya →
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600">Belum ada berita.</p>
            </div>
          )}
        </div>

        {/* View All */}
        <div className="text-center mt-12">
          <Link
            href="/berita"
          className="inline-block bg-red-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-800 transition"
          >
            Lihat Semua Berita
          </Link>
        </div>
      </div>
    </section>
  )
}
