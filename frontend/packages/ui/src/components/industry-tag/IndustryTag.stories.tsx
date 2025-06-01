import type { Meta, StoryObj } from '@storybook/react';

import { IndustryTag } from './IndustryTag';

const meta = {
  title: 'Components/Tags/IndustryTag',
  component: IndustryTag,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof IndustryTag>;

export default meta;
type Story = StoryObj<typeof IndustryTag>;

export const Default: Story = {
  args: { industryType: 'education' }
};
