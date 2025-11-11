import { MapPin, Users, Landmark, TrendingUp } from "lucide-react"

export default function AboutSection({ villageInfo }: any) {
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
    {
      icon: TrendingUp,
      label: "Desa Maju",
      value: "100%",
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-balance">
            Tentang {villageInfo?.name || "Desa"}
          </h2>
          <div className="w-16 h-1 bg-[#1f7d5e] mx-auto"></div>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
          <div>
            <img src="/village-view.jpg" alt="Desa" className="rounded-xl shadow-lg w-full h-auto" />
          </div>
          <div>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              {villageInfo?.description ||
                "Desa kami adalah sebuah komunitas yang berkembang dengan semangat kebersamaan dan kemajuan bersama. Kami berkomitmen untuk memberikan pelayanan terbaik kepada seluruh masyarakat."}
            </p>
            <p className="text-gray-600 text-base leading-relaxed">
              Dengan dukungan teknologi digital modern, kami terus berinovasi untuk meningkatkan kualitas kehidupan
              masyarakat desa.
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition">
              <stat.icon className="w-8 h-8 text-[#1f7d5e] mx-auto mb-3" />
              <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">
                {stat.value}
                {stat.unit}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
