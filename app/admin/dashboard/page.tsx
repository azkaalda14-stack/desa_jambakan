import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AdminLayout from "@/components/admin/admin-layout"
import DashboardOverview from "@/components/admin/dashboard-overview"
import { Layers, FileText, Image, Music, Users, IdCard } from "lucide-react"

export default async function AdminDashboard() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  // Check if user is admin
  const { data: admin } = await supabase.from("admins").select("*").eq("id", user.id).single()

  if (!admin) {
    redirect("/admin/login")
  }

  // Fetch counts for overview
  const { count: tenunCount } = await supabase
    .from("pages")
    .select("id", { count: "exact" })
    .eq("category", "tenun")
    .eq("status", "published")

  const { count: beritaCount } = await supabase
    .from("news")
    .select("id", { count: "exact" })
    .eq("status", "published")

  const { count: galeriCount } = await supabase.from("gallery").select("id", { count: "exact" })

  const { count: karawitanCount } = await supabase
    .from("pages")
    .select("id", { count: "exact" })
    .eq("category", "karawitan")
    .eq("status", "published")

  const { count: strukturCount } = await supabase
    .from("village_structure")
    .select("id", { count: "exact" })
    .eq("status", "active")

  const { count: profileCount } = await supabase.from("village_info").select("id", { count: "exact" })

  return (
    <AdminLayout user={user} admin={admin}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard Admin</h1>
          <p className="text-sm sm:text-base text-gray-700 mt-1">Kelola konten website Desa Jambakan</p>
        </div>

        <DashboardOverview
          items={[
            {
              title: "Kelola Tenun",
              href: "/admin/tenun",
              description: "Tambah, edit, atau hapus karya tenun",
              icon: Layers,
              count: tenunCount || 0,
            },
            {
              title: "Kelola Berita",
              href: "/admin/berita",
              description: "Kelola berita dan kegiatan desa",
              icon: FileText,
              count: beritaCount || 0,
            },
            {
              title: "Kelola Galeri",
              href: "/admin/galeri",
              description: "Kelola foto dan dokumentasi desa",
              icon: Image,
              count: galeriCount || 0,
            },
            {
              title: "Kelola Karawitan",
              href: "/admin/karawitan",
              description: "Kelola konten karawitan",
              icon: Music,
              count: karawitanCount || 0,
            },
            {
              title: "Kelola Profile",
              href: "/admin/sejarah",
              description: "Kelola profil desa (visi, misi, sejarah, dll)",
              icon: IdCard,
              count: profileCount || 0,
            },
            {
              title: "Kelola Struktur",
              href: "/admin/struktur",
              description: "Kelola struktur organisasi desa",
              icon: Users,
              count: strukturCount || 0,
            },
          ]}
        />
      </div>
    </AdminLayout>
  )
}
