import { createClient } from "@/lib/supabase/server"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Website Desa Jambakan",
}
import Header from "@/components/header"
import Footer from "@/components/footer"
import HeroSection from "@/components/hero-section"
import AboutSection from "@/components/about-section"
import NewsSection from "@/components/news-section"
import TenunSection from "@/components/tenun-section"
import KarawitanSection from "@/components/karawitan-section"
import GallerySection from "@/components/gallery-section"
import Reveal from "@/components/ui/reveal"

export default async function Home() {
  const hasSupabaseEnv = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  let villageInfo: any = null
  let news: any[] = []
  let gallery: any[] = []

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

    const { data: gData } = await supabase
      .from("gallery")
      .select("id,title,description,image_url,category,created_at")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(6)
    gallery = gData || []
  }

  // No additional queries needed for Tenun/Karawitan sections on beranda

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection villageInfo={villageInfo} />
      <Reveal delay={0}>
        <AboutSection villageInfo={villageInfo} />
      </Reveal>
      <Reveal delay={100}>
        <TenunSection />
      </Reveal>
      <Reveal delay={200}>
        <NewsSection news={news} />
      </Reveal>
      <Reveal delay={300}>
        <KarawitanSection />
      </Reveal>
      <Reveal delay={400}>
        <GallerySection gallery={gallery} />
      </Reveal>
      <Footer />
    </main>
  )
}
