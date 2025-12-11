import React from 'react';
import { Container, CategoryCard } from '@/components/ui';

interface Category {
  id: string;
  image: string;
  title: string;
  href?: string;
}

interface CategoriesSectionProps {
  title?: string;
  categories?: Category[];
  onCategoryClick?: (id: string) => void;
}

export default function CategoriesSection({
  title = "Nos Catégories",
  categories = [],
  onCategoryClick,
}: CategoriesSectionProps) {
  const handleClick = (id: string) => {
    onCategoryClick?.(id);
  };

  return (
    <section className="py-16 lg:py-24">
      <Container size="lg">
        <h2 className="font-cormorant text-3xl lg:text-5xl text-purple-dark text-center mb-12 lg:mb-16">
          {title}
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              image={category.image}
              title={category.title}
              href={category.href}
              onClick={() => handleClick(category.id)}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}