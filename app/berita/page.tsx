import { createClient } from "@/lib/supabase/server"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Calendar } from "lucide-react"
import Link from "next/link"

export default async function NewsListPage() {
  const supabase = await createClient()

  const { data: news } = await supabase
    .from("news")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <section className="py-12 md:py-16 bg-gradient-to-r from-red-700 to-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-4 text-balance">Berita Desa</h1>
          <p className="text-white/90 text-lg">Informasi terkini dari desa kami</p>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {news && news.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {news.map((item) => (
                <Link href={`/berita/${item.slug}`} key={item.id}>
                  <article className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer h-full">
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
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Calendar size={16} />
                        {new Date(item.published_at).toLocaleDateString("id-ID")}
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Belum ada berita.</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  )
}
