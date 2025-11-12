import { createClient } from "@/lib/supabase/server"

export default async function TenunPage() {
  const supabase = await createClient()
  const { data: items } = await supabase
    .from("pages")
    .select("id,title,slug,excerpt,featured_image_url,status,category,created_at")
    .eq("category", "tenun")
    .eq("status", "published")
    .order("created_at", { ascending: false })

  return (
    <main className="min-h-screen bg-white">
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-balance">Karya Tenun Desa Jambakan</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Koleksi kain tenun tradisional Jambakan dengan teknik turun-temurun dan sentuhan modern.
            </p>
  <div className="w-16 h-1 bg-red-700 mx-auto mt-6"></div>
          </div>

          {items && items.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <div key={item.id} className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition">
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
        </div>
      </section>
    </main>
  )
}