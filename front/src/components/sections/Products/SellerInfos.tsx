import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui';

interface SellerInfoProps {
  seller: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
  };
  onContact?: (sellerId: string) => void;
}

export default function SellerInfo({ seller, onContact }: SellerInfoProps) {
  return (
    <div className="border-t border-purple-dark/10 pt-6 mb-6">
      <p className="text-sm text-purple-dark/60 mb-4">Vendu par</p>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-cream-light/30 rounded-lg">
        <div className="flex items-center gap-3 flex-1 w-full">
          <Image
            src={seller.avatar}
            alt={seller.name}
            width={56}
            height={56}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-medium text-purple-dark truncate">{seller.name}</p>
              {seller.verified && (
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-dark flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              )}
            </div>
            <p className="text-xs sm:text-sm text-purple-dark/60">
              {seller.verified ? 'Vendeur vérifié' : 'Vendeur'}
            </p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onContact?.(seller.id)}
          className="w-full sm:w-auto"
        >
          Contacter
        </Button>
      </div>
    </div>
  );
}