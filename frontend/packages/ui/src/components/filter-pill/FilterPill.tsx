import { cn } from '@/lib/utils';
import { Typography } from '../typography';
import { useState } from 'react';
import { Checkbox } from '../forms/checkbox/Checkbox';
import RadioButton from '../forms/radio-button/Radio';
import { Button } from '../button/Button';

type filterType = 'checkbox' | 'radio';
type FilterData = {
  label: string;
  id: any;
  nameFilter: string;
  checked?: boolean;
};

export interface FilterPillProps {
  /** Array of items to be displayed */
  label?: string;
  type?: filterType | undefined;
  reset?: boolean;
  data: FilterData[];
  value: string;
  onClick?: () => void;
  /** Component to be used to render data */
}

function FilterPill({
  label = 'Filter Type',
  reset = true,
  type,
  data,
  value,
  onClick,
  ...props
}: FilterPillProps) {
  const [open, setOpen] = useState(false);
  const [color, setColor] = useState(false);

  const handleClickOpen = () => {
    setOpen(!open);
  };

  const onChange = () => {
    let checkedInput = document.querySelectorAll('input[type="checkbox"]');
    let checkedInputLength = checkedInput.length;
    let valueChecked = 0;
    checkedInput.forEach((item: any) => {
      if (item.checked === false) {
        valueChecked++;
        if (valueChecked === checkedInputLength) {
          setColor(false);
        } else {
          setColor(true);
        }
      }
    });
  };

  const handleReset = () => {
    if (type === 'checkbox') {
      let checkedInput = document.querySelectorAll('input[type="checkbox"]');
      checkedInput.forEach(input => {
        // @ts-ignore
        input.checked = false;
        setColor(false);
      });
    }
    if (type === 'radio') {
      let checkedInput = document.querySelectorAll('input[type="radio"]');
      checkedInput.forEach(input => {
        // @ts-ignore
        input.checked = false;
        setColor(false);
      });
    }
  };

  return (
    <div className="relative">
      <div
        onClick={handleClickOpen}
        className={cn(
          `${color === false && 'bg-neutral-n-200 hover:bg-neutral-n-300'}`,
          `${color === true && 'bg-primary-g-700 text-primary-g-100 hover:bg-primary-g-800'}`,
          'inline-flex items-center h-10 gap-1 py-2 px-3 rounded-[8px] transition-all cursor-pointer'
        )}
      >
        <Typography variant="caption-strong">{label}</Typography>
        {color === false ? (
          <>
            {open === true ? (
              <div className="transition-all">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M18.7315 15.6469C18.6467 15.732 18.546 15.7995 18.435 15.8456C18.3241 15.8916 18.2051 15.9154 18.085 15.9154C17.9648 15.9154 17.8459 15.8916 17.7349 15.8456C17.624 15.7995 17.5232 15.732 17.4384 15.6469L12.0004 10.2089L6.56094 15.6469C6.38946 15.8184 6.15689 15.9147 5.91438 15.9147C5.67187 15.9147 5.43929 15.8184 5.26782 15.6469C5.09634 15.4754 5 15.2428 5 15.0003C5 14.7578 5.09634 14.5252 5.26782 14.3538L11.3531 8.26847C11.4379 8.18338 11.5387 8.11586 11.6496 8.06979C11.7606 8.02372 11.8795 8 11.9997 8C12.1198 8 12.2388 8.02372 12.3497 8.06979C12.4607 8.11586 12.5614 8.18338 12.6462 8.26847L18.7315 14.3538C18.8166 14.4386 18.8841 14.5393 18.9302 14.6503C18.9763 14.7612 19 14.8802 19 15.0003C19 15.1205 18.9763 15.2394 18.9302 15.3504C18.8841 15.4613 18.8166 15.5621 18.7315 15.6469Z"
                    fill="#1F1D1C"
                  />
                </svg>
              </div>
            ) : (
              <div className="transition-all">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M18.7307 9.5616L12.6458 15.6465C12.561 15.7316 12.4602 15.7991 12.3493 15.8452C12.2383 15.8913 12.1194 15.915 11.9992 15.915C11.8791 15.915 11.7602 15.8913 11.6492 15.8452C11.5383 15.7991 11.4375 15.7316 11.3527 15.6465L5.2678 9.5616C5.09633 9.39014 5 9.15757 5 8.91508C5 8.67259 5.09633 8.44003 5.2678 8.26856C5.43927 8.09709 5.67183 8.00076 5.91432 8.00076C6.15681 8.00076 6.38938 8.09709 6.56084 8.26856L12 13.7077L17.4392 8.2678C17.6106 8.09633 17.8432 8 18.0857 8C18.3282 8 18.5607 8.09633 18.7322 8.2678C18.9037 8.43927 19 8.67183 19 8.91432C19 9.15681 18.9037 9.38938 18.7322 9.56084L18.7307 9.5616Z"
                    fill="#1F1D1C"
                  />
                </svg>
              </div>
            )}
          </>
        ) : (
          <>
            {open === true ? (
              <div className="transition-all">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M18.7315 15.6469C18.6467 15.732 18.546 15.7995 18.435 15.8456C18.3241 15.8916 18.2051 15.9154 18.085 15.9154C17.9648 15.9154 17.8459 15.8916 17.7349 15.8456C17.624 15.7995 17.5232 15.732 17.4384 15.6469L12.0004 10.2089L6.56094 15.6469C6.38946 15.8184 6.15689 15.9147 5.91438 15.9147C5.67187 15.9147 5.43929 15.8184 5.26782 15.6469C5.09634 15.4754 5 15.2428 5 15.0003C5 14.7578 5.09634 14.5252 5.26782 14.3538L11.3531 8.26847C11.4379 8.18338 11.5387 8.11586 11.6496 8.06979C11.7606 8.02372 11.8795 8 11.9997 8C12.1198 8 12.2388 8.02372 12.3497 8.06979C12.4607 8.11586 12.5614 8.18338 12.6462 8.26847L18.7315 14.3538C18.8166 14.4386 18.8841 14.5393 18.9302 14.6503C18.9763 14.7612 19 14.8802 19 15.0003C19 15.1205 18.9763 15.2394 18.9302 15.3504C18.8841 15.4613 18.8166 15.5621 18.7315 15.6469Z"
                    fill="#EAFFE0"
                  />
                </svg>
              </div>
            ) : (
              <div className="transition-all">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M18.7307 9.5616L12.6458 15.6465C12.561 15.7316 12.4602 15.7991 12.3493 15.8452C12.2383 15.8913 12.1194 15.915 11.9992 15.915C11.8791 15.915 11.7602 15.8913 11.6492 15.8452C11.5383 15.7991 11.4375 15.7316 11.3527 15.6465L5.2678 9.5616C5.09633 9.39014 5 9.15757 5 8.91508C5 8.67259 5.09633 8.44003 5.2678 8.26856C5.43927 8.09709 5.67183 8.00076 5.91432 8.00076C6.15681 8.00076 6.38938 8.09709 6.56084 8.26856L12 13.7077L17.4392 8.2678C17.6106 8.09633 17.8432 8 18.0857 8C18.3282 8 18.5607 8.09633 18.7322 8.2678C18.9037 8.43927 19 8.67183 19 8.91432C19 9.15681 18.9037 9.38938 18.7322 9.56084L18.7307 9.5616Z"
                    fill="#EAFFE0"
                  />
                </svg>
              </div>
            )}
          </>
        )}
      </div>
      {open === true && (
        <div className="absolute top-12 w-full bg-white rounded-[8px] py-3 px-2 flex flex-col gap-1 transition-all max-w-[300px] min-w-[300px] shadow-customShadowFilter">
          {type === 'checkbox' ? (
            <>
              {data.map((item, index) => {
                return (
                  <Checkbox
                    value={value}
                    key={`filter-${index}`}
                    label={item.label}
                    id={item.id}
                    nameCheckbox={item.nameFilter}
                    // index={index}
                    // onChange={onChange}
                  />
                );
              })}
            </>
          ) : (
            <>
              {data.map((item, index) => {
                return (
                  <RadioButton
                    value={value}
                    key={`filter-${index}`}
                    label={item.label}
                    id={item.id}
                    nameRadio={item.nameFilter}
                    // onChange={onChange}
                  />
                );
              })}
            </>
          )}
          {reset === true ? (
            <div className="flex items-center justify-end">
              <Button
                onClick={handleReset}
                type="reset"
                label="Reset"
                size="default"
                variant="tertiary"
              />
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export { FilterPill };
export type { FilterData };
