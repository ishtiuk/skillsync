import { Button } from '@workspace/ui/components/button';
import { Job } from '@workspace/ui/components/jobs-table/types';
import {
  PathwayCard,
  PathwayCardType
} from '@workspace/ui/components/pathway-card/PathwayCard';
import { Typography } from '@workspace/ui/components/typography';
import { PhosphorIcon } from '@workspace/ui/icons/PhosphorIcon';
import { cn } from '@workspace/ui/lib/utils';
import { ReactElement } from 'react';

// TODO: find different way to parse responsive widths, this is not compatible with tailwind
const PATHWAY_CARD_WIDTH = 167;
const CARD_MAP = {
  lg: `${2 * PATHWAY_CARD_WIDTH}px`,
  xl: 3 * PATHWAY_CARD_WIDTH,
  '2xl': `${4 * PATHWAY_CARD_WIDTH}px`
};

type ExploreSectionProps = {
  jobs?: Job[];
};
const mediaQueryMaxWidth = `lg:max-w-[${CARD_MAP['lg']}] xl:max-w-[${CARD_MAP['xl']}] 2xl:max-w-[${CARD_MAP['2xl']}]`;
export default function ExploreSection({
  jobs
}: ExploreSectionProps): ReactElement {
  // const viewportWidth = window.innerWidth;
  // console.log(viewportWidth)
  // const maxWidth = 1440 - 88;
  // TODO: grab available jobs by category

  console.log('ExploreSection', jobs);

  const categoryJobs = [
    {
      variant: 'agriculture',
      jobs:
        jobs?.filter(job => job.industry?.toLowerCase() === 'agriculture')
          .length || 0
    },
    {
      variant: 'conservation',
      jobs:
        jobs?.filter(job => job.industry?.toLowerCase() === 'conservation')
          .length || 0
    },
    {
      variant: 'construction',
      jobs:
        jobs?.filter(job => job.industry?.toLowerCase() === 'construction')
          .length || 0
    },
    {
      variant: 'education',
      jobs:
        jobs?.filter(job => job.industry?.toLowerCase() === 'education')
          .length || 0
    },
    {
      variant: 'energy',
      jobs:
        jobs?.filter(job => job.industry?.toLowerCase() === 'energy').length ||
        0
    },
    {
      variant: 'finance',
      jobs:
        jobs?.filter(job => job.industry?.toLowerCase() === 'finance').length ||
        0
    },
    {
      variant: 'forestry',
      jobs:
        jobs?.filter(job => job.industry?.toLowerCase() === 'forestry')
          ?.length || 0
    },
    {
      variant: 'manufacturing',
      jobs:
        jobs?.filter(job => job.industry?.toLowerCase() === 'manufacturing')
          .length || 0
    },
    {
      variant: 'medical',
      jobs:
        jobs?.filter(job => job.industry?.toLowerCase() === 'medical')
          ?.length || 0
    },
    {
      variant: 'policy',
      jobs:
        jobs?.filter(job => job.industry?.toLowerCase() === 'policy')?.length ||
        0
    },
    {
      variant: 'real-estate',
      jobs:
        jobs?.filter(job => job.industry?.toLowerCase() === 'real-estate')
          ?.length || 0
    },
    {
      variant: 'research',
      jobs:
        jobs?.filter(job => job.industry?.toLowerCase() === 'research')
          ?.length || 0
    },
    {
      variant: 'sports',
      jobs:
        jobs?.filter(job => job.industry?.toLowerCase() === 'sports')?.length ||
        0
    },
    {
      variant: 'technology',
      jobs:
        jobs?.filter(job => job.industry?.toLowerCase() === 'technology')
          ?.length || 0
    },
    {
      variant: 'tourism',
      jobs:
        jobs?.filter(job => job.industry?.toLowerCase() === 'tourism')
          ?.length || 0
    },
    {
      variant: 'transportation',
      jobs:
        jobs?.filter(job => job.industry?.toLowerCase() === 'transportation')
          ?.length || 0
    },
    {
      variant: 'urban-planning',
      jobs:
        jobs?.filter(job => job.industry?.toLowerCase() === 'urban-planning')
          ?.length || 0
    },
    {
      variant: 'water',
      jobs:
        jobs?.filter(job => job.industry?.toLowerCase() === 'water')?.length ||
        0
    },
    {
      variant: 'waste-management',
      jobs:
        jobs?.filter(job => job.industry?.toLowerCase() === 'waste-management')
          ?.length || 0
    },
    {
      variant: 'arts-culture',
      jobs:
        jobs?.filter(job => job.industry?.toLowerCase() === 'arts & culture')
          ?.length || 0
    }
  ];

  // `2xl:max-w-[${CARD_MAP['2xl']}px]`, `xl:max-w-[${CARD_MAP['xl']}px]`, `lg:max-w-[${CARD_MAP['lg']}]px` '2xl:max-w-[735px]' `max-w-[${maxWidth}px]`
  return (
    <div
      className={cn(
        'p-12 pr-0 bg-neutral-n-200 flex justify-between overflow-hidden shrink'
      )}
    >
      <div className="w-[350px] flex flex-col gap-6">
        <Typography variant="heading-sm" className="w-[258px] text-wrap">
          Discover various paths to help you find your climate space.
        </Typography>
        <div>
          <Button
            size="default"
            variant="tertiary"
            label="Explore Jobs"
            rightIcon="ArrowCircleRight_fill"
            onClick={() => (window.location.href = '/jobs')}
          />
        </div>
      </div>

      <div className={`flex gap-4 overflow-x-auto max-w-[700px] pb-2`}>
        {categoryJobs.map(type => (
          <PathwayCard
            key={type.variant}
            jobs={type.jobs || 0}
            url={`/jobs?pathway=${type.variant}`}
            variant={type.variant as PathwayCardType}
          />
        ))}
      </div>
    </div>
  );
}
