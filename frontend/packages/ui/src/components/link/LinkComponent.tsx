import Link, { LinkProps } from 'next/link';
import React, { PropsWithChildren } from 'react';
import { Typography } from '../typography';
import { IconVariant, PhosphorIcon } from '@/icons/PhosphorIcon';

type linkTypes = 'default' | 'large';

type ActiveLinkProps = LinkProps & {
  className?: string;
  size: linkTypes;
  label: string;
} & (
    | { leftIcon?: never; rightIcon?: never }
    | { leftIcon: IconVariant; rightIcon?: never }
    | { leftIcon?: never; rightIcon: IconVariant }
  );

const LinkComponent = ({
  className,
  leftIcon,
  rightIcon,
  label,
  size = 'default',
  ...props
}: PropsWithChildren<ActiveLinkProps>) => {
  return (
    <Link
      {...props}
      className="inline-flex items-center gap-1 justify-start text-primary-g-600 transition-all duration-300 border-b border-transparent hover:text-primary-g-700 hover:border-primary-g-700"
    >
      {leftIcon && (
        <PhosphorIcon
          size={size == 'default' ? 20 : 24}
          iconVariant={leftIcon}
        />
      )}
      <Typography
        variant={size == 'default' ? 'caption-strong' : 'body-strong'}
      >
        {label}
      </Typography>
      {rightIcon && (
        <PhosphorIcon
          size={size == 'default' ? 20 : 24}
          iconVariant={rightIcon}
        />
      )}
    </Link>
  );
};

export { LinkComponent };
