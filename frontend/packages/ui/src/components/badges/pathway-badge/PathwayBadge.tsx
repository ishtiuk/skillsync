import { cn } from '@/lib/utils';
import { Tag } from '../../tag/Tag';
import { IconVariant, PhosphorIcon } from '@/icons/PhosphorIcon';

const colorVariants = {
  blue: 'bg-blue-b-200 border-blue-b-200 text-blue-b-700',
  'dark-purple': 'bg-purple-p-700 border-purple-p-700 text-purple-p-100',
  green: 'bg-primary-g-200 border-primary-g-200 text-primary-g-700',
  neutral: 'bg-neutral-n-300 border-neutral-n-300 text-neutral-n-800',
  orange: 'bg-orange-o-200 border-orange-o-200 text-orange-o-700',
  purple: 'bg-purple-p-200 border-purple-p-200 text-purple-p-700',
  red: 'bg-red-r-200 border-red-r-200 text-red-r-700',
  yellow: 'bg-yellow-y-200 border-yellow-y-200 text-yellow-y-700'
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

const industryTypeIconsMap: Record<keyof typeof industryTypes, IconVariant> = {
  conservation: 'Mountains_fill',
  agriculture: 'Carrot_fill',
  energy: 'Lightning_fill',
  education: 'Books_fill',
  construction: 'Barricade_fill',
  finance: 'Bank_fill',
  forestry: 'Tree_fill',
  manufacturing: 'Warehouse_fill',
  'arts & culture': 'Palette_fill',
  'real-estate': 'HouseLine_fill',
  medical: 'FirstAidKit_fill',
  policy: 'Notebook_fill',
  research: 'Flask_fill',
  sports: 'Basketball_fill',
  tourism: 'Bridge_fill',
  transportation: 'CarProfile_fill',
  technology: 'Circuitry_fill',
  'urban-planning': 'Buildings_fill',
  'waste-management': 'Trash_fill',
  water: 'Drop_fill',
  media: 'Television_fill'
};

export interface IndustryTagProps extends React.HTMLAttributes<HTMLDivElement> {
  variant: keyof typeof industryTypes;
  className?: string;
}
function PathwayBadge({ className, variant, ...props }: IndustryTagProps) {
  return (
    <Tag
      className={cn(
        industryTypes[variant],
        className,
        'border-0 w-6 h-6 flex-inline items-center justify-center rounded gap-0 p-1 text-center'
      )}
      {...props}
      minimaze={true}
      TypographyProps={{ variant: 'caption-strong' }}
    >
      <PhosphorIcon iconVariant={industryTypeIconsMap[variant]} size={16} />
    </Tag>
  );
}

export { PathwayBadge };
