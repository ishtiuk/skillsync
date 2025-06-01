import * as React from 'react';

import { cn } from '@/lib/utils';
import { Tag } from '../tag';

const colorVariants = {
  blue: 'bg-blue-b-400 text-blue-b-100',
  green: 'bg-primary-g-500 text-primary-g-100',
  orange: 'bg-orange-o-400 text-orange-o-100',
  purple: 'bg-purple-p-500 text-purple-p-100',
  red: 'bg-red-r-500 text-red-r-100',
  yellow: 'bg-yellow-y-500 text-yellow-y-100'
};

const jobNoteTagCategories = {
  'building-paths': colorVariants['green'],
  'write-your-story': colorVariants['blue'],
  'prep-talk': colorVariants['purple'],
  'skill-building': colorVariants['red'],
  'the-search': colorVariants['orange'],
  'growth-mindset': colorVariants['yellow']
};

const jobNoteTagCategoryLabelMap: Record<
  keyof typeof jobNoteTagCategories,
  string
> = {
  'building-paths': 'Building Paths',
  'write-your-story': 'Write Your Story',
  'prep-talk': 'Prep Talk',
  'skill-building': 'Skill Building',
  'the-search': 'The Search',
  'growth-mindset': 'Growth Mindset'
};

export interface JobNoteTagProps extends React.HTMLAttributes<HTMLDivElement> {
  category: keyof typeof jobNoteTagCategories;
}

function JobNoteTag({ className, category, ...props }: JobNoteTagProps) {
  return (
    <Tag
      className={cn(jobNoteTagCategories[category], className)}
      {...props}
      label={jobNoteTagCategoryLabelMap[category]}
      TypographyProps={{ variant: 'caption-strong' }}
    />
  );
}

export { JobNoteTag };
