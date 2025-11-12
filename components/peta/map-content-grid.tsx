'use client'

import { useState } from 'react'
import { GalleryLightbox } from '@/components/gallery-lightbox'

type PetaPageItem = {
  id: string
  title: string
  featured_image_url?: string | null
  excerpt?: string | null
  content?: string | null
  created_at: string
}

interface MapContentGridProps {
  items: PetaPageItem[]
}

export default function MapContentGrid({ items }: MapContentGridProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<PetaPageItem | null>(null)

  const open = (item: PetaPageItem) => {
    setSelected(item)
    setIsOpen(true)
  }

  const close = () => setIsOpen(false)

  // Bentuk item untuk GalleryLightbox
  const lightboxItem = selected
    ? {
        id: selected.id,
        title: selected.title,
        description: selected.excerpt ?? (selected.content ? String(selected.content) : null),
        image_url: selected.featured_image_url ?? '',
        category: 'peta',
        created_at: selected.created_at,
      }
    : null

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((pg) => (
        <button
          key={pg.id}
          type="button"
          onClick={() => open(pg)}
          className="text-left rounded border border-gray-200 p-4 bg-white hover:shadow-md transition-shadow focus:outline-hidden focus:ring-2 focus:ring-red-700"
        >
          {pg.featured_image_url && (
            <img
              src={pg.featured_image_url}
              alt={pg.title}
              loading="lazy"
              decoding="async"
              className="w-full h-56 md:h-64 object-contain bg-neutral-50 rounded"
            />
          )}
          <div className="mt-2">
            <h3 className="font-medium text-gray-900">{pg.title}</h3>
            {pg.excerpt && <p className="text-sm text-gray-700 mt-1 line-clamp-3">{pg.excerpt}</p>}
            {!pg.excerpt && pg.content && (
              <p className="text-sm text-gray-700 mt-1 line-clamp-3">{String(pg.content)}</p>
            )}
            <p className="text-xs text-gray-500 mt-2">Klik untuk memperbesar gambar & baca detail</p>
          </div>
        </button>
      ))}

      {/* Lightbox */}
      <GalleryLightbox item={lightboxItem} isOpen={isOpen} onClose={close} />
    </div>
  )
}