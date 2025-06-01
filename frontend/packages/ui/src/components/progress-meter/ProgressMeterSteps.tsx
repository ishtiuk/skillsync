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

export interface ProgressMeterStepsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof circularTypes;
  percentage: number;
  steps: number;
}
function ProgressMeterSteps({
  percentage,
  variant = 'networking',
  steps,
  ...props
}: ProgressMeterStepsProps) {
  return (
    <div className="flex flex-col items-start justify-start w-[252px] gap-1">
      <div className="flex items-center justify-between gap-2 w-full">
        {steps === 1 && (
          <>
            <div className="shadow w-full bg-neutral-n-200 rounded-full">
              <div
                className={cn(
                  circularTypes[variant],
                  '!h-[6px] block shadow rounded-full transition-all'
                )}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </>
        )}
        {steps === 2 && (
          <>
            <div className="w-full bg-neutral-n-200 rounded-full">
              <div
                className={cn(
                  circularTypes[variant],
                  '!h-[6px] block rounded-full transition-all'
                )}
                style={{
                  width: `${percentage < 50 ? percentage * 1.9 : 100}%`
                }}
              ></div>
            </div>
            <div className="w-full bg-neutral-n-200 rounded-full">
              <div
                className={cn(
                  circularTypes[variant],
                  '!h-[6px] block rounded-full transition-all'
                )}
                style={{ width: `${percentage > 50 ? percentage : 0}%` }}
              ></div>
            </div>
          </>
        )}
        {steps === 3 && (
          <>
            <div className="w-full bg-neutral-n-200 rounded-full">
              <div
                className={cn(
                  circularTypes[variant],
                  '!h-[6px] block rounded-full transition-all'
                )}
                style={{
                  width: `${(percentage <= 33 && percentage * 3) || (percentage > 33 && 100)}%`
                }}
              ></div>
            </div>
            <div className="w-full bg-neutral-n-200 rounded-full">
              <div className="!h-[6px] block rounded-full">
                {percentage < 33 && (
                  <span
                    className={cn(
                      circularTypes[variant],
                      'rounded-full h-[6px] block transition-all'
                    )}
                    style={{
                      width: `0%`
                    }}
                  ></span>
                )}
                {percentage > 66 && (
                  <span
                    className={cn(
                      circularTypes[variant],
                      'rounded-full h-[6px] block'
                    )}
                    style={{
                      width: `100%`
                    }}
                  ></span>
                )}
                {percentage > 33 && percentage < 66 && (
                  <span
                    className={cn(
                      circularTypes[variant],
                      'rounded-full h-[6px] block'
                    )}
                    style={{
                      width: `${percentage / 2}%`
                    }}
                  ></span>
                )}
              </div>
            </div>
            <div className="w-full bg-neutral-n-200 rounded-full">
              <div className="!h-[6px] block rounded-full">
                {percentage < 66 && (
                  <span
                    className={cn(
                      circularTypes[variant],
                      'rounded-full h-[6px] block transition-all'
                    )}
                    style={{
                      width: `0%`
                    }}
                  ></span>
                )}
                {percentage > 66 && percentage < 95 && (
                  <span
                    className={cn(
                      circularTypes[variant],
                      'rounded-full h-[6px] block'
                    )}
                    style={{
                      width: `${percentage / 1.4}%`
                    }}
                  ></span>
                )}
                {percentage > 95 && (
                  <span
                    className={cn(
                      circularTypes[variant],
                      'rounded-full h-[6px] block'
                    )}
                    style={{
                      width: `${percentage}%`
                    }}
                  ></span>
                )}
              </div>
            </div>
          </>
        )}
        {steps === 4 && (
          <>
            <div className="w-full bg-neutral-n-200 rounded-full">
              <div className="!h-[6px] block rounded-full">
                {percentage >= 25 && (
                  <span
                    className={cn(
                      circularTypes[variant],
                      'rounded-full h-[6px] block'
                    )}
                    style={{
                      width: `100%`
                    }}
                  ></span>
                )}
                {percentage < 25 && (
                  <span
                    className={cn(
                      circularTypes[variant],
                      'rounded-full h-[6px] block'
                    )}
                    style={{
                      width: `${percentage * 4}%`
                    }}
                  ></span>
                )}
              </div>
            </div>
            <div className="w-full bg-neutral-n-200 rounded-full">
              <div className="!h-[6px] block rounded-full">
                {percentage < 26 && (
                  <span
                    className={cn(
                      circularTypes[variant],
                      'rounded-full h-[6px] block transition-all'
                    )}
                    style={{
                      width: `0%`
                    }}
                  ></span>
                )}
                {percentage >= 50 && (
                  <span
                    className={cn(
                      circularTypes[variant],
                      'rounded-full h-[6px] block'
                    )}
                    style={{
                      width: `100%`
                    }}
                  ></span>
                )}
                {percentage > 25 && percentage < 50 && (
                  <span
                    className={cn(
                      circularTypes[variant],
                      'rounded-full h-[6px] block'
                    )}
                    style={{
                      width: `${percentage * 1.5}%`
                    }}
                  ></span>
                )}
              </div>
            </div>
            <div className="w-full bg-neutral-n-200 rounded-full">
              <div className="!h-[6px] block rounded-full">
                {percentage < 50 && (
                  <span
                    className={cn(
                      circularTypes[variant],
                      'rounded-full h-[6px] block transition-all'
                    )}
                    style={{
                      width: `0%`
                    }}
                  ></span>
                )}
                {percentage >= 75 && (
                  <span
                    className={cn(
                      circularTypes[variant],
                      'rounded-full h-[6px] block'
                    )}
                    style={{
                      width: `100%`
                    }}
                  ></span>
                )}
                {percentage > 50 && percentage < 75 && (
                  <span
                    className={cn(
                      circularTypes[variant],
                      'rounded-full h-[6px] block'
                    )}
                    style={{
                      width: `${percentage}%`
                    }}
                  ></span>
                )}
              </div>
            </div>
            <div className="w-full bg-neutral-n-200 rounded-full">
              <div className="!h-[6px] block rounded-full">
                {percentage < 75 && (
                  <span
                    className={cn(
                      circularTypes[variant],
                      'rounded-full h-[6px] block transition-all'
                    )}
                    style={{
                      width: `0%`
                    }}
                  ></span>
                )}
                {percentage > 75 && percentage < 95 && (
                  <span
                    className={cn(
                      circularTypes[variant],
                      'rounded-full h-[6px] block'
                    )}
                    style={{
                      width: `${percentage / 1.4}%`
                    }}
                  ></span>
                )}
                {percentage > 95 && (
                  <span
                    className={cn(
                      circularTypes[variant],
                      'rounded-full h-[6px] block'
                    )}
                    style={{
                      width: `${percentage}%`
                    }}
                  ></span>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      <div className="flex justify-start items-center gap-1 w-full">
        <Typography variant="caption">{percentage}%</Typography>
        <Typography variant="caption" className="text-neutral-n-600">
          Complete
        </Typography>
      </div>
    </div>
  );
}

export { ProgressMeterSteps };
