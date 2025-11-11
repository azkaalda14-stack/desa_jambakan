import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AdminLayout from "@/components/admin/admin-layout"
import ProgramManagement from "@/components/admin/program-management"

export default async function ProgramAdminPage() {
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

  const { data: programs } = await supabase.from("programs").select("*").order("created_at", { ascending: false })

  return (
    <AdminLayout user={user} admin={admin}>
      <ProgramManagement initialPrograms={programs || []} />
    </AdminLayout>
  )
}
