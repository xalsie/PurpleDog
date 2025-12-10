import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'font-raleway font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: 'bg-[var(--color-purple-dark)] text-[var(--color-cream-light)] hover:bg-[var(--color-black-deep)] hover:text-[var(--color-cream-light)]',
    secondary: 'bg-[var(--color-cream-light)] text-[var(--color-purple-dark)] hover:bg-[#FFFCF5] hover:text-[var(--color-purple-dark)]',
    outline: 'bg-transparent text-[var(--color-purple-dark)] border border-[var(--color-purple-dark)] hover:bg-[var(--color-purple-dark)] hover:text-[var(--color-cream-light)]',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}