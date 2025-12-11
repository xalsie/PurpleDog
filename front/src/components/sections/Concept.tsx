import React from 'react';
import Image from 'next/image';
import { Container } from '@/components/ui';

interface Stat {
  value: string;
  label: string;
}

interface ConceptSectionProps {
  title?: string;
  paragraphs?: string[];
  stats?: Stat[];
  image?: string;
  imageAlt?: string;
  imagePosition?: 'left' | 'right';
}

export default function ConceptSection({
  title = "Une Maison Parisienne d'Exception",
  paragraphs = [
    "Purple Dog incarne l'excellence parisienne dans l'univers du luxe et des ventes aux enchères. Notre maison se distingue par une sélection rigoureuse d'objets d'art, de bijoux précieux et de pièces de collection uniques.",
    "Chaque objet est authentifié par nos experts et présenté avec le soin qu'il mérite. Nous créons des moments d'exception pour une clientèle exigeante en quête de rareté et d'authenticité."
  ],
  stats = [
    { value: "500+", label: "Objets d'Art" },
    { value: "50+", label: "Ventes Annuelles" },
    { value: "98%", label: "Satisfaction" }
  ],
  image = "https://storage.googleapis.com/uxpilot-auth.appspot.com/fdacadb0ab-456a58b3fed1088caf86.png",
  imageAlt = "Elegant Paris luxury boutique interior with refined decor and precious objects",
  imagePosition = 'right',
}: ConceptSectionProps) {
  return (
    <section className="py-16 lg:py-24">
      <Container size="lg">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className={imagePosition === 'right' ? 'order-2 lg:order-1' : 'order-2 lg:order-2'}>
            <h2 className="font-cormorant text-3xl lg:text-5xl text-purple-dark mb-6">
              {title}
            </h2>
            
            {paragraphs.map((paragraph, index) => (
              <p 
                key={index}
                className="text-black-deep/80 text-base lg:text-lg mb-6 leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
            {stats && stats.length > 0 && (
              <div className="grid grid-cols-3 gap-6 lg:gap-8 mt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl lg:text-4xl font-cormorant text-purple-dark mb-2">
                      {stat.value}
                    </div>
                    <div className="text-xs lg:text-sm text-black-deep/70">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className={imagePosition === 'right' ? 'order-1 lg:order-2' : 'order-1 lg:order-1'}>
            <div className="relative h-[400px] lg:h-[500px]">
              <Image
                src={image}
                alt={imageAlt}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}