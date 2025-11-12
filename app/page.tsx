import { createClient } from "@/lib/supabase/server"
import Header from "@/components/header"
import Footer from "@/components/footer"
import HeroSection from "@/components/hero-section"
import AboutSection from "@/components/about-section"
import NewsSection from "@/components/news-section"
import TenunSection from "@/components/tenun-section"
import KarawitanSection from "@/components/karawitan-section"
import GallerySection from "@/components/gallery-section"

export default async function Home() {
  const hasSupabaseEnv = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  let villageInfo: any = null
  let news: any[] = []

  if (hasSupabaseEnv) {
    const supabase = await createClient()

    const { data: vInfo } = await supabase.from("village_info").select("*").single()
    villageInfo = vInfo ?? null

    const { data: nData } = await supabase
      .from("news")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(3)
    news = nData || []
  }

  // No additional queries needed for Tenun/Karawitan/Galeri sections on beranda

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection villageInfo={villageInfo} />
      <AboutSection villageInfo={villageInfo} />
      <TenunSection />
      <NewsSection news={news} />
      <KarawitanSection />
      <GallerySection />
      <Footer />
    </main>
  )
}
