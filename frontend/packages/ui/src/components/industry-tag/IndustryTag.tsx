import * as React from 'react';

import { cn } from '@/lib/utils';
import { Tag } from '../tag';

const colorVariants = {
  blue: 'bg-blue-b-200 border-blue-b-200 text-blue-b-700 hover:bg-blue-b-100 hover:text-blue-b-700 hover:border-blue-b-300',
  'dark-purple':
    'bg-purple-p-700 border-purple-p-700 text-purple-p-100 hover:bg-purple-p-500 hover:text-purple-p-100 hover:border-purple-p-700',
  green:
    'bg-primary-g-200 border-primary-g-200 text-primary-g-700 hover:bg-primary-g-100 hover:text-primary-g-700 hover:border-primary-g-300',
  neutral:
    'bg-neutral-n-300 border-neutral-n-300 text-neutral-n-800 hover:bg-neutral-n-200 hover:text-neutral-n-800 hover:border-neutral-n-400',
  orange:
    'bg-orange-o-200 border-orange-o-200 text-orange-o-700 hover:bg-orange-o-100 hover:text-orange-o-700 hover:border-orange-o-300',
  purple:
    'bg-purple-p-200 border-purple-p-200 text-purple-p-700 hover:bg-purple-p-100 hover:text-purple-p-700 hover:border-purple-p-300',
  red: 'bg-red-r-200 border-red-r-200 text-red-r-700 hover:bg-red-r-100 hover:text-red-r-700 hover:border-red-r-300',
  yellow:
    'bg-yellow-y-200 border-yellow-y-200 text-yellow-y-700 hover:bg-yellow-y-100 hover:text-yellow-y-700 hover:border-yellow-y-300'
};

export const industryTypes = {
  education: colorVariants['red'],
  engineering: colorVariants['neutral'],
  energy: colorVariants['yellow'],
  finance: colorVariants['green'],
  manufacturing: colorVariants['orange'],
  operations: colorVariants['blue'],
  policy: colorVariants['purple'],
  research: colorVariants['blue'],
  transportation: colorVariants['green'],
  media: colorVariants['red'],
  agriculture: colorVariants['green'],
  conservation: colorVariants['blue'],
  construction: colorVariants['orange'],
  forestry: colorVariants['green'],
  'waste-management': colorVariants['green'],
  tourism: colorVariants['red'],
  other: colorVariants['neutral'],
  legal: colorVariants['purple'],
  'bipoc-owned': colorVariants['dark-purple'],
  sports: colorVariants['blue']
};

export type IndustryType = keyof typeof industryTypes;

const industryTypeLabelMap: Record<IndustryType, string> = {
  education: 'Education',
  engineering: 'Engineering',
  energy: 'Energy',
  finance: 'Finance',
  manufacturing: 'Manufacturing',
  operations: 'Operations',
  policy: 'Policy',
  research: 'Research',
  transportation: 'Transportation',
  media: 'Media',
  agriculture: 'Agriculture',
  conservation: 'Conservation',
  construction: 'Construction',
  forestry: 'Forestry',
  'waste-management': 'Waste Management',
  tourism: 'Tourism',
  other: 'Other',
  legal: 'Legal',
  'bipoc-owned': 'BIPOC Owned',
  sports: 'Sports'
};

export interface IndustryTagProps extends React.HTMLAttributes<HTMLDivElement> {
  industryType: IndustryType;
}

function IndustryTag({ className, industryType, ...props }: IndustryTagProps) {
  return (
    <Tag
      className={cn(
        industryTypes[industryType],
        className,
        'border-2 tracking-[-0.28px]'
      )}
      {...props}
      label={industryTypeLabelMap[industryType]}
      TypographyProps={{ variant: 'caption-strong' }}
    />
  );
}

export { IndustryTag };
