import type { Meta, StoryObj } from '@storybook/react';
import { AvatarContainer } from './AvatarContainer';

const meta = {
  title: 'Components/Avatars/Avatar Container',
  component: AvatarContainer,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof AvatarContainer>;

export default meta;
type Story = StoryObj<typeof AvatarContainer>;

export const PersonAvatarWithNoIMG: Story = {
  args: {
    size: 'default',
    type: 'company'
  }
};

export const CompanyAvatarNoIMGWithListStatus: Story = {
  args: {
    size: 'default',
    type: 'company',
    badge: true,
    list: 'critical'
  }
};

export const PersonAvatarNoIMGWithListStatus: Story = {
  args: {
    size: 'large',
    badge: true,
    list: 'critical',
    type: 'people'
  }
};
