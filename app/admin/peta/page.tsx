import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AdminLayout from "@/components/admin/admin-layout"
import PageManagement from "@/components/admin/page-management"

export default async function AdminPetaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/admin/login")
  const { data: admin } = await supabase.from("admins").select("*").eq("id", user.id).single()
  if (!admin) redirect("/admin/login")

  return (
    <AdminLayout user={user} admin={admin}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Peta Desa</h1>
          <p className="text-gray-600">Kelola lokasi dan peta desa.</p>
        </div>
        <PageManagement category="peta" currentUserId={user.id} />
      </div>
    </AdminLayout>
  )
}