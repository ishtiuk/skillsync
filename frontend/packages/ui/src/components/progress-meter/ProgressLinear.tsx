import { cn } from '@/lib/utils';
import { Typography } from '../typography';

const colorVariants = {
  orange: 'bg-orange-o-500',
  blue: 'bg-blue-b-500',
  green: 'bg-primary-g-500',
  purple: 'bg-purple-p-500'
};

const circularTypes = {
  interviewing: colorVariants['orange'],
  networking: colorVariants['blue'],
  compensation: colorVariants['green'],
  organization: colorVariants['purple']
};

export interface ProgressLinearProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof circularTypes;
  size?: 'regular' | 'large';
  percentage: number;
}
function ProgressLinear({
  percentage,
  size = 'regular',
  variant = 'networking',
  ...props
}: ProgressLinearProps) {
  return (
    <div>
      <div className="flex flex-col items-start justify-start gap-2">
        <div className="w-full bg-neutral-n-200 rounded-full">
          <div
            className={cn(
              circularTypes[variant],
              `${size === 'large' ? '!h-[24px]' : '!h-[6px]'} block rounded-full`
            )}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        {/* <div className="flex justify-start items-center gap-2 w-full">
          <Typography variant="caption">{percentage}%</Typography>
          <Typography variant="caption" className="text-neutral-n-600">
            Complete
          </Typography>
        </div> */}
      </div>
    </div>
  );
}

export { ProgressLinear };
