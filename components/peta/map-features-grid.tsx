'use client'

import { useState } from 'react'
import { GalleryLightbox } from '@/components/gallery-lightbox'

type MapFeatureItem = {
  id: string
  title: string
  description?: string | null
  image_url?: string | null
  type: string
  latitude?: number | null
  longitude?: number | null
}

interface MapFeaturesGridProps {
  items: MapFeatureItem[]
}

export default function MapFeaturesGrid({ items }: MapFeaturesGridProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<MapFeatureItem | null>(null)

  const open = (item: MapFeatureItem) => {
    if (!item.image_url) return
    setSelected(item)
    setIsOpen(true)
  }
  const close = () => setIsOpen(false)

  const lightboxItem = selected
    ? {
        id: selected.id,
        title: selected.title,
        description: selected.description ?? null,
        image_url: selected.image_url ?? '',
        category: 'lokasi peta',
        created_at: new Date().toISOString(),
      }
    : null

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((feat) => (
        <div key={feat.id} className="rounded border border-gray-200 p-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-red-700 text-white text-xs">
              {feat.type === 'point' ? 'P' : feat.type === 'line' ? 'G' : 'A'}
            </span>
            <span className="font-medium">{feat.title}</span>
            <span className="text-xs text-gray-500">[{feat.type}]</span>
          </div>
          {feat.image_url && (
            <button
              type="button"
              onClick={() => open(feat)}
              className="mt-2 w-full group"
            >
              <img
                src={feat.image_url}
                alt={feat.title}
                loading="lazy"
                decoding="async"
                className="w-full h-40 md:h-48 object-contain bg-neutral-50 rounded group-hover:shadow-md transition"
              />
              <p className="text-xs text-gray-500 mt-1 text-left">Klik gambar untuk memperbesar</p>
            </button>
          )}
          {feat.description && (
            <p className="text-sm text-gray-700 mt-2">{feat.description}</p>
          )}
          {feat.type === 'point' && feat.latitude && feat.longitude ? (
            <a
              href={`https://www.google.com/maps?q=${feat.latitude},${feat.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline mt-2 inline-block"
            >
              Buka di Google Maps
            </a>
          ) : (
            <p className="text-xs text-gray-500 mt-2">
              {feat.type === 'polygon' ? 'Area' : feat.type === 'line' ? 'Garis' : 'Lokasi'} tersedia
            </p>
          )}
        </div>
      ))}

      <GalleryLightbox item={lightboxItem} isOpen={isOpen} onClose={close} />
    </div>
  )
}