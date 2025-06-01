import { cn } from '@/lib/utils';
import { Tag } from '../tag/Tag';
import { Typography } from '../typography';
import {
  AtomIcon,
  NotebookIcon,
  PlaceholderIcon,
  PiggyBankIcon,
  GraduationCapIcon,
  FolderIcon,
  EditIcon,
  NutIcon,
  UsersIcon,
  ChartLineIcon,
  PaletteIcon,
  KanbanIcon
} from '../../icons/index';

export type JobCategory =
  | 'software-engineering'
  | 'supply-chain'
  | 'HR'
  | 'advocacy-policy'
  | 'climate-sustainability'
  | 'investment'
  | 'sales-account-management'
  | 'content'
  | 'marketing-design'
  | 'product'
  | 'data'
  | 'education'
  | 'finance-legal-compliance'
  | 'operations-program-management-strategy'
  | 'science';

export const industryTypeLabelMap: Record<JobCategory, string> = {
  'software-engineering': 'Software Engineering',
  'supply-chain': 'Supply Chain',
  HR: 'People, Administration, HR, & Recruitment',
  'advocacy-policy': 'Advocacy & Policy',
  'climate-sustainability': 'Climate & Sustainability',
  investment: 'Investment',
  'sales-account-management': 'Sales & Account Management',
  content: 'Content',
  'marketing-design': 'Marketing & Design',
  product: 'Product',
  data: 'Data',
  education: 'Education',
  'finance-legal-compliance': 'Finance, Legal, & Compliance',
  'operations-program-management-strategy':
    'Operations, Program/Project Management & Strategy',
  science: 'Science'
};

const industryTypeIconsMap: Record<JobCategory, JSX.Element> = {
  'software-engineering': <NutIcon size={16} />,
  'supply-chain': <PlaceholderIcon size={16} />,
  HR: <UsersIcon size={16} />,
  'advocacy-policy': <NotebookIcon size={16} />,
  'climate-sustainability': <PlaceholderIcon size={16} />,
  investment: <ChartLineIcon size={16} />,
  'sales-account-management': <PlaceholderIcon size={16} />,
  content: <EditIcon size={16} />,
  'marketing-design': <PaletteIcon size={16} />,
  product: <FolderIcon size={16} />,
  data: <PlaceholderIcon size={16} />,
  education: <GraduationCapIcon size={16} />,
  'finance-legal-compliance': <PiggyBankIcon size={16} />,
  'operations-program-management-strategy': <KanbanIcon size={16} />,
  science: <AtomIcon size={16} />
};

export interface IndustryTagProps extends React.HTMLAttributes<HTMLDivElement> {
  variant: JobCategory;
  minimaze?: boolean;
  truncate?: boolean;
}
function JobCategoryTag({
  className,
  variant,
  minimaze,
  truncate = true,
  ...props
}: IndustryTagProps) {
  return (
    <Tag
      className={cn(
        className,
        'border-2 border-neutral-n-200',
        cn(
          minimaze === true ? 'gap-0' : 'gap-1',
          truncate === true ? 'max-w-[150px]' : ''
        )
      )}
      {...props}
      minimaze={minimaze}
      TypographyProps={{ variant: 'caption-strong' }}
    >
      <div className="w-[16px]">{industryTypeIconsMap[variant]}</div>
      {minimaze ? null : (
        <Typography variant="caption" className="font-medium truncate">
          {industryTypeLabelMap[variant]}
        </Typography>
      )}
    </Tag>
  );
}

export { JobCategoryTag };
