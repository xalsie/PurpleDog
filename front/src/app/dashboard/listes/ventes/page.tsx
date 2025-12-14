'use client';

import React from 'react';
import { Container, ProductCard } from '@/components/ui';
import NavBarDashboard from '@/components/layout/NavBarDashboard/NavBarDashboard';
import { useAuth } from '@/hooks/useAuth';


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
  viewAllText?: boolean;
  viewAllHref?: string;
  listings?: Listing[];
  onViewAll?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onBoost?: (id: string) => void;
}

export default function MyListings({
  title = "Mes annonces",
  viewAllText = true,
  viewAllHref = "/dashboard/ventes",
  listings = [],
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
    const { user, logout } = useAuth();

  return (
    <> 
    <NavBarDashboard UserType={user?.role} logOut={logout}/>
    <section className="py-8 sm:py-12 lg:py-16">
      <Container>
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <h2 className="font-cormorant text-2xl sm:text-3xl lg:text-4xl text-purple-dark">
            {title}
          </h2>
    
        </div>

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
    </section></>
  );
}