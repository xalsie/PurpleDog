'use client';

import { Button } from '../../../components/ui';
import React, { useState, useCallback } from 'react';

interface FeedbackFormData {
  name: string;
  email: string;
  rating: number;
  comment: string;
}

interface FeedbackProps {
  onSubmit?: (data: FeedbackFormData) => void;
}

const INITIAL_FORM_DATA: FeedbackFormData = {
  name: '',
  email: '',
  rating: 0,
  comment: '',
};

const STARS = [1, 2, 3, 4, 5] as const;

export const Feedback: React.FC<FeedbackProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<FeedbackFormData>(INITIAL_FORM_DATA);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    console.log('Feedback submitted:', formData);
    
    // Appeler la fonction callback du parent
    if (onSubmit) {
      onSubmit(formData);
    }
    
    setSubmitted(true);
  }, [formData, onSubmit]);

  const handleInputChange = useCallback((field: keyof FeedbackFormData) => 
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData(prev => ({ ...prev, [field]: e.target.value }));
    }, []
  );

  const handleRatingClick = useCallback((rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  }, []);

  if (submitted) {
    return (
      <div className="max-w-md mx-auto p-6 bg-green-50 rounded-lg">
        <h2 className="text-2xl font-bold text-green-700 mb-2">Merci !</h2>
        <p className="text-gray-700">Votre avis a été envoyé avec succès.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Donnez votre avis</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nom
          </label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={handleInputChange('name')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            required
            value={formData.email}
            onChange={handleInputChange('email')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Note
          </label>
          <div className="flex gap-2">
            {STARS.map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingClick(star)}
                className="text-3xl focus:outline-none transition-colors cursor-pointer"
                aria-label={`Noter ${star} étoiles`}
              >
                <span className={star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'}>
                  ★
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
            Commentaire
          </label>
          <textarea
            id="comment"
            required
            rows={4}
            value={formData.comment}
            onChange={handleInputChange('comment')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <Button
          type="submit"
          variant="outline"
          size="lg"
          className="w-full border-purple-dark text-purple-dark bg-transparent hover:bg-purple-dark hover:text-cream-light px-8 sm:px-10 py-3 sm:py-4 text-sm sm:text-base tracking-wide"
        >
          Envoyer
        </Button>
      </form>
    </div>
  );
};

export default Feedback;