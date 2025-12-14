import React from 'react';

type TextareaVariant = 'light' | 'transparent';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: TextareaVariant;
}

export default function Textarea({
  label,
  error,
  helperText,
  variant = 'light',
  className = '',
  ...props
}: TextareaProps) {
  const baseStyles = 'w-full px-4 py-3 font-raleway text-base transition-all duration-200 focus:outline-none focus:ring-2 resize-y min-h-[120px]';
  
  const variantStyles = {
    light: 'bg-white border border-gray-300 text-[var(--color-black-deep)] placeholder:text-gray-400 focus:ring-[var(--color-purple-dark)] focus:border-[var(--color-purple-dark)]',
    transparent: 'bg-[rgba(var(--color-cream-light),0.1)] border border-[rgba(var(--color-purple-dark),0.2)] text-[rgba(var(--color-cream-light),0.4)] placeholder:text-gray-400 focus:ring-[var(--color-cream-light)] focus:border-[var(--color-cream-light)]',
  };

  const errorStyles = error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : '';

  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 font-raleway text-sm font-medium text-[var(--color-black-deep)]">
          {label}
        </label>
      )}
      <textarea
        className={`${baseStyles} ${variantStyles[variant]} ${errorStyles} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500 font-raleway">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500 font-raleway">{helperText}</p>
      )}
    </div>
  );
}