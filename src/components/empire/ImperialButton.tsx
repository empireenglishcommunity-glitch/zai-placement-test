'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ImperialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function ImperialButton({
  variant = 'primary',
  size = 'md',
  children,
  className,
  ...props
}: ImperialButtonProps) {
  const variants = {
    primary: 'bg-gradient-to-r from-[#c9a84c] to-[#cd7f32] text-[#0a0a0a] hover:from-[#d4b55c] hover:to-[#d48f42] shadow-[0_0_15px_rgba(201,168,76,0.3)]',
    secondary: 'bg-[#1a1a2e] text-[#c9a84c] border border-[rgba(201,168,76,0.3)] hover:bg-[#222240] hover:border-[rgba(201,168,76,0.5)]',
    outline: 'bg-transparent text-[#c9a84c] border border-[rgba(201,168,76,0.3)] hover:bg-[rgba(201,168,76,0.1)] hover:border-[rgba(201,168,76,0.5)]',
    ghost: 'bg-transparent text-[#c9a84c] hover:bg-[rgba(201,168,76,0.1)]',
    danger: 'bg-gradient-to-r from-[#e74c3c] to-[#c0392b] text-white shadow-[0_0_15px_rgba(231,76,60,0.3)]',
  };

  const sizes = {
    sm: 'px-4 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg',
  };

  return (
    <motion.button
      className={cn(
        'font-[family-name:var(--font-heading)] font-semibold rounded-md transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
