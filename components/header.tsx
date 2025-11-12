"use client"

import Link from "next/link"
import { Menu, X, ChevronDown } from "lucide-react"
import { useState, useRef, useEffect } from "react"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const budayaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node
      const clickedInsideProfile = profileRef.current?.contains(target)
      const clickedInsideBudaya = budayaRef.current?.contains(target)

      if (!clickedInsideProfile && !clickedInsideBudaya) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? "bg-white/95 backdrop-blur-md shadow-lg" 
        : "bg-white shadow-sm"
    }`}>
      <nav className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" prefetch={false} className="flex items-center gap-4 group">
            <img
              src="https://commons.wikimedia.org/wiki/Special:FilePath/Seal_of_Klaten_Regency.svg"
              alt="Logo Kabupaten Klaten (transparan)"
              className="w-12 h-12 md:w-14 md:h-14 object-contain group-hover:scale-110 transition-transform duration-300"
            />
            <div className="hidden sm:flex flex-col">
  <span className="font-bold text-red-900 text-base md:text-lg leading-tight">DESA JAMBAKAN</span>
  <span className="text-red-600 text-sm md:text-base font-medium">Kabupaten Klaten</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-2 items-center">
            <Link
              href="/"
              prefetch={false}
  className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              Beranda
            </Link>

            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setActiveDropdown(activeDropdown === "profile" ? null : "profile")}
  className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center gap-1"
              >
                Profile
                <ChevronDown
                  size={16}
                  className={`transition-transform ${activeDropdown === "profile" ? "rotate-180" : ""}`}
                />
              </button>
              {activeDropdown === "profile" && (
                <div className="absolute top-full mt-0 left-0 bg-white rounded-lg shadow-lg border border-gray-100 py-2 w-48">
                  <Link
                    href="/tentang"
                    prefetch={false}
                    onClick={() => setActiveDropdown(null)}
  className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600"
                  >
                    Sejarah Desa
                  </Link>
                  <Link
                    href="/profil/peta-desa"
                    prefetch={false}
                    onClick={() => setActiveDropdown(null)}
  className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600"
                  >
                    Peta Desa
                  </Link>
                  <Link
                    href="/profil/struktur"
                    prefetch={false}
                    onClick={() => setActiveDropdown(null)}
  className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600"
                  >
                    Struktur Desa
                  </Link>
                </div>
              )}
            </div>

            <div className="relative" ref={budayaRef}>
              <button
                onClick={() => setActiveDropdown(activeDropdown === "budaya" ? null : "budaya")}
  className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center gap-1"
              >
                Budaya
                <ChevronDown
                  size={16}
                  className={`transition-transform ${activeDropdown === "budaya" ? "rotate-180" : ""}`}
                />
              </button>
              {activeDropdown === "budaya" && (
                <div className="absolute top-full mt-0 left-0 bg-white rounded-lg shadow-lg border border-gray-100 py-2 w-48">
                  <Link
                    href="/budaya/tenun"
                    prefetch={false}
                    onClick={() => setActiveDropdown(null)}
  className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600"
                  >
                    Karya Tenun
                  </Link>
                  <Link
                    href="/budaya/karawitan"
                    prefetch={false}
                    onClick={() => setActiveDropdown(null)}
  className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600"
                  >
                    Karawitan
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/berita"
              prefetch={false}
  className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              Berita
            </Link>
            <Link
              href="/galeri"
              prefetch={false}
  className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              Galeri
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
  className="md:hidden text-gray-700 hover:text-red-600 transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 pt-4 space-y-2">
            <Link
              href="/"
              prefetch={false}
              onClick={() => setIsOpen(false)}
  className="block px-3 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md text-sm font-medium transition-colors"
            >
              Beranda
            </Link>
            <Link
              href="/tentang"
              prefetch={false}
              onClick={() => setIsOpen(false)}
  className="block px-3 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md text-sm font-medium transition-colors"
            >
              Sejarah Desa
            </Link>
            <Link
              href="/profil/peta-desa"
              prefetch={false}
              onClick={() => setIsOpen(false)}
  className="block px-3 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md text-sm font-medium transition-colors"
            >
              Peta Desa
            </Link>
            <Link
              href="/profil/struktur"
              prefetch={false}
              onClick={() => setIsOpen(false)}
  className="block px-3 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md text-sm font-medium transition-colors"
            >
              Struktur Desa
            </Link>
            <Link
              href="/budaya/tenun"
              prefetch={false}
              onClick={() => setIsOpen(false)}
  className="block px-3 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md text-sm font-medium transition-colors"
            >
              Karya Tenun
            </Link>
            <Link
              href="/budaya/karawitan"
              prefetch={false}
              onClick={() => setIsOpen(false)}
  className="block px-3 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md text-sm font-medium transition-colors"
            >
              Karawitan
            </Link>
            <Link
              href="/berita"
              prefetch={false}
              onClick={() => setIsOpen(false)}
  className="block px-3 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md text-sm font-medium transition-colors"
            >
              Berita
            </Link>
            <Link
              href="/galeri"
              prefetch={false}
              onClick={() => setIsOpen(false)}
  className="block px-3 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md text-sm font-medium transition-colors"
            >
              Galeri
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}
