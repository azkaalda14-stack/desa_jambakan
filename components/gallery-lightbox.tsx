'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'

export interface GalleryItem {
  id: string
  title: string
  description: string | null
  image_url: string
  category: string | null
  created_at: string
  status?: string
  uploaded_by?: string
}

interface GalleryLightboxProps {
  item: GalleryItem | null
  isOpen: boolean
  onClose: () => void
}

export function GalleryLightbox({ item, isOpen, onClose }: GalleryLightboxProps) {
  if (!item) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent showCloseButton={false} className="max-w-4xl max-h-[95vh] p-0 gap-0 rounded-2xl overflow-hidden shadow-2xl border-0">
        <div className="flex flex-col h-full">
          {/* Bagian Gambar - di atas */}
          <div className="relative w-full bg-black flex items-center justify-center flex-shrink-0">
            <img
              src={item.image_url}
              alt={item.title}
              className="max-w-full max-h-[60vh] object-contain rounded-t-2xl"
            />
            <DialogClose className="absolute top-6 right-6 z-10 bg-white/90 hover:bg-white text-black rounded-full p-3 transition-all duration-200 shadow-lg hover:shadow-xl">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </DialogClose>
          </div>
          
          {/* Bagian Konten - di bawah */}
          <div className="w-full bg-white p-8 overflow-y-auto flex-grow rounded-b-2xl">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-xl md:text-2xl font-bold text-gray-900">
                {item.title}
              </DialogTitle>
              {item.category && (
                <Badge variant="secondary" className="w-fit mt-2">
                  {item.category}
                </Badge>
              )}
            </DialogHeader>
            
            <div className="space-y-4">
              {item.description && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Deskripsi</h4>
                  <DialogDescription className="text-sm md:text-base text-gray-600 whitespace-pre-wrap">
                    {item.description}
                  </DialogDescription>
                </div>
              )}
              
              <div className="text-xs text-gray-500">
                <p>Dipublikasikan pada: {new Date(item.created_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}