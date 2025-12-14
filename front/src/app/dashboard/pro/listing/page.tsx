'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, ProductCard, SearchBar } from '@/components/ui';
import NavBarDashboard from '@/components/layout/NavBarDashboard/NavBarDashboard';
import { useAuth } from '@/hooks/useAuth';

interface Product {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  price: number;
  status: "PENDING" | "ACTIVE" | "ENDED" | "CANCELLED";
  currentBid?: number;
  bidsCount?: number;
  timeLeft?: string;
}

export default function ProductsListingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth(); 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/items');
        setProducts(response.data);
      } catch (err) {
        setProducts(demoProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
    <>
      <main className="pt-16 sm:pt-20 min-h-screen bg-cream-light">
        <Container>
          <div className="py-8 sm:py-12">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-purple-dark/10 rounded-lg mb-3"></div>
                  <div className="h-4 bg-purple-dark/10 rounded mb-2"></div>
                  <div className="h-4 bg-purple-dark/10 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </main>
    </>
    );
  }

  return ( <><NavBarDashboard UserType={user?.role} logOut={logout}/>
    <main className="pt-16 sm:pt-20 min-h-screen bg-cream-light">
      <Container>
        <SearchBar searchQuery="" filters={{ price: "", saleType: "", category: "", status: "" }} onSearchChange={() => {}} onFiltersChange={() => {}} />
        <div className="py-8 sm:py-12">
          
          <div className="mb-8">
            <h1 className="font-cormorant text-3xl sm:text-4xl lg:text-5xl text-purple-dark mb-2">
              Tous les produits
            </h1>
            <p className="text-black-deep/60">
              {products.length} article{products.length > 1 ? 's' : ''} disponible{products.length > 1 ? 's' : ''}
            </p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-black-deep/60">Aucun produit disponible</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  image={product.image}
                  title={product.title}
                  subtitle={product.subtitle}
                  price={product.price}
                  status={product.status}
                  currentBid={product.currentBid}
                  bidsCount={product.bidsCount}
                  timeLeft={product.timeLeft}
                  viewMode="buyer"
                  href={product.status === "ACTIVE" ? `/auction/${product.id}` : `/product/${product.id}`}
                  onLike={(id) => console.log('Like:', id)}
                  onShare={(id) => console.log('Share:', id)}
                />
              ))}
            </div>
          )}
        </div>
      </Container>
    </main></> 
  );
}

// Demo data
const demoProducts: Product[] = [
  {
    id: '1',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/a9a4c78066-8cb28e8acb8abfdf401e.png',
    title: 'Sac Hermès Birkin 35',
    subtitle: 'Cuir Togo Bordeaux',
    price: 12500,
    status: 'ACTIVE',
  },
  {
    id: '2',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/2fe8b912ae-08939be41498732d673b.png',
    title: 'Kelly 32 Vintage',
    subtitle: 'Cuir Box Bordeaux',
    price: 3450,
    status: 'ACTIVE',
    currentBid: 3450,
    bidsCount: 23,
    timeLeft: '2j 14h',
  },
  {
    id: '3',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/f0e1989619-e3a048e083a00826cce5.png',
    title: 'Montre Rolex Datejust',
    subtitle: 'Or et Acier',
    price: 8500,
    status: 'ACTIVE',
  },
  {
    id: '4',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/2cfc09faf5-e0d36803676d3a310720.png',
    title: 'Collier Cartier Love',
    subtitle: 'Or Rose 18k',
    price: 5200,
    status: 'ACTIVE',
    currentBid: 4800,
    bidsCount: 15,
    timeLeft: '1j 8h',
  },
  {
    id: '5',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/06a58df423-ac462b5edb737cbec5da.png',
    title: 'Tableau Picasso',
    subtitle: 'Période Bleue',
    price: 45000,
    status: 'ACTIVE',
    currentBid: 42000,
    bidsCount: 38,
    timeLeft: '5j 2h',
  },
  {
    id: '6',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/8b5e3fb914-7915714203a508bfe98f.png',
    title: 'Fauteuil Eames',
    subtitle: 'Lounge Chair Original',
    price: 3200,
    status: 'ACTIVE',
  },
  {
    id: '7',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/eb2d38ba4b-8f3a495ca1f7dee57169.png',
    title: 'Bague Tiffany & Co',
    subtitle: 'Diamant 1.5ct',
    price: 18500,
    status: 'ACTIVE',
  },
  {
    id: '8',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/8df559733b-578825e38ca95fa863b1.png',
    title: 'Sculpture Giacometti',
    subtitle: 'Bronze Patiné',
    price: 28000,
    status: 'ACTIVE',
    currentBid: 26500,
    bidsCount: 42,
    timeLeft: '3j 18h',
  },
  {
    id: '9',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/a9a4c78066-8cb28e8acb8abfdf401e.png',
    title: 'Manteau Chanel',
    subtitle: 'Tweed Noir et Blanc',
    price: 4200,
    status: 'ACTIVE',
  },
  {
    id: '10',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/2fe8b912ae-08939be41498732d673b.png',
    title: 'Vase Ming',
    subtitle: 'Porcelaine Dynastie Ming',
    price: 35000,
    status: 'ACTIVE',
    currentBid: 32000,
    bidsCount: 56,
    timeLeft: '4j 12h',
  },
  {
    id: '11',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/f0e1989619-e3a048e083a00826cce5.png',
    title: 'Chaussures Louboutin',
    subtitle: 'Escarpins Rouges',
    price: 850,
    status: 'ACTIVE',
  },
  {
    id: '12',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/2cfc09faf5-e0d36803676d3a310720.png',
    title: 'Bracelet Van Cleef',
    subtitle: 'Alhambra Or Jaune',
    price: 7500,
    status: 'ACTIVE',
  },
];