'use client'

import React, { useState,useEffect } from 'react';
import Image from 'next/image';
import { Container, Button } from '@/components/ui';
import { PhotoGallery, ProductHeader, ProductDetails, SellerInfos } from '@/components/sections/Index';
import { CheckoutFlow } from '@/components/sections/Payment';
import NavBarDashboard from '@/components/layout/NavBarDashboard/NavBarDashboard';
import { useAuth } from '@/hooks/useAuth';
import axiosInstance from '@/lib/axios';

interface Product {
  id: string;
  brand: string;
  title: string;
  subtitle: string;
  price: number;
  condition: string;
  year: string;
  material: string;
  color: string;
  dimensions: string;
  reference: string;
  description: string;
  images: string[];
  status: 'online' | 'auction' | 'sold' | 'draft';
  seller: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
  };
}

interface ProductPageProps {
  productId?: string;
}

export default function ProductPage({ productId }: ProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setProduct(defaultProduct);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data } = await axiosInstance.get(`/items/${productId}`);
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur de chargement');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleBuy = async () => {
    if (!product) return;
    
    setShowCheckout(true);
  };

  const handleCheckoutComplete = () => {
    setShowCheckout(false);
  };

  const defaultProduct: Product = {
  id: '1',
  brand: 'Hermès',
  title: 'Birkin 35 Bordeaux',
  subtitle: 'Sac iconique en cuir Togo bordeaux, édition exceptionnelle avec détails dorés',
  price: 12500,
  condition: 'Excellent',
  year: '2018',
  material: 'Cuir Togo',
  color: 'Bordeaux',
  dimensions: '35 × 25 × 18 cm',
  reference: 'PD-HB-2018-035',
  description: "Pièce d'exception de la maison Hermès, ce Birkin 35 en cuir Togo bordeaux incarne l'élégance intemporelle. Authentifié et en excellent état, ce sac présente des finitions dorées impeccables et une patine naturelle qui témoigne de son caractère unique. Livré avec sa boîte d'origine, dustbag et certificat d'authenticité.",
  images: [
    'https://storage.googleapis.com/uxpilot-auth.appspot.com/a9a4c78066-8cb28e8acb8abfdf401e.png',
    'https://storage.googleapis.com/uxpilot-auth.appspot.com/f0e1989619-e3a048e083a00826cce5.png',
    'https://storage.googleapis.com/uxpilot-auth.appspot.com/2cfc09faf5-e0d36803676d3a310720.png',
    'https://storage.googleapis.com/uxpilot-auth.appspot.com/06a58df423-ac462b5edb737cbec5da.png',
    'https://storage.googleapis.com/uxpilot-auth.appspot.com/8b5e3fb914-7915714203a508bfe98f.png',
    'https://storage.googleapis.com/uxpilot-auth.appspot.com/eb2d38ba4b-8f3a495ca1f7dee57169.png',
    'https://storage.googleapis.com/uxpilot-auth.appspot.com/8df559733b-578825e38ca95fa863b1.png',
    'https://storage.googleapis.com/uxpilot-auth.appspot.com/f105f73b5e-8d99dac92a05c91fc0b5.png',
    'https://storage.googleapis.com/uxpilot-auth.appspot.com/99bcee24c6-c0a2600b425dbacfc735.png',
    'https://storage.googleapis.com/uxpilot-auth.appspot.com/5c87a94109-7e1d11b6c87b98c0aca1.png',
  ],
  status: 'online',
  seller: {
    id: 'seller-1',
    name: 'Sophie M.',
    avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg',
    verified: true,
  },
};

  const handleLike = async () => {
    if (!product) return;

    try {
      await axiosInstance.post('/favorite', {
        productId: product.id
      });
    } catch (err) {
      console.error('Error liking product:', err);
    }
  };

  const handleMessage = async () => {
    if (!product) return;

    try {
      const { data } = await axiosInstance.post('/conversations', {
        sellerId: product.seller.id,
        productId: product.id
      });

      if (data?.conversationId) {
        window.location.href = `/messages/${data.conversationId}`;
      }
    } catch (err) {
      console.error('Error starting conversation:', err);
    }
  };

  const handleContactSeller = async (sellerId: string) => {
    // Même logique que handleMessage
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
            <p className="text-red-600">{error || 'Produit non trouvé'}</p>
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
        <Container size="lg">
          <main className="pt-16 sm:pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <div className="order-1">
               
            < PhotoGallery
              images={product.images}
              title={product.title}
              status={product.status}
            />
          </div>

          <div className="order-2">
            <div className="sticky top-24">
              <ProductHeader
                brand={product.brand}
                title={product.title}
                subtitle={product.subtitle}
                price={product.price}
                onBuy={handleBuy}
                onLike={handleLike}
                onMessage={handleMessage}
              />

              <SellerInfos
                seller={product.seller}
                onContact={handleContactSeller}
              />

              <ProductDetails
                condition={product.condition}
                year={product.year}
                material={product.material}
                color={product.color}
                dimensions={product.dimensions}
                reference={product.reference}
                description={product.description}
              />
            </div>
          </div>
        </div>
          </div>
        </main>
        </Container>

        {showCheckout && product && (
          <CheckoutFlow
            productId={product.id}
            productPrice={product.price}
            productTitle={product.title}
            onPaymentComplete={handleCheckoutComplete}
            onClose={() => setShowCheckout(false)}
          />
        )}
      </>
  );
}

