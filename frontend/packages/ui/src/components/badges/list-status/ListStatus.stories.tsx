import type { Meta, StoryObj } from '@storybook/react';
import { ListStatus } from './ListStatus';

const meta = {
  title: 'Components/Notifications/ListStatus',
  component: ListStatus,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof ListStatus>;

export default meta;
type Story = StoryObj<typeof ListStatus>;

export const Critical: Story = {
  args: { variant: 'critical' }
};

export const Bookmark: Story = {
  args: { variant: 'bookmark' }
};

export const Success: Story = {
  args: { variant: 'success' }
};

export const Favorite: Story = {
  args: { variant: 'favorite' }
};

export const BIPOCOwned: Story = {
  args: { variant: 'BIPOCOwned' }
};
