'use client'

import React, { useState } from 'react';
import { Button, Textarea } from '@/components/ui';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReviewModal({ isOpen, onClose }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitted(true);
  
    setTimeout(() => {
      handleClose();
    }, 2000);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setRating(0);
    setHoveredRating(0);
    setComment('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black-deep/80 backdrop-blur-sm">
      <div className="bg-cream-light rounded-lg shadow-2xl max-w-md w-full p-8 relative">
       
        {!isSubmitted && (
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-black-deep/40 hover:text-black-deep transition"
            aria-label="Fermer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {!isSubmitted ? (
          <>
           
            <div className="text-center mb-8">
              <h2 className="font-cormorant text-3xl text-purple-dark mb-2">
                Donnez votre avis
              </h2>
              <p className="text-black-deep/60 text-sm">
                Partagez votre expérience avec la communauté
              </p>
            </div>

       
            <form onSubmit={handleSubmit} className="space-y-6">
           
              <div className="flex flex-col items-center">
                <label className="text-sm font-medium text-black-deep mb-3">
                  Votre note
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-transform hover:scale-110"
                      aria-label={`${star} étoile${star > 1 ? 's' : ''}`}
                    >
                      <svg
                        className="w-10 h-10"
                        fill={star <= (hoveredRating || rating) ? '#2C0E40' : 'none'}
                        stroke="#2C0E40"
                        strokeWidth={1.5}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                        />
                      </svg>
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-sm text-purple-dark mt-2 font-medium">
                    {rating === 1 && 'Décevant'}
                    {rating === 2 && 'Moyen'}
                    {rating === 3 && 'Satisfaisant'}
                    {rating === 4 && 'Très bien'}
                    {rating === 5 && 'Excellent'}
                  </p>
                )}
              </div>

             
              <div>
                <label className="block text-sm font-medium text-black-deep mb-2">
                  Votre commentaire
                </label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Partagez votre expérience en détail..."
                  rows={4}
                  required
                />
              </div>

           
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={rating === 0 || !comment.trim()}
                className="w-full"
              >
                Envoyer mon avis
              </Button>
            </form>
          </>
        ) : (
       
          <div className="text-center py-8">
            <div className="mb-6">
              <svg
                className="w-20 h-20 text-purple-dark mx-auto animate-bounce"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="font-cormorant text-4xl text-purple-dark mb-3">
              Merci !
            </h2>
            <p className="text-black-deep/70">
              Votre avis a bien été envoyé
            </p>
          </div>
        )}
      </div>
    </div>
  );
}