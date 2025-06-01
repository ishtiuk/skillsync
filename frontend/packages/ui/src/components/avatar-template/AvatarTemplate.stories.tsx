import type { Meta, StoryObj } from '@storybook/react';
import { AvatarTemplate } from './AvatarTemplate';

const meta = {
  title: 'Components/Avatars/Avatar Template',
  component: AvatarTemplate,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof AvatarTemplate>;

export default meta;
type Story = StoryObj<typeof AvatarTemplate>;

export const Default: Story = {
  args: {
    size: '48px'
  }
};
