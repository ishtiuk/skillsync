import type { Meta, StoryObj } from '@storybook/react';

import { Card } from './Card';

const meta = {
  title: 'Components/Cards/Card',
  component: Card,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: { size: 'large' }
};

export const Skinny: Story = {
  args: { size: 'skinny' }
};

export const Small: Story = {
  args: { size: 'small' }
};

export const Medium: Story = {
  args: { size: 'medium' }
};

export const Large: Story = {
  args: { size: 'large' }
};
