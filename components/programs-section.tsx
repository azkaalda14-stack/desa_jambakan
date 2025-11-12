import Link from "next/link"
import { DollarSign } from "lucide-react"

export default function ProgramsSection({ programs }: any) {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-balance">Program Desa</h2>
  <div className="w-16 h-1 bg-red-700 mx-auto"></div>
        </div>

        {/* Programs Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {programs && programs.length > 0 ? (
            programs.map((program: any) => (
              <div
                key={program.id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition"
              >
                {program.image_url && (
                  <img
                    src={program.image_url || "/placeholder.svg"}
                    alt={program.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
          <div className="inline-block bg-[#d4af37] text-red-700 px-3 py-1 rounded-full text-sm font-semibold mb-3">
            {program.category}
          </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{program.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{program.description}</p>
                  {program.budget && (
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <DollarSign size={16} />
                      Rp {program.budget?.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600">Belum ada program.</p>
            </div>
          )}
        </div>

        {/* View All */}
        <div className="text-center mt-12">
          <Link
            href="/program"
          className="inline-block bg-red-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-800 transition"
          >
            Lihat Semua Program
          </Link>
        </div>
      </div>
    </section>
  )
}
