'use client';
import React, { useEffect, useState } from 'react';
import { Typography } from '../typography';
import { PhosphorIcon, PhosphorIconProps } from '@/icons/PhosphorIcon';
import { cn } from '@/lib/utils';
import { Button, ButtonProps } from '../button/Button';
import { IconButton } from '../icon-button/IconButton';
import Image from 'next/image';

type SectionHeaderProps = {
  count?: number;
  title: string;
  className?: string;
} & (
  | { leftIconProps?: never; leftImageSrc: string }
  | { leftIconProps?: never; leftImageSrc?: never }
  | { leftIconProps: PhosphorIconProps; leftImageSrc?: never }
) &
  (
    | {
        hasDropdown: boolean;
        defaultState: 'open' | 'closed';
        onClickDropdown: () => void;
        rightButtonProps?: never;
      }
    | {
        hasDropdown?: never;
        defaultState?: never;
        onClickDropdown?: never;
        rightButtonProps: ButtonProps;
      }
    | {
        hasDropdown?: never;
        defaultState?: never;
        onClickDropdown?: never;
        rightButtonProps?: ButtonProps;
      }
  );

function SectionHeader({
  leftIconProps,
  leftImageSrc,
  count,
  title,
  className,
  hasDropdown,
  defaultState,
  onClickDropdown,
  rightButtonProps
}: SectionHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(
    defaultState && defaultState === 'open' ? true : false
  );

  const onClick = () => {
    setDropdownOpen(!dropdownOpen);
    onClickDropdown?.();
  };

  useEffect(() => {
    if (defaultState === 'open') setDropdownOpen(true);
  }, [defaultState]);

  return (
    <div className={cn('px-6 py-4 items-center flex gap-3', className)}>
      {hasDropdown && (
        <IconButton
          variant="tertiary"
          iconVariant={dropdownOpen ? 'CaretDown_bold' : 'CaretRight_bold'}
          onClick={onClick}
          size="small"
        />
      )}
      <div className="flex justify-between grow">
        <div className="flex gap-[10px] items-center">
          {leftIconProps && <PhosphorIcon {...leftIconProps} size={24} />}
          {leftImageSrc && (
            <Image
              src={leftImageSrc}
              width="24"
              height="24"
              alt="section header"
            />
          )}
          <Typography variant="body-strong">{title}</Typography>
          {count !== undefined && (
            <div className="px-[2px] bg-neutral-n-200 rounded min-w-[20px] text-center">
              <Typography variant="caption-strong">{count}</Typography>
            </div>
          )}
        </div>
        {rightButtonProps && (
          <Button {...rightButtonProps} variant="tertiary" size="default" />
        )}
      </div>
    </div>
  );
}

export default SectionHeader;
