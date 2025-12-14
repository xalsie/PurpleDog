'use client'

import React, { useState } from 'react';
import { Container } from '@/components/ui';

interface SearchSectionProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export default function SearchSection({
  placeholder = "Rechercher des produits sur la plateforme...",
  onSearch,
}: SearchSectionProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <section className="mb-12 lg:mb-16">
      <Container>
        <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full px-6 py-4 pr-14 rounded-lg border-2 border-purple-dark/20 focus:border-purple-dark focus:outline-none bg-white text-black-deep placeholder:text-black-deep/40"
          />
          <button
            type="submit"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-dark hover:text-black-deep transition-colors"
            aria-label="Rechercher"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </form>
      </Container>
    </section>
  );
}