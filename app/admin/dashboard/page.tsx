import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AdminLayout from "@/components/admin/admin-layout"
import DashboardStats from "@/components/admin/dashboard-stats"
import RecentNews from "@/components/admin/recent-news"
import RecentSubmissions from "@/components/admin/recent-submissions"

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

  // Fetch dashboard data
  const { data: newsCount } = await supabase.from("news").select("id", { count: "exact" }).eq("status", "published")

  const { data: programsCount } = await supabase
    .from("programs")
    .select("id", { count: "exact" })
    .eq("status", "active")

  const { data: submissions } = await supabase.from("contact_submissions").select("*").eq("status", "new").limit(5)

  const { data: recentNews } = await supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <AdminLayout user={user} admin={admin}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Selamat datang kembali, {admin.full_name || user.email}</p>
        </div>

        <DashboardStats newsCount={newsCount || []} programsCount={programsCount || []} />

        <div className="grid md:grid-cols-2 gap-8">
          <RecentNews news={recentNews || []} />
          <RecentSubmissions submissions={submissions || []} />
        </div>
      </div>
    </AdminLayout>
  )
}
