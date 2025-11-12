import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AdminLayout from "@/components/admin/admin-layout"
import TenunManagement from "@/components/admin/tenun-management"

export default async function AdminTenunPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/admin/login")
  const { data: admin } = await supabase.from("admins").select("*").eq("id", user.id).single()
  if (!admin) redirect("/admin/login")

  const { data: items } = await supabase
    .from("pages")
    .select("id,title,slug,excerpt,content,featured_image_url,status,category,created_at")
    .eq("category", "tenun")
    .order("created_at", { ascending: false })

  return (
    <AdminLayout user={user} admin={admin}>
      <TenunManagement initialItems={items || []} currentUserId={user.id} />
    </AdminLayout>
  )
}