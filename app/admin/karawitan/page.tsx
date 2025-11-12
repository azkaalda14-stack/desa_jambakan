import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AdminLayout from "@/components/admin/admin-layout"
import KarawitanManagement from "@/components/admin/karawitan-management"

// Halaman admin khusus karawitan menggunakan komponen KarawitanManagement

export default async function AdminKarawitanPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/admin/login")
  const { data: admin } = await supabase.from("admins").select("*").eq("id", user.id).single()
  if (!admin) redirect("/admin/login")

  const { data: items } = await supabase
    .from("pages")
    .select("id,title,slug,excerpt,content,status,category,created_at")
    .eq("category", "karawitan")
    .order("created_at", { ascending: false })

  return (
    <AdminLayout user={user} admin={admin}>
      <KarawitanManagement initialItems={items || []} currentUserId={user.id} />
    </AdminLayout>
  )
}