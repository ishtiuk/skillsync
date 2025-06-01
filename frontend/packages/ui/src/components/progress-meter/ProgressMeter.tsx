import { Circular } from './Circular';
import { ProgressLinear } from './ProgressLinear';
import { ProgressMeterSteps } from './ProgressMeterSteps';

const colorVariants = {
  orange:
    'bg-blue-b-200 border-blue-b-200 text-blue-b-700 hover:bg-blue-b-100 hover:text-blue-b-700 hover:border-blue-b-300',
  blue: 'bg-purple-p-700 border-purple-p-700 text-purple-p-100 hover:bg-purple-p-500 hover:text-purple-p-100 hover:border-purple-p-700',
  green:
    'bg-primary-g-200 border-primary-g-200 text-primary-g-700 hover:bg-primary-g-100 hover:text-primary-g-700 hover:border-primary-g-200',
  purple:
    'bg-neutral-n-300 border-neutral-n-300 text-neutral-n-800 hover:bg-neutral-n-200 hover:text-neutral-n-800 hover:border-neutral-n-400'
};

const industryTypes = {
  interviewing: colorVariants['orange'],
  networking: colorVariants['blue'],
  compensation: colorVariants['green'],
  organization: colorVariants['purple']
};

export interface IndustryTagProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof industryTypes;
  percentage?: number;
}
function ProgressMeter({
  variant,
  percentage = 25,
  ...props
}: IndustryTagProps) {
  return (
    <div>
      <div className="flex items-center justify-start mb-4 gap-2">
        <Circular variant="organization" size="96px" percentage={percentage} />
        <Circular variant="organization" size="48px" percentage={percentage} />
      </div>
      <div className="mb-4">
        <ProgressLinear percentage={percentage} variant={variant} />
      </div>
      <div className="mb-4">
        <ProgressMeterSteps
          percentage={percentage}
          variant={variant}
          steps={2}
        />
      </div>
      <div className="mb-4">
        <ProgressMeterSteps
          percentage={percentage}
          variant={variant}
          steps={3}
        />
      </div>
      <div className="mb-4">
        <ProgressMeterSteps
          percentage={percentage}
          variant={variant}
          steps={4}
        />
      </div>
    </div>
  );
}

export { ProgressMeter };
