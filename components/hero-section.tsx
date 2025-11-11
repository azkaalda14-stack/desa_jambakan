import Link from "next/link"
import { ChevronDown } from "lucide-react"

export default function HeroSection({ villageInfo }: any) {
  return (
    <section className="relative w-full h-[500px] md:h-[600px] bg-gradient-to-r from-[#1f7d5e] to-[#2d9f6f] flex items-center justify-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/village-pattern.jpg')] bg-cover bg-center" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-balance">
          {villageInfo?.name || "Selamat Datang di Desa"}
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-balance opacity-90">
          {villageInfo?.tagline || "Portal Informasi Desa Digital Modern"}
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/tentang"
            className="bg-white text-[#1f7d5e] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Pelajari Lebih Lanjut
          </Link>
          <Link
            href="/kontak"
            className="bg-[#d4af37] text-[#1f7d5e] px-8 py-3 rounded-lg font-semibold hover:bg-[#e8c547] transition"
          >
            Hubungi Kami
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown size={32} className="text-white" />
      </div>
    </section>
  )
}
