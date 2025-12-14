import React from 'react';
import Image from 'next/image';
import { Button, Container } from '@/components/ui';

interface HeroSectionProps {
  title?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  backgroundImage?: string;
}

export default function HeroSection({
  title = "L'Art de l'Exception",
  description = "Découvrez une sélection raffinée d'objets de luxe et participez à des ventes aux enchères exclusives",
  ctaText = "Rejoindre la plateforme",
  ctaHref = "/login",
  onCtaClick,
  backgroundImage = "https://storage.googleapis.com/uxpilot-auth.appspot.com/98f7f86b86-43dfe55a88cc6039ffcb.png",
}: HeroSectionProps) {
  const handleClick = () => {
    if (onCtaClick) {
      onCtaClick();
    } else if (ctaHref) {
      window.location.href = ctaHref;
    }
  };

  return (
    <section className="relative bg-[var(--color-purple-dark)] h-[600px] lg:h-[700px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt="Elegant luxury auction house interior with classical architecture"
          fill
          className="object-cover"
          priority
          quality={85}
        />
        <div className="absolute inset-0 bg-[var(--color-purple-dark)] opacity-80"></div>
      </div>
      <Container size="lg" className="relative z-10">
        <div className="text-center">
          <h1 className="font-cormorant text-4xl lg:text-6xl xl:text-7xl text-[var(--color-cream-light)] mb-6 leading-tight">
            {title}
          </h1>
          <p className="text-[var(--color-cream-light)] opacity-90 text-base lg:text-lg xl:text-xl mb-8 max-w-2xl mx-auto font-raleway font-light">
            {description}
          </p>
          
          {ctaHref ? (
            <a href={ctaHref}>
              <Button 
                variant="secondary" 
                size="lg"
                className="px-8 py-3 lg:px-10 lg:py-4"
              >
                {ctaText}
              </Button>
            </a>
          ) : (
            <Button 
              variant="secondary" 
              size="lg"
              onClick={handleClick}
              className="px-8 py-3 lg:px-10 lg:py-4"
            >
              {ctaText}
            </Button>
          )}
        </div>
      </Container>
    </section>
  );
}