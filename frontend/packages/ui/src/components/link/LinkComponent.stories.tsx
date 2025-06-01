import type { Meta, StoryObj } from '@storybook/react';
import { LinkComponent } from './LinkComponent';

const meta = {
  title: 'Components/Link',
  component: LinkComponent,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof LinkComponent>;

export default meta;
type Story = StoryObj<typeof LinkComponent>;

export const Default: Story = {
  args: { size: 'default', label: 'Text Link', href: '' }
};

export const Large: Story = {
  args: { size: 'large', label: 'Text Link', href: '' }
};

export const DefaultLinkWithIconLeft: Story = {
  args: {
    size: 'default',
    label: 'Text Link',
    leftIcon: 'Export_bold',
    href: ''
  }
};

export const LargeLinkWithIconRight: Story = {
  args: {
    size: 'large',
    label: 'Text Link',
    rightIcon: 'Export_bold',
    href: ''
  }
};
