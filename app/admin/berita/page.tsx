import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AdminLayout from "@/components/admin/admin-layout"
import NewsManagement from "@/components/admin/news-management"

export const metadata = {
  title: "Manajemen Berita | Admin Desa",
  description: "Kelola berita dan artikel desa Anda",
}

export default async function NewsAdminPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: admin } = await supabase.from("admins").select("*").eq("id", user.id).single()

  if (!admin) {
    redirect("/admin/login")
  }

  const { data: news } = await supabase.from("news").select("*").order("created_at", { ascending: false })

  return (
    <AdminLayout user={user} admin={admin}>
      <NewsManagement initialNews={news || []} currentUserId={user.id} />
    </AdminLayout>
  )
}
