import { cn } from '@/lib/utils';
import React from 'react';
import { Typography } from '../../typography';

export interface SwitchProps {
  id: string;
  label?: string;
  enabled?: boolean;
  className?: string;
  helperText?: string;
  nameSwitch?: string;
  onChange?: (value: boolean) => void;
}

export const Switch: React.FC<SwitchProps> = ({
  id,
  label,
  enabled = false, // Controlled via props
  onChange,
  className,
  helperText,
  nameSwitch,
  ...props
}) => {
  const handleToggle = () => {
    onChange?.(!enabled); // Directly update parent state
  };

  return (
    <div
      className={cn(
        `max-w-[375px] w-full ${label ? 'min-w-[375px]' : 'min-w-[65px]'}`,
        className
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className={cn(`flex flex-col ${helperText ? 'gap-1' : 'gap-0'}`)}>
          {label && (
            <label htmlFor={id} className="block w-full">
              <Typography
                variant="body"
                className="text-neutral-n-800 tracking-[-0.36px]"
              >
                {label}
              </Typography>
            </label>
          )}
          {helperText && (
            <Typography
              variant="caption"
              className="text-neutral-n-600 tracking-[-0.28px] font-medium"
            >
              {helperText}
            </Typography>
          )}
        </div>

        {/* Clickable Label Wrapping the Input */}
        <label
          htmlFor={id}
          className="relative flex items-center w-16 h-8 cursor-pointer"
        >
          <input
            id={id}
            type="checkbox"
            checked={enabled} // Controlled via props
            onChange={handleToggle} // Call parent's onChange
            className="sr-only peer"
          />
          <div
            className={`w-16 h-8 rounded-full transition-colors ${
              enabled ? 'bg-primary-g-600' : 'bg-neutral-n-400'
            }`}
          >
            <div
              className={`absolute top-0 left-0 h-8 w-8 bg-white border rounded-full transition-transform ${
                enabled
                  ? 'translate-x-full border-primary-g-600'
                  : 'border-neutral-n-400'
              }`}
            ></div>
          </div>
          <svg
            width="18"
            height="18"
            fill="none"
            viewBox="0 0 18 18"
            xmlns="http://www.w3.org/2000/svg"
            className={`absolute right-[7px] top-[7px] z-10 transition-opacity ${
              enabled ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M13.6551 5.24447C14.0724 5.60626 14.1174 6.23783 13.7556 6.65511L8.55331 12.6551C8.36337 12.8742 8.0877 13 7.79775 13C7.50781 13 7.23214 12.8742 7.0422 12.6551L4.24446 9.42823C3.88267 9.01095 3.92765 8.37938 4.34493 8.01759C4.76222 7.6558 5.39378 7.70078 5.75557 8.11807L7.79777 10.4735L12.2445 5.34492C12.6063 4.92764 13.2378 4.88267 13.6551 5.24447Z"
              fill="#3BA36F"
            />
          </svg>
        </label>
      </div>
    </div>
  );
};
