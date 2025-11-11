import { createClient } from "@/lib/supabase/server"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { DollarSign } from "lucide-react"

export default async function ProgramListPage() {
  const supabase = await createClient()

  const { data: programs } = await supabase
    .from("programs")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false })

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <section className="py-12 md:py-16 bg-gradient-to-r from-[#1f7d5e] to-[#2d9f6f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-4 text-balance">Program Desa</h1>
          <p className="text-white/90 text-lg">Berbagai program pembangunan desa</p>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {programs && programs.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {programs.map((program) => (
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
                    <div className="inline-block bg-[#d4af37] text-[#1f7d5e] px-3 py-1 rounded-full text-sm font-semibold mb-3">
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
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Belum ada program.</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  )
}
