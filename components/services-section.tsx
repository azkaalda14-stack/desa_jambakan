import { Zap, MapPin, FileText, Clock, Users, Award } from "lucide-react"

const iconMap: any = {
  lightning: Zap,
  location: MapPin,
  document: FileText,
  clock: Clock,
  users: Users,
  award: Award,
}

export default function ServicesSection({ services }: any) {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-balance">Layanan Desa</h2>
          <div className="w-16 h-1 bg-[#1f7d5e] mx-auto"></div>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {services && services.length > 0 ? (
            services.map((service: any) => {
              const IconComponent = iconMap[service.icon_url] || Zap
              return (
                <div
                  key={service.id}
                  className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-8 border border-gray-200 hover:border-[#1f7d5e] hover:shadow-lg transition"
                >
                  <div className="w-12 h-12 bg-[#1f7d5e] rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
                </div>
              )
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600">Belum ada layanan.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
