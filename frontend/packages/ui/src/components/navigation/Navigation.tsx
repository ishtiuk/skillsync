'use client';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Typography } from '../typography';
import { NavigationButton } from '../navigation-button';
import { LogoNavigation } from '../navigation-logo/NavigationLogo';
import { FooterNavigation } from '../navigation-footer/FooterNavigation';

import {
  FavoritesData,
  NavigationFavorites
} from '../navigation-favorites/NavigationFavorites';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../tooltip-2/Tooltip';
import { IconVariant } from '@/icons/PhosphorIcon';

type NavigationItem = {
  label: string;
  pathname: string;
  icon?: IconVariant | undefined;
};

export interface NavigationProps {
  profile?: string;
  status?: boolean;
  collapsed?: boolean;
  data?: FavoritesData[];
  jobs?: string | number;
  items?: NavigationItem[];
  notifications?: string | number;
  onClickCustom?: () => void;
}
function Navigation({
  jobs,
  data,
  items,
  status,
  profile,
  notifications,
  onClickCustom,
  ...props
}: NavigationProps) {
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const onClickShowNavigtion = () => {
    setCollapsed(!collapsed);
  };

  return (
    <aside
      className={cn(
        'cursor-pointer top-0 h-screen bg-navigation text-navigation-foreground transition-all duration-200 ease sticky shrink-0 z-[25]',
        `${collapsed === true ? 'w-[88px]' : 'w-[236px]'}`
      )}
    >
      <LogoNavigation collapsed={collapsed} />
      <nav className="px-4 py-3">
        {items?.map((item, index) => (
          <TooltipProvider delayDuration={0} key={index}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <NavigationButton
                    jobs={jobs}
                    status={status}
                    person={profile}
                    label={item.label}
                    collapsed={collapsed}
                    iconVariant={item.icon}
                    pathname={item.pathname}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className={`relative ${!collapsed ? 'hidden' : ''}`}
              >
                <Typography variant="caption">{item.label}</Typography>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}

        {data && <NavigationFavorites collapsed={collapsed} data={data} />}
      </nav>

      <FooterNavigation
        collapsed={collapsed}
        onClick2={() => onClickCustom?.()}
        onClick1={onClickShowNavigtion}
      />
    </aside>
  );
}

export { Navigation };
