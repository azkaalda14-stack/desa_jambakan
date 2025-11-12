import Header from "@/components/header"
import Footer from "@/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Struktur",
}
import { createClient } from "@/lib/supabase/server"

export default async function StrukturDesaPage() {
  const supabase = await createClient()
  const { data: items } = await supabase
    .from("village_structure")
    .select("id,name,position,photo_url,order_index,status")
    .eq("status", "active")
    .order("order_index", { ascending: true })

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: admin } = user ? await supabase.from("admins").select("id").eq("id", user.id).single() : { data: null }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
  <h1 className="text-2xl md:text-3xl font-bold text-red-900">Struktur Organisasi Desa</h1>
            <p className="text-gray-600 mt-2">Susunan perangkat Desa Jambakan.</p>
          </div>
        </div>

        {items && items.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="rounded-xl border border-gray-200 shadow-sm p-6 bg-white">
                {item.photo_url && (
                  <img src={item.photo_url} alt={item.name} className="w-full h-40 object-cover rounded mb-3" />
                )}
  <h3 className="text-red-800 font-semibold">{item.position}</h3>
                <p className="text-gray-700 mt-1">{item.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-gray-600">Belum ada data struktur aktif.</p>
            <p className="text-sm text-gray-500 mt-2">Tambahkan melalui menu Admin → Struktur Desa.</p>
          </div>
        )}
      </section>
      <Footer />
    </main>
  )
}