import type { Meta, StoryObj } from '@storybook/react';
import { Circular } from './Circular';

const meta = {
  title: 'Components/ProgressMeter/Circular',
  component: Circular,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof Circular>;

export default meta;
type Story = StoryObj<typeof Circular>;

export const Default: Story = {
  args: { variant: 'organization', percentage: 25 }
};
