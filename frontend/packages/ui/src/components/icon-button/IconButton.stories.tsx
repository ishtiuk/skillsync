import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from './IconButton';
const meta = {
  title: 'Components/Button/IconButton',
  component: IconButton,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Default: Story = {
  args: {
    variant: 'default',
    iconVariant: 'BellSimple_fill'
  }
};

export const Primary: Story = {
  args: {
    variant: 'primary',
    iconVariant: 'CaretDown_bold'
  }
};

export const SecondarySmall: Story = {
  args: {
    variant: 'secondary',
    size: 'small',
    iconVariant: 'Eye_fill'
  }
};

export const Tertiary: Story = {
  args: {
    variant: 'tertiary',
    iconVariant: 'Briefcase_fill'
  }
};
