'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui';

interface ProductGalleryProps {
  images: string[];
  title: string;
  status: "PENDING" | "ACTIVE" | "ENDED" | "CANCELLED";
}

export default function ProductGallery({ images, title, status }: ProductGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <>
      <div className="mb-4 overflow-hidden bg-white rounded-sm relative">
        <button
          onClick={() => setIsZoomed(true)}
          className="w-full cursor-zoom-in"
        >
          <Image
            src={images[currentImageIndex]}
            alt={title}
            width={800}
            height={800}
            className="w-full h-auto max-h-[600px] object-cover"
          />
        </button>

        <div className="absolute bottom-4 left-4">
          <Badge variant={status}>
            {status === 'PENDING' && 'À venir'}
            {status === 'ACTIVE' && 'En cours'}
            {status === 'ENDED' && 'Terminée'}
            {status === 'CANCELLED' && 'Annulée'}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {images.slice(0, 10).map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`overflow-hidden bg-white rounded-sm cursor-pointer transition ${
              index === currentImageIndex 
                ? 'ring-2 ring-purple-dark' 
                : 'hover:opacity-80'
            }`}
          >
            <Image
              src={image}
              alt={`${title} - ${index + 1}`}
              width={150}
              height={150}
              className="w-full h-20 sm:h-24 object-cover"
            />
          </button>
        ))}
      </div>

      {/* Zoom Modal */}
      {isZoomed && (
        <div 
          className="fixed inset-0 z-50 bg-black-deep/95 flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-4 right-4 text-cream-light hover:text-white"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <Image
            src={images[currentImageIndex]}
            alt={title}
            width={1200}
            height={1200}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </>
  );
}