import React from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui';
import { MediaDto } from '@/types';

interface FavoritesCard {
    id: string;
    title: string;
    subtitle?: string;
    price: number;
    availability: string;
    medias: MediaDto;
    sellerName: string | null;
    status?: 'online' | 'auction' | 'sold' | 'draft';
    currentBid?: number;
    bidsCount?: number;
    timeLeft?: string;
    viewMode?: 'buyer' | 'seller'; 
    offersCount?: number; 
    onLike?: (id: string) => void;
    onShare?: (id: string) => void;
    onEdit?: (id: string) => void; 
    onDelete?: (id: string) => void; 
    onBoost?: (id: string) => void; 
    href?: string;
    isLiked?: boolean;
}

export default function FavoritesCard({
  id,
  medias,
  sellerName,
  title,
  subtitle,
  price,
  status,
  currentBid,
  bidsCount,
  timeLeft,
  viewMode = 'buyer',
  offersCount,
  onLike,
  onShare,
  onEdit,
  onDelete,
  onBoost,
  href,
  isLiked = true,
}: FavoritesCard) {
  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onLike?.(id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onShare?.(id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit?.(id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete?.(id);
  };

  const handleBoost = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onBoost?.(id);
  };


  const CardContent = (
    <div className="bg-cream-light overflow-hidden group cursor-pointer shadow-xl">
      <div className="relative aspect-square overflow-hidden bg-cream-light">
        {medias.url ? (
          <Image
            src={medias.url}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
        {status && (
          <div className="absolute bottom-3 left-3">
            <Badge variant={status}>
              {status === 'online' && 'EN VENTE'}
              {status === 'auction' && 'ENCHÈRE'}
              {status === 'sold' && 'VENDU'}
              {status === 'draft' && 'BROUILLON'}
            </Badge>
          </div>
        )}
        <button 
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
          onClick={(e) => e.stopPropagation()}
          aria-label="Image précédente"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
          onClick={(e) => e.stopPropagation()}
          aria-label="Image suivante"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-cormorant text-lg font-light text-purple-dark mb-1">
          {title}
        </h3>
          {sellerName && (
            <p className="font-raleway font-light text-sm text-gray-500 mb-2">{sellerName}</p>
          )}
        {subtitle && (
          <p className="font-raleway font-light text-sm text-gray-500 mb-2">{subtitle}</p>
        )}
        
        {status === 'auction' && (currentBid || bidsCount || timeLeft) ? (
          <div className="space-y-1">
            <p className="font-raleway text-base font-light text-purple-dark">
              {(currentBid || price).toLocaleString('fr-FR')} €
            </p>
            {bidsCount !== undefined && (
              <p className="font-raleway text-xs text-gray-500">
                {bidsCount} enchère{bidsCount > 1 ? 's' : ''}
              </p>
            )}
            {timeLeft && (
              <p className="font-raleway text-xs text-gray-500">
                {timeLeft}
              </p>
            )}
          </div>
        ) : (
          <p className="font-raleway text-base font-light text-purple-dark">
            {price.toLocaleString('fr-FR')} €
          </p>
        )}
        {viewMode === 'seller' && offersCount !== undefined && offersCount > 0 && (
          <p className="font-raleway text-sm text-gray-600 mt-2">
            {offersCount} offre{offersCount > 1 ? 's' : ''} reçue{offersCount > 1 ? 's' : ''}
          </p>
        )}

        <div className="flex gap-2 mt-3 justify-end">
          {viewMode === 'buyer' ? (
            <>
              <button
                onClick={handleLike}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Ajouter aux favoris"
              >
                <svg 
                  className="w-5 h-5" 
                  fill={isLiked ? '#2C0E40' : 'none'} 
                  stroke="#2C0E40" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                  />
                </svg>
              </button>
              <button
                onClick={handleShare}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Partager"
              >
                <svg className="w-5 h-5" fill="none" stroke="#2C0E40" viewBox="0 0 24 24">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" 
                  />
                </svg>
              </button>
            </>
          ) : (
            <>
        
              {status !== 'sold' && onEdit && (
                <button
                  onClick={handleEdit}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Modifier"
                  title="Modifier"
                >
                  <svg className="w-5 h-5" fill="none" stroke="#2C0E40" viewBox="0 0 24 24">
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                    />
                  </svg>
                </button>
              )}
              {status !== 'sold' && offersCount === 0 && onBoost && (
                <button
                  onClick={handleBoost}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Relancer"
                  title="Relancer l'annonce"
                >
                  <svg className="w-5 h-5" fill="none" stroke="#2C0E40" viewBox="0 0 24 24">
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M13 10V3L4 14h7v7l9-11h-7z" 
                    />
                  </svg>
                </button>
              )}
              {onDelete && (
                <button
                  onClick={handleDelete}
                  className="p-2 hover:bg-red-50 rounded-full transition-colors"
                  aria-label="Supprimer"
                  title="Supprimer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="#dc2626" viewBox="0 0 24 24">
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                    />
                  </svg>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block">
        {CardContent}
      </a>
    );
  }

  return CardContent;
}
