import type { Meta, StoryObj } from '@storybook/react';
import { BrandButton } from './BrandButton';

const meta = {
  title: 'Components/Button/BrandButton',
  component: BrandButton,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof BrandButton>;

export default meta;
type Story = StoryObj<typeof BrandButton>;

export const Facebook: Story = {
  args: { variant: 'facebook' }
};

export const Googole: Story = {
  args: { variant: 'google' }
};
