import type { Meta, StoryObj } from '@storybook/react';
import { Notification } from './Notification';

const meta = {
  title: 'Components/Notifications/Notification',
  component: Notification,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof Notification>;

export default meta;
type Story = StoryObj<typeof Notification>;

export const Alert: Story = {
  args: { variant: 'alert' }
};

export const Count: Story = {
  args: { variant: 'count' }
};
