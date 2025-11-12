import { createClient } from "@/lib/supabase/server"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import Reveal from "@/components/ui/reveal"

export default async function NewsByCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  const supabase = await createClient()

  const decodedCategory = decodeURIComponent(category)
  const { data: news } = await supabase
    .from("news")
    .select("*")
    .eq("status", "published")
    .eq("category", decodedCategory)
    .order("published_at", { ascending: false })

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-red-900">Kategori: {decodedCategory}</h1>
          <p className="text-gray-600 mt-2">Berita berdasarkan kategori</p>
          <div className="mt-4">
            <Link href="/berita" className="text-red-700 hover:underline">Lihat semua berita</Link>
          </div>
        </div>

        {news && news.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            {news.map((item, index) => (
              <Reveal key={item.id} delay={index * 150}>
                <Link href={`/berita/${item.slug}`}>
                  <article className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer h-full border border-gray-200">
                    {item.featured_image_url && (
                      <img
                        src={item.featured_image_url || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-6">
                      {item.category && (
                        <span className="inline-block text-xs px-2 py-1 rounded bg-red-100 text-red-800 mb-2">{item.category}</span>
                      )}
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.excerpt}</p>
                      <span className="text-red-700 font-semibold hover:text-red-800 transition">Baca Selengkapnya →</span>
                    </div>
                  </article>
                </Link>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600">Belum ada berita untuk kategori ini.</p>
          </div>
        )}
      </section>

      <Footer />
    </main>
  )
}