import React from 'react';
import Image from 'next/image';

interface CategoryCardProps {
  image: string;
  title: string;
  href?: string;
  onClick?: () => void;
}

export default function CategoryCard({
  image,
  title,
  href,
  onClick,
}: CategoryCardProps) {
  const CardContent = (
    <div className="group cursor-pointer">
      <div className="relative aspect-square overflow-hidden bg-[var(--color-cream-light)]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <h3 className="mt-3 text-center font-cormorant text-xl font-semibold text-[var(--color-purple-dark)]">
        {title}
      </h3>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block">
        {CardContent}
      </a>
    );
  }

  return (
    <div onClick={onClick}>
      {CardContent}
    </div>
  );
}