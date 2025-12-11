'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui';

interface ProductHeaderProps {
  brand: string;
  title: string;
  subtitle: string;
  price: number;
  onBuy?: () => void;
  onLike?: () => void;
  onMessage?: () => void;
}

export default function ProductHeader({
  brand,
  title,
  subtitle,
  price,
  onBuy,
  onLike,
  onMessage,
}: ProductHeaderProps) {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.();
  };

  return (
    <div>
      <div className="mb-3">
        <span className="text-xs sm:text-sm uppercase tracking-widest text-purple-dark/60">
          {brand}
        </span>
      </div>
      <h1 className="font-cormorant text-3xl sm:text-4xl lg:text-5xl text-purple-dark mb-4">
        {title}
      </h1>
      <p className="text-sm sm:text-base text-purple-dark/70 mb-6 leading-relaxed">
        {subtitle}
      </p>
      <div className="mb-8">
        <div className="flex items-baseline space-x-3">
          <span className="font-raleway text-3xl sm:text-4xl text-purple-dark">
            {price.toLocaleString('fr-FR')} €
          </span>
        </div>
      </div>
      <div className="space-y-3 mb-8">
        <Button
          variant="primary"
          size="lg"
          onClick={onBuy}
          className="w-full uppercase tracking-widest"
        >
          Acheter maintenant
        </Button>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleLike}
            className="border border-purple-dark text-purple-dark py-3 px-4 text-xs sm:text-sm uppercase tracking-widest hover:bg-purple-dark hover:text-cream-light transition flex items-center justify-center space-x-2"
          >
            <svg 
              className="w-5 h-5" 
              fill={isLiked ? 'currentColor' : 'none'} 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
              />
            </svg>
            <span>Favoris</span>
          </button>

          <button
            onClick={onMessage}
            className="border border-purple-dark text-purple-dark py-3 px-4 text-xs sm:text-sm uppercase tracking-widest hover:bg-purple-dark hover:text-cream-light transition flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
              />
            </svg>
            <span>Message</span>
          </button>
        </div>
      </div>
    </div>
  );
}