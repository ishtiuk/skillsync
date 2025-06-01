import React from 'react';
import Image from 'next/image';
import { Typography } from '@workspace/ui/components/typography';

type EmptyStateProps = {
  title: string;
  imageUrl?: string;
  description: string;
  callToAction?: string | React.ReactNode | React.ReactElement;
};

const EmptyState = ({
  title,
  imageUrl,
  description,
  callToAction
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-centerspace-y-4 py-8 text-center text-neutral-n-500">
      <Image
        width={135}
        height={162}
        className="mb-4"
        alt="Empty state"
        src={imageUrl || '/images/empty-state-experiences.svg'}
      />
      <Typography variant="body-strong" className="mb-2 text-neutral-n-800">
        {title}
      </Typography>
      <Typography variant="caption" className="mb-4 text-neutral-n-800 w-[30%]">
        {description}
      </Typography>
      {callToAction && <div>{callToAction}</div>}
    </div>
  );
};

export default EmptyState;
