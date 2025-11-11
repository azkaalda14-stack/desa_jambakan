"use client"

import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#1f7d5e] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <span className="font-bold text-lg text-gray-900 hidden sm:inline">Desa</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-8">
            <Link href="/" className="text-gray-700 hover:text-[#1f7d5e] transition">
              Beranda
            </Link>
            <Link href="/tentang" className="text-gray-700 hover:text-[#1f7d5e] transition">
              Tentang
            </Link>
            <Link href="/berita" className="text-gray-700 hover:text-[#1f7d5e] transition">
              Berita
            </Link>
            <Link href="/program" className="text-gray-700 hover:text-[#1f7d5e] transition">
              Program
            </Link>
            <Link href="/kontak" className="text-gray-700 hover:text-[#1f7d5e] transition">
              Kontak
            </Link>
          </div>

          {/* Admin Link */}
          <div className="hidden md:block">
            <Link
              href="/admin/login"
              className="bg-[#1f7d5e] text-white px-4 py-2 rounded-lg hover:bg-[#165a47] transition"
            >
              Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-700">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4 space-y-3">
            <Link href="/" className="block text-gray-700 hover:text-[#1f7d5e] transition">
              Beranda
            </Link>
            <Link href="/tentang" className="block text-gray-700 hover:text-[#1f7d5e] transition">
              Tentang
            </Link>
            <Link href="/berita" className="block text-gray-700 hover:text-[#1f7d5e] transition">
              Berita
            </Link>
            <Link href="/program" className="block text-gray-700 hover:text-[#1f7d5e] transition">
              Program
            </Link>
            <Link href="/kontak" className="block text-gray-700 hover:text-[#1f7d5e] transition">
              Kontak
            </Link>
            <Link
              href="/admin/login"
              className="block bg-[#1f7d5e] text-white px-4 py-2 rounded-lg hover:bg-[#165a47] transition"
            >
              Admin
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}
