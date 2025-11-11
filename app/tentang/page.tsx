import { createClient } from "@/lib/supabase/server"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { MapPin, Users, Landmark } from "lucide-react"

export default async function AboutPage() {
  const supabase = await createClient()

  const { data: villageInfo } = await supabase.from("village_info").select("*").single()

  const stats = [
    {
      icon: Users,
      label: "Populasi",
      value: villageInfo?.population?.toLocaleString() || "0",
    },
    {
      icon: MapPin,
      label: "Area",
      value: villageInfo?.area_km2 || "0",
      unit: " km²",
    },
    {
      icon: Landmark,
      label: "Berdiri Sejak",
      value: villageInfo?.established_year || "2024",
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <section className="py-12 md:py-16 bg-gradient-to-r from-[#1f7d5e] to-[#2d9f6f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-4 text-balance">Tentang Desa</h1>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <img src="/placeholder.svg?key=q94jl" alt="Desa" className="rounded-xl shadow-lg w-full h-auto" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{villageInfo?.name || "Desa Kami"}</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                {villageInfo?.description ||
                  "Desa kami adalah sebuah komunitas yang berkembang dengan semangat kebersamaan dan kemajuan bersama."}
              </p>
              <p className="text-gray-600 text-base leading-relaxed">
                Dengan dukungan teknologi digital modern, kami terus berinovasi untuk meningkatkan kualitas kehidupan
                masyarakat desa.
              </p>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-8 text-center shadow-md">
                <stat.icon className="w-12 h-12 text-[#1f7d5e] mx-auto mb-4" />
                <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stat.value}
                  {stat.unit}
                </p>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="bg-gray-50 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Informasi Kontak</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Alamat:</span>
                </p>
                <p className="text-gray-700">{villageInfo?.address || "Alamat desa"}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Telepon:</span>
                </p>
                <p className="text-gray-700">{villageInfo?.phone || "Nomor telepon"}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Email:</span>
                </p>
                <p className="text-gray-700">{villageInfo?.email || "Email desa"}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
