import type { Meta, StoryObj } from '@storybook/react';
import { ProgressSteps } from './ProgressSteps';

const meta = {
  title: 'Components/Progress/ProgressSteps',
  component: ProgressSteps,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof ProgressSteps>;

export default meta;
type Story = StoryObj<typeof ProgressSteps>;

export const Default: Story = {
  args: {}
};

export const Active: Story = {
  args: {
    saved: 25,
    applied: 1,
    interview: 1
  }
};

export const Hired: Story = {
  args: {
    saved: 25,
    applied: 1,
    interview: 1,
    offer: 1,
    accepted: true
  }
};
