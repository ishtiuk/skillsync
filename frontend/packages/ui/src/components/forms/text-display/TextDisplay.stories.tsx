import type { Meta, StoryObj } from '@storybook/react';
import { TextDisplay } from './TextDisplay';

const meta = {
  title: 'Components/Forms/TextDisplay',
  component: TextDisplay,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof TextDisplay>;

export default meta;
type Story = StoryObj<typeof TextDisplay>;

export const Default: Story = {
  args: { label: 'Field label', value: 'Field value' }
};

export const TextDisplayWithCoachTip: Story = {
  args: {
    label: 'Field label',
    value: 'Field value',
    message: 'Informational Message'
  }
};

export const TextDisplayWithHelperText: Story = {
  args: {
    label: 'Field label',
    value: 'Field value',
    helperText: 'Informational Message'
  }
};
