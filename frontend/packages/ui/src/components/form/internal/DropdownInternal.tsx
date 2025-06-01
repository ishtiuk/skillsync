import * as React from 'react';

import { cn } from '@/lib/utils';
import { IconButton } from '../../icon-button/IconButton';
import { useId, useState } from 'react';
import { Input } from './InputInternal';
import { useClickOutside } from '@/hooks/useClickOutside';

export interface DropdownInternalProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  options: string[];
  className?: string;
  isOptionsLoading?: boolean;
}

export const DropdownInternal = React.forwardRef<
  HTMLInputElement,
  DropdownInternalProps
>(
  (
    {
      isOptionsLoading = false,
      options,
      placeholder,
      onChange,
      className,
      onBlur,
      name,
      value,
      ...props
    },
    ref
  ) => {
    if (name === 'city') {
      console.log(name, isOptionsLoading);
    }

    const id = useId();
    const [focusedOption, setFocusedOption] = useState<number>(-1);
    const [suggestedOptions, setSuggestedOptions] = useState<string[]>(options);
    const [showList, setShowList] = useState<string>('none');
    const containerRef = useClickOutside(handleOnBlur);

    const setValue = (option: string) => {
      onChange?.({
        target: { value: option, name: name || '' }
      } as React.ChangeEvent<HTMLInputElement>);
      handleOnBlur();
      setSuggestedOptions(
        options.filter(
          op => op.toLowerCase().indexOf(option.toLowerCase()) !== 0
        )
      );
    };

    function handleOnBlur() {
      setFocusedOption(-1);
      setShowList('none');
    }

    const onFocus = () => {
      setShowList('block');
    };

    const onInputChange: React.ChangeEventHandler<HTMLInputElement> = event => {
      const newInput = event.target.value;
      onChange?.(event);
      setSuggestedOptions(
        options.filter(
          option => option.toLowerCase().indexOf(newInput.toLowerCase()) === 0
        )
      );
    };

    const onClick: React.MouseEventHandler = event => {
      event?.preventDefault();
      setShowList(prev => (prev === 'block' ? 'none' : 'block'));
    };

    const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = event => {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setShowList('block');
          if (!!event.altKey) break;
          if (
            focusedOption === suggestedOptions.length - 1 ||
            focusedOption === -1
          ) {
            setFocusedOption(0);
          } else {
            setFocusedOption(prev => prev + 1);
          }
          break;
        case 'ArrowUp':
          event.preventDefault();
          setShowList('block');
          if (focusedOption === 0 || focusedOption === -1) {
            setFocusedOption(suggestedOptions.length - 1);
          } else {
            setFocusedOption(prev => prev - 1);
          }
          break;
        case 'Enter':
          event.preventDefault();
          if (focusedOption === -1) {
            setShowList('none');
          } else {
            if (suggestedOptions[focusedOption] !== undefined) {
              setValue(suggestedOptions[focusedOption]);
            }
          }
          break;
        case 'Escape':
          handleOnBlur();
      }
    };

    return (
      <div ref={containerRef} className={className}>
        <div
          className={
            'relative flex flex-row gap-3 w-full items-center justify-between'
          }
          role="combobox"
          aria-controls={`dropdown-list-${id}`}
          aria-expanded={showList === 'block'}
          aria-activedescendant={
            focusedOption === -1 ? undefined : suggestedOptions[focusedOption]
          }
          aria-autocomplete="list"
        >
          <Input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={onInputChange}
            onKeyDown={onKeyDown}
            ref={ref}
            onFocus={onFocus}
            autoComplete="off"
            onBlur={onBlur}
            name={name}
            {...props}
          />
          <IconButton
            iconVariant={'CaretDown_bold'}
            variant={'tertiary'}
            type="button"
            tabIndex={-1}
            onMouseDown={onClick}
          />
        </div>

        {!isOptionsLoading && (
          <ul
            style={{
              listStyleType: 'none',
              display: showList,
              //top: '64px',
              maxHeight: '200px',
              left: '0px',
              zIndex: 1000,
              overflowY: 'auto',
              borderTop: 0,
              color: 'var(--Neutral-Black, #000)'
            }}
            id={`dropdown-list-${id}`}
            role="listbox"
            data-testid="dropdown-list"
            className={
              'absolute w-full border border-neutral-n-300 bg-neutral-n-100'
            }
          >
            {suggestedOptions.length > 0 ? (
              suggestedOptions.map((option, idx) => (
                <li
                  className={cn(
                    'hover:bg-neutral-n-200 cursor-pointer py-1 px-2',
                    idx === focusedOption && 'bg-neutral-n-200'
                  )}
                  key={idx}
                  value={option}
                  aria-selected={value === option}
                  onMouseDown={() => setValue(option)}
                  onMouseEnter={() => setFocusedOption(idx)}
                  onMouseLeave={() => setFocusedOption(-1)}
                >
                  {option}
                </li>
              ))
            ) : (
              <li className="py-1 px-2">No options available</li>
            )}
          </ul>
        )}
      </div>
    );
  }
);

DropdownInternal.displayName = 'DropdownInternal';
