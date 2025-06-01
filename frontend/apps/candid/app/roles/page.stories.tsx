import type { Meta, StoryObj } from '@storybook/react';

import RolesPage from './page';

const meta = {
  title: 'Pages/Roles',
  component: RolesPage,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true
    }
  },
  tags: ['autodocs']
} satisfies Meta<typeof RolesPage>;

export default meta;
type Story = StoryObj<typeof RolesPage>;

export const Default: Story = {};
