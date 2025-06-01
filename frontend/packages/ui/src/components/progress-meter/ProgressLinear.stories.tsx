import type { Meta, StoryObj } from '@storybook/react';
import { ProgressLinear } from './ProgressLinear';

const meta = {
  title: 'Components/ProgressMeter/ProgressLinear',
  component: ProgressLinear,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof ProgressLinear>;

export default meta;
type Story = StoryObj<typeof ProgressLinear>;

export const Default: Story = {
  args: { variant: 'organization', percentage: 25 }
};
