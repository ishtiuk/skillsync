import type { Meta, StoryObj } from '@storybook/react';

import { Banner } from './Banner';

const meta = {
  title: 'Components/Notifications/Banner',
  component: Banner,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof Banner>;

export const Default: Story = {
  args: {
    variant: 'neutral',
    title: 'Write your content here.',
    text: 'Write your content here.'
  }
};

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Write your content here.',
    text: 'Write your content here.'
  }
};

export const Warning: Story = {
  args: { variant: 'warning', title: 'Write your content here.' }
};

export const Critical: Story = {
  args: { variant: 'critical', title: 'Write your content here.' }
};

export const Feature: Story = {
  args: {
    variant: 'feature',
    title: 'Write your content here.',
    text: 'Write your content here.'
  }
};

export const BannerWithButton: Story = {
  args: {
    variant: 'feature',
    title: 'Write your content here.',
    text: 'Write your content here.',
    btn: true
  }
};
