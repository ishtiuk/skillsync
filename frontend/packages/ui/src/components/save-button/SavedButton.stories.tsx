import type { Meta, StoryObj } from '@storybook/react';
import { SavedButton } from './SaveButton';

const meta = {
  title: 'Components/Button/SaveButton',
  component: SavedButton,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof SavedButton>;

export default meta;
type Story = StoryObj<typeof SavedButton>;

export const SaveButton: Story = {
  args: {}
};
