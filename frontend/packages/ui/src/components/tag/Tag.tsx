import * as React from 'react';

import { cn } from '@/lib/utils';
import { Typography } from '../typography';
import { TypographyProps } from '../typography/Typography';

interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  TypographyProps?: Partial<TypographyProps>;
  QuantityJobs?: string;
  minimaze?: boolean;
  children?: any;
}

function Tag({
  className,
  label,
  TypographyProps,
  QuantityJobs,
  minimaze = false,
  children,
  ...props
}: TagProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-lg h-7 px-2 py-1 font-semibold transition-colors bg-neutral-n-200 text-neutral-n-800',
        className
      )}
      {...props}
    >
      {children}
      {minimaze ? (
        <div></div>
      ) : (
        <Typography variant="caption" {...TypographyProps}>
          {label}
        </Typography>
      )}
      {QuantityJobs && (
        <div className="flex justify-center items-center">
          <Typography variant="caption-strong" className="text-sm font-medium">
            {QuantityJobs} <span className="text-sm font-medium">Jobs</span>
          </Typography>
        </div>
      )}
    </div>
  );
}

export { Tag };
export type { TagProps };
