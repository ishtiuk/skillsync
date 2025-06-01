import type { Meta, StoryObj } from '@storybook/react';
import { ProgressMeterSteps } from './ProgressMeterSteps';

const meta = {
  title: 'Components/ProgressMeter/ProgressMeterSteps',
  component: ProgressMeterSteps,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof ProgressMeterSteps>;

export default meta;
type Story = StoryObj<typeof ProgressMeterSteps>;

export const Default: Story = {
  args: { variant: 'organization', percentage: 25, steps: 2 }
};
