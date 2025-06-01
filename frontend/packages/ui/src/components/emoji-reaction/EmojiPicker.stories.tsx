import { Meta, StoryObj } from '@storybook/react';
import { EmojiPicker } from './EmojiPicker';
import { Reaction } from './types';

export default {
  title: 'Components/EmojiReaction/EmojiPicker',
  component: EmojiPicker,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} as Meta<typeof EmojiPicker>;

type Story = StoryObj<typeof EmojiPicker>;

export const Default: Story = {
  args: {
    onSelect: (reaction: Reaction) => {}
  }
};
