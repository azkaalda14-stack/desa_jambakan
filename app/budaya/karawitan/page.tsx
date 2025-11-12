import { createClient } from "@/lib/supabase/server"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Karawitan Desa",
}
import SocialEmbed from "@/components/social-embed"
import Header from "@/components/header"
import Footer from "@/components/footer"

function extractUrls(text: string | null | undefined): string[] {
  if (!text) return []
  const urlRegex = /https?:\/\/[^\s)]+/g
  const matches = text.match(urlRegex) || []
  return matches
}

export default async function KarawitanPage() {
  const supabase = await createClient()

  const { data: pages } = await supabase
    .from("pages")
    .select("title, content, status, category")
    .eq("category", "karawitan")
    .eq("status", "published")
    .order("created_at", { ascending: false })

  const allUrls = (pages || []).flatMap((p: any) => extractUrls(p.content)).filter(Boolean)
  const uniqueUrls = Array.from(new Set(allUrls))

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-red-900">Karawitan Desa Jambakan</h1>
          <p className="text-gray-600 mt-2">Seni gamelan tradisional yang menjadi bagian penting budaya Desa Jambakan.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 rounded-xl border border-gray-200 bg-white p-6 shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Pengantar Karawitan</h3>
            <p className="text-gray-700">
              Karawitan adalah musik gamelan Jawa yang dimainkan dengan harmoni instrumen tradisional seperti bonang,
              saron, dan kendang. Komunitas Jambakan aktif melestarikan dan mengajarkan karawitan kepada generasi muda.
            </p>
          </div>
          <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-md">
            <img src="/placeholder.jpg" alt="Karawitan" className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-gray-900">Latihan Rutin Karawitan</h3>
              <p className="text-sm text-gray-600">Kegiatan latihan dan pementasan di balai desa Jambakan.</p>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Video & Media Komunitas</h3>
          <p className="text-gray-600 mb-6">Tempelkan URL dari YouTube, TikTok, atau Instagram di konten kategori Karawitan (admin) untuk ditampilkan di sini.</p>
          <SocialEmbed urls={uniqueUrls} />
        </div>
      </section>
      <Footer />
    </main>
  )
}