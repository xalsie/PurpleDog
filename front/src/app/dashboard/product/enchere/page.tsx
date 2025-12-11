'use client'

import React, { useEffect, useState } from 'react';
import { Container, Button } from '@/components/ui';
import { AuctionHeader, AuctionDetails, PhotoGallery, SellerInfos } from '@/components/sections/Index';
import NavBarDashboard from '@/components/layout/NavBarDashboard/NavBarDashboard';
import { useAuth } from '@/hooks/useAuth';
import axiosInstance from '@/lib/axios';

interface AuctionProduct {
  id: string;
  brand: string;
  title: string;
  subtitle: string;
  currentBid: number;
  timeLeft: string;
  bidsCount: number;
  model: string;
  material: string;
  color: string;
  year: string;
  condition: string;
  authenticated: boolean;
  description: string;
  images: string[];
  status: 'auction' | 'sold';
  seller: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
  };
}

interface AuctionProductPageProps {
  productId?: string;
}

export default function AuctionProductPage({ productId }: AuctionProductPageProps) {
  const [product, setProduct] = useState<AuctionProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, logout } = useAuth();

  const defaultAuctionProduct: AuctionProduct = {
   id: '1',
   brand: 'Hermès',
   title: 'Kelly 32 Vintage',
   subtitle: 'Sac iconique en cuir Box bordeaux, circa 1995',
   currentBid: 3450,
   timeLeft: '2j 14h',
   bidsCount: 23,
   model: 'Kelly 32',
   material: 'Cuir Box',
   color: 'Bordeaux',
   year: '1995',
   condition: 'Excellent',
   authenticated: true,
   description: "Sac Kelly 32 en cuir Box bordeaux, datant de 1995. Pièce authentique en excellent état vintage avec patine naturelle du cuir. Fermoir et cadenas plaqué or en parfait état de fonctionnement. Intérieur en cuir chevreau bordeaux impeccable.",
  images: [
   'https://storage.googleapis.com/uxpilot-auth.appspot.com/2fe8b912ae-08939be41498732d673b.png',
   'https://storage.googleapis.com/uxpilot-auth.appspot.com/1e3b7ae36f-b6e656608b5dadff4ad3.png',
    'https://storage.googleapis.com/uxpilot-auth.appspot.com/ed117302db-0ef9383370e382c2d72e.png',
    'https://storage.googleapis.com/uxpilot-auth.appspot.com/e9a4bda1e5-f4d3ebee959865a69b05.png',
    'https://storage.googleapis.com/uxpilot-auth.appspot.com/af06b0b441-ca4c42dfa004d446f8e1.png',
    'https://storage.googleapis.com/uxpilot-auth.appspot.com/830672da53-e24cd66178d57a9437ca.png',
    'https://storage.googleapis.com/uxpilot-auth.appspot.com/921ffbcb1f-8afe17bd773098fd479a.png',
    'https://storage.googleapis.com/uxpilot-auth.appspot.com/197b360499-9a468a952a417a295627.png',
    'https://storage.googleapis.com/uxpilot-auth.appspot.com/f28079d9fb-70f9ed420956375029a2.png',
    'https://storage.googleapis.com/uxpilot-auth.appspot.com/543f7a6df4-62b7f39390fb849ed71f.png',
  ],
  status: 'auction',
  seller: {
    id: 'seller-2',
    name: 'Jean L.',
    avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg',
    verified: true,
  },
};

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setProduct(defaultAuctionProduct);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data } = await axiosInstance.get(`/auctions/${productId}`);
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur de chargement');
        console.error('Error fetching auction:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleBid = async (amount: number) => {
    if (!product) return;

    try {
      const { data: updatedProduct } = await axiosInstance.post('/bids', {
        auctionId: product.id,
        amount
      });

      console.log('Enchère placée:', amount);
      setProduct(updatedProduct);
    } catch (err) {
      console.error('Error placing bid:', err);
    }
  };

  const handleLike = async () => {
    if (!product) return;

    try {
      await axiosInstance.post('/favorite', {
        auctionId: product.id
      });
      console.log('Ajouté aux favoris');
    } catch (err) {
      console.error('Error liking auction:', err);
    }
  };

  const handleMessage = async () => {
    if (!product) return;

    try {
      const { data } = await axiosInstance.post('/conversations', {
        sellerId: product.seller.id,
        auctionId: product.id
      });

      if (data?.conversationId) {
        window.location.href = `/messages/${data.conversationId}`;
      }
    } catch (err) {
      console.error('Error starting conversation:', err);
    }
  };

  const handleContactSeller = async (sellerId: string) => {
    handleMessage();
  };

  if (loading) {
    return (
      <main className="pt-16 sm:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-purple-dark">Chargement...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="pt-16 sm:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-red-600">{error || 'Enchère non trouvée'}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
  <>
  <NavBarDashboard 
                  UserType={user?.role}
                  logOut={logout}
                />
    <main className="pt-16 sm:pt-20">
        
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          
          <section className="order-1">
            <PhotoGallery
              images={product.images}
              title={product.title}
              status={product.status}
            />
          </section>

          <section className="order-2">
            <div className="sticky top-24">
              <AuctionHeader
                brand={product.brand}
                title={product.title}
                subtitle={product.subtitle}
                currentBid={product.currentBid}
                timeLeft={product.timeLeft}
                bidsCount={product.bidsCount}
                onBid={handleBid}
                onLike={handleLike}
                onMessage={handleMessage}
              />

              <SellerInfos
                seller={product.seller}
                onContact={handleContactSeller}
              />

              <AuctionDetails
                brand={product.brand}
                model={product.model}
                material={product.material}
                color={product.color}
                year={product.year}
                condition={product.condition}
                authenticated={product.authenticated}
                description={product.description}
              />
            </div>
          </section>
        </div>
      </div>
    </main>
    </>
  );
}

 