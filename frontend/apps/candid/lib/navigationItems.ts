import { IconVariant } from '@/icons/PhosphorIcon';

type NavigationItem = {
  label: string;
  pathname: string;
  icon?: IconVariant | undefined;
};

export const navigationItems: NavigationItem[] = [
  {
    label: 'Home',
    pathname: 'home',
    icon: 'HouseSimple_fill'
  },

  {
    label: 'Profile',
    pathname: 'profile'
  },

  {
    label: 'Roles',
    pathname: 'roles',
    icon: 'Briefcase_fill'
  },

  {
    label: 'Insights',
    pathname: 'insights',
    icon: 'ChartBarHorizontal_fill'
  },

  {
    label: 'Settings',
    pathname: 'settings',
    icon: 'Gear_fill'
  }
];
