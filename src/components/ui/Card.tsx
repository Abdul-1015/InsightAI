import React from 'react';

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ');
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={cn('bg-card border border-border rounded-xl', className)} {...props}>
      {children}
    </div>
  )
);

Card.displayName = 'Card';