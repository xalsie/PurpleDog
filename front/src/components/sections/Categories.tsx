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
  categories = [
    {
      id: 'jewelry',
      image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/65353f6e5e-65a4c8ede345a4184202.png',
      title: 'Joaillerie',
      href: '/categories/jewelry',
    },
    {
      id: 'art',
      image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/48153ebb44-11578bfbb8c91238c343.png',
      title: "Œuvres d'Art",
      href: '/categories/art',
    },
    {
      id: 'watches',
      image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/478ec11857-60197a984f353e6bac21.png',
      title: 'Horlogerie',
      href: '/categories/watches',
    },
    {
      id: 'furniture',
      image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/03f13468ae-99eb391a346902f12c99.png',
      title: 'Mobilier',
      href: '/categories/furniture',
    },
  ],
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
