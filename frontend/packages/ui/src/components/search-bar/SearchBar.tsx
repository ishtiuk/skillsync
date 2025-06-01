'use client';
import { cn } from '@/lib/utils';
import { Button } from '../button';
import SearchBarLink from './SearchBarLink';
import { useState } from 'react';

export interface SearchBarProps {
  error?: boolean;
  items?: Array<{
    id: string;
    title: string;
  }>;
  onSubmit?: (values: { [key: string]: string | undefined }) => void;
}

function SearchBar({ error, items, onSubmit, ...props }: SearchBarProps) {
  const [formValues, setFormValues] = useState<{
    [key: string]: string | undefined;
  }>({
    search: '',
    location: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value === '' ? undefined : value
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit(formValues);
  };

  return (
    <div className="items-center flex w-full justify-center">
      <form
        className="flex items-center justify-between gap-4 min-w-[1080px] mx-auto w-full"
        onSubmit={handleFormSubmit}
      >
        <div className="relative  w-[920px] ">
          <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M21.7959 20.2042L17.3437 15.7501C18.6787 14.0106 19.3019 11.8284 19.087 9.64618C18.8722 7.46401 17.8353 5.44527 16.1867 3.99948C14.5382 2.55369 12.4014 1.7891 10.2098 1.86083C8.01829 1.93255 5.93607 2.83521 4.38558 4.3857C2.83509 5.9362 1.93243 8.01841 1.8607 10.21C1.78898 12.4015 2.55356 14.5383 3.99936 16.1868C5.44515 17.8354 7.46389 18.8723 9.64606 19.0871C11.8282 19.302 14.0104 18.6788 15.75 17.3439L20.2059 21.8007C20.3106 21.9054 20.4348 21.9884 20.5715 22.045C20.7083 22.1017 20.8548 22.1308 21.0028 22.1308C21.1508 22.1308 21.2973 22.1017 21.4341 22.045C21.5708 21.9884 21.695 21.9054 21.7997 21.8007C21.9043 21.6961 21.9873 21.5719 22.044 21.4351C22.1006 21.2984 22.1298 21.1519 22.1298 21.0039C22.1298 20.8559 22.1006 20.7093 22.044 20.5726C21.9873 20.4359 21.9043 20.3116 21.7997 20.207L21.7959 20.2042ZM4.12499 10.5001C4.12499 9.23926 4.49888 8.00672 5.19938 6.95836C5.89987 5.90999 6.89551 5.09289 8.06039 4.61038C9.22527 4.12788 10.5071 4.00163 11.7437 4.24761C12.9803 4.49359 14.1162 5.10075 15.0078 5.99231C15.8994 6.88387 16.5065 8.01979 16.7525 9.25642C16.9985 10.493 16.8722 11.7748 16.3897 12.9397C15.9072 14.1046 15.0901 15.1002 14.0418 15.8007C12.9934 16.5012 11.7608 16.8751 10.5 16.8751C8.80977 16.8734 7.18927 16.2012 5.99411 15.006C4.79894 13.8108 4.12673 12.1903 4.12499 10.5001Z"
                fill="#7A7671"
              />
            </svg>
          </div>
          <input
            type="text"
            name="search"
            id="simple-search"
            className={cn(
              error === true
                ? 'border border-red-r-600  caret-red-r-600 placeholder:text-neutral-n-800 focus:border-red-r-600 active:border-red-r-600 outline-red-r-600 placeholder:focus:text-neutral-n-600'
                : 'border border-neutral-n-300 hover:border-neutral-n-400 caret-primary-g-600 outline-primary-g-600',
              'transition-all duration-100 pr-4 h-14 bg-neutral-n-100  text-neutral-n-800 text-lg   rounded-[4px] w-full flex  placeholder-neutral-n-600 outline-1 items-center justify-start py-4 pl-11 font-medium leading-6 tracking-[-0.36px] active:outline-0'
            )}
            placeholder="Search by job title"
            value={formValues.search}
            onChange={handleInputChange}
          />
          <div className="absolute top-[61px] left-0 max-w-[721px] w-full shadow-customShadowBar">
            {items?.map(result => {
              return (
                <SearchBarLink
                  key={result.id}
                  title={result.title}
                  id={result.id}
                />
              );
            })}
          </div>

          {error && (
            <div className="absolute inset-y-0 end-0 flex items-center pe-4 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M20.6647 17.1271L13.6688 4.97764C13.4939 4.67999 13.2444 4.43318 12.9448 4.2617C12.6452 4.09021 12.306 4 11.9608 4C11.6156 4 11.2764 4.09021 10.9768 4.2617C10.6772 4.43318 10.4276 4.67999 10.2528 4.97764L3.25686 17.1271C3.08865 17.415 3 17.7425 3 18.0759C3 18.4094 3.08865 18.7368 3.25686 19.0247C3.42944 19.3242 3.67859 19.5723 3.97874 19.7437C4.27889 19.9151 4.61923 20.0035 4.96484 19.9999H18.9567C19.302 20.0032 19.6421 19.9146 19.9419 19.7433C20.2417 19.5719 20.4906 19.3239 20.6631 19.0247C20.8315 18.7369 20.9205 18.4096 20.9207 18.0761C20.921 17.7427 20.8327 17.4152 20.6647 17.1271ZM11.3208 10.4C11.3208 10.2303 11.3882 10.0675 11.5082 9.94745C11.6282 9.82742 11.791 9.76 11.9608 9.76C12.1305 9.76 12.2933 9.82742 12.4133 9.94745C12.5333 10.0675 12.6008 10.2303 12.6008 10.4V13.6C12.6008 13.7697 12.5333 13.9325 12.4133 14.0525C12.2933 14.1725 12.1305 14.24 11.9608 14.24C11.791 14.24 11.6282 14.1725 11.5082 14.0525C11.3882 13.9325 11.3208 13.7697 11.3208 13.6V10.4ZM11.9608 17.4399C11.7709 17.4399 11.5853 17.3836 11.4274 17.2781C11.2696 17.1726 11.1465 17.0227 11.0739 16.8473C11.0012 16.6719 10.9822 16.4789 11.0192 16.2926C11.0563 16.1064 11.1477 15.9354 11.282 15.8011C11.4162 15.6669 11.5873 15.5754 11.7735 15.5384C11.9597 15.5013 12.1527 15.5204 12.3281 15.593C12.5036 15.6657 12.6535 15.7887 12.759 15.9466C12.8645 16.1045 12.9208 16.2901 12.9208 16.4799C12.9208 16.7345 12.8196 16.9787 12.6396 17.1587C12.4596 17.3388 12.2154 17.4399 11.9608 17.4399Z"
                  fill="#E90000"
                />
              </svg>
            </div>
          )}
        </div>

        <div className="relative w-fit">
          <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="22"
              viewBox="0 0 18 22"
              fill="none"
            >
              <path
                d="M15.75 20H11.1131C11.892 19.3045 12.6266 18.5608 13.3125 17.7734C15.8859 14.8138 17.25 11.6938 17.25 8.75C17.25 6.56196 16.3808 4.46354 14.8336 2.91637C13.2865 1.36919 11.188 0.5 9 0.5C6.81196 0.5 4.71354 1.36919 3.16637 2.91637C1.61919 4.46354 0.75 6.56196 0.75 8.75C0.75 11.6938 2.11031 14.8138 4.6875 17.7734C5.37338 18.5608 6.10795 19.3045 6.88688 20H2.25C2.05109 20 1.86032 20.079 1.71967 20.2197C1.57902 20.3603 1.5 20.5511 1.5 20.75C1.5 20.9489 1.57902 21.1397 1.71967 21.2803C1.86032 21.421 2.05109 21.5 2.25 21.5H15.75C15.9489 21.5 16.1397 21.421 16.2803 21.2803C16.421 21.1397 16.5 20.9489 16.5 20.75C16.5 20.5511 16.421 20.3603 16.2803 20.2197C16.1397 20.079 15.9489 20 15.75 20ZM9 5.75C9.59334 5.75 10.1734 5.92595 10.6667 6.25559C11.1601 6.58524 11.5446 7.05377 11.7716 7.60195C11.9987 8.15013 12.0581 8.75333 11.9424 9.33527C11.8266 9.91721 11.5409 10.4518 11.1213 10.8713C10.7018 11.2909 10.1672 11.5766 9.58527 11.6924C9.00333 11.8081 8.40013 11.7487 7.85195 11.5216C7.30377 11.2946 6.83524 10.9101 6.50559 10.4167C6.17595 9.92336 6 9.34334 6 8.75C6 7.95435 6.31607 7.19129 6.87868 6.62868C7.44129 6.06607 8.20435 5.75 9 5.75Z"
                fill="#7A7671"
              />
            </svg>
          </div>
          <input
            type="text"
            name="location"
            id="location-search"
            className={cn(
              error === true
                ? 'border border-red-r-600  caret-red-r-600 placeholder:max-w-[124px] placeholder:text-neutral-n-800 focus:border-red-r-600 active:border-red-r-600 outline-red-r-600 placeholder:focus:text-neutral-n-600'
                : 'border border-neutral-n-300 hover:border-neutral-n-400 caret-primary-g-600 outline-primary-g-600',
              'transition-all duration-100 pr-4 h-14 bg-neutral-n-100  text-neutral-n-800 text-lg   rounded-[4px] w-full flex  placeholder-neutral-n-600 outline-1 items-center justify-start py-4 pl-10 font-medium leading-6 tracking-[-0.36px] active:outline-0'
            )}
            value={formValues.location}
            onChange={handleInputChange}
            placeholder={
              error === true ? 'City, state, or...' : 'City, state, or...'
            }
          />
          {error && (
            <div className="absolute inset-y-0 end-0 flex items-center pe-4 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M20.6647 17.1271L13.6688 4.97764C13.4939 4.67999 13.2444 4.43318 12.9448 4.2617C12.6452 4.09021 12.306 4 11.9608 4C11.6156 4 11.2764 4.09021 10.9768 4.2617C10.6772 4.43318 10.4276 4.67999 10.2528 4.97764L3.25686 17.1271C3.08865 17.415 3 17.7425 3 18.0759C3 18.4094 3.08865 18.7368 3.25686 19.0247C3.42944 19.3242 3.67859 19.5723 3.97874 19.7437C4.27889 19.9151 4.61923 20.0035 4.96484 19.9999H18.9567C19.302 20.0032 19.6421 19.9146 19.9419 19.7433C20.2417 19.5719 20.4906 19.3239 20.6631 19.0247C20.8315 18.7369 20.9205 18.4096 20.9207 18.0761C20.921 17.7427 20.8327 17.4152 20.6647 17.1271ZM11.3208 10.4C11.3208 10.2303 11.3882 10.0675 11.5082 9.94745C11.6282 9.82742 11.791 9.76 11.9608 9.76C12.1305 9.76 12.2933 9.82742 12.4133 9.94745C12.5333 10.0675 12.6008 10.2303 12.6008 10.4V13.6C12.6008 13.7697 12.5333 13.9325 12.4133 14.0525C12.2933 14.1725 12.1305 14.24 11.9608 14.24C11.791 14.24 11.6282 14.1725 11.5082 14.0525C11.3882 13.9325 11.3208 13.7697 11.3208 13.6V10.4ZM11.9608 17.4399C11.7709 17.4399 11.5853 17.3836 11.4274 17.2781C11.2696 17.1726 11.1465 17.0227 11.0739 16.8473C11.0012 16.6719 10.9822 16.4789 11.0192 16.2926C11.0563 16.1064 11.1477 15.9354 11.282 15.8011C11.4162 15.6669 11.5873 15.5754 11.7735 15.5384C11.9597 15.5013 12.1527 15.5204 12.3281 15.593C12.5036 15.6657 12.6535 15.7887 12.759 15.9466C12.8645 16.1045 12.9208 16.2901 12.9208 16.4799C12.9208 16.7345 12.8196 16.9787 12.6396 17.1587C12.4596 17.3388 12.2154 17.4399 11.9608 17.4399Z"
                  fill="#E90000"
                />
              </svg>
            </div>
          )}
        </div>
        <Button variant="primary" size="large" label="Search" />
      </form>
    </div>
  );
}

export default SearchBar;
