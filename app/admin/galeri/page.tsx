import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AdminLayout from "@/components/admin/admin-layout"
import GalleryManagement from "@/components/admin/gallery-management"

export default async function AdminGaleriPage() {
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

  const { data: gallery } = await supabase.from("gallery").select("*").order("created_at", { ascending: false })

  return (
    <AdminLayout user={user} admin={admin}>
      <GalleryManagement initialGallery={gallery || []} currentUserId={user.id} />
    </AdminLayout>
  )
}