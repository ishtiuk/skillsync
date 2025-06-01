import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta = {
  title: 'Components/Notifications/Badge',
  component: Badge,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof Badge>;

export const Critical: Story = {
  args: { variant: 'critical', text: 'Critical' }
};

export const Warning: Story = {
  args: { variant: 'warning', text: 'Warning' }
};

export const Success: Story = {
  args: { variant: 'success', text: 'Success' }
};

export const Neutral: Story = {
  args: { variant: 'neutral', text: 'TagName' }
};

export const Feature: Story = {
  args: { variant: 'feature', text: 'Featured' }
};

export const BIPOCOwned: Story = {
  args: { variant: 'BIPOCOwned', text: 'BIPOC Owned' }
};
