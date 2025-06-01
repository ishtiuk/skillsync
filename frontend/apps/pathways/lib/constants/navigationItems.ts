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
    label: 'Your Space',
    pathname: 'profile'
  },

  {
    label: 'Explore Jobs',
    pathname: 'jobs',
    icon: 'Binoculars_fill'
  },

  {
    label: 'Your Jobs',
    pathname: 'your-jobs',
    icon: 'Briefcase_fill'
  }
];
