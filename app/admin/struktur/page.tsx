import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AdminLayout from "@/components/admin/admin-layout"
import StructureManagement from "@/components/admin/structure-management"

export default async function AdminStrukturPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/admin/login")
  const { data: admin } = await supabase.from("admins").select("*").eq("id", user.id).single()
  if (!admin) redirect("/admin/login")

  return (
    <AdminLayout user={user} admin={admin}>
      <StructureManagement currentUserId={user.id} />
    </AdminLayout>
  )
}