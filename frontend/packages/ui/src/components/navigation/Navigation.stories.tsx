import { Navigation } from './Navigation';
import { IconVariant } from '@/icons/PhosphorIcon';
import type { Meta, StoryObj } from '@storybook/react';
import ProfileIMG from '@/public/images/people/user.png';
import { FavoritesData } from '../navigation-favorites/NavigationFavorites';

const data: FavoritesData[] = [
  {
    label: 'Communication Coordinator',
    color: 'neutral',
    pathname: 'collection',
    id: '15'
  },
  {
    label: 'Communication Coordinator',
    color: 'blue',
    pathname: 'collection',
    id: '16'
  },
  {
    label: 'Communication Coordinator',
    color: 'purple',
    pathname: 'collection',
    id: '17'
  }
];

type NavigationItem = {
  label: string;
  pathname: string;
  icon?: IconVariant | undefined;
};

const navigationItems: NavigationItem[] = [
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
    label: 'Nav Item 3',
    pathname: 'item-3',
    icon: 'Briefcase_fill'
  }
];

const meta = {
  title: 'Components/Navigation',
  component: Navigation,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof Navigation>;

export default meta;
type Story = StoryObj<typeof Navigation>;

export const Default: Story = {
  args: {
    jobs: '15',
    status: false,
    items: navigationItems
  }
};

export const Favorites: Story = {
  args: {
    jobs: '15',
    data: data,
    items: navigationItems
  }
};

export const Notifications: Story = {
  args: {
    notifications: '5',
    jobs: '15',
    items: navigationItems
  }
};

export const Profile: Story = {
  args: {
    notifications: '5',
    jobs: '15',
    profile: '',
    items: navigationItems
  }
};

export const Collapsed: Story = {
  args: {
    notifications: '5',
    jobs: '15',
    profile: '',
    collapsed: true,
    items: navigationItems
  }
};

export const ProfileStatus: Story = {
  args: {
    notifications: '5',
    jobs: '15',
    profile: '',
    status: true,
    items: navigationItems
  }
};
