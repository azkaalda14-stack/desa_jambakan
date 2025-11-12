import Header from "@/components/header"
import Footer from "@/components/footer"
import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { GalleryClient } from "./gallery-client"

export const metadata: Metadata = {
  title: "Galeri",
}

interface GalleryItem {
  id: string
  title: string
  description: string | null
  image_url: string
  category: string | null
  created_at: string
}

export default async function GaleriPage() {
  const supabase = await createClient()
  const { data: items } = await supabase
    .from("gallery")
    .select("id,title,description,image_url,category,status,created_at")
    .eq("status", "published")
    .order("created_at", { ascending: false })

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-red-900">Galeri Desa Jambakan</h1>
          <p className="text-gray-600 mt-2">Kumpulan foto kegiatan dan keindahan Desa Jambakan.</p>
        </div>
        <GalleryClient items={items || []} />
      </section>
      <Footer />
    </main>
  )
}