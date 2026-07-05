import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', size = 'md', className, disabled, type = 'button', ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2';
    const variants = {
      primary: 'bg-[#4F46E5] text-white hover:bg-[#4338CA] active:scale-[0.98] shadow-sm',
      secondary: 'bg-transparent border border-border text-foreground hover:bg-muted active:scale-[0.98]',
      ghost: 'bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground',
      danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
    };
    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-sm',
      icon: 'w-8 h-8 text-sm',
    };
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(base, variants[variant], sizes[size], disabled && 'opacity-50 cursor-not-allowed', className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';