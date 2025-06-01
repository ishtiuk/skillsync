import * as React from 'react';
import { FormControl, FormLabel } from '../Form';

export interface TextAreaProps
  extends React.InputHTMLAttributes<HTMLTextAreaElement> {}

const TextAreaInternal = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <div
        className={
          'wrapped-input-with-label relative flex flex-col gap-0.5 w-full'
        }
      >
        <FormLabel
          data-testid="textarea-label"
          className={'floating-label-textarea text-neutral-n-600'}
        >
          {props.placeholder}
        </FormLabel>
        <FormControl>
          <textarea
            rows={8}
            data-testid="form-textarea"
            aria-labelledby="textarea-label"
            className={'block w-full placeholder-opacity-0'}
            style={{
              border: 'none',
              outline: 'none',
              fontWeight: 500,
              boxShadow: 'none',
              fontStyle: 'normal',
              letterSpacing: '-0.36px',
              backgroundColor: 'transparent',
              lineHeight: 'var(--Large, 24px)',
              color: 'var(--Neutral-Black, #000)',
              fontSize: 'var(--Font-Size-md, 18px)',
              fontFamily: 'var(--Font-Family-Base, "DM Sans")',
              fontFeatureSettings:
                "'ss04' on, 'ss03' on, 'ss02' on, 'salt' on, 'ss01' on"
            }}
            ref={ref}
            {...props}
            placeholder=""
          />
        </FormControl>
      </div>
    );
  }
);
TextAreaInternal.displayName = 'TextAreaInternal';

export { TextAreaInternal };
