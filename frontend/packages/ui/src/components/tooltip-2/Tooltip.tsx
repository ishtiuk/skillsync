'use client';

import { cn } from '@/lib/utils';
import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

const Tooltip = TooltipPrimitive.Root;
const TooltipPortal = TooltipPrimitive.Portal;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipProvider = TooltipPrimitive.Provider;

interface TooltipContentProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> {
  arrowFill?: string;
}

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(
  (
    { className, sideOffset = 5, arrowFill = 'fill-primary-g-800', ...props },
    ref
  ) => (
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-25 select-none rounded-[8px] bg-primary-g-800 px-4 py-2 text-sm text-white shadow-lg',
        'data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
        className
      )}
      {...props}
    >
      {props.children}
      <TooltipPrimitive.Arrow className={cn(arrowFill)} />
    </TooltipPrimitive.Content>
  )
);

TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipPortal,
  TooltipProvider
};
