import { cn } from '@/lib/utils';
import { Tag } from '../tag/Tag';
import { Typography } from '../typography';
import {
  BooksIcon,
  EnergyIcon,
  BankIcon,
  NotebookIcon,
  BarricadeIcon,
  BridgeIcon,
  PlaceholderIcon,
  MountainsIcon,
  AgricultureIcon,
  ForestryIcon,
  WarehouseIcon,
  BuildingIcon,
  MedicalIcon,
  FlaskIcon,
  SportsIcon,
  CircuitryIcon,
  HouseIcon,
  CarIcon,
  TrashIcon,
  DropIcon,
  MediaIcon
} from '../../icons/index';

const colorVariants = {
  blue: 'bg-blue-b-200 border-blue-b-200 text-blue-b-700 hover:bg-blue-b-100 hover:text-blue-b-700 hover:border-blue-b-300',
  'dark-purple':
    'bg-purple-p-700 border-purple-p-700 text-purple-p-100 hover:bg-purple-p-500 hover:text-purple-p-100 hover:border-purple-p-700',
  green:
    'bg-primary-g-200 border-primary-g-200 text-primary-g-700 hover:bg-primary-g-100 hover:text-primary-g-700 hover:border-primary-g-200',
  neutral:
    'bg-neutral-n-300 border-neutral-n-300 text-neutral-n-800 hover:bg-neutral-n-200 hover:text-neutral-n-800 hover:border-neutral-n-400',
  orange:
    'bg-orange-o-200 border-orange-o-200 text-orange-o-700 hover:bg-orange-o-100 hover:text-orange-o-700 hover:border-orange-o-200',
  purple:
    'bg-purple-p-200 border-purple-p-200 text-purple-p-700 hover:bg-purple-p-100 hover:text-purple-p-700 hover:border-purple-p-300',
  red: 'bg-red-r-200 border-red-r-200 text-red-r-700 hover:bg-red-r-100 hover:text-red-r-700 hover:border-red-r-300',
  yellow:
    'bg-yellow-y-200 border-yellow-y-200 text-yellow-y-700 hover:bg-yellow-y-100 hover:text-yellow-y-700 hover:border-yellow-y-300'
};

export const industryTypes = {
  conservation: colorVariants['blue'],
  energy: colorVariants['yellow'],
  agriculture: colorVariants['green'],
  education: colorVariants['red'],
  construction: colorVariants['orange'],
  finance: colorVariants['green'],
  forestry: colorVariants['green'],
  manufacturing: colorVariants['orange'],
  'arts & culture': colorVariants['purple'],
  'real-estate': colorVariants['red'],
  medical: colorVariants['red'],
  policy: colorVariants['purple'],
  research: colorVariants['blue'],
  sports: colorVariants['blue'],
  technology: colorVariants['yellow'],
  tourism: colorVariants['red'],
  transportation: colorVariants['green'],
  'urban-planning': colorVariants['orange'],
  'waste-management': colorVariants['green'],
  water: colorVariants['blue'],
  media: colorVariants['red']
};

export const industryTypeLabelMap: Record<keyof typeof industryTypes, string> =
  {
    conservation: 'Conservation',
    agriculture: 'Agriculture',
    energy: 'Energy',
    education: 'Education',
    construction: 'Construction',
    finance: 'Finance',
    forestry: 'Forestry',
    manufacturing: 'Manufacturing',
    'arts & culture': 'Arts & Culture',
    'real-estate': 'Real Estate',
    medical: 'Medical',
    policy: 'Policy',
    research: 'Research',
    sports: 'Sports',
    tourism: 'Tourism',
    transportation: 'Transport',
    technology: 'Technology',
    'urban-planning': 'Urban Planning',
    'waste-management': 'Waste Management',
    water: 'Water',
    media: 'Media'
  };

const industryTypeIconsMap: Record<keyof typeof industryTypes, JSX.Element> = {
  conservation: <MountainsIcon size={20} />,
  agriculture: <AgricultureIcon size={20} />,
  energy: <EnergyIcon size={20} />,
  education: <BooksIcon size={20} />,
  construction: <BarricadeIcon size={20} />,
  finance: <BankIcon size={20} />,
  forestry: <ForestryIcon size={20} />,
  manufacturing: <WarehouseIcon size={20} />,
  'arts & culture': <PlaceholderIcon size={20} />,
  'real-estate': <HouseIcon size={20} />,
  medical: <MedicalIcon size={20} />,
  policy: <NotebookIcon size={20} />,
  research: <FlaskIcon size={20} />,
  sports: <SportsIcon size={20} />,
  tourism: <BridgeIcon size={20} />,
  transportation: <CarIcon size={20} />,
  technology: <CircuitryIcon size={20} />,
  'urban-planning': <BuildingIcon size={20} />,
  'waste-management': <TrashIcon size={20} />,
  water: <DropIcon size={20} />,
  media: <MediaIcon size={20} />
};

export interface IndustryTagProps extends React.HTMLAttributes<HTMLDivElement> {
  variant: keyof typeof industryTypes;
  minimaze?: boolean;
}
function PathwayTag({
  className,
  variant,
  minimaze,
  ...props
}: IndustryTagProps) {
  return (
    <Tag
      className={cn(
        industryTypes[variant],
        className,
        'border-2',
        cn(minimaze === true ? 'gap-0' : 'gap-1')
      )}
      {...props}
      minimaze={minimaze}
      TypographyProps={{ variant: 'caption-strong' }}
    >
      {industryTypeIconsMap[variant]}
      {minimaze ? null : (
        <Typography variant="caption" className="font-bold">
          {industryTypeLabelMap[variant]}
        </Typography>
      )}
    </Tag>
  );
}

export { PathwayTag };
