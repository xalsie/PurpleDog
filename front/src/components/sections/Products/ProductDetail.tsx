import React from 'react';

interface ProductDetailsProps {
  condition: string;
  year: string;
  material: string;
  color: string;
  dimensions: string;
  reference: string;
  description: string;
}

export default function ProductDetails({
  condition,
  year,
  material,
  color,
  dimensions,
  reference,
  description,
}: ProductDetailsProps) {
  return (
    <div>
      <div className="border-t border-purple-dark/10 pt-6 space-y-4 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-purple-dark/60">Condition</span>
          <span className="text-purple-dark">{condition}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-purple-dark/60">Année</span>
          <span className="text-purple-dark">{year}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-purple-dark/60">Matière</span>
          <span className="text-purple-dark">{material}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-purple-dark/60">Couleur</span>
          <span className="text-purple-dark">{color}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-purple-dark/60">Dimensions</span>
          <span className="text-purple-dark">{dimensions}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-purple-dark/60">Référence</span>
          <span className="text-purple-dark">{reference}</span>
        </div>
      </div>

      <div className="border-t border-purple-dark/10 pt-6">
        <h3 className="font-cormorant text-xl sm:text-2xl text-purple-dark mb-3">
          Description
        </h3>
        <p className="text-sm sm:text-base text-purple-dark/70 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="border-t border-purple-dark/10 mt-6 pt-6">
        <div className="flex items-start space-x-3 text-sm">
          <svg className="w-5 h-5 text-purple-dark/60 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          <div>
            <p className="text-purple-dark font-raleway font-normal">
              Livraison assurée
            </p>
            <p className="text-purple-dark/60 text-xs mt-1">
              Expédition sous 2-3 jours ouvrés
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}