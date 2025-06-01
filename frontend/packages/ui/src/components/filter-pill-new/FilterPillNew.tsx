import { cn } from '@/lib/utils';
import { Button } from '../button/Button';
import { Typography } from '../typography';
import { PhosphorIcon } from '@/icons/PhosphorIcon';

import React, {
  useState,
  useEffect,
  SetStateAction,
  BaseSyntheticEvent
} from 'react';

type filterType = 'checkbox' | 'radio';

type FilterData = {
  id: string;
  label: string;
  checked?: boolean;
  nameFilter: string;
};

export interface FilterPillProps {
  label?: string;
  reset?: boolean;
  data: FilterData[];
  type?: filterType | undefined;
  setData?: React.Dispatch<SetStateAction<FilterData[]>>;
}

function FilterPillNew({
  type,
  data,
  reset = true,
  label = 'Filter Type',
  setData
}: FilterPillProps) {
  const [open, setOpen] = useState(false);
  const [color, setColor] = useState(false);

  const handleClickOpen = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const hasChecked = data.some(item => item.checked === true);
    setColor(hasChecked);
  }, [data]);

  const onChange = (e: BaseSyntheticEvent) => {
    setData?.(prevData => {
      const newData =
        prevData?.map(item =>
          item.label === e.target.value
            ? { ...item, checked: e.target.checked }
            : item
        ) || [];

      return newData;
    });
  };

  const onChangeRadio = (e: BaseSyntheticEvent) => {
    console.log('e.target.value', e.target.value);

    const checkedInput = document.querySelectorAll(
      'input[type="radio"]'
    ) as NodeListOf<HTMLInputElement>;

    checkedInput.forEach(item => {
      if (item.checked === true)
        setData?.(
          data.map(dataItem => {
            return { ...dataItem, checked: dataItem.label === item.value };
          })
        );
    });
  };

  const handleReset = () => {
    if (type === 'radio') {
      const checkedInput = document.querySelectorAll(
        'input[type="radio"]'
      ) as NodeListOf<HTMLInputElement>;

      checkedInput.forEach(input => {
        input.checked = false;
        setColor(false);
      });
    }

    setData?.(
      data.map(item => {
        return { ...item, checked: false };
      })
    );
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

        <PhosphorIcon
          size={24}
          iconVariant={`${open === true ? 'CaretUp' : 'CaretDown'}_bold`}
          className={`${color === false ? 'fill-[#A39D96] text-[#A39D96]' : 'fill-[#EAFFE0] text-[#EAFFE0]'}`}
        />
      </div>

      {open === true && (
        <div className="absolute top-12 w-full bg-white rounded-[8px] py-3 px-2 flex flex-col gap-1 transition-all max-w-[300px] min-w-[300px] shadow-customShadowFilter">
          {type === 'checkbox' ? (
            <>
              {data.map((item, index) => {
                return (
                  <div
                    key={`filter-${index}`}
                    className={cn(`max-w-[375px] w-full 'min-w-[100px]'`)}
                  >
                    <div className="flex items-center justify-start gap-1 p-[10px]">
                      <div className="w-6 h-6 relative mr-[10px]">
                        <input
                          id={item.id}
                          type="checkbox"
                          value={item.label}
                          name={item.nameFilter}
                          onChange={e => onChange(e)}
                          checked={item.checked || false}
                          className="peer relative appearance-none shrink-0 rounded w-6 h-6"
                        />

                        <span
                          className={cn(
                            `absolute left-0 flex items-center justify-center top-0 border-2 w-6 h-6 border-[#A39D96] bg-white rounded pointer-events-none ${item.checked && `bg-blue-b-400 border-blue-b-400`}`
                          )}
                        >
                          <PhosphorIcon
                            size={18}
                            iconVariant={`Check_bold`}
                            className="fill-white"
                          />
                        </span>
                      </div>

                      <label htmlFor={item.id} className="block w-full">
                        <Typography
                          variant="body"
                          className="text-gray-g-500 tracking-[-0.36px] text-nowrap"
                        >
                          {item.label}
                        </Typography>
                      </label>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <>
              {data.map((item, index) => {
                return (
                  <div
                    key={`filter-${index}`}
                    className={cn(`max-w-[375px] w-full min-w-[100px]`)}
                  >
                    <div className="flex items-center justify-start gap-1 p-[10px]">
                      <fieldset
                        id="radioGroup"
                        className="w-6 h-6 relative mr-[10px]"
                      >
                        <input
                          type="radio"
                          id={item.id}
                          name="radioGroup"
                          value={item.label}
                          onChange={e => onChangeRadio(e)}
                          className="peer relative appearance-none shrink-0 rounded-full w-6 h-6"
                        />
                        <span
                          className={cn(
                            `absolute left-0 top-0 flex items-center justify-center rounded-full border-2 w-6 h-6 border-[#A39D96] peer-checked:!border-blue-b-400 bg-white pointer-events-none peer-checked:!bg-blue-b-400`
                          )}
                        >
                          <span className="w-2 h-2 rounded-full bg-white"></span>
                        </span>
                      </fieldset>
                      <div className={cn(`flex flex-col`)}>
                        <label htmlFor={item.id} className="block w-full">
                          <Typography
                            variant="body"
                            className="text-gray-g-500 tracking-[-0.36px]"
                          >
                            {item.label}
                          </Typography>
                        </label>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {reset === true ? (
            <div className="flex items-center justify-end">
              <Button
                type="reset"
                label="Reset"
                size="default"
                variant="tertiary"
                onClick={handleReset}
              />
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export { FilterPillNew };
export type { FilterData };
