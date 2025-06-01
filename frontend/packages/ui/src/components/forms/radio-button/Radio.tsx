import { useFormContext } from 'react-hook-form';
import { Typography } from '@/components/typography/Typography';
import { cn } from '@/lib/utils';
import { ContextualAlert } from '@/components/contextual-alerts/ContextualAlert';

export interface RadioButtonProps {
  id: string;
  value: string;
  nameRadio: string;
  label: string | JSX.Element;
  helperText?: string;
  isError?: boolean;
  isErrorMessage?: string;
  isChecked?: boolean;
}

const RadioButton = ({
  id,
  value,
  label,
  nameRadio,
  helperText,
  isChecked = false,
  isError,
  isErrorMessage = ''
}: RadioButtonProps) => {
  const { register, watch } = useFormContext();
  const selectedValue = watch(nameRadio); // Track the selected radio button value

  return (
    <div
      className={cn(
        `max-w-[375px] w-full ${isError ? 'min-w-[375px]' : 'min-w-[100px]'}`
      )}
    >
      <div className="flex items-center justify-start gap-1 p-[10px]">
        <div className="w-6 h-6 relative mr-[10px]">
          <input
            className="peer relative appearance-none shrink-0 rounded-full w-6 h-6"
            type="radio"
            id={id}
            {...register(nameRadio)} // Registering input
            value={value}
            checked={selectedValue === value} // Ensuring controlled behavior
          />
          <span
            className={cn(
              `absolute left-0 top-0 flex items-center justify-center rounded-full border-2 w-6 h-6 
              ${isError ? 'border-red-r-500 peer-checked:!border-red-r-500' : 'border-[#A39D96] peer-checked:!border-blue-b-400'} 
              bg-white pointer-events-none peer-checked:!bg-blue-b-400`
            )}
          >
            <span className="w-2 h-2 rounded-full bg-white"></span>
          </span>
        </div>
        <div className={cn(`flex flex-col ${helperText ? 'gap-1' : 'gap-0'}`)}>
          <label htmlFor={id} className="block w-full">
            <Typography
              variant="body"
              className="text-gray-g-500 tracking-[-0.36px]"
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

export default RadioButton;
