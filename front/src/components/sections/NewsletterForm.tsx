'use client'

import React, { useState } from 'react';
import { Container, Button, Input } from '@/components/ui';

interface NewsletterFormProps {
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  onSubmit?: (email: string) => void;
}

export default function NewsletterForm({
  title = "Rejoignez Notre Communauté",
  description = "Inscrivez-vous pour recevoir nos catalogues exclusifs et être informé en avant-première de nos ventes aux enchères",
  placeholder = "Votre adresse email",
  buttonText = "S'inscrire",
  onSubmit,
}: NewsletterFormProps) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && onSubmit) {
      onSubmit(email);
      setEmail('');
    }
  };

  return (
    <section className="py-16 lg:py-20 text-[var(--color-cream-light)]" style={{ backgroundColor: 'var(--color-black-deep)' }}>
      <Container size="md">
        <div className="text-center">
          <svg 
  className="w-10 h-10 text-[var(--color-cream-light)] mb-6 mx-auto" 
  fill="none" 
  stroke="currentColor" 
  viewBox="0 0 24 24"
>
  <path 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    strokeWidth={2} 
    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
  />
</svg>
          <h2 className="font-cormorant text-3xl lg:text-5xl mb-6">
            {title}
          </h2>
          <p className="text-[var(--color-cream-light)] opacity-70 text-base lg:text-lg mb-8 max-w-2xl mx-auto font-raleway font-light">
            {description}
          </p>
          <form 
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto"
          >
            <Input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              required
              variant="transparent"
              className="flex-1"
            />
            <Button 
              type="submit"
              variant="secondary"
              className="whitespace-nowrap px-8 py-3"
            >
              {buttonText}
            </Button>

          </form>
          <p className="mt-4 text-sm opacity-50 font-raleway font-light">
            En vous inscrivant, vous acceptez de recevoir nos communications. Vous pouvez vous
            désabonner à tout moment.
          </p>
        </div>
      </Container>
    </section>
  );
}