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
  viewAllHref = "/dashboard/listes/encheres",
  auctions = [],
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