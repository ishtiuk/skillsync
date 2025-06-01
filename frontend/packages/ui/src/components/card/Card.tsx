import * as React from "react";

import { cn } from "@/lib/utils";

type variantType = "default" | "gradient";

const cardSizes = {
  skinny: "w-[21.875rem] h-[7.75rem] p-4",
  small: "w-[10.438rem] h-[12.5rem] p-3",
  medium: "w-[21.875rem] h-[12.5rem] p-4",
  "medium-flex": "flex-1 h-[12.5rem] p-4",
  large: "w-[21.875rem] h-[26rem] p-6",
  fill: "w-full h-auto p-6",
};
export type CardSizes = keyof typeof cardSizes;

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: CardSizes;
  variant?: variantType;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, size = "large", variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        cardSizes[size],
        `rounded-sm bg-white ${
          variant === "default" ? "bg-white" : "gradient"
        } text-primary shadow-customShadow`,
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
