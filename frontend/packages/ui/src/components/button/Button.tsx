import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Typography } from "../typography";
import { IconVariant, PhosphorIcon } from "@/icons/PhosphorIcon";

type brandButtonTypes = "primary" | "secondary" | "tertiary";

const brandSize = {
  default: "py-3 px-4 gap-1 h-11",
  large: "py-4 px-6 gap-2 h-14",
};

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[48px] shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-primary-g-600 text-white transition-all duration-300 hover:bg-primary-g-700",
        secondary:
          "bg-neutral-n-200 text-neutral-n-800 border-2 border-neutral-n-200 transition-all duration-300 hover:bg-neutral-n-300 hover:border-neutral-n-400",
        tertiary:
          "bg-white text-primary-g-700 transition-all duration-300 hover:bg-primary-g-100 hover:text-primary-g-600",
      },
    },
  }
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: brandButtonTypes;
  size?: keyof typeof brandSize;
  label?: string;
  asChild?: boolean;
  onClick?: (ev: Event) => void;
} & (
    | { leftIcon?: never; rightIcon?: never }
    | { leftIcon: IconVariant; rightIcon?: never }
    | { leftIcon?: never; rightIcon: IconVariant }
  );

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "default",
      label,
      leftIcon,
      rightIcon,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, className }), brandSize[size])}
        ref={ref}
        {...props}
      >
        {leftIcon && <PhosphorIcon size={size == "default" ? 20 : 24} iconVariant={leftIcon} />}
        <Typography variant={size == "default" ? "caption-strong" : "body-strong"}>
          {label}
        </Typography>
        {rightIcon && <PhosphorIcon size={size == "default" ? 20 : 24} iconVariant={rightIcon} />}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
