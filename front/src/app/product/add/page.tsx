'use client'

import React, { useState } from 'react';
import { Container, Button, InputField, Textarea, FileField, CheckboxField } from '@/components/ui';

export default function CreateListingPage() {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    condition: '',
    price: '',
    description: '',
    images: [] as File[],
    acceptTerms: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // TODO: Handle form submission
  };

  return (
    <main className="py-12 lg:py-16">
      <Container size="md">
        <div className="text-center mb-12">
          <h1 className="font-cormorant text-4xl lg:text-5xl text-purple-dark mb-4">
            Créer une annonce
          </h1>
          <p className="text-black-deep/70 text-lg">
            Partagez vos trésors avec notre communauté
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-lg p-8 shadow-sm border border-purple-dark/10">
            <h2 className="font-cormorant text-2xl text-purple-dark mb-6">
              Photos de l'objet
            </h2>
            <FileField
              label="Ajouter des photos"
              accept="image/*"
              multiple
              onChange={(e) => setFormData({ ...formData, images: Array.from(e.target.files || []) })}
              helperText="Formats acceptés : JPG, PNG (max 5 photos)"
            />
          </div>
          <div className="bg-white rounded-lg p-8 shadow-sm border border-purple-dark/10">
            <h2 className="font-cormorant text-2xl text-purple-dark mb-6">
              Informations générales
            </h2>
            
            <div className="space-y-6">
              <InputField
                label="Titre de l'annonce"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Sac à main Hermès Birkin"
                required
              />

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-purple-dark mb-2">
                    Catégorie
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-purple-dark/20 rounded-lg focus:border-purple-dark focus:outline-none bg-white text-black-deep"
                    required
                  >
                    <option value="">Sélectionner une catégorie</option>
                    <option value="jewelry">Joaillerie</option>
                    <option value="art">Œuvres d'Art</option>
                    <option value="watches">Horlogerie</option>
                    <option value="furniture">Mobilier</option>
                    <option value="fashion">Mode</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-dark mb-2">
                    État
                  </label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-purple-dark/20 rounded-lg focus:border-purple-dark focus:outline-none bg-white text-black-deep"
                    required
                  >
                    <option value="">Sélectionner un état</option>
                    <option value="new">Neuf</option>
                    <option value="like-new">Comme neuf</option>
                    <option value="excellent">Excellent</option>
                    <option value="good">Bon état</option>
                    <option value="fair">État correct</option>
                  </select>
                </div>
              </div>

              <InputField
                label="Prix"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="2500"
                // suffix="€"
                required
              />

              <div>
                <label className="block text-sm font-medium text-purple-dark mb-2">
                  Description
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Décrivez votre objet en détail : origine, histoire, particularités..."
                  rows={6}
                  required
                />
                <p className="text-sm text-black-deep/60 mt-2">
                  Minimum 50 caractères
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-8 shadow-sm border border-purple-dark/10">
            <h2 className="font-cormorant text-2xl text-purple-dark mb-6">
              Conditions de vente
            </h2>
            
            <div className="space-y-4">
              <CheckboxField
                label="Je certifie être le propriétaire légitime de cet objet"
                checked={formData.acceptTerms}
                onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
              />
              
              <CheckboxField
                label="J'accepte les conditions générales de vente"
                checked={false}
                onChange={() => {}}
              />
              
              <CheckboxField
                label="J'autorise Purple Dog à vérifier l'authenticité de l'objet"
                checked={false}
                onChange={() => {}}
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="order-2 sm:order-1"
            >
              Enregistrer en brouillon
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="order-1 sm:order-2"
            >
              Publier l'annonce
            </Button>
          </div>
        </form>
      </Container>
    </main>
  );
}