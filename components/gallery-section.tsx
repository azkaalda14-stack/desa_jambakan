import Link from "next/link"
import Image from "next/image"
import Reveal from "./ui/reveal"

interface GalleryItem {
  id: string
  title: string
  description: string | null
  image_url: string
  category: string | null
  created_at: string
}

interface GallerySectionProps {
  gallery: GalleryItem[]
}

export default function GallerySection({ gallery }: GallerySectionProps) {
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

        {gallery && gallery.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {gallery.map((item, index) => (
              <Reveal key={item.id} delay={index * 100}>
                <div className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="aspect-[4/3] relative">
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                        {item.description && (
                          <p className="text-xs opacity-90 line-clamp-2">{item.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="text-center mb-12">
            <p className="text-gray-500 mb-4">Belum ada foto di galeri.</p>
          </div>
        )}

        <div className="text-center">
          <Link href="/galeri" className="inline-block bg-red-700 hover:bg-red-800 text-white px-8 py-3 rounded-lg font-semibold transition">
            Lihat Semua Galeri →
          </Link>
        </div>
      </div>
    </section>
  )
}