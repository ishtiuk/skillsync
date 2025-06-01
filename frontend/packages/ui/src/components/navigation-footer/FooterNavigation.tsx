import { Typography } from '../typography/Typography';
import { IconButton } from '../icon-button/IconButton';
import { cn } from '@/lib/utils';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../tooltip-2/Tooltip';

export interface LogoNavigationProps
  extends React.HTMLAttributes<HTMLDivElement> {
  collapsed?: boolean;
  onClick1: () => void;
  onClick2: () => void;
}
function FooterNavigation({
  collapsed = false,
  onClick1,
  onClick2,
  ...props
}: LogoNavigationProps) {
  return (
    <div
      {...props}
      className={cn(
        'w-full h-[72px] fill-navigation-btn-foreground absolute bottom-8 flex shrink-0 gap-2 items-center self-stretch px-8 pt-16 pb-8 border-t border-neutral-n-300',
        collapsed === true ? 'justify-center' : 'justify-between'
      )}
    >
      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-between items-center gap-4">
          {collapsed === false && (
            <Typography variant="caption-strong" className="whitespace-nowrap">
              Hide Navigation
            </Typography>
          )}

          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <IconButton
                    size="small"
                    onClick={onClick1}
                    variant={'tertiary'}
                    iconVariant={'SidebarSimple_bold'}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className={`relative ${!collapsed ? 'hidden' : ''}`}
              >
                <Typography variant="caption">
                  {collapsed === true ? 'Show Navigation' : 'Hide Navigation'}
                </Typography>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex justify-between items-center gap-4">
          {collapsed === false && (
            <Typography variant="caption-strong" className="whitespace-nowrap">
              Logout
            </Typography>
          )}

          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <IconButton
                    size="small"
                    onClick={onClick2}
                    variant={'tertiary'}
                    className="text-red-r-500"
                    iconVariant={'SignOut_bold'}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className={`relative ${!collapsed ? 'hidden' : ''}`}
              >
                <Typography variant="caption">Logout</Typography>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}

export { FooterNavigation };
