import { cn } from '@/lib/utils';
import { Tag } from '../../tag/Tag';
import { Typography } from '../../typography';
import {
  WarningIcon,
  WarningDiamondIcon,
  CheckCircleIcon,
  InfoIcon,
  FlagIcon,
  HeartIcon
} from '../../../icons/index';

const colorVariants = {
  blue: 'bg-blue-b-100 border-blue-b-100 text-blue-b-500',
  green: 'bg-primary-g-100 border-primary-g-100 text-primary-g-500',
  neutral: 'bg-neutral-n-100 border-neutral-n-100 text-neutral-n-700',
  orange: 'bg-orange-o-100 border-orange-o-100 text-orange-o-500',
  purple: 'bg-purple-p-100 border-purple-p-100 text-purple-p-500',
  red: 'bg-red-r-100 border-red-r-100 text-red-r-600'
};

const badgeTypes = {
  critical: colorVariants['red'],
  warning: colorVariants['orange'],
  success: colorVariants['green'],
  neutral: colorVariants['neutral'],
  feature: colorVariants['blue'],
  BIPOCOwned: colorVariants['purple']
};

const BadgeTypeLabelMap: Record<keyof typeof badgeTypes, string> = {
  critical: 'Critical',
  warning: 'Warning',
  success: 'Success',
  neutral: 'Neutral',
  feature: 'Feature',
  BIPOCOwned: 'BIPOC Owned'
};

const badgeTypeIconsMap: Record<keyof typeof badgeTypes, JSX.Element> = {
  critical: <WarningIcon size={18} />,
  warning: <WarningDiamondIcon size={18} />,
  success: <CheckCircleIcon size={20} />,
  neutral: <InfoIcon size={18} />,
  feature: <FlagIcon size={18} />,
  BIPOCOwned: <HeartIcon size={18} />
};

export interface BadgeTagProps extends React.HTMLAttributes<HTMLDivElement> {
  variant: keyof typeof badgeTypes;
  minimaze?: boolean;
  className?: string;
  text: string;
}
function Badge({
  className,
  variant,
  minimaze,
  text,
  ...props
}: BadgeTagProps) {
  return (
    <Tag
      className={cn(
        badgeTypes[variant],
        className,
        'border-2 rounded-[23px] py-1 px-2',
        cn(minimaze === true ? 'gap-0' : 'gap-1')
      )}
      {...props}
      minimaze={minimaze}
      TypographyProps={{ variant: 'caption-strong' }}
    >
      {minimaze ? null : <div>{badgeTypeIconsMap[variant]}</div>}
      <Typography variant="caption" className="font-bold">
        {text}
      </Typography>
    </Tag>
  );
}

export { Badge };
