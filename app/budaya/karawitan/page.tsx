import { createClient } from "@/lib/supabase/server"
import SocialEmbed from "@/components/social-embed"

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
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-balance">Karawitan Desa Jambakan</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Seni gamelan tradisional yang menjadi bagian penting budaya Desa Jambakan.
            </p>
  <div className="w-16 h-1 bg-red-700 mx-auto mt-6"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Pengantar Karawitan</h3>
              <p className="text-gray-700">
                Karawitan adalah musik gamelan Jawa yang dimainkan dengan harmoni instrumen tradisional seperti bonang,
                saron, dan kendang. Komunitas Jambakan aktif melestarikan dan mengajarkan karawitan kepada generasi muda.
              </p>
            </div>
            <div className="rounded-xl overflow-hidden border border-gray-200 bg-white">
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
        </div>
      </section>
    </main>
  )
}