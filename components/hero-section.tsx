"use client"

import Link from "next/link"
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"

const heroImages = [
  {
    url: "/village-view.jpg",
    title: "Selamat Datang di Desa Jambakan",
    description:
      "Jelajahi keindahan warisan budaya tradisional, karya tenun, dan karawitan dari Desa Jambakan, Kabupaten Klaten",
  },
  {
    url: "/village-pattern.jpg",
    title: "Karya Tenun Tradisional",
    description:
      "Kerajinan tenun yang indah dan berkualitas dari para pengrajin lokal",
  },
  {
    url: "/placeholder.jpg",
    title: "Karawitan Jambakan",
    description:
      "Seni musik tradisional yang memukau dengan instrumen gamelan bernilai sejarah",
  },
]

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoplay, setIsAutoplay] = useState(true)

  useEffect(() => {
    if (!isAutoplay) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [isAutoplay])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoplay(false)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    setIsAutoplay(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)
    setIsAutoplay(false)
  }

  return (
    <section className="relative w-full h-[70vh] sm:h-[80vh] md:h-[600px] overflow-hidden">
      {/* Carousel Slides */}
      {heroImages.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-out ${
            index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        >
          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${slide.url}')` }} />
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <div className="text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-balance leading-tight duration-1000">
              {heroImages[currentSlide].title}
            </h1>
            <p className="text-lg md:text-xl text-gray-100 text-balance leading-relaxed max-w-2xl mx-auto duration-1000 delay-200">
              {heroImages[currentSlide].description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 duration-1000 delay-300">
              <Link
                href="/budaya/tenun"
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-110 active:scale-95 inline-flex items-center gap-2"
              >
                Lihat Karya Tenun
                <ChevronDown size={18} className="rotate-180" />
              </Link>
              <Link
                href="/berita"
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 border border-white/30 hover:border-white/50 backdrop-blur-sm hover:scale-110 active:scale-95 inline-flex items-center gap-2"
              >
                Baca Berita
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="hidden sm:flex absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm hover:scale-125 active:scale-95"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="hidden sm:flex absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm hover:scale-125 active:scale-95"
      >
        <ChevronRight size={24} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-500 ${
              index === currentSlide
  ? "w-8 bg-red-500 scale-125"
                : "w-2 bg-white/50 hover:bg-white/75 hover:scale-110"
            }`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-24 md:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
        <ChevronDown size={32} className="text-white/70 hover:text-white transition-colors" />
      </div>
    </section>
  )
}
