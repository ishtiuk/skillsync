import { cn } from '@/lib/utils';
import { Input } from '../internal/InputInternal';
import { useFormContext } from 'react-hook-form';
import React, { HTMLInputTypeAttribute, useState } from 'react';
import { IconButton } from '@/components/icon-button/IconButton';
import {
  FormItem,
  FormField,
  FormLabel,
  FormMessage,
  FormComponentProps
} from '../Form';

export type TextInputProps = FormComponentProps &
  React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    noSuffix?: boolean;
    onChangeFunc?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyPressFunc?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  };

export const TextInput: React.FC<TextInputProps> = ({
  rules,
  label,
  noSuffix,
  leftIcon,
  fieldName,
  onChangeFunc,
  onKeyPressFunc,
  ...props
}) => {
  const { control, getFieldState } = useFormContext();
  const { error } = getFieldState(fieldName);

  const [passwordType, setPasswordType] = useState<HTMLInputTypeAttribute>(
    props.type || 'password'
  );

  const handlePasswordVisibility: React.MouseEventHandler<
    HTMLButtonElement
  > = event => {
    event.preventDefault();
    setPasswordType(passwordType === 'password' ? 'text' : 'password');
  };

  return (
    <FormField
      rules={rules}
      name={fieldName}
      control={control}
      render={({ field }) => (
        <FormItem className={cn('flex flex-col w-full gap-2')}>
          <FormLabel
            data-testid="input-label"
            className={'text-black text-xs font-medium'}
          >
            {label ?? props.placeholder}
          </FormLabel>

          <div
            className={cn(
              'flex h-12 py-2 px-3 shrink-0 border border-neutral-n-300 rounded bg-neutral-100 relative items-center w-full justify-between',
              error ? 'border-red-r-600' : 'focus-within:border-primary-g-600',
              leftIcon ? 'gap-3' : 'gap-2'
            )}
          >
            {leftIcon && leftIcon}

            <Input
              {...field}
              type={props.type === 'password' ? passwordType : props.type}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  onKeyPressFunc?.(e);
                }
              }}
              onChange={e => {
                field.onChange(e);
                onChangeFunc?.(e);
              }}
              placeholder={
                props.placeholder +
                (rules?.required || noSuffix ? '' : ' (Optional)')
              }
            />

            {props.type === 'password' && (
              <IconButton
                size={'small'}
                variant={'tertiary'}
                onMouseDown={handlePasswordVisibility}
                iconVariant={
                  passwordType === 'password' ? 'Eye_fill' : 'EyeSlash_fill'
                }
              />
            )}
          </div>
          <FormMessage className="!py-0 mb-2" />
        </FormItem>
      )}
    />
  );
};
