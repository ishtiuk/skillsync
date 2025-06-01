import * as React from 'react';
import { FormControl, FormLabel } from '../Form';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <FormControl>
        <input
          ref={ref}
          {...props}
          type={type}
          data-testid="form-input"
          aria-labelledby="input-label"
          className="block w-full border-none outline-none shadow-none bg-neutral-n-100 text-black font-dm-sans text-md font-medium leading-6 tracking-tight"
        />
      </FormControl>
    );
  }
);
Input.displayName = 'Input';

export { Input };
