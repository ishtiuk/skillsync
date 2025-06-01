import type { Meta, StoryObj } from '@storybook/react';

import YourJobsPage from './page';

const meta = {
  title: 'Pages/Your Jobs',
  component: YourJobsPage,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true
    }
  },
  tags: ['autodocs']
} satisfies Meta<typeof YourJobsPage>;

export default meta;
type Story = StoryObj<typeof YourJobsPage>;

export const Default: Story = {};
