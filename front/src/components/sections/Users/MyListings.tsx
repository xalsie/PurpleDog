'use client';

import React from 'react';
import { Container, ProductCard } from '@/components/ui';

interface Listing {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  price: number;
  status: 'online' | 'draft' | 'sold';
  offersCount?: number;
}

interface MyListingsProps {
  title?: string;
  viewAllText?: string;
  viewAllHref?: string;
  listings?: Listing[];
  onViewAll?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onBoost?: (id: string) => void;
}

export default function MyListings({
  title = "Mes annonces",
  viewAllText = "Voir tout",
  viewAllHref = "/dashboard/particulier/annonces",
  listings = [
    {
      id: '1',
      image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/e0d2439471-9f938c17e3a7cc7ca9ec.png',
      title: 'Sac à main en cuir',
      subtitle: 'État excellent',
      price: 850,
      status: 'online',
    },
    {
      id: '2',
      image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/5e1fafd939-63faf1d245637788564f.png',
      title: 'Montre automatique',
      subtitle: 'Comme neuf',
      price: 1200,
      status: 'online',
    },
    {
      id: '3',
      image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/ad67813f3b-3643b0fbcc4eae0a4261.png',
      title: 'Foulard en soie',
      subtitle: 'État excellent',
      price: 320,
      status: 'online',
    },
    {
      id: '4',
      image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/7ab749c170-a8e653a6d8ae8574ab22.png',
      title: 'Escarpins en daim',
      subtitle: 'Très bon état',
      price: 450,
      status: 'online',
    },
    {
      id: '5',
      image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/7157287c24-51e38876db30307af636.png',
      title: 'Collier en or',
      subtitle: 'Comme neuf',
      price: 2100,
      status: 'online',
    },
    {
      id: '6',
      image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/b40da808f2-7d6994a7c39f32ffa713.png',
      title: 'Lunettes de soleil',
      subtitle: 'État excellent',
      price: 380,
      status: 'online',
    },
  ],
  onViewAll,
  onEdit,
  onDelete,
  onBoost,
}: MyListingsProps) {
  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else if (viewAllHref) {
      window.location.href = viewAllHref;
    }
  };

  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <Container>
        {/* Header */}
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <h2 className="font-cormorant text-2xl sm:text-3xl lg:text-4xl text-purple-dark">
            {title}
          </h2>
          <button
            onClick={handleViewAll}
            className="text-purple-dark text-sm sm:text-base hover:underline flex items-center gap-2"
          >
            {viewAllText}
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Grid of Listings */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {listings.map((listing) => (
            <ProductCard
              key={listing.id}
              id={listing.id}
              image={listing.image}
              title={listing.title}
              subtitle={listing.subtitle}
              price={listing.price}
              status={listing.status}
              viewMode="seller"
              offersCount={listing.offersCount}
              onEdit={onEdit}
              onDelete={onDelete}
              onBoost={onBoost}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}