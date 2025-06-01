import React from 'react';
import { cn } from '@/lib/utils';
import { useFormContext } from 'react-hook-form';
import { TextAreaInternal } from '../internal/TextAreaInternal';
import { FormComponentProps, FormField, FormItem, FormMessage } from '../Form';

export type TextAreaProps = FormComponentProps &
  React.InputHTMLAttributes<HTMLTextAreaElement> & {
    onChangeFunc?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    noSuffix?: boolean;
  };

export const TextArea: React.FC<TextAreaProps> = ({
  rules,
  noSuffix,
  leftIcon,
  fieldName,
  onChangeFunc,
  ...props
}) => {
  const { control, getFieldState } = useFormContext();
  const { error } = getFieldState(fieldName);

  return (
    <FormField
      rules={rules}
      name={fieldName}
      control={control}
      render={({ field }) => (
        <FormItem className={cn('flex flex-col w-full gap-2')}>
          <div
            className={cn(
              'flex h-full py-2 px-3 shrink-0 border border-neutral-n-300 rounded bg-neutral-100 relative items-center w-full justify-between',
              error ? 'border-red-r-600' : 'focus-within:border-primary-g-600',
              leftIcon ? 'gap-3' : 'gap-2'
            )}
          >
            {leftIcon && leftIcon}
            <TextAreaInternal
              {...field}
              onChange={e => {
                field.onChange(e);
                onChangeFunc?.(e);
              }}
              placeholder={
                props.placeholder +
                (rules?.required || noSuffix ? '' : ' (Optional)')
              }
            />
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
