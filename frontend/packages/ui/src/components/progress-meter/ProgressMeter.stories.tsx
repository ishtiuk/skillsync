import type { Meta, StoryObj } from '@storybook/react';
import { ProgressMeter } from './ProgressMeter';

const meta = {
  title: 'Components/ProgressMeter/ProgressMeter',
  component: ProgressMeter,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof ProgressMeter>;

export default meta;
type Story = StoryObj<typeof ProgressMeter>;

export const Default: Story = {
  args: { variant: 'organization', percentage: 25 }
};
