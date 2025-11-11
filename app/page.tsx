import { createClient } from "@/lib/supabase/server"
import Header from "@/components/header"
import Footer from "@/components/footer"
import HeroSection from "@/components/hero-section"
import AboutSection from "@/components/about-section"
import NewsSection from "@/components/news-section"
import ProgramsSection from "@/components/programs-section"
import ServicesSection from "@/components/services-section"

export default async function Home() {
  const supabase = await createClient()

  // Fetch village info
  const { data: villageInfo } = await supabase.from("village_info").select("*").single()

  // Fetch published news (limit 3)
  const { data: news } = await supabase
    .from("news")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(3)

  // Fetch active programs (limit 3)
  const { data: programs } = await supabase.from("programs").select("*").eq("status", "active").limit(3)

  // Fetch active services
  const { data: services } = await supabase.from("services").select("*").eq("status", "active").limit(6)

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection villageInfo={villageInfo} />
      <AboutSection villageInfo={villageInfo} />
      <NewsSection news={news || []} />
      <ProgramsSection programs={programs || []} />
      <ServicesSection services={services || []} />
      <Footer />
    </main>
  )
}
