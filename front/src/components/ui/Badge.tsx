import React from 'react';

type BadgeVariant = "PENDING" | "ACTIVE" | "ENDED" | "CANCELLED";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export default function Badge({
  variant = 'PENDING',
  children,
  className = '',
}: BadgeProps) {
  const baseStyles = 'inline-block px-3 py-1 text-xs font-raleway font-light uppercase tracking-wide';
  
  const variantStyles = {
    PENDING: 'bg-yellow-400 text-white',
    ACTIVE: 'bg-green-500 text-white',
    ENDED: 'bg-gray-500 text-white',
    CANCELLED: 'bg-red-500 text-white',
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}