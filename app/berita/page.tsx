import { createClient } from "@/lib/supabase/server"
import type { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { Calendar } from "lucide-react"
import Reveal from "@/components/ui/reveal"

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

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-red-900">Berita Desa</h1>
          <p className="text-gray-600 mt-2">Informasi terkini dari desa kami</p>
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
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{item.excerpt}</p>
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Calendar size={16} />
                        {new Date(item.published_at).toLocaleDateString("id-ID")}
                      </div>
                    </div>
                  </article>
                </Link>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Belum ada berita.</p>
          </div>
        )}
      </section>
      <Footer />
    </main>
  )
}
export const metadata: Metadata = {
  title: "Berita",
}
