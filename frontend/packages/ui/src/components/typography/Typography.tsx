import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

const typographyVariants = {
  DEFAULT:
    'font-dm-sans text-base font-medium leading-[1.5rem] tracking-[-0.0225rem]',
  display: 'font-dm-sans text-3xl font-medium',
  'heading-lg': 'font-dm-sans text-2xl font-medium',
  'heading-md': 'font-dm-sans text-xl font-medium',
  'heading-sm': 'font-dm-sans text-lg font-medium',
  'body-strong': 'font-dm-sans text-md font-bold',
  body: 'font-dm-sans text-md',
  'caption-strong': 'font-dm-sans text-sm font-bold',
  caption: 'font-dm-sans text-sm'
};

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
  variant: keyof typeof typographyVariants;
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant, children, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'p';
    return (
      <Comp className={cn(typographyVariants[variant], className)} {...props}>
        {children}
      </Comp>
    );
  }
);
Typography.displayName = 'Typography';

export { Typography, typographyVariants };
