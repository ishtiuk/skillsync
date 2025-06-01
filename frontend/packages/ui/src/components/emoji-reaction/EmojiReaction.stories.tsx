import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { EmojiReaction } from './EmojiReaction';

export default {
  title: 'Components/EmojiReaction/EmojiReaction',
  component: EmojiReaction,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} as Meta<typeof EmojiReaction>;

type Story = StoryObj<typeof EmojiReaction>;

export const Default: Story = {
  args: {
    initialReaction: 'happy'
  }
};
