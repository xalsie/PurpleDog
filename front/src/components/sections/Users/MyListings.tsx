'use client';

import { useEffect, useState } from 'react';
import { Container, ProductCard } from '@/components/ui';
import axios from '@/lib/axios';

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

const statusMap: Record<string, 'online' | 'draft' | 'sold'> = {
  PUBLISHED: 'online',
  DRAFT: 'draft',
  SOLD: 'sold',
  ARCHIVED: 'draft',
};

export default function MyListings({
  title = 'Mes annonces',
  viewAllText = true,
  viewAllHref = '/dashboard/particulier/annonces',
  listings: propListings,
  onViewAll,
  onEdit,
  onDelete,
  onBoost,
}: MyListingsProps) {
  const [listings, setListings] = useState<Listing[]>(propListings ?? []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (propListings && propListings.length > 0) {
      setListings(propListings);
      return;
    }

    let cancelled = false;

    const fetchMyListings = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/items');

        const mapped: Listing[] = (data || []).map((d: any) => {
          const item = d.item || d;
          const medias = item.medias ?? [];
          const primary = medias.find((m: any) => m.isPrimary) ?? medias[0];
          const image = primary?.url ? `${process.env.NEXT_PUBLIC_API_URL}/api/medias${primary.url}` : '/images/placeholder.png';
          const price = Number(item.desired_price ?? item.ai_estimated_price ?? 0);
          const status = statusMap[item.status] || 'draft';

          return {
            id: item.id,
            image,
            title: item.name,
            subtitle: item.description ?? '',
            price,
            status,
            offersCount: d.favCount ?? 0,
          };
        });

        if (!cancelled) setListings(mapped);
      } catch (err) {
        console.error('Error fetching listings:', err);
        if (!cancelled) setError('Erreur lors du chargement de vos annonces');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchMyListings();

    return () => {
      cancelled = true;
    };
  }, [propListings]);

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else if (viewAllHref) {
      window.location.href = viewAllHref;
    }
  };

  if (loading) {
    return <div className="py-16 text-center">Chargement...</div>;
  }

  if (error) {
    return <div className="py-16 text-center text-red-500">{error}</div>;
  }

  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <Container>
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <h2 className="font-cormorant text-2xl sm:text-3xl lg:text-4xl text-purple-dark">
            {title}
          </h2>
          { viewAllText && 
            <button
              onClick={handleViewAll}
              className="text-purple-dark text-sm sm:text-base hover:underline flex items-center gap-2"
            >
              voir tout
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          }
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
              href={`/dashboard/product/enchere?id=${listing.id}`}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
