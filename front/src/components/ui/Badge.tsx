import React from 'react';

type BadgeVariant = 'online' | 'auction' | 'sold' | 'default'| 'draft';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export default function Badge({
  variant = 'default',
  children,
  className = '',
}: BadgeProps) {
  const baseStyles = 'inline-block px-3 py-1 text-xs font-raleway font-semibold uppercase tracking-wide';
  
  const variantStyles = {
    online: 'bg-[var(--color-purple-dark)] text-[var(--color-cream-light)]',
    auction: 'bg-[var(--color-purple-dark)] text-[var(--color-cream-light)]',
    sold: 'bg-red-500 text-white',
    default: 'bg-gray-200 text-[var(--color-black-deep)]',
    draft: 'bg-yellow-400 text-white',
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}