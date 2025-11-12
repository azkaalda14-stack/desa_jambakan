"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { LogOut, Menu, X, BarChart3, FileText, Image, Music, Layers, Users, BookOpen, Map, ExternalLink } from "lucide-react"
import { useEffect, useState } from "react"

export default function AdminLayout({ user, admin, children }: any) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  // Show sidebar by default on desktop, hidden on mobile
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true)
      }
    }
  }, [])

  const menuItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/admin/berita", label: "Kelola Berita", icon: FileText },
    { href: "/admin/galeri", label: "Kelola Galeri", icon: Image },
    { href: "/admin/karawitan", label: "Kelola Karawitan", icon: Music },
    { href: "/admin/tenun", label: "Kelola Tenun", icon: Layers },
    { href: "/admin/struktur", label: "Kelola Struktur", icon: Users },
    { href: "/admin/sejarah", label: "Sejarah Desa", icon: BookOpen },
    { href: "/admin/peta", label: "Peta Desa", icon: Map },
  ]

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Sidebar */}
      <aside
        className={`bg-rose-50 text-gray-900 border-r border-gray-200 z-40 w-64 ${
          // Mobile: toggle sidebar as an overlay; Desktop: always visible and non-fixed
          sidebarOpen ? "fixed inset-y-0 left-0 md:static md:flex" : "hidden md:static md:flex"
        } flex flex-col`}
      >
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-red-700 text-white flex items-center justify-center font-bold">DJ</div>
            <div>
              <div className="text-lg font-bold text-red-700">DESA JAMBAKAN</div>
              <div className="text-xs text-red-900/70">Admin Panel</div>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-red-700 text-white shadow-sm"
                    : "text-red-900/60 hover:bg-red-100 hover:text-red-700"
                }`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="m-4 flex items-center gap-3 px-4 py-3 rounded-lg text-red-900/70 hover:bg-red-100 hover:text-red-700"
          >
            <ExternalLink size={18} />
            <span>Lihat Web Publik</span>
          </Link>
          <div className="border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-900/70 hover:bg-red-100 hover:text-red-700 transition"
            >
              <div className="h-8 w-8 rounded-full bg-neutral-200 text-neutral-700 flex items-center justify-center font-semibold">
                {(user?.email || "U").charAt(0).toUpperCase()}
              </div>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between p-4 sm:p-6">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden p-2 -ml-2">
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="hidden sm:flex items-center gap-4">
              <span className="text-gray-700 truncate max-w-[200px]">Admin: {user.email}</span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">{children}</div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed md:hidden inset-0 bg-black/50 z-30" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
