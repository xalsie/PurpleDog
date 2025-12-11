import React from 'react';
import Image from 'next/image';
import { Container, Button } from '@/components/ui';

interface DashboardCTAProps {
  title?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  image?: string;
  imageAlt?: string;
  onCtaClick?: () => void;
}

export default function DashboardCTA({
  title = "Mettez en vente vos pièces d'exception",
  description = "Partagez vos trésors avec une communauté de passionnés. Simple, élégant, efficace.",
  ctaText = "Créer une annonce",
  ctaHref = "/dashboard/particulier/vendre",
  image = "https://storage.googleapis.com/uxpilot-auth.appspot.com/59cbe99951-ebe187b223c777fd31b6.png",
  imageAlt = "Elegant luxury fashion items on marble surface",
  onCtaClick,
}: DashboardCTAProps) {
  const handleClick = () => {
    if (onCtaClick) {
      onCtaClick();
    } else if (ctaHref) {
      window.location.href = ctaHref;
    }
  };

  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <Container>
        <div className="bg-[var(--color-purple-dark)] rounded-none sm:rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

            <div className="p-8 sm:p-10 lg:p-16 flex flex-col justify-center">
              <h2 className="font-cormorant text-3xl sm:text-4xl lg:text-5xl text-[var(--color-cream-light)] mb-4 sm:mb-6">
                {title}
              </h2>
              <p className="text-[var(--color-cream-light)] opacity-80 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed font-raleway font-light">
                {description}
              </p>
              <div>
                {ctaHref ? (
                  <a href={ctaHref}>
                    <Button
                      variant="secondary"
                      size="lg"
                      className="px-8 sm:px-10 py-3 sm:py-4 text-sm sm:text-base tracking-wide"
                    >
                      {ctaText}
                    </Button>
                  </a>
                ) : (
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={handleClick}
                    className="px-8 sm:px-10 py-3 sm:py-4 text-sm sm:text-base tracking-wide"
                  >
                    {ctaText}
                  </Button>
                )}
              </div>
            </div>

            <div className="h-64 sm:h-80 lg:h-auto relative overflow-hidden">
              <Image
                src={image}
                alt={imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}