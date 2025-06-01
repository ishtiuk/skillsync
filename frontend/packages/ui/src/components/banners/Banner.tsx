import { cn } from '@/lib/utils';
import { Typography } from '../typography/Typography';
import {
  WarningIcon,
  WarningDiamondIcon,
  CheckCircleIcon,
  InfoIcon,
  FlagIcon
} from '../../icons/index';
import { Button } from '../button/Button';

const colorVariants = {
  blue: 'bg-blue-b-200 border-blue-b-200 text-primary-g-800 fill-primary-g-800 hover:fill-white duration-200',
  green:
    'bg-primary-g-200 border-primary-g-200 text-primary-g-700 fill-primary-g-700 hover:fill-primary-g-400 duration-200',
  neutral:
    'bg-neutral-n-300 border-neutral-n-300 text-neutral-n-800 fill-neutral-n-800 hover:fill-white duration-200',
  orange:
    'bg-orange-o-200 border-orange-o-200 text-orange-o-700 fill-orange-o-700 hover:fill-white duration-200',
  red: 'bg-red-r-200 border-red-r-200 text-red-r-800 fill-red-r-800 hover:fill-red-r-400 duration-200'
};

const industryTypes = {
  critical: colorVariants['red'],
  warning: colorVariants['orange'],
  success: colorVariants['green'],
  neutral: colorVariants['neutral'],
  feature: colorVariants['blue']
};

const bgIconBox = {
  critical: 'bg-red-r-100',
  warning: 'bg-orange-o-200',
  success: 'bg-primary-g-200',
  neutral: 'bg-neutral-n-300',
  feature: 'bg-blue-b-200'
};

const industryTypeIconsMap: Record<keyof typeof industryTypes, JSX.Element> = {
  critical: <WarningIcon size={24} color="#5C0000" />,
  warning: <WarningDiamondIcon size={24} color="#7A2900" />,
  success: <CheckCircleIcon size={24} color="#0E5249" />,
  neutral: <InfoIcon size={24} color="#000000" />,
  feature: <FlagIcon size={24} color="#072924" />
};

export interface IndustryTagProps extends React.HTMLAttributes<HTMLDivElement> {
  variant: keyof typeof industryTypes;
  title?: string;
  text?: string;
  onClose?: () => void;
  onUpgrade?: () => void;
  btn?: boolean;
  className?: string;
}
function Banner({
  className,
  variant = 'neutral',
  title,
  text,
  onUpgrade,
  onClose,
  btn,
  ...props
}: IndustryTagProps) {
  return (
    <div
      className={cn(
        industryTypes[variant],
        className,
        'max-w-[578px] w-[578px] max-h-[84px] h-full py-4 px-11 flex items-center justify-between gap-6'
      )}
      {...props}
    >
      <div className="flex items-center gap-4 w-full">
        <div
          className={cn(
            'w-[32px] h-[32px] flex items-center justify-center rounded-[8px] p-1 basis-8'
          )}
        >
          {industryTypeIconsMap[variant]}
        </div>
        <div className="max-w-72 w-full min-w-60 flex flex-col justify-center">
          <Typography variant="body-strong">{title}</Typography>
          {text && (
            <Typography variant="body" className="truncate">
              {text}
            </Typography>
          )}
        </div>
      </div>
      <div className="flex justify-center items-center gap-4">
        {btn ? (
          <div>
            <Button
              label="Upgrade"
              className={cn(
                variant === 'neutral' ? 'text-black' : 'text-primary-g-700',
                'bg-white  font-bold h-11'
              )}
              variant="tertiary"
              size="default"
              onClick={onUpgrade}
            />
          </div>
        ) : null}
        <div onClick={onClose} className="cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className={cn(industryTypes[variant])}
          >
            <path d="M17.7465 16.5349C17.9074 16.6958 17.9979 16.9141 17.9979 17.1417C17.9979 17.3694 17.9074 17.5877 17.7465 17.7486C17.5855 17.9096 17.3672 18 17.1396 18C16.912 18 16.6937 17.9096 16.5327 17.7486L11.9996 13.2141L7.46515 17.7472C7.30419 17.9081 7.08589 17.9986 6.85826 17.9986C6.63064 17.9986 6.41234 17.9081 6.25138 17.7472C6.09042 17.5862 6 17.3679 6 17.1403C6 16.9127 6.09042 16.6944 6.25138 16.5334L10.7859 12.0004L6.25281 7.46586C6.09185 7.30491 6.00143 7.0866 6.00143 6.85898C6.00143 6.63135 6.09185 6.41305 6.25281 6.25209C6.41376 6.09114 6.63207 6.00071 6.85969 6.00071C7.08732 6.00071 7.30562 6.09114 7.46658 6.25209L11.9996 10.7866L16.5341 6.25138C16.6951 6.09042 16.9134 6 17.141 6C17.3686 6 17.5869 6.09042 17.7479 6.25138C17.9089 6.41234 17.9993 6.63064 17.9993 6.85826C17.9993 7.08589 17.9089 7.30419 17.7479 7.46515L13.2134 12.0004L17.7465 16.5349Z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export { Banner };
