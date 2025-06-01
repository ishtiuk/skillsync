import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from './Alert';

const meta = {
  title: 'Components/Notifications/Alert',
  component: Alert,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  args: {
    variant: 'neutral',
    label: 'Write your content here.'
  }
};

export const Success: Story = {
  args: {
    variant: 'success',
    label: 'Write your content here.'
  }
};

export const Warning: Story = {
  args: { variant: 'warning', label: 'Write your content here.' }
};

export const Critical: Story = {
  args: { variant: 'critical', label: 'Write your content here.' }
};

export const Feature: Story = {
  args: {
    variant: 'feature',
    label: 'Write your content here.'
  }
};

export const BannerWithButton: Story = {
  args: {
    variant: 'feature',
    label: 'Write your content here.',
    btn: true
  }
};
