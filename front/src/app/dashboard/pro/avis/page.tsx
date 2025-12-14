'use client';

import NavBarDashboard from '@/components/layout/NavBarDashboard/NavBarDashboard';
import { Feedback } from '../../../../components/sections/Users/Feedback';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface Avis {
  id: number;
  nom: string;
  note: number;
  commentaire: string;
  date: string;
}

export default function AvisPage() {
  const [avis, setAvis] = useState<Avis[]>([
    {
      id: 1,
      nom: "Marie Dupont",
      note: 5,
      commentaire: "Excellent service ! Très professionnelle et à l'écoute.",
      date: "Il y a 2 jours"
    },
    {
      id: 2,
      nom: "Pierre Martin",
      note: 4,
      commentaire: "Très bonne expérience, je recommande vivement.",
      date: "Il y a 1 semaine"
    },
    {
      id: 3,
      nom: "Sophie Bernard",
      note: 5,
      commentaire: "Parfait ! Exactement ce que je cherchais.",
      date: "Il y a 2 semaines"
    }
  ]);

  const handleFeedbackSubmit = (data: { name: string; email: string; rating: number; comment: string }) => {
    // Créer un nouvel avis avec les données reçues
    const nouvelAvis: Avis = {
      id: avis.length + 1,
      nom: data.name,
      note: data.rating,
      commentaire: data.comment,
      date: "À l'instant"
    };
    
    // Ajouter le nouvel avis en début de liste
    setAvis([nouvelAvis, ...avis]);
  };

  const { user, logout } = useAuth()
  return (
    <>
      <NavBarDashboard UserType={user?.role} logOut={logout}/>
      <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Avis et Témoignages</h1>
      
      <div className="mb-12">
        <Feedback onSubmit={handleFeedbackSubmit} />
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold mb-4">Avis récents</h2>
        {avis.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg">{item.nom}</h3>
              <span className="text-sm text-gray-500">{item.date}</span>
            </div>
            <div className="flex items-center mb-3">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${i < item.note ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-700">{item.commentaire}</p>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}