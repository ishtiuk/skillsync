import type { Meta, StoryObj } from '@storybook/react';
import SearchBar from './SearchBar';
const items = [
  { title: 'Recently searched', id: "25" },
  { title: 'Recently searched', id: "30" },
  { title: 'Recently searched', id: "35" }
];

const meta = {
  title: 'Components/SearchBar',
  component: SearchBar,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof SearchBar>;

export const SearchBarComponent: Story = {
  args: {}
};

export const SearchBarWithError: Story = {
  args: {
    error: true
  }
};

export const SearchBarWithResult: Story = {
  args: {
    items: items
  }
};
