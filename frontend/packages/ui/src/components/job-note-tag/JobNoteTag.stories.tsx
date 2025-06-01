import type { Meta, StoryObj } from '@storybook/react';

import { JobNoteTag } from './JobNoteTag';

const meta = {
  title: 'Components/Tags/JobNoteTag',
  component: JobNoteTag,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof JobNoteTag>;

export default meta;
type Story = StoryObj<typeof JobNoteTag>;

export const Default: Story = {
  args: { category: 'building-paths' }
};
