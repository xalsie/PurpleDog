'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui';
import ReviewModal from './ReviewModal';

interface ReviewBannerProps {
  title?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
}

export default function ReviewBanner({
  title = "Votre avis compte",
  description = "Aidez-nous à améliorer votre expérience en partageant vos impressions sur Purple Dog.",
  ctaText = "Laisser un avis",
  ctaHref,
  onCtaClick,
}: ReviewBannerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    if (onCtaClick) {
      onCtaClick();
    } else if (ctaHref) {
      window.location.href = ctaHref;
    } else {

      setIsModalOpen(true);
    }
  };

  return (
    <>
      <section className="py-8 sm:py-12 lg:py-16" style={{ backgroundColor: 'rgba(44, 14, 64, 0.05)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 lg:p-16 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="flex justify-center mb-6">
                <svg 
                  className="w-8 h-8 sm:w-10 sm:h-10" 
                  fill="#2C0E40"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>

              <h2 className="font-cormorant text-2xl sm:text-3xl lg:text-4xl mb-4 sm:mb-6" style={{ color: '#2C0E40' }}>
                {title}
              </h2>

              <p className="text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed" style={{ color: 'rgba(2, 0, 22, 0.7)' }}>
                {description}
              </p>

              <Button
                variant="outline"
                size="lg"
                onClick={handleClick}
                className="border-purple-dark text-purple-dark bg-transparent hover:bg-purple-dark hover:text-cream-light px-8 sm:px-10 py-3 sm:py-4 text-sm sm:text-base tracking-wide"
              >
                {ctaText}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}