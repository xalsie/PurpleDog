import React from 'react';

type InputVariant = 'light' | 'transparent';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: InputVariant;
}

export default function Input({
  label,
  error,
  helperText,
  variant = 'light',
  className = '',
  ...props
}: InputProps) {
  const baseStyles = 'w-full px-4 py-3 font-raleway text-base transition-all duration-200 focus:outline-none focus:ring-2';
  
  const variantStyles = {
    light: 'bg-white border border-gray-300 text-[var(--color-black-deep)] placeholder:text-gray-400 focus:ring-[var(--color-purple-dark)] focus:border-[var(--color-purple-dark)]',
    transparent: 'bg-[rgba(240,238,233,0.1)] border border-[rgba(240,238,233,0.2)] text-[rgba(240,238,233,0.4)] placeholder:text-gray-400 focus:ring-[var(--color-cream-light)] focus:border-[var(--color-cream-light)]',
  };

  const errorStyles = error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : '';

  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 font-raleway text-sm font-medium text-[#020016]">
          {label}
        </label>
    )}
    <input
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