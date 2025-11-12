import { createClient } from "@/lib/supabase/server"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default async function TenunPage() {
  const supabase = await createClient()
  const { data: items } = await supabase
    .from("pages")
    .select("id,title,slug,excerpt,featured_image_url,status,category,created_at")
    .eq("category", "tenun")
    .eq("status", "published")
    .order("created_at", { ascending: false })

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-red-900">Karya Tenun Desa Jambakan</h1>
          <p className="text-gray-600 mt-2">Koleksi kain tenun tradisional Jambakan dengan teknik turun-temurun dan sentuhan modern.</p>
        </div>

        {items && items.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-md hover:shadow-lg transition">
                {item.featured_image_url ? (
                  <img src={item.featured_image_url} alt={item.title} className="w-full h-40 object-cover" />
                ) : (
                  <img src="/placeholder.jpg" alt={item.title} className="w-full h-40 object-cover" />
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  {item.excerpt && <p className="text-sm text-gray-600">{item.excerpt}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
            <p className="text-gray-600">Belum ada konten tenun yang dipublikasikan.</p>
            <p className="text-sm text-gray-500 mt-2">Silakan tambahkan melalui menu Admin → Tenun.</p>
          </div>
        )}
      </section>
    </main>
      <Footer />
    </>
  )
}