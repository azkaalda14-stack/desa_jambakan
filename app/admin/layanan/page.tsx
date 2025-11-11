import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AdminLayout from "@/components/admin/admin-layout"
import ServicesManagement from "@/components/admin/services-management"

export default async function ServicesAdminPage() {
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

  const { data: services } = await supabase.from("services").select("*").order("created_at", { ascending: false })

  return (
    <AdminLayout user={user} admin={admin}>
      <ServicesManagement initialServices={services || []} />
    </AdminLayout>
  )
}
