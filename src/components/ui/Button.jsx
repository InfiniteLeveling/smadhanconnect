import React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const Button = React.forwardRef(({
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  children,
  icon: Icon,
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-500 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] cursor-pointer select-none';
  
  const variants = {
    primary: 'bg-gradient-to-r from-brand-700 via-emerald-600 to-teal-600 text-white shadow-sm shadow-brand-600/20 hover:shadow-md hover:shadow-brand-600/30 hover:brightness-105 active:brightness-95 border border-brand-500/20',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200/80 hover:border-slate-300 shadow-2xs',
    outline: 'border border-slate-300 bg-white hover:bg-slate-50/80 text-slate-700 hover:text-brand-700 hover:border-brand-400 shadow-2xs hover:shadow-xs',
    ghost: 'bg-transparent hover:bg-slate-100/80 text-slate-700 hover:text-slate-900',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-600/20 active:brightness-95 border border-rose-500/20',
    accent: 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-sm hover:shadow-md hover:brightness-105 border border-teal-500/20',
    subtle: 'bg-brand-50 hover:bg-brand-100 text-brand-800 border border-brand-200/80 font-bold'
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs gap-1.5',
    md: 'h-10 px-4 py-2 text-sm gap-2',
    lg: 'h-12 px-6 text-base gap-2.5 rounded-2xl',
    icon: 'h-10 w-10 p-0',
    iconSm: 'h-8 w-8 p-0 rounded-lg'
  };

  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin shrink-0" />}
      {!isLoading && Icon && <Icon className="h-4 w-4 shrink-0" />}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
