import type { Meta, StoryObj } from '@storybook/react';
import ProfilePicture from './ProfilePicture';

const meta = {
  title: 'Components/ProfilePicture',
  component: ProfilePicture,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof ProfilePicture>;

export default meta;
type Story = StoryObj<typeof ProfilePicture>;

export const PeopleNoIMG: Story = {
  args: {
    onEdit: () => {}
  }
};
