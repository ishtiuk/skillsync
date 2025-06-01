import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from './Switch';

const meta = {
  title: 'Components/Forms/Switch',
  component: Switch,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: { id: '1', label: 'Field Value' }
};

export const On: Story = {
  args: { id: '1', label: 'Field Value', enabled: true }
};

export const HelperText: Story = {
  args: {
    id: '1',
    label: 'Field Value',
    enabled: true,
    helperText: 'Helper Text'
  }
};
