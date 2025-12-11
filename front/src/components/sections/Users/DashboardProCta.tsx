'use client'

import React from 'react';
import { Container, Button } from '@/components/ui';

interface DashboardProCTAProps {
  title?: string;
  description?: string;
  directSaleText?: string;
  auctionText?: string;
  onDirectSale?: () => void;
  onAuction?: () => void;
  directSaleHref?: string;
  auctionHref?: string;
}

export default function DashboardProCTA({
  title = "Mettre en vente un article",
  description = "Proposez vos articles d'exception à notre communauté d'acheteurs distingués",
  directSaleText = "Vente directe",
  auctionText = "Créer une enchère",
  onDirectSale,
  onAuction,
  directSaleHref = "/dashboard/pro/vente-directe",
  auctionHref = "/dashboard/pro/enchere",
}: DashboardProCTAProps) {
  const handleDirectSale = () => {
    if (onDirectSale) {
      onDirectSale();
    } else if (directSaleHref) {
      window.location.href = directSaleHref;
    }
  };

  const handleAuction = () => {
    if (onAuction) {
      onAuction();
    } else if (auctionHref) {
      window.location.href = auctionHref;
    }
  };

  return (
    <section className="mb-12 lg:mb-16" >
      <Container>
        <div className="rounded-lg p-8 lg:p-12 text-center" style={{ backgroundColor: 'var(--color-purple-dark)' }}>
          <h2 className="font-cormorant text-[var(--color-cream-light)] text-3xl lg:text-5xl mb-4 lg:mb-6">
            {title}
          </h2>
          <p className="font-raleway font-light text-[var(--color-cream-light)] opacity-80 text-base lg:text-lg mb-6 lg:mb-8 max-w-2xl mx-auto">
            {description}
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              variant="secondary"
              size="lg"
              onClick={handleDirectSale}
              className="w-full sm:w-auto"
            >
              {directSaleText}
            </Button>
            
            <Button
              variant="primary"
              size="lg"
              onClick={handleAuction}
              className="w-full sm:w-auto border-2 border-cream-light text-cream-light hover:bg-cream-light hover:text-purple-dark"
            >
              {auctionText}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}