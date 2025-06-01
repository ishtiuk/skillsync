import type { Meta, StoryObj } from '@storybook/react';
import { ContextualAlert } from './ContextualAlert';

const meta = {
  title: 'Components/Notifications/ContextualAlert',
  component: ContextualAlert,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof ContextualAlert>;

export default meta;
type Story = StoryObj<typeof ContextualAlert>;

export const Default: Story = {
  args: { variant: 'neutral', label: 'Info message content' }
};

export const Warning: Story = {
  args: { variant: 'warning', label: 'Info message content' }
};

export const Success: Story = {
  args: { variant: 'success', label: 'Info message content' }
};

export const Critical: Story = {
  args: { variant: 'critical', label: 'Info message content' }
};
