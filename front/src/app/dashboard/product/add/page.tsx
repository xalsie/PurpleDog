'use client'

import React, { useState } from 'react';
import { Container, Button, Textarea, FileField, CheckboxField } from '@/components/ui';

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
  };

  return (
    <main className="py-12 lg:py-16">
      <Container size="md">
        <h1 className="font-cormorant text-4xl lg:text-5xl text-purple-dark text-center mb-8 lg:mb-12">
          Ajouter un Nouveau Produit - Page à faire
        </h1>
      </Container>
    </main>
  );
}