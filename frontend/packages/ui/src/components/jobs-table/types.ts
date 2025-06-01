import { Reaction } from '../emoji-reaction/types';
import { PhosphorIconProps } from '@/icons/PhosphorIcon';
import { industryTypes } from '../badges/pathway-badge/PathwayBadge';

// Types and Style Objects Shared by Table Components

const JobTypeLabelMap = {
  contract: 'Contract',
  full_time: 'Full Time',
  internship: 'Internship',
  part_time: 'Part Time',
  temporary: 'Temporary',
  volunteer: 'Volunteer'
};

const BadgeTypeLabelMap = {
  featured: 'Featured',
  bipoc: 'BIPOC Owned',
  closing: 'Closing Soon'
};

const WorkplaceTypeLabelMap = {
  remote: 'Remote',
  onsite: 'Onsite',
  hybrid: 'Hybrid'
};

// rough interface of a job and its details
interface Job {
  image?: string;
  title: string;
  company: string;
  lastEdited: number;
  reaction?: Reaction;
  is_favourite?: boolean;
  stage?: JobStage;
  jobId: string;
  hired?: boolean;
  stages: { [key: string]: boolean };
  jobType?: keyof typeof JobTypeLabelMap;
  industry?: keyof typeof industryTypes;
  badge?: keyof typeof BadgeTypeLabelMap;
  workplace?: keyof typeof WorkplaceTypeLabelMap;
}

// a user can mark a job as any of these stages
const JOB_STAGES = [
  'saved',
  'applied',
  'interview',
  'offer',
  'hired',
  'past-roles',
  'ineligible'
] as const;

type JobStage = (typeof JOB_STAGES)[number];

interface JobStageProps {
  iconProps: PhosphorIconProps;
  title: string;
  emptyState?: {
    title: string;
    className: string;
    description: string;
    iconVariant: string;
  };
}

// TODO: streamline this with migrateTo for centralized styling
// maps a job stage to certain styling properties used for section headers and dropdowns
const JOB_STAGE_STYLES: Record<JobStage, JobStageProps> = {
  saved: {
    iconProps: {
      iconVariant: 'BookmarkSimple_fill',
      className: 'fill-blue-b-400'
    },
    title: 'Saved',
    emptyState: {
      title: 'No jobs saved yet',
      iconVariant: 'BookmarkSimple_fill',
      className: 'bg-blue-b-500 fill-white',
      description:
        'Discover and find hundreds of jobs in Pathways! Save it and don’t forget it!'
    }
  },
  applied: {
    title: 'Applied',
    iconProps: {
      iconVariant: 'PaperPlaneTilt_fill',
      className: 'fill-purple-p-400'
    },
    emptyState: {
      title: 'No applied jobs yet!',
      iconVariant: 'PaperPlaneTilt_fill',
      className: 'bg-purple-p-500 fill-white',
      description:
        'When you apply for a job make sure to migrate your saved job to this section.'
    }
  },
  interview: {
    title: 'Interviewing',
    iconProps: {
      iconVariant: 'ChatCircleDots_fill',
      className: 'fill-orange-o-400'
    },
    emptyState: {
      title: 'No interviews here yet!',
      iconVariant: 'ChatCircleDots_fill',
      className: 'bg-orange-o-500 fill-white',
      description:
        'When have a job interview make sure to migrate it to this section.'
    }
  },
  offer: {
    title: 'Offers',
    iconProps: {
      iconVariant: 'SealCheck_fill',
      className: 'fill-primary-g-400'
    },
    emptyState: {
      title: 'No offers yet!',
      iconVariant: 'SealCheck_fill',
      className: 'bg-primary-g-500 fill-white',
      description: 'When have an offer make sure to migrate it to this section.'
    }
  },
  hired: {
    title: 'Hired',
    iconProps: {
      iconVariant: 'Confetti_fill',
      className: 'bg-gradient-rainbow-200 rounded-[4px]'
    },
    emptyState: {
      title: 'No hired jobs yet!',
      iconVariant: 'Confetti_fill',
      className: 'bg-gradient-rainbow-200 fill-black',
      description:
        'When you get hired make sure to migrate your job to this section.'
    }
  },
  'past-roles': {
    title: 'Past Roles',
    iconProps: {
      iconVariant: 'ClockCounterClockwise_bold',
      className: 'fill-yellow-y-400'
    },
    emptyState: {
      title: 'No past roles yet!',
      iconVariant: 'ClockCounterClockwise_bold',
      className: 'bg-yellow-y-500 fill-white',
      description:
        'When you have a past role make sure to migrate it to this section.'
    }
  },
  ineligible: {
    title: 'Ineligible',
    iconProps: {
      iconVariant: 'X_fill',
      className: 'fill-red-r-500'
    },
    emptyState: {
      title: 'No ineligible jobs yet!',
      iconVariant: 'X_fill',
      className: 'bg-red-r-500 fill-white',
      description:
        'When you have an ineligible job make sure to migrate it to this section.'
    }
  }
};

// the column labels for the jobs table
const COLUMN_TITLES = ['job', 'company', 'stage', 'activity', 'reaction'];
type HeaderSection = (typeof COLUMN_TITLES)[number];

// properties of a column label
type HeaderObject = {
  title: string;
  flexRatio: string;
  filters?: Array<FilterTypes>;
  style: string;
};

// TODO: implement filters for columns
type FilterTypes = 'time' | 'alpha';

const COLUMN_STYLES: Record<HeaderSection, HeaderObject> = {
  job: {
    title: 'Job Title',
    flexRatio: 'basis-[23.148%] grow-[1]',
    filters: ['alpha'],
    style: 'justify-between'
  },
  company: {
    title: 'Company',
    flexRatio: 'basis-[23.148%] grow-[1]',
    filters: ['alpha'],
    style: 'justify-between'
  },
  stage: {
    title: 'Stage',
    flexRatio: 'basis-[17.9%] grow-[1]',
    style: 'justify-start'
  },
  activity: {
    title: 'Activity',
    flexRatio: 'basis-[17.9%] grow-[1]',
    filters: ['time'],
    style: 'justify-center'
  },
  reaction: {
    title: 'Reaction',
    flexRatio: 'basis-[17.9%] grow-[1]',
    style: 'justify-center'
  }
};

export type { Job, JobStage };
export {
  JOB_STAGE_STYLES,
  COLUMN_STYLES,
  COLUMN_TITLES,
  JOB_STAGES,
  JobTypeLabelMap,
  BadgeTypeLabelMap,
  WorkplaceTypeLabelMap
};
