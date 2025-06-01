import React from 'react';
import { BadgeTagProps } from '../badges/badge/Badge';
import { Typography } from '../typography';
import { cn } from '@/lib/utils';

export interface ListItemProps {
  title: string;
  subTitle?: string;
  header?: string;
  Badge?: React.ReactElement<BadgeTagProps>;
  ContentImage?: React.ReactElement;
  footer?: React.ReactElement | string;
  onClick?: () => void;
  ListItemRight?: React.ReactElement;
  className?: string;
}

export const ListItem = ({
  title,
  subTitle,
  header,
  Badge,
  ContentImage,
  footer,
  ListItemRight,
  onClick,
  className
}: ListItemProps) => {
  const Footer =
    !!footer && typeof footer === 'string' ? (
      <Typography variant="caption">{footer}</Typography>
    ) : (
      footer
    );
  return (
    <div
      className={cn(
        'w-full px-6 py-4 flex gap-12 justify-between',
        !!onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      role="listitem"
    >
      <div className="flex flex-col gap-3 shrink truncate">
        <div
          className="flex justify-start gap-4 items-center"
          data-testid="listItemHeader"
        >
          {header && (
            <Typography variant="caption" className="text-neutral-n-600">
              {header}
            </Typography>
          )}
          {Badge}
        </div>
        <div
          data-testid="listItemContent"
          className="flex gap-2 shrink truncate"
        >
          {ContentImage}
          <div className="flex flex-col align-start gap-1 shrink truncate">
            {title && (
              <Typography variant="body-strong" className="truncate">
                {title}
              </Typography>
            )}
            {subTitle && (
              <Typography
                variant="caption"
                className="truncate text-neutral-n-600"
              >
                {subTitle}
              </Typography>
            )}
          </div>
        </div>
        <div data-testid="listItemFooter" className="flex gap-2 justify-start">
          {Footer}
        </div>
      </div>
      <div>{ListItemRight}</div>
    </div>
  );
};
