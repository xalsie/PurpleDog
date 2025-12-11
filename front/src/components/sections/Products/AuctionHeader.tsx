'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui';

interface AuctionHeaderProps {
  brand: string;
  title: string;
  subtitle: string;
  currentBid: number;
  timeLeft: string;
  bidsCount: number;
  onBid?: (amount: number) => void;
  onLike?: () => void;
  onMessage?: () => void;
}

export default function AuctionHeader({
  brand,
  title,
  subtitle,
  currentBid,
  timeLeft,
  bidsCount,
  onBid,
  onLike,
  onMessage,
}: AuctionHeaderProps) {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.();
  };

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <p className="text-sm sm:text-base text-purple-dark mb-2 tracking-wide">
          {brand.toUpperCase()}
        </p>
        <h1 className="font-cormorant text-3xl sm:text-4xl lg:text-5xl text-black-deep mb-3 sm:mb-4">
          {title}
        </h1>
        <p className="text-sm sm:text-base text-black-deep/70 leading-relaxed">
          {subtitle}
        </p>
      </div>

      <div className="border-t border-b border-purple-dark/10 py-6 sm:py-8 mb-6 sm:mb-8">
        <div className="grid grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div>
            <p className="text-xs sm:text-sm text-black-deep/60 mb-2">
              Enchère actuelle
            </p>
            <p className="font-raleway text-2xl sm:text-3xl lg:text-4xl text-purple-dark">
              {currentBid.toLocaleString('fr-FR')} €
            </p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-black-deep/60 mb-2">
              Temps restant
            </p>
            <p className="font-raleway text-2xl sm:text-3xl lg:text-4xl text-black-deep">
              {timeLeft}
            </p>
          </div>
        </div>
        <div className="flex items-center text-xs sm:text-sm text-black-deep/70">

          <span>{bidsCount} enchère{bidsCount > 1 ? 's' : ''}</span>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-10">
        <Button
          variant="primary"
          size="lg"
          onClick={() => onBid?.(currentBid + 50)}
          className="w-full tracking-wide"
        >
          Enchérir
        </Button>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <button
            onClick={handleLike}
            className="border border-purple-dark text-purple-dark py-3 sm:py-4 rounded-sm hover:bg-purple-dark hover:text-cream-light transition-all flex items-center justify-center space-x-2"
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
            <span className="text-sm sm:text-base">Favoris</span>
          </button>

          <button
            onClick={onMessage}
            className="border border-purple-dark text-purple-dark py-3 sm:py-4 rounded-sm hover:bg-purple-dark hover:text-cream-light transition-all flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
              />
            </svg>
            <span className="text-sm sm:text-base">Message</span>
          </button>
        </div>
      </div>
    </div>
  );
}