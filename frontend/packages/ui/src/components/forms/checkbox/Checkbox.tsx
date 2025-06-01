import { useFormContext } from 'react-hook-form';
import { Typography } from '@/components/typography/Typography';
import { cn } from '@/lib/utils';
import { ContextualAlert } from '@/components/contextual-alerts/ContextualAlert';

export interface CheckboxProps {
  id: string;
  label: string;
  value: string;
  nameCheckbox: string;
  helperText?: string;
  isError?: boolean;
  isErrorMessage?: string;
  isChecked?: boolean;
}

const Checkbox = ({
  id,
  value,
  label,
  nameCheckbox,
  helperText,
  isError,
  isChecked = false,
  isErrorMessage = ''
}: CheckboxProps) => {
  const { register, watch } = useFormContext();
  const checkedValues = watch(nameCheckbox) || []; // Ensure it's an array

  return (
    <div
      className={cn(
        `max-w-[375px] w-full ${isError ? 'min-w-[375px]' : 'min-w-[100px]'}`
      )}
    >
      <div className="flex items-center justify-start gap-1 p-[10px]">
        <div className="w-6 h-6 relative mr-[10px]">
          <input
            className="peer relative appearance-none shrink-0 rounded w-6 h-6"
            type="checkbox"
            id={id}
            {...register(nameCheckbox)}
            value={value}
            checked={checkedValues.includes(value)} // Ensure proper state control
          />
          <span
            className={cn(
              `absolute left-0 flex items-center justify-center top-0 border-2 w-6 h-6 
              ${isError ? 'border-red-r-500 peer-checked:!border-red-r-500' : 'border-[#A39D96] peer-checked:!border-blue-b-400'} 
              bg-white rounded pointer-events-none peer-checked:!bg-blue-b-400`
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
            >
              <path
                d="M14.7958 5.68239L7.41335 13.0648C7.34906 13.1293 7.27265 13.1805 7.18853 13.2155C7.1044 13.2504 7.01421 13.2684 6.92311 13.2684C6.83202 13.2684 6.74183 13.2504 6.6577 13.2155C6.57358 13.1805 6.49717 13.1293 6.43288 13.0648L3.20306 9.835C3.13868 9.77063 3.08762 9.6942 3.05277 9.61008C3.01793 9.52597 3 9.43581 3 9.34477C3 9.25372 3.01793 9.16356 3.05277 9.07945C3.08762 8.99533 3.13868 8.91891 3.20306 8.85453C3.26744 8.79015 3.34387 8.73908 3.42799 8.70424C3.5121 8.66939 3.60226 8.65146 3.6933 8.65146C3.78435 8.65146 3.8745 8.66939 3.95862 8.70424C4.04273 8.73908 4.11916 8.79015 4.18354 8.85453L6.92369 11.5947L13.8165 4.70306C13.9465 4.57304 14.1228 4.5 14.3067 4.5C14.4906 4.5 14.6669 4.57304 14.7969 4.70306C14.927 4.83308 15 5.00943 15 5.1933C15 5.37718 14.927 5.55352 14.7969 5.68354L14.7958 5.68239Z"
                fill="white"
              />
            </svg>
          </span>
        </div>
        <div className={cn(`flex flex-col ${helperText ? 'gap-1' : 'gap-0'}`)}>
          <label htmlFor={id} className="block w-full">
            <Typography
              variant="body"
              className="text-gray-g-500 tracking-[-0.36px] text-nowrap"
            >
              {label}
            </Typography>
          </label>
          {helperText && (
            <Typography
              variant="caption"
              className="text-gray-g-400 tracking-[-0.28px]"
            >
              {helperText}
            </Typography>
          )}
        </div>
      </div>
      {isError && <ContextualAlert variant="critical" label={isErrorMessage} />}
    </div>
  );
};

export { Checkbox };
