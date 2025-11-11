"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { LogOut, Menu, X, BarChart3, FileText, Briefcase, Wrench, Settings } from "lucide-react"
import { useState } from "react"

export default function AdminLayout({ user, admin, children }: any) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  const menuItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/admin/berita", label: "Berita", icon: FileText },
    { href: "/admin/program", label: "Program", icon: Briefcase },
    { href: "/admin/layanan", label: "Layanan", icon: Wrench },
    { href: "/admin/galeri", label: "Galeri", icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-screen bg-[#1f7d5e] text-white transition-transform ${
          sidebarOpen ? "w-64" : "w-0 md:w-0"
        } z-40`}
      >
        <div className="p-6 border-b border-[#165a47]">
          <h1 className="text-2xl font-bold">Admin Desa</h1>
        </div>

        <nav className="p-6 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#165a47] transition"
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-[#165a47] hover:bg-[#0f3d2e] transition"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between p-6">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden">
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Admin: {user.email}</span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6 md:p-8">{children}</div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed md:hidden inset-0 bg-black/50 z-30" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
