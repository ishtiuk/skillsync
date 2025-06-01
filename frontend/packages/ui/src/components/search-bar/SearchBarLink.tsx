import { useRef, useState } from 'react';
import { Typography } from '../typography';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export interface SearchBarLinkProps {
  id: string;
  title: string;
}

function SearchBarLink({ title, id, ...props }: SearchBarLinkProps) {
  const [blockItem, setBlockItem] = useState(true);

  function handleClick() {
    setBlockItem(false);
  }
  return (
    <Link
      href={`/home/${id}`}
      className={cn(
        blockItem === true
          ? 'cursor-pointer border-b-[1px] h-16 relative border-b-neutral-n-200 flex items-center justify-start relative py-3 pl-4 pr-10 w-full bg-white transition-all duration-200 hover:bg-neutral-n-100'
          : 'hidden'
      )}
    >
      <Typography variant="body" className="text-neutral-n-800">
        {title}
      </Typography>
      <div
        onClick={handleClick}
        className="absolute w-10 h-10 flex items-center justify-center rounded-full cursor-pointer  top-3 right-4 hover:bg-white transition-all duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M17.7465 16.5349C17.9074 16.6958 17.9979 16.9141 17.9979 17.1417C17.9979 17.3694 17.9074 17.5877 17.7465 17.7486C17.5855 17.9096 17.3672 18 17.1396 18C16.912 18 16.6937 17.9096 16.5327 17.7486L11.9996 13.2141L7.46515 17.7472C7.30419 17.9081 7.08589 17.9986 6.85826 17.9986C6.63064 17.9986 6.41234 17.9081 6.25138 17.7472C6.09042 17.5862 6 17.3679 6 17.1403C6 16.9127 6.09042 16.6944 6.25138 16.5334L10.7859 12.0004L6.25281 7.46586C6.09185 7.30491 6.00143 7.0866 6.00143 6.85898C6.00143 6.63135 6.09185 6.41305 6.25281 6.25209C6.41376 6.09114 6.63207 6.00071 6.85969 6.00071C7.08732 6.00071 7.30562 6.09114 7.46658 6.25209L11.9996 10.7866L16.5341 6.25138C16.6951 6.09042 16.9134 6 17.141 6C17.3686 6 17.5869 6.09042 17.7479 6.25138C17.9089 6.41234 17.9993 6.63064 17.9993 6.85826C17.9993 7.08589 17.9089 7.30419 17.7479 7.46515L13.2134 12.0004L17.7465 16.5349Z"
            fill="#0E5249"
          />
        </svg>
      </div>
    </Link>
  );
}

export default SearchBarLink;
