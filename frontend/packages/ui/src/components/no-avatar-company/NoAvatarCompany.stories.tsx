import type { Meta, StoryObj } from '@storybook/react';
import { NoAvatarCompany } from './NoAvatarCompany';

const meta = {
  title: 'Components/Avatars/No-Logo',
  component: NoAvatarCompany,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof NoAvatarCompany>;

export default meta;
type Story = StoryObj<typeof NoAvatarCompany>;

export const Default: Story = {
  args: {
    size: '128px'
  }
};
