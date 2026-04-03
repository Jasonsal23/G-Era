'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'accent' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) => {
  const baseStyles =
    'border-2 font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background',
    accent:
      'border-accent bg-accent text-black hover:bg-black hover:text-accent',
    outline:
      'border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
