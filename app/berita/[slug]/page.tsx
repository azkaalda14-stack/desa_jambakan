import { createClient } from "@/lib/supabase/server"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: news } = await supabase.from("news").select("*").eq("slug", slug).eq("status", "published").single()

  if (!news) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <article className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/berita" className="flex items-center gap-2 text-red-700 hover:underline mb-8">
            <ArrowLeft size={20} />
            Kembali ke Berita
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-balance">{news.title}</h1>

          <div className="flex items-center gap-2 text-gray-500 mb-8">
            <Calendar size={20} />
            {new Date(news.published_at).toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>

          {news.featured_image_url && (
            <img
              src={news.featured_image_url || "/placeholder.svg"}
              alt={news.title}
              className="w-full h-96 object-cover rounded-xl mb-8"
            />
          )}

          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
            {news.content}
          </div>
        </div>
      </article>
      <Footer />
    </main>
  )
}
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = await createClient()
  const { data: news } = await supabase
    .from("news")
    .select("title,status")
    .eq("slug", params.slug)
    .single()

  return {
    title: news?.title || "Detail Berita",
  }
}
