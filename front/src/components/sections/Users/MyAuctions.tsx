'use client';

import React from 'react';
import { Container, ProductCard } from '@/components/ui';

interface Auction {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  currentBid: number;
  bidsCount: number;
  timeLeft: string;
  status: 'auction' | 'sold' | 'draft';
}

interface MyAuctionsProps {
  title?: string;
  viewAllText?: string;
  viewAllHref?: string;
  auctions?: Auction[];
  onViewAll?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onBoost?: (id: string) => void;
}

export default function MyAuctions({
  title = "Mes enchères",
  viewAllText = "Voir tout",
  viewAllHref = "/dashboard/pro/encheres",
  auctions = [
    {
      id: '1',
      image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/e0d2439471-9f938c17e3a7cc7ca9ec.png',
      title: 'Sac à main en cuir',
      subtitle: 'État excellent',
      currentBid: 850,
      bidsCount: 12,
      timeLeft: '2j 5h',
      status: 'auction',
    },
    {
      id: '2',
      image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/5e1fafd939-63faf1d245637788564f.png',
      title: 'Montre automatique',
      subtitle: 'Comme neuf',
      currentBid: 1200,
      bidsCount: 24,
      timeLeft: '1j 12h',
      status: 'auction',
    },
    {
      id: '3',
      image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/ad67813f3b-3643b0fbcc4eae0a4261.png',
      title: 'Foulard en soie',
      subtitle: 'État excellent',
      currentBid: 320,
      bidsCount: 8,
      timeLeft: '5j 3h',
      status: 'auction',
    },
    {
      id: '4',
      image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/7ab749c170-a8e653a6d8ae8574ab22.png',
      title: 'Escarpins en daim',
      subtitle: 'Très bon état',
      currentBid: 450,
      bidsCount: 6,
      timeLeft: '3j 8h',
      status: 'auction',
    },
    {
      id: '5',
      image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/7157287c24-51e38876db30307af636.png',
      title: 'Collier en or',
      subtitle: 'Comme neuf',
      currentBid: 2100,
      bidsCount: 35,
      timeLeft: '18h',
      status: 'auction',
    },
    {
      id: '6',
      image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/b40da808f2-7d6994a7c39f32ffa713.png',
      title: 'Lunettes de soleil',
      subtitle: 'État excellent',
      currentBid: 380,
      bidsCount: 10,
      timeLeft: '4j 15h',
      status: 'auction',
    },
  ],
  onViewAll,
  onEdit,
  onDelete,
  onBoost,
}: MyAuctionsProps) {
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

        {/* Grid of Auctions */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {auctions.map((auction) => (
            <ProductCard
              key={auction.id}
              id={auction.id}
              image={auction.image}
              title={auction.title}
              subtitle={auction.subtitle}
              price={auction.currentBid}
              status={auction.status}
              viewMode="seller"
              bidsCount={auction.bidsCount}
              timeLeft={auction.timeLeft}
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