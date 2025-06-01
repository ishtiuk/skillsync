import type { Meta, StoryObj } from '@storybook/react';
import { MigrateTo } from './MigratoTo';

const meta = {
  title: 'Components/Filter/MigrateTo',
  component: MigrateTo,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof MigrateTo>;

export default meta;
type Story = StoryObj<typeof MigrateTo>;

export const MigrateToList: Story = {
  args: { initialStage: 'saved', jobId: '1234' }
};
