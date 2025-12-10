'use client'

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Container } from '@/components/ui';

interface CarouselItem {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  price: number;
  isLiked?: boolean;
}

interface FeaturedCarouselProps {
  title?: string;
  description?: string;
  items?: CarouselItem[];
  onLike?: (id: string) => void;
  onItemClick?: (id: string) => void;
}

export default function FeaturedCarousel({
  title = "Sélection du Moment",
  description = "Découvrez nos pièces d'exception actuellement disponibles",
  items = [
    {
      id: '1',
      image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/b33a166c57-d7a31c85a4607b573787.png',
      title: 'Collier Diamants',
      subtitle: 'Cartier, 1925',
      price: 125000,
    },
    {
      id: '2',
      image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/9d2cadbf4c-bd06a3a2262e94ba03ec.png',
      title: 'Montre Patek Philippe',
      subtitle: 'Référence 5711, 2018',
      price: 89000,
    },
    {
      id: '3',
      image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/c8205ffaa7-fea841e5c3fb322a22df.png',
      title: 'Sac Hermès Birkin',
      subtitle: 'Cuir Togo, Noir',
      price: 35000,
    },
    {
      id: '4',
      image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/f335a20f92-8810f7fec8c18f2621fc.png',
      title: 'Stylo Montblanc',
      subtitle: 'Meisterstück 149',
      price: 12500,
    },
  ],
  onLike,
  onItemClick,
}: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  // Détecte le nombre d'items à afficher selon la taille d'écran
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerView(3);
      } else {
        setItemsPerView(1);
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const maxIndex = Math.max(0, items.length - itemsPerView);

  const goToSlide = (index: number) => {
    const clampedIndex = Math.max(0, Math.min(index, maxIndex));
    setCurrentIndex(clampedIndex);
  };

  const goToPrev = () => {
    goToSlide(currentIndex - 1);
  };

  const goToNext = () => {
    goToSlide(currentIndex + 1);
  };

  // Gestion du swipe tactile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentIndex < maxIndex) {
      goToNext();
    }
    if (isRightSwipe && currentIndex > 0) {
      goToPrev();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const handleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onLike?.(id);
  };

  const handleItemClick = (id: string) => {
    onItemClick?.(id);
  };

  // Calcul du nombre de dots à afficher
  const dotsCount = itemsPerView === 1 ? items.length : maxIndex + 1;

  return (
    <section className="py-16 lg:py-20" style={{ backgroundColor: 'rgba(44, 14, 64, 0.05)' }}>
      <Container>
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="font-cormorant text-3xl lg:text-5xl text-[var(--color-purple-dark)] mb-4">
            {title}
          </h2>
          <p className="text-[var(--color-black-deep)] opacity-70 text-base lg:text-lg font-raleway font-light">
            {description}
          </p>
        </div>

        {/* Carousel */}
        <div className="relative max-w-6xl mx-auto">
          <div 
            className="overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              ref={trackRef}
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              }}
            >
              {items.map((item) => (
                <div
                  key={item.id}
                  className="min-w-full lg:min-w-[33.333%] px-3"
                  onClick={() => handleItemClick(item.id)}
                >
                  <div className="bg-[var(--color-cream-light)] group cursor-pointer">
                    {/* Image */}
                    <div className="relative h-[400px] lg:h-[450px] overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-700"
                        sizes="(max-width: 1024px) 100vw, 33vw"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="font-cormorant text-xl lg:text-2xl text-[var(--color-purple-dark)] mb-2">
                        {item.title}
                      </h3>
                      <p className="text-[var(--color-black-deep)] opacity-70 text-sm mb-3 font-raleway font-light">
                        {item.subtitle}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-[var(--color-purple-dark)] font-raleway font-light">
                          {item.price.toLocaleString('fr-FR')} €
                        </span>
                        <button
                          onClick={(e) => handleLike(e, item.id)}
                          className="text-[var(--color-purple-dark)] hover:scale-110 transition-transform"
                          aria-label="Ajouter aux favoris"
                        >
                          <svg
                            className="w-6 h-6"
                            fill={item.isLiked ? 'currentColor' : 'none'}
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
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons - Desktop only */}
          {maxIndex > 0 && (
            <>
              <button
                onClick={goToPrev}
                disabled={currentIndex === 0}
                className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 bg-[var(--color-cream-light)] text-[var(--color-purple-dark)] w-12 h-12 rounded-full hover:bg-[var(--color-purple-dark)] hover:text-[var(--color-cream-light)] transition shadow-lg items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Précédent"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={goToNext}
                disabled={currentIndex === maxIndex}
                className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 bg-[var(--color-cream-light)] text-[var(--color-purple-dark)] w-12 h-12 rounded-full hover:bg-[var(--color-purple-dark)] hover:text-[var(--color-cream-light)] transition shadow-lg items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Suivant"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Dots Navigation */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: dotsCount }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-[var(--color-purple-dark)]' : 'bg-[var(--color-purple-dark)] opacity-30'
                }`}
                aria-label={`Aller à la diapositive ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}