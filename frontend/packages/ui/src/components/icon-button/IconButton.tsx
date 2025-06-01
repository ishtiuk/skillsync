import { forwardRef, ComponentType } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { IconVariant, PhosphorIcon } from '@/icons/PhosphorIcon';

const buttonVariants = cva(
  'flex items-center justify-center whitespace-nowrap rounded-[30px] shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary-g-600 text-white transition-all duration-300 hover:bg-primary-g-700',
        primary:
          'bg-primary-g-600 text-white transition-all duration-300 hover:bg-primary-g-700',
        secondary:
          'bg-neutral-n-200 text-primary-g-800 border border-transparent transition-all duration-300 hover:bg-neutral-n-200 hover:border-neutral-n-300',
        tertiary:
          'bg-white text-primary-g-700 transition-all duration-300 hover:bg-primary-g-100 hover:text-primary-g-600'
      },
      size: {
        default: 'w-[48px] h-[48px]',
        small: 'w-[34px] h-[34px]'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    iconVariant: IconVariant;
  };

const IconButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, iconVariant, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        <PhosphorIcon iconVariant={iconVariant} size={size === 'default' ? 24 : 18} />
      </Comp>
    );
  }
);
IconButton.displayName = 'Button';

export { IconButton, buttonVariants };
