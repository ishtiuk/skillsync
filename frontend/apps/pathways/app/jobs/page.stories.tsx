import type { Meta, StoryObj } from '@storybook/react';

import JobsPage from './page';

const meta = {
  title: 'Pages/Jobs',
  component: JobsPage,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true
    }
  },
  tags: ['autodocs']
} satisfies Meta<typeof JobsPage>;

export default meta;
type Story = StoryObj<typeof JobsPage>;

export const Default: Story = {};
