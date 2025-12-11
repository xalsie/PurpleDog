import React from 'react';

interface AuctionDetailsProps {
  brand: string;
  model: string;
  material: string;
  color: string;
  year: string;
  condition: string;
  authenticated: boolean;
  description: string;
}

export default function AuctionDetails({
  brand,
  model,
  material,
  color,
  year,
  condition,
  authenticated,
  description,
}: AuctionDetailsProps) {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h3 className="font-cormorant text-xl sm:text-2xl mb-3 sm:mb-4 text-black-deep">
          Description
        </h3>
        <p className="text-sm sm:text-base text-black-deep/80 leading-relaxed">
          {description}
        </p>
      </div>

      <div>
        <h3 className="font-cormorant text-xl sm:text-2xl mb-3 sm:mb-4 text-black-deep">
          Détails
        </h3>
        <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
          <div className="flex justify-between py-2 border-b border-purple-dark/10">
            <span className="text-black-deep/60">Marque</span>
            <span className="text-black-deep">{brand}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-purple-dark/10">
            <span className="text-black-deep/60">Modèle</span>
            <span className="text-black-deep">{model}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-purple-dark/10">
            <span className="text-black-deep/60">Matière</span>
            <span className="text-black-deep">{material}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-purple-dark/10">
            <span className="text-black-deep/60">Couleur</span>
            <span className="text-black-deep">{color}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-purple-dark/10">
            <span className="text-black-deep/60">Année</span>
            <span className="text-black-deep">{year}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-purple-dark/10">
            <span className="text-black-deep/60">État</span>
            <span className="text-black-deep">{condition}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-black-deep/60">Authenticité</span>
            <span className="text-black-deep flex items-center">
              {authenticated ? 'Certifiée' : 'Non vérifiée'}
              {authenticated && (
                <svg className="w-5 h-5 text-purple-dark ml-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-purple-dark/5 p-4 sm:p-6 rounded-sm">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-dark mt-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <div>
            <h4 className="font-cormorant text-base sm:text-lg mb-2 text-black-deep">
              Garantie d'authenticité
            </h4>
            <p className="text-xs sm:text-sm text-black-deep/70 leading-relaxed">
              Chaque pièce est authentifiée par nos experts et accompagnée d'un certificat d'authenticité.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}