import { cn } from '@/lib/utils';
import { useFormContext } from 'react-hook-form';
import { FormComponentProps, FormField, FormItem, FormMessage } from '../Form';
import {
  DropdownInternalProps,
  DropdownInternal
} from '../internal/DropdownInternal';

export type DropdownProps = FormComponentProps &
  DropdownInternalProps & {
    isOptionsLoadingParent?: boolean;
  };

export const Dropdown: React.FC<DropdownProps> = ({
  rules,
  fieldName,
  placeholder,
  isOptionsLoadingParent,
  ...props
}) => {
  const { control, getFieldState } = useFormContext();
  const { error } = getFieldState(fieldName);

  //   console.log(fieldName, props.options, isOptionsLoading);

  return (
    <FormField
      control={control}
      name={fieldName}
      rules={{
        validate: value =>
          props.options.includes(value) || 'Choose an option from the list.',
        ...rules
      }}
      render={({ field }) => (
        <FormItem className="flex flex-col w-full gap-2">
          {!isOptionsLoadingParent && (
            <DropdownInternal
              {...field}
              options={props.options}
              placeholder={placeholder}
              isOptionsLoading={isOptionsLoadingParent}
              className={cn(
                'h-16 py-2 px-3 items-center shrink-0 border border-neutral-n-300 rounded bg-neutral-100 w-full',
                error ? 'border-red-r-600' : 'focus-within:border-primary-g-600'
              )}
            />
          )}

          <FormMessage />
        </FormItem>
      )}
    />
  );
};
