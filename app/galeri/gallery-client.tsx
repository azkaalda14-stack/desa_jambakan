'use client'

import { useState } from 'react'
import Image from 'next/image'
import { GalleryLightbox, GalleryItem } from '@/components/gallery-lightbox'
import Reveal from '@/components/ui/reveal'

interface GalleryClientProps {
  items: GalleryItem[]
}

export function GalleryClient({ items }: GalleryClientProps) {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const handleImageClick = (item: GalleryItem) => {
    setSelectedItem(item)
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
    setSelectedItem(null)
  }

  if (!items || items.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
        <p className="text-gray-600">Belum ada foto galeri yang dipublikasikan.</p>
      </div>
    )
  }

  return (
    <>
      <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4">
        {items.map((item, index) => (
          <Reveal key={item.id} delay={index * 100}>
            <div 
              className="relative cursor-pointer group overflow-hidden rounded-lg mb-4 break-inside-avoid"
              onClick={() => handleImageClick(item)}
            >
              <img
                src={item.image_url || "/placeholder.jpg"}
                alt={item.title}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </div>
          </Reveal>
        ))}
      </div>
      
      <GalleryLightbox 
        item={selectedItem} 
        isOpen={isOpen} 
        onClose={handleClose} 
      />
    </>
  )
}