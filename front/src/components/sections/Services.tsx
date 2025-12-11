import React from 'react';
import { Container } from '@/components/ui';

interface Service {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface ServicesSectionProps {
  title?: string;
  services?: Service[];
}

export default function ServicesSection({
  title = "Nos Services",
  services = [
    {
      id: 'authentication',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Authentification',
      description: 'Chaque objet est authentifié par nos experts reconnus internationalement',
    },
    {
      id: 'estimation',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Estimation',
      description: 'Faites estimer vos objets de valeur par nos spécialistes',
    },
    {
      id: 'security',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: 'Sécurité',
      description: 'Transactions sécurisées et livraison assurée dans le monde entier',
    },
  ],
}: ServicesSectionProps) {
  return (
    <section className="py-16 lg:py-24">
      <Container size="lg">
        <h2 className="font-cormorant text-3xl lg:text-5xl text-purple-dark text-center mb-12 lg:mb-16">
          {title}
        </h2>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {services.map((service) => (
            <div key={service.id} className="text-center">
              <div className="w-16 h-16 bg-purple-dark/10 rounded-full flex items-center justify-center mx-auto mb-6 text-purple-dark">
                {service.icon}
              </div>
              <h3 className="font-cormorant text-xl lg:text-2xl text-purple-dark mb-4">
                {service.title}
              </h3>
              <p className="text-black-deep/70 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}